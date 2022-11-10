import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../../services/financ.service';

@Component({
  selector: 'app-contaspagar-edit',
  templateUrl: './contaspagar-edit.component.html',
  styleUrls: ['./contaspagar-edit.component.scss']
})
export class ContaspagarEditComponent extends BaseComponent implements OnInit {

  public contaForm: FormGroup
  private conta: any
  
  public colaboradores: any[] = new Array<any>()
  public fornecedores: any[] = new Array<any>()

  public subcontas: any[] = new Array<any>()
  public bancos: any[] = new Array<any>()
  public eHfornecedor = true

  constructor(
    override _snackBar: MatSnackBar,
    private _financService: FinanceiroService,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ContaspagarEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    super(_snackBar);

    this.contaForm = _fb.group({
      // vencimento: ['', [Validators.required]],
      // valor: ['', [Validators.required]],
      // ehFornecedor: [true],
      // pessoaId: ['', [Validators.required]],
      // historico: [''],
      // subcontaId: ['', [Validators.required]],
      // bancoId: ['']

      id: [''],
      vencimento: ['', [Validators.required]],
      dataPagamento: [''],
      valor: ['', [Validators.required]],
      valorPago: [''],
      juros: [''],
      jurosFixo: [''],
      multa: [''],
      nome: [''],
      multaFixo: [''],
      desconto: [''],
      diasDesconto: [''],
      statusBoleto: [''],
      reparcelamentoId: [''],
      centroCustoUnidadeId: [''],
      informacaoDebitoId: [''],
      pessoaId: ['',[Validators.required]],
      bancoId: [''],
      banco: [''],
      ehFornecedor: [true],
      id_unico: [''],
      id_unico_original: [''],
      status: [''],
      msg: [''],
      nossonumero: [''],
      linkBoleto: [''],
      linkGrupo: [''],
      linhaDigitavel: [''],
      pedido_numero: [''],
      banco_numero: [''],
      token_facilitador: [''],
      credencial: [''],
      historico: [''],
      subConta: [''],
      subContaId: ['', [Validators.required]],
      formaPagamento: [''],
      digitosCartao: [''],
      responsavelCadastroId: [''],
      tipo: [''],
      dataCadastro: [''],
      ativo:[true]

    })

    this.contaForm.get('ehFornecedor')?.valueChanges.subscribe(
      (form: any) => {
        console.log('changevalue')
        // if (this.contaForm.get('ehFornecedor')?.value) {
        //   this.contaForm.get('pessoaId')?.setValue('')
        //   this.eHfornecedor = true
        // } else {
        //   this.contaForm.get('pessoaId')?.setValue('')
        //   this.eHfornecedor = false
        // }
      }
    );

  }

  public ChangePessoa(pessoa: any) {
    //console.log('clicado')
    if (pessoa == 'Aluno') {
      if (this.eHfornecedor != false) {
        this.contaForm.get('pessoaId')?.setValue('')
      }
      this.eHfornecedor = false
    } else {
      if (this.eHfornecedor != true) {
        this.contaForm.get('pessoaId')?.setValue('')
      }
      this.eHfornecedor = true
    }

  }

  ngOnInit() {
    this.GetColaboradoresProfessore()
  }

  private GetContaReceber() {

    this._financService.GetContaReceber(this.data['conta'].id)
      .subscribe({
        next: (resp: any) => {
          //console.log(resp['conta'])
          this.contaForm.patchValue(resp['conta']);
          this.conta = JSON.parse(JSON.stringify(this.contaForm.value))
        },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => {
          
          var pessoa = this.fornecedores.find(element => element.id == this.conta.pessoaId)
          console.log(pessoa)
          if(pessoa != null){
            this.eHfornecedor = true
          }else{
            this.eHfornecedor = false
          }
         

          this.dialogRef.addPanelClass('contareceber-editar-class')
          this.initProgressBar = 'hidden'
          this.showForm = true
          //console.log(this.fornecedores)

          //console.log(this.contaForm.value)
          // this.GetAlunosFromUnidade() 
        }
      })

  }

  public GetColaboradoresProfessore() {
    // GetAlunosFromUnidade
    this._financService.GetColaboradoresProfessores(this.data['conta'].pessoaId)
      .subscribe({
        next: (resp: any) => {
          this.colaboradores = Object.assign([], resp['result'])
          //console.log(this.colaboradores)
        },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { this.GetFornecedoresFromUnidade() }
      })
  }

  public GetFornecedoresFromUnidade() {
    // GetFornecedoresFromUnidades
    this._financService.GetFornecedoresFromUnidades(this.data['conta'].pessoaId)
      .subscribe({
        next: (resp: any) => {

          //this.fornecedores = resp['fornecedores'].map((element: any) => {  element.tipoPessoa == 'Fornecedor' })
          this.fornecedores = Object.assign([], resp['fornecedores'])
          console.log(this.fornecedores)
          // resp['fornecedores'].forEach((element: any) => {
          //   this.fornecedores.push({razaoSocial: element.nome, pessoaId: element.id})
          // });



        },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { this.GetAllBancosFromUnidade() }
      })
  }

  public GetAllBancosFromUnidade() {
    //GetBancosAtivosFromUnidade
    this._financService.GetBancosAtivosFromUnidade()
      .subscribe({
        next: (resp: any) => { this.bancos = Object.assign([], resp['result']) },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { this.GetAllSubcontasFromUnidade() }
      })
  }

  public GetAllSubcontasFromUnidade() {
    // GetSubcontasAtivas
    this._financService.GetSubcontasAtivas()
      .subscribe({
        next: (resp: any) => { this.subcontas = Object.assign([], resp['result']) },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => {
          //
          this.GetContaReceber()
          // this.dialogRef.addPanelClass('contareceber-nova-class')
          // this.initProgressBar = 'hidden'
          // this.showForm = true
        }
      })
  }

  get disabledButtonSave() {

    if(this.conta.statusBoleto == 'Pago' ||
    this.conta.statusBoleto == 'Cancelado' ||
    this.conta.statusBoleto == 'Suspenso' ||
    this.conta.statusBoleto == 'Reparcelado' ||
    this.conta.statusBoleto == 'Quitado'){
      
      this.showSaveButton = 'hidden'
      this.contaForm.disable();
      return true
    }

    if (this.contaForm.valid &&
      JSON.stringify(this.conta) !=
      JSON.stringify(this.contaForm.value)) {

      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {
    this.matProgressSaveButton = 'visible'
    this._financService.EditContaReceber(this.contaForm.value)
      .subscribe({
        next: (resp: any) => { this.OpenSnackBarSucesso('Conta editada com sucesso.'); this.dialogRef.close({ saved: true }) },
        error: (error: any) => { this.matProgressSaveButton = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { }
      })
  }

}