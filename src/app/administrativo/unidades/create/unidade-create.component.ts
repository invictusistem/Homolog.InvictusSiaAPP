import { Component, Inject, OnInit, Pipe, PipeTransform } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { UpperCasePipe } from "@angular/common";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";

@Pipe({ name: 'myPipe' })
export class MyPipe implements PipeTransform {
    transform(val?: any) {
        console.log(val)
        return val?.toUpperCase()
    }
}

@Component({
    selector: 'createunidademodal',
    templateUrl: './unidade-create.component.html',
    styleUrls: ['./unidade-create.component.scss'],
    animations: [HighlightTrigger]
})

export class CreateUnidadeComponent implements OnInit {

    // pageSize: number = 5;
    // genericTasks: GenericTask[] = new Array<GenericTask>();
    // length: number;
    // pageEvent: PageEvent;
    public saveSpinner = 'hidden'
    public showMensagem = 'hidden'
    public msgErros: any[] = new Array<any>();
    testepipe: any
    private _baseUrl = environment.baseUrl
    public unidadeForm: FormGroup;
    public colaboradorForm?: FormGroup;
    //public salas: Sala[]
    constructor(
        //private service: AdmService,
        private upperCasePipe: UpperCasePipe,
        private _helper: HelpersService,
        private _http: HttpClient,
        private _fb: FormBuilder,
        private _modal: MatDialog,
        public dialogRef: MatDialogRef<CreateUnidadeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.unidadeForm = this._fb.group({
            descricao: ['', [Validators.required]],
            sigla: ['', [Validators.required, Validators.maxLength(3), Validators.minLength(3)]],
            cnpj: ['', [Validators.required]],
            cep: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]],
            complemento: [''],
            numero: ['', [Validators.required]],
            logradouro: ['', [Validators.required]],
            bairro: ['', [Validators.required]],
            cidade: ['', [Validators.required]],
            uf: ['', [Validators.required]],
            isUnidadeGlobal: [false],
            ativo: [true],
        })


    }

    get habilitarBotao() {
        // console.log(this.unidadeForm.valid)
        // console.log(this.colaboradorForm.valid)
        if (this.unidadeForm.valid && this.colaboradorForm?.valid) {
            return false
        } else {
            return true
        }

    }
    ngOnInit() {

        // this.getCargos();
    }

    cargos: any[] = new Array<any>()
    getCargos() {

        this._http.get(`${this._baseUrl}/unidade/cargo`)
            .subscribe(response => {
                this.cargos = Object.assign([], response)
            }, (err) => {
                // console.log(err)
            },
                () => {
                    // console.log(this.cargos)
                    //this.showForm = true
                });
    }

    log() {
        // console.log(this.unidadeForm.value)
        // console.log(this.colaboradorForm.value)
        // console.log(this.testepipe)

        // if (form.valid) {
        var command = { unidade: this.unidadeForm.value, colaborador: this.colaboradorForm?.value }
        this._http.post(`${this._baseUrl}/unidade`, command, {})
            .subscribe(resp => { },
                (error) => {
                    //console.log(error)
                },
                () => { this.dialogRef.close({ clicked: "OK" }) })

        // }
    }

    onSubmit(form: any) {
        this.showMensagem = 'hidden'

        if (form.valid) {
            this.msgErros = new Array<any>()
            this.saveSpinner = 'visible'
            this._http.post(`${this._baseUrl}/unidade`, this.unidadeForm.value, {})
                .subscribe(resp => { },
                    (error) => {
                        console.log(error['status'])
                        this.saveSpinner = 'hidden'
                        this.msgErros = error['error'].msg
                        this.showMensagem = 'visible'

                    },
                    () => {
                        this._helper.openSnackBarSucesso('Unidade criada sucesso')
                        this.dialogRef.close({ created: true })
                    })

        }
    }

    consultaCEP(CEP: string, form: any) {
        //  console.log(CEP);
        // console.log(form.controls['cep'].valid);
        // console.log(form.controls['cep'].value)
        if (form.controls['cep'].value) {

            this._http.get(`https://viacep.com.br/ws/${CEP}/json/`, {})
                .subscribe((response: any) => {

                    // console.log(response)
                    form.get('logradouro').setValue(response["logradouro"].toUpperCase());
                    form.get('bairro').setValue(response["bairro"].toUpperCase());
                    form.get('cidade').setValue(response["localidade"].toUpperCase());
                    form.get('uf').setValue(response["uf"].toUpperCase());
                }, err => {
                    //console.log(err)
                },
                    () => {
                        // console.log('finaly')
                    });
        }
    }

    get saveButton() {

        if (this.unidadeForm.valid) {
            return this.saveSpinner != 'hidden'
        } else {
            return true
        }
    }

}
