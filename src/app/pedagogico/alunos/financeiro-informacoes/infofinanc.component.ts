import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { PedagogicoService } from "../../services/pedagogico.service";

@Component({
    selector: 'infosFinancmodal',
    templateUrl: './infofinanc.component.html',
    styleUrls: ['./infofinanc.component.scss'],
    animations: [HighlightTrigger]
})

export class InfoFinancPedagComponent implements OnInit {

    public initProgressBar = 'visible'
    public showContent = false
    public debitos: any[] = new Array<any>()// Debito[] = new Array<Debito>();
    public turma: any;


    constructor(
        private _pedagService: PedagogicoService,
        private _modal: MatDialog,
        public dialogRef: MatDialogRef<InfoFinancPedagComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {        

    }

    ngOnInit() {
       // console.log(this.data['aluno'])
        this.getInfoFinancAlunos(this.data['aluno'].matriculaId)
    }

    showNaoMatriculadoMsg = true
    getInfoFinancAlunos(matriculaId: any){

        this._pedagService.getInfoDebitos(matriculaId)
            .subscribe(
                sucesso => { this.getInfoFinancAlunosSucesso(sucesso)},
                falha => { this.getInfoFinancAlunosError(falha) })       
    }

    getInfoFinancAlunosSucesso(response:any){
        this.debitos = Object.assign([], response['debitos']);
       // console.log(this.debitos)
        this.turma = response['turma'];
        this.initProgressBar = 'hidden'
        this.dialogRef.addPanelClass('myminfofinanc-class')
        this.showContent = true
    }

    getInfoFinancAlunosError(error:any){
       // console.log(error)
        this.showNaoMatriculadoMsg = false
    }

}