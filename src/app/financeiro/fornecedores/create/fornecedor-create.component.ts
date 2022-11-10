import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { FinanceiroService } from "../../services/financ.service";
import { Cargos, Unidades } from "src/app/_shared/models/perfil.model";


@Component({
  selector: 'createfornecedormodal',
  templateUrl: './fornecedor-create.component.html',
  styleUrls: ['./fornecedor-create.component.scss']
})

export class CreateFornecedorComponent extends BaseComponent implements OnInit {

  //baseUrl = environment.baseUrl;
  public saveSpinner = 'hidden'
  public enderecoContainer = 'hidden'
  //public cepReturn: CepReturn = new CepReturn();
  public fornecedorForm!: FormGroup;
  public endereco: FormGroup
  public validadeEmailMsg = false
  public validadeCPFMsg = false
  // cargos = Cargos;
  mensagem = "";
  showMensagem = false

  unidades = Unidades;
  constructor(
    override _snackBar: MatSnackBar,
    private _finService: FinanceiroService,
    //private router: Router,
    private _fb: FormBuilder,
    private _http: HttpClient,
    public dialogRef: MatDialogRef<CreateFornecedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    super(_snackBar);
    this.fornecedorForm = _fb.group({
      nome: ['', [Validators.required]],
      ie_rg: [''],
      cnpj: ['', [Validators.required, Validators.minLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      telefoneContato: [''],
      telWhatsapp: [''],
      nomeContato: ['', [Validators.required]],
      ativo: [true],
      unidadeId: [''],

      endereco: this.endereco = _fb.group({
        cep: ['', [Validators.required, Validators.minLength(8)]],
        logradouro: [''],
        complemento: [''],
        numero: ['', [Validators.required]],
        cidade: ['', [Validators.required]],
        uf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],//,
        bairro: ['', [Validators.required]]//,
      })
    })
  }

  ngOnInit() {

    this.fornecedorForm.get('unidadeId')?.setValue(this.tokenInfo.UnidadeId)
    // console.log(this.tokenInfo.Unidade);
    // console.log(this.tokenInfo.Codigo);
    // console.log(this.tokenInfo);
    // this.fornecedorForm.get('email').setErrors({ 'incorrect': true });
    //this.fornecedorForm.get('cnpj_cpf').setErrors({ 'incorrect': true });

  }


  onSubmit(form: any) {


    // console.log(form.value)
    if (this.fornecedorForm.valid) {

      this.saveSpinner = 'visible'

      this._finService.SaveFornecedor(this.fornecedorForm.value)
        .subscribe(
          sucesso => { this.onSubmitSucess(sucesso) },
          falha => { this.onSubmitFalha(falha) }
        )
    }
  }

  onSubmitSucess(resposta: any) {
    this.OpenSnackBarSucesso("Fornecedor salvo com sucesso.")
    this.saveSpinner = 'hidden'
    this.dialogRef.close({})
  }

  onSubmitFalha(error: any) {
    this.OpenSnackBarErrorDefault();
    this.saveSpinner = 'hidden'
  }



  get disabledButton() {

    if (this.fornecedorForm.valid) {
      return this.saveSpinner != 'hidden'
    } else {
      return true
    }
  }

  get getValue() {

    var value = this.fornecedorForm.get('cnpj_cpf')?.value

    if (this.fornecedorForm.get('cnpj_cpf')?.value.length <= 11) {


      return '123434'//value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4")
    } else {

      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5")
    }
  }

  // buscarEmail(event: any) {
  //     if (this.fornecedorForm.get('email').valid) {
  //         this.validadeEmailMsg = false
  //         this.http.get(`${this.baseUrl}/adm/aluno/email/${event.target.value}`, {
  //         }).subscribe(response => {

  //         }, (err) => {
  //             if (err['status'] == 409) {
  //                 this.validadeEmailMsg = true
  //                 this.fornecedorForm.get('email').setErrors({ 'incorrect': true });
  //             }
  //         },
  //             () => {
  //                 this.fornecedorForm.get('email').setErrors(null);
  //             });
  //     }
  // }

  // buscarCPF(event: any) {
  //     // console.log(event.target.value)
  //     console.log(this.fornecedorForm.get('cnpj_cpf').value)
  //     console.log(this.fornecedorForm.get('cnpj_cpf').valid)
  //     console.log(this.fornecedorForm.get('cnpj_cpf').value.length)
  //     if (this.fornecedorForm.get('cnpj_cpf').valid) {
  //         this.validadeCPFMsg = false
  //         let cpf = this.fornecedorForm.get('cnpj_cpf').value
  //         //this.http.get(`${this.baseUrl}/adm/aluno/cpf/${event.target.value}`, {
  //         this.http.get(`${this.baseUrl}/adm/aluno/cpf/${cpf}`, {
  //             headers: new HttpHeaders({
  //                 "Content-Type": "application/json",
  //                 "Authorization": "Bear "
  //             })
  //         }).subscribe(response => {

  //         }, (err) => {
  //             if (err['status'] == 409) {
  //                 this.validadeCPFMsg = true
  //                 this.fornecedorForm.get('cnpj_cpf').setErrors({ 'incorrect': true });
  //             }
  //         },
  //             () => {
  //                 this.fornecedorForm.get('cnpj_cpf').setErrors(null);
  //             });
  //     }
  // }


  consultaCEP(CEP: string) {
    //  console.log(CEP);
    if (this.endereco.get('cep')?.valid) {


      //var mystring = "crt/r2002_2";
      CEP = CEP.replace('-', '');
      CEP = CEP.replace('.', '');
      console.log(CEP);
      this._http.get(`https://viacep.com.br/ws/${CEP}/json/`, {})
        .subscribe((response: any) => {

          this.endereco.get('logradouro')?.setValue(response["logradouro"].toUpperCase());
          this.endereco.get('bairro')?.setValue(response["bairro"].toUpperCase());
          this.endereco.get('cidade')?.setValue(response["localidade"].toUpperCase());
          this.endereco.get('uf')?.setValue(response["uf"].toUpperCase());

        }, err => {
          // console.log(err) 
        },
          () => {
            //  console.log('finaly')
            //  this.showEndereco = true
          });
    }
  }

  onOkClick() {
    //console.log("I do nothing");
    this.dialogRef.close({ clicked: "Ok" });
  }

}