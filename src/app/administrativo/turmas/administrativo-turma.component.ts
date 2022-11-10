import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { ConfirmAcaoModalComponent } from "src/app/_shared/components/acao-confirm/confirm-acao.component";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { ConfirmAcaoModalConfig } from "src/app/_shared/services/shared.modal";
import { environment } from "src/environments/environment";
import { iniciarTurmaModalConfig, OpenCreateCursoModalConfig, OpenTurmaEditmodel } from "../services/adm-modal";
import { AdmService } from "../services/adm.service";
import { CreateCursoComponent } from "./create/turma-create.component";
import { EditCursoComponent } from "./edit/turma-edit.component";
import { ConfirmarIniciarTurmaModal } from "./iniciar/confirmariniciar.component";

@Component({
    selector: "admturmas-app",
    templateUrl: './administrativo-turma.component.html',
    styleUrls: ['./administrativo-turma.component.scss'],
    animations: [HighlightTrigger]
})

export class AdmTurmasComponent implements OnInit {

    public initProgressBar = 'visible'
    pageSize: number = 5;
    pageEvent: PageEvent = new PageEvent
    pageIndexNumber: number = 0;
    cursos: any[] = new Array<any>();
    baseUrl = environment.baseUrl;
    turmas: any[] = new Array<any>();
    private jwtHelper = new JwtHelperService();
    tokenInfo: TokenInfos = new TokenInfos();
    currentPage = 1

    showTurmas = false
    showMessage = false
    showSpinner = false
    mensagem?: string;

    constructor(
        private _helper: HelpersService,
        private _admService: AdmService,
        private http: HttpClient,
        private _modal: MatDialog
    ) { }

    ngOnInit() {


        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.getCursos();
    }

    iniciarTurma(turmaId: any): void {
        const dialogRef = this._modal
        .open(ConfirmarIniciarTurmaModal, iniciarTurmaModalConfig(turmaId));
    dialogRef.afterClosed().subscribe((result: any) => {
        if (result.clicked === true) {
            this.getCursos();
        }
    });
    }

    get podeDeletar() {
      
        return this.tokenInfo.role == 'SuperAdm'
    }

    PodeAdiar(turma: any) {
        return true
        if (turma.statusAndamento == 'Aguardando início' &&
            turma.previsaoInfo != '3ª previsão') {
            return false
        } else {
            return true
        }

    }

    adiar(turmaId: number) {
       // console.log('adiar')
        return true
        // this.http.put(`${this.baseUrl}/turma/adiar/${turmaId}`, {}).subscribe(response => {

        // },
        //     (error) => { console.log(error) },
        //     () => {
        //         this.getCursos();
        //     }
        // )
    }

    getCursos() {

        var itemsPerPage = 0;
        var actualPage = 0

        this.showTurmas = false
        this.showMessage = false
        this.showSpinner = true

        this._admService.GetTodasTurmasDaUnidade()
            .subscribe(
                sucesso => { this.getCursosSucesso(sucesso) },
                falha => { this.getCursosFalha(falha) }
            );
    }

    getCursosSucesso(response: any) {
        Object.assign(this.turmas, response['turmas'])
        this.initProgressBar = 'hidden'
        this.showTurmas = true
        this.showMessage = false
        this.showSpinner = false
    }

    getCursosFalha(erro: any) {
        this.initProgressBar = 'hidden'
        this.mensagem = "Não há turmas cadastradas ou em andamento nesta unidade."
        this.showTurmas = false
        this.showMessage = true
        this.showSpinner = false
    }

    createCurso() {

    }

    openCreateCursoModal(): void {
        const dialogRef = this._modal
            .open(CreateCursoComponent, OpenCreateCursoModalConfig());
        dialogRef.afterClosed().subscribe((result: any) => {
            if (result.clicked === "OK") {
                this.getCursos();
               // console.log('afte close ok')
            }
        });
    }

    // openCalendarioModal(): void {
    //     const dialogRef = this._modal
    //         .open(CalendarioModalComponent, {
    //             height: 'auto',
    //             width: '1030px',
    //             autoFocus: false,
    //             maxHeight: '90vh',
    //             maxWidth: '400vh',

    //             data: { Hello: "Hello World" },
    //             hasBackdrop: true,
    //             disableClose: true
    //         });       

    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result.clicked === "OK") {
               
    //             console.log('afte close ok')
    //         }

    //     });
    // }

    openEditCursoModal(turma:any): void {
        const dialogRef = this._modal
            .open(EditCursoComponent, OpenTurmaEditmodel(turma));
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    deleteCurso(turma:any): void {

        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

            if (data.clicked == true) {

                this.http.delete(`${this.baseUrl}/dev/deletar-turma/${turma.id}`)
                    .subscribe(
                        response => { this.getCursos(); }, 
                        err => { })
            }
        })
    }

    Cancelar(turmaId: any): void {

        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

            if (data.clicked == true) {

                this.http.put(`${this.baseUrl}/turma/cancelar/${turmaId}`,{})
                    .subscribe(
                        response => { 
                            this._helper.openSnackBarSucesso("Turma cancelada com sucesso.")
                            this.getCursos(); }, 
                        err => { 
                            if(err['status'] == 409){
                                this._helper.openSnackBarError("Não é possível cancelar turma com alunos matriculados.")
                            }else{
                                this._helper.openSnackBarErrorDefault();
                            }
                        })
            }
        })
    }

}
