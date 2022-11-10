import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";

@Component({
    selector: 'createcolaboradoresrmodal',
    templateUrl: './colaborador-create.component.html',
    styleUrls: ['./colaborador-create.component.scss']
})

export class CreateColaboradoresComponent extends BaseComponent implements OnInit {

    mostrarModalPrincipal = true

    public colaboradorForm: FormGroup;
    public endereco: FormGroup;
    public validadeEmailMsg = false
    public validadeCPFMsg = false
    public disabledSpinner = false
    public showContent = false
    //public disabledSaveButton = 'hidden'

    //showForm = false
    cargos: any[] = new Array<any>()
    mensagem = "";
    public showMensagem = 'hidden'
    public msgErros: any

    constructor(
        override _snackBar: MatSnackBar,
        private _admService: AdmService,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateColaboradoresComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        super(_snackBar);

        // this.endereco = _fb.group({
        //     cep: ['', [Validators.required, Validators.minLength(8)]],
        //     logradouro: ['', [Validators.required, Validators.minLength(1)]],
        //     complemento: [''],
        //     numero: ['', [Validators.required]],
        //     cidade: ['', [Validators.required, Validators.minLength(1)]],
        //     uf: ['', [Validators.required, Validators.minLength(2)]],
        //     bairro: ['', [Validators.required, Validators.minLength(1)]]//,
        // })

        this.colaboradorForm = _fb.group({
            nome: ['', [Validators.required, Validators.minLength(5)]],
            email: ['', [Validators.required, Validators.email]],
            cpf: ['', [Validators.required, Validators.minLength(11)]],
            celular: [null, [Validators.required, Validators.minLength(5)]],
            cargoId: ['', [Validators.required]],
            ativo: [true, [Validators.required]],
            endereco: this.endereco = _fb.group({
                cep: ['', [Validators.required, Validators.minLength(8)]],
                logradouro: ['', [Validators.required, Validators.minLength(1)]],
                complemento: [''],
                numero: ['', [Validators.required]],
                cidade: ['', [Validators.required, Validators.minLength(1)]],
                uf: ['', [Validators.required, Validators.minLength(2)]],
                bairro: ['', [Validators.required, Validators.minLength(1)]]//,
            })


        })


    }
    ngOnInit() {
        this.getCargos();
    }

    getCargos() {

        this._admService.GetConfig('CARGOS')
            .subscribe({
                next: (response: any) => {
                    this.cargos = Object.assign([], response['values'])
                    this.dialogRef.addPanelClass('mycreatecolab-class')
                    this.initProgressBar = 'hidden'
                    this.showContent = true
                    this.mostrarModalPrincipal = false
                    this.showForm = true
                    this.funcaoTestar()
                },
                error: (error) => { }
            })
    }

    onSubmit(form: FormGroup) {
        this.showMensagem = 'hidden'
        //console.log(this.colaboradorForm.value)
        if (this.colaboradorForm.valid) {
            this.disabledSpinner = true
            this.disabledCloseModalIcon = true
            this.disabledSaveButton = 'visible'
            this._admService.SaveColaborador(this.colaboradorForm.value)
                .subscribe(response => {
                }, (err) => {
                    this.OpenSnackBarErrorDefault()
                    this.disabledCloseModalIcon = false
                    this.disabledSaveButton = 'hidden'
                    if (err['status'] == 409) {
                        this.msgErros = err['error'].msg
                        this.showMensagem = 'visible'

                    } else {
                        //this.disabledCloseModalIcon = false
                        //this.dialogRef.close({ clicked: "Ok" });
                    }
                },
                    () => {
                        this.disabledCloseModalIcon = false
                        this.OpenSnackBarSucesso('Colaborador salvo com sucesso')
                        this.dialogRef.close({ clicked: "Ok" });
                        this.disabledSaveButton = 'hidden'
                    });
        }
    }


    cpfValidation = false
    emailValidation = false
    funcaoTestar() {
        let cpf = false
        this.cpfValidation = cpf
    }

    showEndereco = 'hidden'
    consultaCEP(CEP: string) {
        //console.log(CEP)
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
        this.dialogRef.close({ clicked: "Ok" });
    }


    get disabledButton() {
        if (this.colaboradorForm.valid) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }
}