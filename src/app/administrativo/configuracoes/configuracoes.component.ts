import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { ConfirmAcaoModalComponent } from "src/app/_shared/components/acao-confirm/confirm-acao.component";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { ConfirmAcaoModalConfig } from "src/app/_shared/services/shared.modal";
import { environment } from "src/environments/environment";
import { OpenCreateCargoModalConfig, OpenCreateDocModalConfig, OpenCreateMateriaConfig, OpenEditCargoModalConfig, OpenEditDocModalConfig, OpenEditMateriaConfig, OpenEditTipoConfig } from "../services/adm-modal";
import { AdmService } from "../services/adm.service";
import { CargoCreateComponent } from "./cargo-create/cargo-create.component";
import { CargoEditComponent } from "./cargo-edit/cargo-edit.component";
import { DocTemplateComponent } from "./doc-create/doc-create.component";
import { DocEditComponent } from "./doc-edit/doc-edit.component";
import { MateriaTemplateComponent } from "./materia-create/mat-create.component";
import { MatEditComponent } from "./materia-edit/mat-edit.component";
import { TipoPacoteCreateComponent } from "./tipo-pacote-create/tipo-pacote-create.component";
import { TipoPacoteEditComponent } from "./tipo-pacote-edit/tipo-pacote-edit.component";

enum Config {
    CARGOS,
    DOCUMENTOS,
    MATERIAS
}

@Component({
    selector: "configuracoes-app",
    templateUrl: './configuracoes.component.html',
    styleUrls: ['./configuracoes.component.scss'],
    animations: [HighlightTrigger]

})

export class ConfiguracoesComponent implements OnInit {

    private jwtHelper = new JwtHelperService();
    tokenInfo: TokenInfos = new TokenInfos();
    public baseUrl: string = environment.baseUrl
    // Materias paginated
    materiasLength: number = 0
    materiasPageSize: number = 10;
    materiasPageEvent?: PageEvent;
    materiasPageIndexNumber: number = 0;
    materiasCurrentPage = 1
    @ViewChild(MatPaginator) MateriaPaginator?: MatPaginator
    //
    public config?: Config
    public configCargos = Config.CARGOS

    public searchSpinner = 'hidden'
    // table Cargos
    public cargos: any[] = new Array<any>();
    public showCargosTable = false
    // Table Documentos
    public documentos: any[] = new Array<any>();
    public showDocumentosTable = false
    // Table Matérias
    public materias: any[] = new Array<any>();
    public showMateriasTable = false
    // Table Tipos
    public tipos: any[] = new Array<any>();
    public showTiposTable = false

    constructor(
        private _admService: AdmService,
        private _modal: MatDialog,
        private _http: HttpClient,
    ) { }


    ngOnInit() {

    }


    public GetMaterias(event?: any) {

        this.searchSpinner = 'visible'

        if (event != undefined) {
            this.materiasCurrentPage = event.pageIndex + 1
        } else {
            this.materiasCurrentPage = 1
        }

        this._admService.GetMaterias(this.materiasPageSize, this.materiasCurrentPage)
            .subscribe(
                sucesso => { this.GetMateriasSucesso(sucesso, event) },
                falha => { this.GetMateriasError(falha) }
            )

        return event
    }

    private GetMateriasSucesso(response: any, event?: any) {
        this.materias = Object.assign([], response['results'].data);

        this.materiasLength = response['results'].totalItemsInDatabase


        this.searchSpinner = 'hidden'
        if (event != undefined) {
            this.materiasPageIndexNumber = (event.pageIndex * this.materiasPageSize)
        } else {
            this.materiasPageIndexNumber = 0

            if (this.MateriaPaginator != undefined) {
                this.MateriaPaginator.firstPage();
            }
        }

        this.showMateriasTable = true
    }

    private GetMateriasError(fail?: any) {
        if (fail['status'] == 404) {
            // this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
            // this.showMessageNoColaborador = true
            this.materias = new Array<any>();
        }
        if (fail['status'] != 404) {
            // this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
            // this.showMessageNoColaborador = true
            this.materias = new Array<any>();
        }

        this.searchSpinner = 'hidden'
    }

    showTableCargos = false

