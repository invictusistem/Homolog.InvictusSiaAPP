import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../services/financ.service';

@Component({
  selector: 'app-caixa-escola',
  templateUrl: './caixa-escola.component.html',
  styleUrls: ['./caixa-escola.component.scss']
})

export class CaixaEscolaComponent extends BaseComponent implements OnInit {
    
  public pesquisarForm: FormGroup
  public meiosPagamento: any[] = new Array<any>()
  public contas: any[] = new Array<any>()
  public disabledForm = true
  public totalAtraso: any
  public totalRecebido: any

  constructor(
    override _snackBar: MatSnackBar,
    private _financService: FinanceiroService,
    private _fb: FormBuilder,
    private _modal: MatDialog
  ) {
      super(_snackBar);
      this.pesquisarForm = _fb.group({
        cartao: [false],
        start: ['', [Validators.required]],
        end: ['', [Validators.required]]
      });
     
  }


  ngOnInit() {
    //this.spinnerSearch = "visible"
    //this.GetMeiosPagamento()
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
  
  
  public Pesquisar(event?: any) {

    this.showMessageNotFound = false

    if (this.pesquisarForm.valid) {
      this.spinnerSearch = 'visible'
      this.showMessageNotFound = false
      this.contas = new Array<any>()
      this._financService.GetCaixa(
        this.pesquisarForm.get('cartao')?.value,
        new Date(this.pesquisarForm.get('start')?.value).toISOString(),
        new Date(this.pesquisarForm.get('end')?.value).toISOString()
        )
        .subscribe({
          next: (resp: any) => {

            this.totalRecebido = resp['totalRecebido']
            this.contas = Object.assign([], resp['result'])
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

}
