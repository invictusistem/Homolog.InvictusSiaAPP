import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'editcolaboradoresmodal',
    templateUrl: './colaborador-edit.component.html',
    styleUrls: ['./colaborador-edit.component.scss']
})

export class EditColaboradoresComponent extends BaseComponent implements OnInit {

    //baseUrl = environment.baseUrl;
    originalColaborador: any;
    autorizado = 'visible'
    //public initProgressBar = 'visible'
    public saveBar = 'hidden'
    // unidades = Unidades;
    showMensagem = false
    mensagem = ''
    cpf = ''
    //showForm = false

    //public cepReturn: CepReturn = new CepReturn();
    cargos: any[] = new Array<any>();
    ativo = true;
    public colaboradorForm: FormGroup
    public endereco: FormGroup;

    constructor(
        //private _helper: HelpersService,
        private _admService: AdmService,
        override _snackBar: MatSnackBar,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<EditColaboradoresComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(_snackBar);
        // this.colaboradorForm = _fb.group({
        //     id: [''],
        //     nome: ['', [Validators.required, Validators.minLength(5)]],
        //     email: ['', [Validators.email]],
        //     cpf: [''],
        //     celular: [null, [Validators.required, Validators.minLength(5)]],
        //     cargoId: ['', [Validators.required]],
        //     unidadeId: [''],
        //     ativo: [true, [Validators.required]],
        //     cep: ['', [Validators.required, Validators.minLength(8)]],
        //     logradouro: ['', [Validators.required, Validators.minLength(1)]],
        //     complemento: [null],
        //     numero: ['', [Validators.required]],
        //     cidade: ['', [Validators.required, Validators.minLength(1)]],
        //     uf: ['', [Validators.required, Validators.minLength(2)]],
        //     bairro: ['', [Validators.required, Validators.minLength(1)]],
        //     tipoPessoa:[''],
        //     dataCriacao: [''],
        //     supervisorId: ['']
        // })

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
            id:[],
            nome: ['', [Validators.required, Validators.minLength(5)]],
            email: ['', [Validators.required, Validators.email]],
            cpf: ['', [Validators.required, Validators.minLength(11)]],
            celular: [null, [Validators.required, Validators.minLength(10)]],
            cargoId: ['', [Validators.required]],
            tipoPessoa:[''],
            dataCriacao: [''],
            unidadeId:[''],
            pessoaRespCadastroId:[''],
            ativo: [true, [Validators.required]],
            endereco: this.endereco = _fb.group({
                id:[''],
                cep: ['', [Validators.required, Validators.minLength(8)]],
                logradouro: ['', [Validators.required, Validators.minLength(1)]],
                complemento: [''],
                numero: ['', [Validators.required]],
                cidade: ['', [Validators.required, Validators.minLength(1)]],
                uf: ['', [Validators.required, Validators.minLength(2)]],
                bairro: ['', [Validators.required, Validators.minLength(1)]],
                pessoaId:['']
                //,
            })


        })
    }

    tentando = true
    get teste() {
        return this.tentando
    }
    get desabilitar() {

        if (this.colaboradorForm.valid &&
            JSON.stringify(this.originalColaborador) !=
            JSON.stringify(this.colaboradorForm.value)) {

            return this.saveBar != 'hidden'
        } else {
            return true
        }
    }

    ngOnInit() {
        this.getColaborador();
    }

    getColaborador() {

        this._admService.GetColaborador(this.data['colaborador'].id)
            .subscribe({
                next: (response: any) => {

                    this.cargos = Object.assign([], response['values'])
                    this.colaboradorForm.patchValue(response['colaborador']);
                    this.originalColaborador = JSON.parse(JSON.stringify(this.colaboradorForm.value))
                    this.dialogRef.addPanelClass('myeditcolab-class')
                    console.log(this.colaboradorForm.value)
                    // this.colaboradorForm.disable()
                    // this.autorizado = 'hidden'
                    this.showForm = true
                    this.initProgressBar = 'hidden'

                },
                error: (error) => {
                    this.initProgressBar = 'hidden'
                }
            })
    }


    disabledSpinner = false
    edit(form: any) {

        if (this.colaboradorForm.valid) {
            this.saveBar = 'visible'

            this._admService.EditColaborador(this.colaboradorForm.value)
                .subscribe(response => {

                }, err => {
                    this.saveBar = 'hidden'
                },
                    () => {
                        this.OpenSnackBarSucesso('Colaborador editado com sucesso.')
                        this.saveBar = 'hidden'

                        this.dialogRef.close();

                    });
        }
    }



    openSnackBar() {
        this.OpenSnackBarError('ERRO')
    }

    consultaCEP(CEP: string) {
        //console.log('consulta')
        if (this.endereco.get('cep')?.valid) {

            CEP = CEP.replace('-', '');
            CEP = CEP.replace('.', '');

            this._admService.CepConsulta(this.endereco.get('cep')?.value)
                .subscribe(response => {
                    this.endereco.get('logradouro')?.setValue(response["logradouro"].toUpperCase())
                    this.endereco.get('bairro')?.setValue(response["bairro"].toUpperCase())
                    this.endereco.get('cidade')?.setValue(response["localidade"].toUpperCase())
                    this.endereco.get('uf')?.setValue(response["uf"].toUpperCase())
                }, err => { },
                    () => { });
        }
    }
}