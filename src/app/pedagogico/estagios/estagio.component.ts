import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { CreateEstagioModalConfig, EditEstagioModalConfig, EstagioTipoModalConfig } from "../services/pedag-modal";
import { PedagogicoService } from "../services/pedagogico.service";
import { EstagioCadastroComponent } from "./create/estagiocadastro.component";
import { EstagioEditComponent } from "./edit/estagio-edit.component";
import { EstagioAlunosComponent } from "./estagio-alunos/estagio-alunos.component";
import { EstagioTipoComponent } from "./tipos/estagio-tipo.component";

@Component({
    selector: "estagio-app",
    templateUrl: './estagio.component.html',
    styleUrls: ['./estagio.component.scss'],
    animations: [HighlightTrigger]
})

export class EstagioComponent implements OnInit {

    public estagios: any[] = new Array<any>();
    private jwtHelper = new JwtHelperService();
    tokenInfo: TokenInfos = new TokenInfos();
    public showMessageNoEstagior = false
    public spinnerSearch = 'visible'
    public mensagem: string = ''

    constructor(
        private _modal: MatDialog,
        private _pedagService: PedagogicoService
    ) {

    }

    ngOnInit() {
        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.GetEstagios();
    }

    public GetEstagios() {
        this.showMessageNoEstagior = false
        this._pedagService.GetEstagios()
            .subscribe(
                sucesso => { this.GetEstagiosSucesso(sucesso) },
                erro => { this.GetEstagiosFalha(erro) }
            )
    }

    private GetEstagiosSucesso(response: any) {

        this.estagios = response['estagios']
        this.spinnerSearch = 'hidden'
    }

    private GetEstagiosFalha(erro: any) {

        if (erro['status'] == 404) {
            this.mensagem = "Não há estágios cadastrados"
        }
        if (erro['status'] != 404) {
            this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
        }
        this.spinnerSearch = 'hidden'
        this.showMessageNoEstagior = true
    }

    

    verificarMatriculados(estagio: any): void {
        const dialogRef = this._modal
            .open(EstagioAlunosComponent, {
                height: 'auto',
                width: '720px',

                data: { estagio: estagio },
                hasBackdrop: true,
                disableClose: true
            });


        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "Ok") {

            } else if (data.clicked === "Cancel") {

            }
        });
    }

    cadastroEstagio(): void {
        const dialogRef = this._modal
            .open(EstagioCadastroComponent, CreateEstagioModalConfig());
        dialogRef.afterClosed().subscribe(data => {
            if (data.clicked == true) this.GetEstagios()
            
        });
    }

    public EstagioTipo(): void{
        const dialogRef = this._modal
            .open(EstagioTipoComponent, EstagioTipoModalConfig());
        dialogRef.afterClosed().subscribe(data => {
            if (data.clicked == true){

            } 
            
        });
    }

    editarEstagio(estagio:any): void {
        const dialogRef = this._modal
            .open(EstagioEditComponent, EditEstagioModalConfig(estagio));
        dialogRef.afterClosed().subscribe(data => {
            if (data.clicked == true) this.GetEstagios()
            
        });
    }  
}