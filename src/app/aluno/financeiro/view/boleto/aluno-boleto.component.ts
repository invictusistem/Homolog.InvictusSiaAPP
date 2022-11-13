import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditFinancComponent } from 'src/app/financeiro/alunos/infos/edit/financeiro-edit.component';
import { HighlightTrigger } from 'src/app/_shared/animation/animation';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-aluno-boleto',
  templateUrl: './aluno-boleto.component.html',
  styleUrls: ['./aluno-boleto.component.scss'],
    animations: [HighlightTrigger]
})
export class AlunoBoletoComponent implements OnInit {

  baseUrl = environment.baseUrl;
    public atualizar: boolean = false
    public aluno: any;
    public nome: any;
    public matricula: any;
    public debito: any;
    public turma: any

    constructor(
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _modal: MatDialog,
        public dialogRef: MatDialogRef<AlunoBoletoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
    }

    ngOnInit() {

        this.nome = this.data['aluno']
        this.matricula = this.data['matricula']
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
        // let url = `financeiro/boleto-cancelar/${this.data['debito'].id}`
        // let metodo = 'put'
        // let mensagem = 'Confirmar o cancelamento?'
        // let payload = ''
        // const dialogRef = this._modal
        //     .open(ModalConfirmarComponent, ModalconfirmarConfig(
        //         url,
        //         metodo,
        //         mensagem,
        //         'Boleto cancelado com sucesso.',
        //         payload));
        // dialogRef.afterClosed().subscribe((data) => {

        //     if (data.confirm == true) {
        //         console.log('confirmado')
        //         this.atualizar = true
        //         this.debito.statusBoleto = "Cancelado"
        //         //this.dialogRef.close({ clicked: "PAGO" })
        //     }
        // });
    }
}
