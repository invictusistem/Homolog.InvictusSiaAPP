import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { environment } from "src/environments/environment";
import { OpenPresencaComponentModal } from "../services/pedag-modal";
import { NotasComponent } from "./notas/notas.component";
import { PresencaComponent } from "./presenca/presenca.component";

@Component({
    selector: 'turmas-app',
    templateUrl: './diario-classe.component.html',
    animations: [HighlightTrigger]
})

export class TurmasComponent implements OnInit {

    private BaseUrl = environment.baseUrl;
    showPresencaIcon = false
    turmas: any[] = new Array<any>();// TurmaViewModel[] = new Array<TurmaViewModel>();
    showTurmas = false
    public showMessage = 'visible'
    showSpinner = false
    mensagem!: string;
    private jwtHelper = new JwtHelperService();
    tokenInfo: TokenInfos = new TokenInfos();


    constructor(
        private _http: HttpClient,
        private _modal: MatDialog
    ) {

    }
    ngOnInit() {
        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.getTurmas();

    }

    agendarProvas() {

    }

    getTurmas() {

        this.showTurmas = false
        this.showMessage = 'visible'
        this.showSpinner = true

        this._http.get(`${this.BaseUrl}/pedag/turma/diario-classe`)
            .subscribe((response: any) => {
                this.turmas = Object.assign([], response['turmas']);
                console.log(this.turmas)
            },
                (error) => {
                    // this.mensagem = "Ocorreu um erro! Contate o Administrador!"
                    console.log(error)
                    this.mensagem = "Não há turmas cadastradas ou em andamento."
                    this.showTurmas = false
                    this.showMessage = 'hidden'
                    this.showSpinner = false
                },
                () => {
                    this.showTurmas = true
                    this.showMessage = 'hidden'
                    this.showSpinner = false
                })
    }

    openNotas(turma:any): void {

        const dialogRef = this._modal.open(NotasComponent, {
            height: 'auto',
            width: '1030px',
            autoFocus: false,
            maxHeight: '90vh',
            maxWidth: '400vh',
            data: { turma: turma },
            hasBackdrop: true,
            disableClose: true
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed');
            // this.animal = result;
        });
    }

    podeIniciarAula(podeIniciar: Boolean) {
        //console.log('pode iniciar')
        //return true
        //return !turma
        // if (this.tokenInfo.role == 'MasterAdm') {
        //     return false
        // }


        return !podeIniciar
    }

    openAgendamento(turma: any): void {

        // const dialogRef = this._modal.open(AgendamentoComponent, {
        //     height: 'auto',
        //     width: '1130px',
        //     autoFocus: false,
        //     maxHeight: '110vh',
        //     maxWidth: '450vh',
        //     data: { turma: turma },
        //     hasBackdrop: true,
        //     disableClose: true
        // });

        // dialogRef.afterClosed().subscribe(result => {

        // });
    }

    openPresenca(turma: any): void {
        const dialogRef = this._modal
            .open(PresencaComponent, OpenPresencaComponentModal(turma));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    // openPresenca(turma: TurmaViewModel): void {

    //     const dialogRef = this._modal.open(PresencaComponent, {
    //         height: 'auto',
    //         width: '1030px',
    //         autoFocus: false,
    //         // maxHeight: '90vh',
    //         maxWidth: '400vh',
    //         data: { turma: turma },
    //         hasBackdrop: true,
    //         disableClose: true
    //     });

    //     dialogRef.afterClosed().subscribe(result => {

    //     });
    // }

    iniciarAula(turma: any) {

        const dialogRef = this._modal
            .open(ConfirmarIniciarAulaModal, {
                height: 'auto',
                width: '500px',
                autoFocus: false,
                //maxHeight: '90vh',
                //maxWidth: '400vh',

                data: { turma: turma },
                hasBackdrop: true,
                disableClose: true
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result.clicked == true) {

                // console.log(turmaId)
                // this.http.put(`${this.baseUrl}/turmas/turma/${turmaId}`, {
                this.openPresenca(turma)

            } else {
                console.log('nao')
            }

        });



        // this.showPresencaIcon = true
        //  turma.aulaIniciada = true

    }

}



@Component({
    selector: 'confirmdialog',
    template: `<div class="container">
    <div class="row" style="margin-bottom: 10px;">
        <div style="font-size: 1.2em;">
            Professor! Tem certeza que deseja inicar a aula?
        </div>
        <br>
        <div style="text-align: justify; margin-top: 10px">
            A aula será iniciada e só poderá ser encerrada ao final da aula após o preenchimento da lista de presença e do
            conteúdo programático.
        </div>
    </div>
    <mat-progress-bar style="margin-top: 20px;" [style.visibility]="initProgressBar" @rowHighlight mode="query"></mat-progress-bar>

    <div class="row">
        <button [disabled]="disabledButton" color="primary" style="width: 30px;" (click)="iniciarAula()" mat-button>SIM</button>
        <button [disabled]="disabledButton" style="width: 30px;" [mat-dialog-close]="{clicked:'Cancel'}" mat-button>NÃO</button>
    </div>
</div>`,
animations: [HighlightTrigger]
})
export class ConfirmarIniciarAulaModal implements OnInit {


    private BaseUrl = environment.baseUrl;
    public initProgressBar = 'hidden'
    public disabledButton = false
    constructor(
        private _http: HttpClient,
        public dialogRef: MatDialogRef<ConfirmarIniciarAulaModal>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    ngOnInit() {
        console.log(this.data['turma'].calendarioId)

    }


    iniciarAula() {
        // calendario/{calendarioId}
        this.disabledButton = true
        this.initProgressBar = 'visible'
        this._http.put(`${this.BaseUrl}/pedag/turma/calendario/${this.data['turma'].calendarioId}`, {})
            .subscribe(resp => {

            }, (error) => {
                console.log(error)
                this.disabledButton = false
                this.initProgressBar = 'hidden'
                // this.dialogRef.close({ clicked: "Sim" })
            },
                () => {
                    this.disabledButton = false
                    this.initProgressBar = 'hidden'
                    this.dialogRef.close({ clicked: true })
                })



    }
}