    public GetConfig(config: any) {
        this.showCargosTable = false
        this.showDocumentosTable = false
        this.showMateriasTable = false
        this.showTiposTable = false
        this.searchSpinner = 'visible'
        this._admService.GetConfig(config)
            .subscribe(
                sucesso => { this.GetConfigSucess(sucesso, config) },
                falha => { this.GetConfigError(falha) }
            )
    }

    get podeDeletar() {

        return this.tokenInfo.role == 'SuperAdm'
    }

    private GetConfigSucess(response?: any, config?: any) {

        this.cargos = new Array<any>();
        this.showCargosTable = false
        // Table Documentos
        this.documentos = new Array<any>();
        this.showDocumentosTable = false
        // Table Matérias
        this.materias = new Array<any>();
        this.showMateriasTable = false

        this.tipos = new Array<any>();
        this.showTiposTable = false

        this.searchSpinner = 'hidden'
        if (config == 'CARGOS') {
            this.showCargosTable = true
            this.cargos = response['values']
        }
        if (config == 'DOCUMENTOS') {
            this.showDocumentosTable = true
            this.documentos = response['docs']
        }
        if (config == 'MATERIAS') {
            this.showMateriasTable = true
            this.materias = response['results']
        }
        if (config == 'TIPOS') {
          this.showTiposTable = true
          this.tipos = response['typePacotes']
      }

    }

    private GetConfigError(error?: any) {
        this.searchSpinner = 'hidden'
    }


    // getCargos() {
    //     this.showTableCargos = false
    //     this._http.get(`${this.baseUrl}/unidade/cargo`)
    //         .subscribe(resp => {
    //             this.cargos = Object.assign([], resp)
    //         }, (error) => {
    //             console.log(error)
    //         },
    //             () => {
    //                 this.showTableCargos = true
    //             })
    // }

    // mensagem: any;
    // pegarMesg() {

    //     this._http.get(`${this.baseUrl}/mensagem`)
    //         .subscribe(resp => {
    //             console.log(resp)
    //             this.mensagem = resp
    //             this.htmlContent = resp
    //         }, (error) => { console.log(error) },
    //             () => {

    //             })
    // }



    getDocumentacao() {

    }

    getMaterias() {

    }

    public OpenCreateCargoModal(): void {
        const dialogRef = this._modal
            .open(CargoCreateComponent, OpenCreateCargoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    public OpenCreateDocModal(): void {
        const dialogRef = this._modal
            .open(DocTemplateComponent, OpenCreateDocModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    public OpenCreateMateriaModal(): void {
        const dialogRef = this._modal
            .open(MateriaTemplateComponent, OpenCreateMateriaConfig());
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    public OpenCreateTipoModal(): void {
      const dialogRef = this._modal
          .open(TipoPacoteCreateComponent, OpenEditTipoConfig());
      dialogRef.afterClosed().subscribe((data) => {

      });
  }

    public OpenEditCargoModal(cargoId: any): void {
        const dialogRef = this._modal
            .open(CargoEditComponent, OpenEditCargoModalConfig(cargoId));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    public OpenEditDocModal(docId: any): void {
        const dialogRef = this._modal
            .open(DocEditComponent, OpenEditDocModalConfig(docId));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    public OpenEditMatModal(matId: any): void {
        const dialogRef = this._modal
            .open(MatEditComponent, OpenEditMateriaConfig(matId));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    public OpenEditTipoModal(matId: any): void {
      const dialogRef = this._modal
          .open(TipoPacoteEditComponent, OpenEditTipoConfig(matId));
      dialogRef.afterClosed().subscribe(data => {
      });
  }



    public DeleteCargo(doc:any): void {

        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

            if (data.clicked == true) {

                this._http.delete(`${this.baseUrl}/parametro/value/${doc.id}`)
                    .subscribe(
                        response => { this.GetConfig('CARGOS')},
                        err => { })
            }
        })
    }

    deleteDocumento(doc:any): void {

        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

            if (data.clicked == true) {

                this._http.delete(`${this.baseUrl}/documentacao/${doc.id}`)
                    .subscribe(
                        response => { this.GetConfig('DOCUMENTOS') },
                        err => { })
            }
        })
    }


    deleteMateria(doc:any): void {

        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

            if (data.clicked == true) {

                this._http.delete(`${this.baseUrl}/materia-template/${doc.id}`)
                    .subscribe(
                        response => { this.GetConfig('MATERIAS') },
                        err => { })
            }
        })
    }


}
