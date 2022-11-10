import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PedagogicoService } from "src/app/pedagogico/services/pedagogico.service";
import { HighlightTrigger } from "src/app/_shared/animation/animation";

@Component({
    selector: 'obsturmamodaldialog',
    templateUrl: './aula-detalhe.component.html',
    styleUrls:['./aula-detalhe.component.scss'],
    animations: [HighlightTrigger]
})
export class AulaDetalheModal implements OnInit{

    //private _baseUrl = environment.baseUrl
    public initProgressBar = 'visible'
    public showContent = false
    public aula: any
    constructor(
        //private _http: HttpClient,
        private _pedagService: PedagogicoService,
        public dialogRef: MatDialogRef<AulaDetalheModal>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

        ngOnInit() {
            //this.dialogRef.addPanelClass('auladetalhe-class')
            this.GetAulaInfos()
            //console.log(this.data['caled'])
        }

        private GetAulaInfos(){

            this._pedagService.GetAulaViewModel(this.data['caled'].id)
                .subscribe(
                    sucesso => { this.GetAulaInfosSucesso(sucesso)},
                    falha => { this.GetAulaInfosFalha(falha)}
                )
        }

        private GetAulaInfosSucesso(resp:any){
            this.aula = resp['aula']
            //console.log(this.aula)
            this.dialogRef.addPanelClass('auladetalheedit-class')
            this.initProgressBar = 'hidden'
            this.showContent = true
        }

        private GetAulaInfosFalha(error:any){

        }
}

