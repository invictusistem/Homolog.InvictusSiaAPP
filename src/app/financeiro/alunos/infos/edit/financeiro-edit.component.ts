import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { ModalconfirmarConfig } from "src/app/_shared/services/shared.modal";
import { ModalConfirmarComponent } from "src/app/_shared/components/modal-confirmar/modal-confirmar.component";

@Component({
    selector: 'editfinancmodal',
    templateUrl: './financeiro-edit.component.html',
    styleUrls: ['./financeiro-edit.component.scss'],
    animations: [HighlightTrigger]
})

export class EditFinancComponent implements OnInit {

    baseUrl = environment.baseUrl;
    public atualizar: boolean = false
    public aluno: any;
    public debito: any;
    public turma: any

    constructor(
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _modal: MatDialog,
        public dialogRef: MatDialogRef<EditFinancComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {

        this.aluno = Object.assign({}, this.data['aluno'])
        this.debito = Object.assign({}, this.data['debito'])
        this.turma = Object.assign({}, this.data['turma'])
        console.log(this.data['debito'])
    }

    get PodeCancelar() {

        if (!(this.debito.statusBoleto == 'Vencido' ||
            this.debito.statusBoleto == 'Em aberto')) {
            return false
        } else {
            return true
        }

    }

    public CancelarBoleto() {
        let url = `financeiro/boleto-cancelar/${this.data['debito'].id}`
        let metodo = 'put'
        let mensagem = 'Confirmar o cancelamento?'
        let payload = ''
        const dialogRef = this._modal
            .open(ModalConfirmarComponent, ModalconfirmarConfig(
                url, 
                metodo, 
                mensagem,
                'Boleto cancelado com sucesso.',
                payload));
        dialogRef.afterClosed().subscribe((data) => {

            if (data.confirm == true) {
                console.log('confirmado')
                this.atualizar = true
                this.debito.statusBoleto = "Cancelado"
                //this.dialogRef.close({ clicked: "PAGO" })
            }
        });
    }
}