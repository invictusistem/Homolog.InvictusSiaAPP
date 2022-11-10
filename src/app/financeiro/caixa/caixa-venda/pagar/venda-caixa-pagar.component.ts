import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-venda-caixa-pagar',
  templateUrl: './venda-caixa-pagar.component.html',
  styleUrls: ['./venda-caixa-pagar.component.scss']
})
export class VendaCaixaPagarComponent extends BaseComponent implements OnInit {

  //baseUrl = environment.baseUrl;
  //public showForm = false
  public aluno: any;// = new Aluno();
  public debito: any;//Debito = new Debito();
  public turma: any
  public mostrarModalPrincipal = true
  public hoje: Date = new Date()
  public vencido = false
  public bancos: any[] = new Array<any>()
  public formasRecebimento: any[] = new Array<any>()

  public iniProgressBar = 'visible'
  public saveSpinner = 'hidden'
  // public valorReceber = 0
  //public valorQuitado = 0
  //public formaRecebimento = "Dinheiro"
  public recebimentoForm!: FormGroup

  constructor(
    override _snackBar: MatSnackBar,
    private _finService: FinanceiroService,
    private _fb: FormBuilder,
    private _http: HttpClient,
    private _modal: MatDialog,
    //private _helper: HelpersService,
    // private _service: PedagService,
    public dialogRef: MatDialogRef<VendaCaixaPagarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar)
    this.recebimentoForm = _fb.group({
      //boletoId: ['', [Validators.required]],
      valorReceber: [0],
      valorRecebido: [0, [Validators.required]],
      formaRecebimentoId: ['', [Validators.required]],
      bancoId: ['', [Validators.required]],
      digitosCartao: ['0000'],
      produtos: [''],
      parcelar: [false],
      parcelas: [1, [Validators.min(1)]],
      matriculaId: ['']

    })

    this.recebimentoForm.get('formaRecebimentoId')?.valueChanges.subscribe(
      (form: any) => {

        if (this.recebimentoForm.get('formaRecebimentoId')?.value != '') {

          var forma = this.formasRecebimento.find(element =>
            element.descricao == 'DINHEIRO'
          )

          this.recebimentoForm.get('bancoId')?.setValue('')

          if (this.recebimentoForm.get('formaRecebimentoId')?.value == forma?.id) {

            this.recebimentoForm.get('digitosCartao')?.disable()

          } else {
            this.recebimentoForm.get('digitosCartao')?.enable()
          }

          var forma = this.formasRecebimento.find((element: any) => {
            return element.id == this.recebimentoForm.get('formaRecebimentoId')?.value
          })

          if (forma.ehCartao) {
            console.log('é cartao')
            if (forma.permiteParcelamento) {
              console.log('pode parcelar')
              this.recebimentoForm.get('parcelas')?.enable()
              this.recebimentoForm.get('parcelar')?.enable()
            } else {
              console.log('nao pode parcelar')
              this.recebimentoForm.get('parcelas')?.disable()
              this.recebimentoForm.get('parcelar')?.disable()
            }

          }
          else {
            console.log('nao é cartao')
            this.recebimentoForm.get('parcelas')?.disable()
            this.recebimentoForm.get('parcelar')?.disable()
          }
        }
      }
    );

