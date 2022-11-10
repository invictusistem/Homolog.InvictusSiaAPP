import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";


@Component({
    selector: 'reapconfirmarmodal',
    templateUrl: './reparcelamento-confirmar.component.html',
    styleUrls: ['./reparcelamento-confirmar.component.scss'],
    animations: [HighlightTrigger]
})

export class ConfirmarParcelamento implements OnInit {

    baseUrl = environment.baseUrl;
    public saveProgressBar = 'hidden'
   public reparcelaCommand: ReparcelaCommand = new ReparcelaCommand();
   showTable = false
    constructor(
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _modal: MatDialog,
        private _helper: HelpersService,
        // private _service: PedagService,
        public dialogRef: MatDialogRef<ConfirmarParcelamento>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {
        this.reparcelaCommand.valorEntrada = this.data['valorEntrada']
        this.reparcelaCommand.debitosIds = this.data['debitosIds']
        let valorDasParcelas = (this.data['totalFinal'] - this.data['valorEntrada']) / this.data['parcelas']
        //console.log(this.data)

        this.reparcelaCommand.parcelas = new Array<Parcelas>();
        for (let index = 0; index < this.data['parcelas']; index++) {
            var dataVencimento = new Date(this.data['vencimento'])    
            this.reparcelaCommand.parcelas.push(new Parcelas(
                new Date(
                    dataVencimento.getFullYear(),
                    dataVencimento.getMonth() + (index + 1),
                    dataVencimento.getDay()),valorDasParcelas))            
        }

        this.showTable = true     
    }

    get disabledSaveButton(){

        return this.saveProgressBar != 'hidden'
    }

    confirmarParc(){
        this.saveProgressBar == 'visible'
        console.log(this.reparcelaCommand)

        if(this.reparcelaCommand.valorEntrada == null){
            this.reparcelaCommand.valorEntrada = 0;
        }

        this._http.post(`${this.baseUrl}/financeiro/reparcelar`, this.reparcelaCommand , {})
        .subscribe(resp => { 

        },(error) => { 
            this._helper.openSnackBarErrorDefault()
            this.saveProgressBar == 'hidden'
           // console.log(error)
        },
        () => { 
            this._helper.openSnackBarSucesso()
            this.dialogRef.close({ clicked: true})
        })
    }

}


export class ReparcelaCommand{
    constructor(
        public valorEntrada?: number,
        public debitosIds?: number[],
        public parcelas?: Parcelas[]
    ){

    }
}

export class Parcelas{
    constructor(
        public vencimento?: Date,
        public valor?: number
    ){
        
    }
}

