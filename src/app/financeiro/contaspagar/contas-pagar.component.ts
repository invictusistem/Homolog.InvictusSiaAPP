import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../services/financ.service';
import { OpenNovaContaPagarModal, OpenEditContaPagarModal } from '../services/financ-modal'
import { MatDialog } from '@angular/material/dialog';
import { ContaspagarNovaComponent } from './nova/contaspagar-nova.component';
import { ContaspagarEditComponent } from './editar/contaspagar-edit.component';
import { PagarcontaComponent } from './pagar/pagarconta.component';
import { PagarComponentModal } from '../services/financ-modal';
import { ConfirmDeletarcontaComponent } from 'src/app/_shared/components/confirm-deletarconta/confirm-deletarconta.component';
import { ConfirmDeletarContaModalConfig } from "src/app/_shared/services/shared.modal";

@Component({
  selector: 'app-contas-pagar',
  templateUrl: './contas-pagar.component.html',
  styleUrls: ['./contas-pagar.component.scss']
})

export class ContasPagarComponent extends BaseComponent implements OnInit {

  public pesquisarForm: FormGroup
  public meiosPagamento: any[] = new Array<any>()
  public contas: any[] = new Array<any>()
  public disabledForm = true
  public totalAtraso: any
  public totalPago:any
  public totalPagar: any

  constructor(
    override _snackBar: MatSnackBar,
    private _financService: FinanceiroService,
    private _fb: FormBuilder,
    private _modal: MatDialog
  ) {

    super(_snackBar);

    this.pesquisarForm = _fb.group({
      meioPagamentoId: [null],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]],
      ativo:[false]
    });

  }
  ngOnInit() {
    this.spinnerSearch = "visible"
    this.GetMeiosPagamento()
  }

  private GetMeiosPagamento() {

    this._financService.GetMeioPagamentos()
      .subscribe({
        next: (resp: any) => {
          this.meiosPagamento = Object.assign([], resp['result'])
          this.spinnerSearch = "hidden"
          this.disabledForm = false
        },
        error: (fail: any) => {
          this.spinnerSearch = "hidden"
          this.OpenSnackBarErrorDefault()
        }
      })

  }

  public Pagar(conta:any){
    const dialogRef = this._modal
            .open(PagarcontaComponent, PagarComponentModal(conta));
        dialogRef.afterClosed().subscribe((data) => {

            if(data.clicked == true){
                //this.GetInfoFinancAlunos(this.data['aluno'].matriculaId)
            }

        });
  }

  public Pesquisar(event?: any) {

    this.showMessageNotFound = false

    if (this.pesquisarForm.valid) {
      this.spinnerSearch = 'visible'
      this.showMessageNotFound = false
      this.contas = new Array<any>()
      this._financService.GetContasPagar(
        this.pesquisarForm.get('meioPagamentoId')?.value,
        new Date(this.pesquisarForm.get('start')?.value).toISOString(),
        new Date(this.pesquisarForm.get('end')?.value).toISOString(),
        this.pesquisarForm.get('ativo')?.value
        )
        .subscribe({
          next: (resp: any) => {
            this.totalAtraso = resp['totalAtraso']
            this.totalPagar = resp['totalPagar']
            this.totalPago = resp['valorPago']
            this.contas = Object.assign([], resp['contas'])
            this.spinnerSearch = 'hidden'
          },
          error: (fail: any) => {
            this.spinnerSearch = 'hidden'
            if (fail['status'] == 404) {
              this.showMessageNotFound = true
              this.mensagemNotFound = "Nenhum registro foi localizado no período informado."
            } else {
              this.OpenSnackBarErrorDefault()
            }
          }
        });
    }

  }

  public OpenNovaContaPagarModal() {
    const dialogRef = this._modal
      .open(ContaspagarNovaComponent, OpenNovaContaPagarModal());
    dialogRef.afterClosed().subscribe((data) => {

    });
  }

  public EditConta(conta:any) {
    const dialogRef = this._modal
      .open(ContaspagarEditComponent, OpenEditContaPagarModal(conta));
    dialogRef.afterClosed().subscribe((data) => {

    });
  }

  public DeletarConta(id: any) { // ConfirmDeletarcontaComponent

    const dialogRef = this._modal
      .open(ConfirmDeletarcontaComponent, ConfirmDeletarContaModalConfig(id));
    dialogRef.afterClosed().subscribe((data) => {

      if (data.confirm == true) {
        var index = this.contas.findIndex(element => element.id == id)
        console.log(index)
        this.contas[index].ativo = false
        this.contas[index].statusBoleto = 'Cancelado'
        
      }
    })

  }  

}