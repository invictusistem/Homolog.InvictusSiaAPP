import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { Unidades } from "src/app/_shared/models/perfil.model";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { AdmService } from "../../services/adm.service";


@Component({
    selector: 'createprofessormodal',
    templateUrl: './professor-create.component.html',
    styleUrls: ['./professor-create.component.scss'],
    animations: [HighlightTrigger]
})

export class CreateProfessorComponent implements OnInit {

    baseUrl = environment.baseUrl;
    //public cepReturn: CepReturn = new CepReturn();
    public colaboradorForm: FormGroup;
    public endereco: FormGroup;

    private jwtHelper = new JwtHelperService();
    public tokenInfo: TokenInfos = new TokenInfos();
    public validadeEmailMsg = false
    public validadeCPFMsg = false
    public disabledSpinner = false
    public showMensagem = 'hidden'
    public disabledSaveButton = 'hidden'
    public msgErros: any
    //cargos = Cargos;
    mensagem = "";
    // public showMensagem = 'hidden'
    //public bairro: string = null;
    //@Input() disabled = true;
    unidades = Unidades;//: string[] = new Array("Campo Grande II", "Jacarepaguá");
    constructor(
        //private service: AdmService,
        //private _snackBar: MatSnackBar,
        private _helper: HelpersService,
        private _admService: AdmService,
        private router: Router,
        private _fb: FormBuilder,
        private http: HttpClient,
        public dialogRef: MatDialogRef<CreateProfessorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.colaboradorForm = _fb.group({
            // templateName: ['', [Validators.required, Validators.minLength(5)]],
            // newCat: [,[Validators.required, Validators.minLength(3)]],
            // newFunc: [, [Validators.required, Validators.minLength(3)]]
            nome: ['', [Validators.required, Validators.minLength(5)]], //
            email: [''], // 
            cpf: ['', [Validators.required, Validators.minLength(11)]], //
            cnpj: [''],
            celular: [null, [Validators.required, Validators.minLength(11)]],
            telefoneContato: [null],
            nomeContato: [''],
            dataEntrada: [''],
            //cargoId: [0],
            ativo: [true],
            endereco: this.endereco = _fb.group({
                cep: [''],
                logradouro: [''],
                complemento: [''],
                numero: [''],
                cidade: [''],
                uf: [''],
                bairro: ['']//,
                //celular: [new MyTel('', '', ''), [Validators.required, Validators.minLength(1)]]
            })
        })
    }

    ngOnInit() {
        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        // console.log(this.tokenInfo.Unidade);
        // console.log(this.tokenInfo.Codigo);
        // console.log(this.tokenInfo);
    }
    showForm = false
    // showForm = false
    cargos: any[] = new Array<any>()
    getCargos() {

        this.http.get(`${this.baseUrl}/unidade/cargo`)
            .subscribe(response => {
                this.cargos = Object.assign([], response)
            }, (err) => {
                // console.log(err)
            },
                () => {
                    //  console.log(this.cargos)
                    // this.showForm = true
                });
    }

    // OnKeyOnlyNumbers(char: HTMLInputElement){

    //    return String.fromCharCode(char..value).match(/[^0-9]/g) === null

    // }
    //disabledSaveButton = false
    get disabledButton() {
        if (this.colaboradorForm.valid) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }

    onSubmit(form: FormGroup) {
        // this.showMensagem = false
        // console.log(form)
        //console.log(form.value)
        // console.log(form.valid)
        this.showMensagem = 'hidden'
        //var cel = `${form['celular'].value}`
        //console.log(cel)
        // this.dialogRef.close();
        if (this.colaboradorForm.valid) {
            //  this.disabledSpinner = true
            // console.log('form valid')
            // const novoColaborador = JSON.stringify(form.value);
            //this.save(novoColaborador)
            // let newTemplate = this.mapForm(tempForm)
            this.disabledSaveButton = 'visible'
            this.http.post(`${this.baseUrl}/professor`, this.colaboradorForm.value, {})
                .subscribe(response => {

                    // console.log(response)
                    // this.colaboradores = Object.assign([], response['data'])
                    // console.log(this.colaboradores)
                    // this.dialogRef.close();
                }, (err) => {

                    if (err['status'] == 409) {
                        this.msgErros = err['error'].msg
                        this.showMensagem = 'visible'
                        this.disabledSaveButton = 'hidden'
                    } else {
                        this.disabledSaveButton = 'hidden'
                        this._helper.openSnackBarErrorDefault()
                        // console.log(err)
                        //this.dialogRef.close();
                    }
                },
                    () => {
                        //console.log(response)
                        this._helper.openSnackBarSucesso('Professor salvo com sucesso.')
                        //this.openSnackBar()

                        //this.showMensagem = false
                        this.dialogRef.close({ clicked: true });
                        this.disabledSaveButton = 'hidden'
                    });
        }
    }

    // openSnackBar() {
    //     this._snackBar.open('Professor salvo com sucesso.', '', {
    //         horizontalPosition: 'center',
    //         verticalPosition: 'top',
    //         panelClass: 'green-snackbar',
    //         duration: 3 * 1000,
    //     });
    // }

    // buscarEmail(event: any) {
    //     if (this.colaboradorForm.get('email').valid) {
    //         this.validadeEmailMsg = false
    //         this.http.get(`${this.baseUrl}/adm/aluno/email/${event.target.value}`, {
    //             headers: new HttpHeaders({
    //                 "Content-Type": "application/json",
    //                 "Authorization": "Bear "
    //             })
    //         }).subscribe(response => {

    //         }, (err) => {
    //             if (err['status'] == 409) {
    //                 this.validadeEmailMsg = true
    //                 this.colaboradorForm.get('email').setErrors({ 'incorrect': true });
    //             }
    //         },
    //             () => {
    //                 this.colaboradorForm.get('email').setErrors(null);
    //             });

    //         //this.colaboradorForm.get('email').setErrors({ 'incorrect': true });

    //     }
    // }

    // buscarCPF(event: any) {
    //     // console.log(event.target.value)
    //     console.log(this.colaboradorForm.get('cpf').value)
    //     console.log(this.colaboradorForm.get('cpf').valid)
    //     console.log(this.colaboradorForm.get('cpf').value.length)
    //     if (this.colaboradorForm.get('cpf').valid) {
    //         this.validadeCPFMsg = false
    //         let cpf = this.colaboradorForm.get('cpf').value
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
    //                 this.colaboradorForm.get('cpf').setErrors({ 'incorrect': true });
    //             }
    //         },
    //             () => {
    //                 this.colaboradorForm.get('cpf').setErrors(null);
    //             });

    //         //this.colaboradorForm.get('email').setErrors({ 'incorrect': true });

    //     }
    // }
    // https://viacep.com.br/ws/01001000/json/
    showEndereco = 'hidden'
    consultaCEP(CEP: string) {

        if (this.endereco.get('cep')?.valid) {

            this._admService.CepConsulta(this.endereco.get('cep')?.value)
                .subscribe(response => {
                    this.endereco.get('logradouro')?.setValue(response["logradouro"].toUpperCase());
                    this.endereco.get('bairro')?.setValue(response["bairro"].toUpperCase());
                    this.endereco.get('cidade')?.setValue(response["localidade"].toUpperCase());
                    this.endereco.get('uf')?.setValue(response["uf"].toUpperCase());
                }, err => { },
                    () => {
                        this.showEndereco = 'visible'
                    });
        }
    }

    onOkClick() {
        //console.log("I do nothing");
        this.dialogRef.close({ clicked: "Ok" });
    }

}