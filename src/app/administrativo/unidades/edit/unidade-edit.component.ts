import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdmService } from "../../services/adm.service";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";

@Component({
    selector: 'editunidademodal',
    templateUrl: './unidade-edit.component.html',
    styleUrls: ['./unidade-edit.component.scss']
})

export class EditUnidadeComponent implements OnInit {

    public initProgressBar = 'visible'
    public saveSpinner = 'hidden'
    public showMensagem = 'hidden'
    public msgErros: any[] = new Array<any>();
    public showContent = false
    public unidadeOriginal: any;
    public unidadeForm: FormGroup;

    constructor(
        private _admService: AdmService,
        private _helper: HelpersService,
        private _fb: FormBuilder,
        private _dialogRef: MatDialogRef<EditUnidadeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.unidadeForm = this._fb.group({
            id: [''],
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
            ativo: [''],
        })
    }

    ngOnInit() {
        this.GetUnidade()
    }

    private GetUnidade() {

        this._admService.GetUnidadeById(this.data['unidade'].id)
            .subscribe(
                sucesso => { this.GetUnidadeSucesso(sucesso) },
                falha => { this.GetUnidadeFalha(falha) }
            )
    }

    private GetUnidadeSucesso(resp: any) {
        this.unidadeForm.patchValue(resp['unidade']);
        this.unidadeOriginal = JSON.parse(JSON.stringify(this.unidadeForm.value))
        this._dialogRef.addPanelClass('myeditunidade-class')
        this.initProgressBar = 'hidden'
        this.showContent = true
    }

    private GetUnidadeFalha(error: any) {
        this.initProgressBar = 'hidden'
    }

    public ConsultaCEP(CEP: string) {

        if (this.unidadeForm.get('cep')?.valid) {

            this._admService.CepConsulta(CEP)
                .subscribe(response => {

                    // console.log(response)

                    this.unidadeForm.get('logradouro')?.setValue(response["logradouro"].toUpperCase());
                    this.unidadeForm.get('bairro')?.setValue(response["bairro"].toUpperCase());
                    this.unidadeForm.get('cidade')?.setValue(response["localidade"].toUpperCase());
                    this.unidadeForm.get('uf')?.setValue(response["uf"].toUpperCase());

                }, err => {
                    //console.log(err) 
                });
        }
    }

    get saveButton() {

        if (this.unidadeForm.valid &&
            JSON.stringify(this.unidadeOriginal) !=
            JSON.stringify(this.unidadeForm.value)) {

            return this.saveSpinner != 'hidden'
        } else {
            return true
        }
    }

    public SaveEdit() {

        if (this.unidadeForm.valid) {
            this.showMensagem = 'hidden'
            this.msgErros = new Array<any>()
            this.saveSpinner = 'visible'

            this._admService.EditUnidade(this.unidadeForm.value)
                .subscribe(
                    sucesso => { this.SaveEditSucesso(sucesso) },
                    falha => { this.SaveEditFalha(falha) }

                )
        }
    }

    private SaveEditSucesso(resp: any) {
        this._helper.openSnackBarSucesso("Unidade editada com sucesso")
        this._dialogRef.close({edited: true})
    }

    private SaveEditFalha(falha: any) {
        this.msgErros = falha['error'].msg
        this.showMensagem = 'visible'
        this.saveSpinner = 'hidden'
    }
}