    this.recebimentoForm.get('parcelar')?.valueChanges.subscribe(
      (form: any) => {

        if (this.recebimentoForm.get('parcelar')?.value) {
          this.recebimentoForm.get('parcelas')?.enable()
        } else {
          this.recebimentoForm.get('parcelas')?.disable()
        }
      }
    );

  }

  ngOnInit() {

    /*
    PEGAR A PESSOA 
    PEGAR A CONTA (BOLETO)
        SE JA FOI PAGA, TRAZER CONFLITO E O FRONT ATUALIZAR
    PEGAR OS BANCOS

    
    */

    this.recebimentoForm.get('matriculaId')?.setValue(this.data['matriculaId'])
    //console.log(this.data['aluno'])
    //console.log(this.data['debito'])
    //this.GetConta();
    this.AnalisarProdutos()
    //this.GetFormasRecebimentosFromUnidade()

    // this.dialogRef.addPanelClass('recebervalores-class')

    //this.mostrarModalPrincipal = false
  }

  private AnalisarProdutos() {

    var sum = 0
    this.data['produtos'].forEach((element: any) => {
      sum += element.quantidade * element.preco
    });

    this.recebimentoForm.get('valorReceber')?.setValue(sum)
    this.recebimentoForm.get('valorRecebido')?.setValue(sum)
    this.recebimentoForm.get('produtos')?.setValue(this.data['produtos'])

    //var sum2 = sum.toFixed(2)



    this.GetBancoFromUnidade()
  }

  get getResumo() {
    var parcelas = this.recebimentoForm.get('parcelas')?.value

    var valor = this.recebimentoForm.get('valorRecebido')?.value  //valorRecebido

    var valorParcela = valor / parcelas
    // var sum2 = sum.toFixed(2)
    return `${parcelas} x ${valorParcela.toFixed(2)}`//this.recebimentoForm.get('produtos')?
    //return 'testar'
  }



  get liberarParcela() {

    var forma = this.formasRecebimento.find((element: any) => {
      return element.id == this.recebimentoForm.get('formaRecebimentoId')?.value
    })

    if (forma.ehCartao) {
      return !forma.permiteParcelamento
    } else {
      return true
    }

  }







  private GetConta() {
    this._finService.GetContaReceber(this.data['debito'].id)
      .subscribe({
        next: (resp: any) => {
          this.debito = resp['conta']
        },
        error: (error: any) => { },
        complete: () => { this.GetBancoFromUnidade() }

      })
  }

  disabledTransf(banco: any) {

    var forma = this.formasRecebimento.find(element =>
      element.descricao == 'DINHEIRO'
    )

    if (this.recebimentoForm.get('formaRecebimentoId')?.value == forma?.id) {

      this.recebimentoForm.get('bancoId')?.setValue(this.bancos.find(element => element.ehCaixaEscola == true).id)
      //console.log(this.recebimentoForm.get('bancoId')?.value)
      if (banco.ehCaixaEscola == true) {
        return false
      } else {
        return true
      }

    } else {

      if (banco.ehCaixaEscola == true) {
        return true
      } else {
        return false
      }
    }
  }

  private GetBancoFromUnidade() {

    // this.recebimentoForm.get('digitosCartao')?.disable()
    // this.aluno = Object.assign({}, this.data['aluno'])

    // this.recebimentoForm.get('boletoId')?.setValue(this.data['debito'].id)
    // if (this.debito.statusBoleto == 'Vencido') {

    //   this.recebimentoForm.get('valorReceber')?.setValue(this.debito.valor)
    //   this.recebimentoForm.get('valorRecebido')?.setValue(this.debito.valor)
    // } else {
    //   let total = this.debito.valor - parseInt(this.debito.desconto)

    //   this.recebimentoForm.get('valorReceber')?.setValue(total)
    //   this.recebimentoForm.get('valorRecebido')?.setValue(total)
    // }


    this._finService.GetBancosAtivosFromUnidade()
      .subscribe({
        next: (resp: any) => { this.GetBancosSucesso(resp) },
        error: (error: any) => { }
      })
  }

  private GetBancosSucesso(resp: any) {
    this.bancos = resp['result']
    this.GetFormasRecebimentosFromUnidade()
  }

  private GetFormasRecebimentosFromUnidade() {

    this._finService.GetFormasRecebimentosAtivo()
      .subscribe({
        next: (resp: any) => {
          this.formasRecebimento = resp['result']

          var forma = this.formasRecebimento.find(element =>
            element.descricao == 'DINHEIRO'
          )

          //console.log(forma)
          this.recebimentoForm.get('formaRecebimentoId')?.setValue(forma.id)

          this.iniProgressBar = 'hidden'
          this.showForm = true
        },
        error: (error: any) => { }
      })
  }

  get saveButton() {

    if (this.recebimentoForm.valid) {
      return this.saveSpinner != 'hidden'
    } else {
      return true
    }
  }

  public timerDaPaginacaoAutomatica(): Observable<boolean> {
    let numero: number = 1;
    var valido = true
    return of(valido)
      .pipe(delay(2000));
  }


  public Quitar() {
    //console.log(this.recebimentoForm.value)
    this.saveSpinner = 'visible'
    this._http.post(`${this.baseUrl}/venda`, this.recebimentoForm.value)
      .subscribe(resp => {

      },
        (error) => {
          this.saveSpinner = 'hidden'
          this.OpenSnackBarErrorDefault();
        },
        () => {
          this.OpenSnackBarSucesso("Venda efetuada com sucesso.")
          this.dialogRef.close({ vendido: true })
        })
  }


}