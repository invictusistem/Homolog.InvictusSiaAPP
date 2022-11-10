import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../../services/financ.service';

@Component({
  selector: 'app-pagarconta',
  templateUrl: './pagarconta.component.html',
  styleUrls: ['./pagarconta.component.scss']
})
export class PagarcontaComponent extends BaseComponent  implements OnInit {

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
        public dialogRef: MatDialogRef<PagarcontaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          super(_snackBar);
        this.recebimentoForm = _fb.group({
            boletoId: ['', [Validators.required]],
            valorReceber: [0],
            valorRecebido: [0, [Validators.required]],
            formaRecebimentoId: ['', [Validators.required]],
            bancoId: ['', [Validators.required]],
            digitosCartao: ['0000']

        })

        this.recebimentoForm.get('formaRecebimentoId')?.valueChanges.subscribe(
            (form: any) => {

                if (this.recebimentoForm.get('formaRecebimentoId')?.value != '') {

                    var forma = this.formasRecebimento.find(element =>
                        element.descricao == 'DINHEIRO'
                    )

                    console.log(forma)

                    this.recebimentoForm.get('bancoId')?.setValue('')

                    if (this.recebimentoForm.get('formaRecebimentoId')?.value == forma?.id) {



                        this.recebimentoForm.get('digitosCartao')?.disable()


                    } else {
                        this.recebimentoForm.get('digitosCartao')?.enable()
                    }
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


        console.log(this.data)
        //console.log(this.data['debito'])
        this.GetConta();
        
        //this.GetFormasRecebimentosFromUnidade()

        // this.dialogRef.addPanelClass('recebervalores-class')

        //this.mostrarModalPrincipal = false
    }

    private GetConta(){
        this._finService.GetContaReceber(this.data['debito'].id)
            .subscribe({
                next: (resp:any) => { 
                    this.debito = resp['conta']
                 },
                error: (error:any) => {},
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

        this.recebimentoForm.get('digitosCartao')?.disable()
        console.log(this.data)
        this.aluno = Object.assign({}, this.data['aluno'])
        //this.debito = Object.assign({}, this.data['debito'])
        console.log(this.debito)
        //this.valorQuitado = this.debito.valor - this.debito.desconto
        this.recebimentoForm.get('boletoId')?.setValue(this.data['debito'].id)
        if (this.debito.statusBoleto == 'Vencido') {
            // console.log(this.debito.valor)
            this.recebimentoForm.get('valorReceber')?.setValue(this.debito.valor)
            this.recebimentoForm.get('valorRecebido')?.setValue(this.debito.valor)
        } else {
            let total = this.debito.valor - parseInt(this.debito.desconto)
            // console.log(total)
            this.recebimentoForm.get('valorReceber')?.setValue(total)
            this.recebimentoForm.get('valorRecebido')?.setValue(total)

        }

        

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


    public Quitar() {

        this.saveSpinner = 'visible'
        this._http.put(`${this.baseUrl}/financeiro/boleto-pagar`, this.recebimentoForm.value)
            .subscribe(resp => {

            },
                (error) => {
                    this.saveSpinner = 'hidden'
                    this.OpenSnackBarErrorDefault();
                    // console.log(error) 
                },
                () => {
                    this.OpenSnackBarSucesso("Status do boleto alterado com sucesso.")
                    this.dialogRef.close({ clicked: true })
                })
        //boleto-pagar/{idDebito}

    }


}