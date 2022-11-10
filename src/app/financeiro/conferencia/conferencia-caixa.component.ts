import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../services/financ.service';
import { ConferenciaConfirmarComponent } from './confirmar/conferencia-confirmar.component';
import { ConferenciaConfirmarComponentModal } from '../services/financ-modal';
import { SaldoBancarioComponent } from './saldo/saldo-bancario.component';
import { OpenSaldoComponentModal } from '../services/financ-modal';
import { ConferenciaExtornarComponent } from './extornar/conferencia-extornar.component';

@Component({
  selector: 'app-conferencia-caixa',
  templateUrl: './conferencia-caixa.component.html',
  styleUrls: ['./conferencia-caixa.component.scss']
})
export class ConferenciaCaixaComponent extends BaseComponent implements OnInit {

  public pesquisarForm: FormGroup
  public contas: any[] = new Array<any>()
  public recebimento = 'default'

  constructor(
    override _snackBar: MatSnackBar,
    private _financService: FinanceiroService,
    private _fb: FormBuilder,
    private _modal: MatDialog
  ) {

    super(_snackBar);

    this.pesquisarForm = _fb.group({
      recebimento: [false, [Validators.required]],
      start: [new Date(), [Validators.required]],
      end: [new Date(), [Validators.required]]

    });

  }
  ngOnInit() {

  }

  public Pesquisar() {

    this.showMessageNotFound = false

    if (this.pesquisarForm.valid) {
      this.spinnerSearch = 'visible'
      this.showMessageNotFound = false
      this.contas = new Array<any>()
      this._financService.GetConferênciaCaixa(this.pesquisarForm.value)
        .subscribe({
          next: (resp: any) => {

            this.contas = Object.assign([], resp['result'])
            console.log(this.contas)
            this.spinnerSearch = 'hidden'

            if (this.pesquisarForm.get('recebimento')?.value) {
              this.recebimento = 'cartao'
            } else {
              this.recebimento = 'dinheiro'
            }

          },
          error: (fail: any) => {
            this.recebimento = 'default'
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

    // let conta1 = {
    //   id: 'caaafcf4-8511-466b-9fc3-f10eeb660cf7',
    //   nome: 'ALUNO TAL',
    //   historico: '01/20 MENSALIDADE',
    //   formaPagamento: 'DINHEIRO',
    //   vencimento: new Date(2022, 6, 25, 0, 0, 0).toISOString(),
    //   dataPgm: new Date(2022, 6, 25, 14, 25, 30).toISOString(),
    //   tipo: 'C',
    //   valorPago: 130.90,
    //   usuario: 'DESENVOLVEDOR'
    // }

    // let conta2 = {
    //   id: 'a67c9bb2-c443-4938-bf20-a7ece2e83fc5', nome: 'FULANO TAL',
    //   historico: '15/20 MENSALIDADE',
    //   formaPagamento: 'DINHEIRO',
    //   vencimento: new Date(2022, 6, 20, 0, 0, 0).toISOString(),
    //   dataPgm: new Date(2022, 6, 20, 14, 25, 30).toISOString(),
    //   tipo: 'd',
    //   valorPago: 125,
    //   usuario: 'DESENVOLVEDOR'
    // }

    // let contas = new Array<any>()

    // contas.push(conta1)
    // contas.push(conta2)
    // this.Sucesso({ contas: contas })
  }

  public ConfirmarModal(contaId: any): void {
    const dialogRef = this._modal
      .open(ConferenciaConfirmarComponent, ConferenciaConfirmarComponentModal(contaId));
    dialogRef.afterClosed().subscribe((data) => {

      if (data.confirm == true) {

        var index = this.contas.findIndex(element => element.id == contaId)

        this.contas[index].statusBoleto = 'Confirmado'
      }

    });
  }

  public Extornar(contaId: any): void{
    const dialogRef = this._modal
    .open(ConferenciaExtornarComponent, ConferenciaConfirmarComponentModal(contaId));
  dialogRef.afterClosed().subscribe((data) => {

    if (data.confirm == true) {

      var index = this.contas.findIndex(element => element.id == contaId)

      this.contas[index].statusBoleto = 'Estornado'
    }

  });
  }

  public Sucesso(resp: any) {
    this.spinnerSearch = 'hidden'
    this.contas = Object.assign([], resp['contas'])
    this.recebimento = "dinheiro"



  }

  public Erro(error: any) {

  }

  public SaldoBancario(): void {

    const dialogRef = this._modal
      .open(SaldoBancarioComponent, OpenSaldoComponentModal());
    dialogRef.afterClosed().subscribe((data) => {



    });
  }




}