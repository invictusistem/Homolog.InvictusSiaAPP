import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'edit-bolsamodal',
    templateUrl: './edit-bolsa.component.html',
    styleUrls: ['./edit-bolsa.component.scss']
})

export class EditBolsaComponent extends BaseComponent implements OnInit {

    //public initProgressBar = 'visible'
    public showContent = false
    // public typesPacotes: any;
    public originalBolsa: any
    public bolsaForm: FormGroup

    constructor(
        private _admService: AdmService,
        override _snackBar: MatSnackBar,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<EditBolsaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
        this.bolsaForm = _fb.group({
            id: [''],
            nome: ['', [Validators.required]],
            percentualDesconto: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
            typePacoteId: ['', [Validators.required]],
            dataExpiracao: ['', [Validators.required]],
            senha: [''],
            colaborador: [''],
            unidadeId: [''],
            dataCriacao: ['']
        })
    }

    ngOnInit() {
        this.GetBolsa();
    }

    GetBolsa() {
        this.initProgressBar = 'visible'
        this._admService.GetBolsa(this.data['bolsaId'])
            .subscribe(
                sucesso => { this.GetBolsaSucesso(sucesso) },
                falha => { this.GetBolsaErro(falha) }
            )

    }

    GetBolsaSucesso(resposta?:any) {
        this.bolsaForm.patchValue(resposta['bolsa']);
        this.bolsaForm.patchValue(resposta['bolsa']);
        this.originalBolsa = JSON.parse(JSON.stringify(this.bolsaForm.value))
        this.initProgressBar = 'hidden'
        this.dialogRef.addPanelClass('editbolsa-class')
        this.showContent = true
    }

    GetBolsaErro(error?:any) {
        this.initProgressBar = 'hidden'
    }

    //disabledSaveButton = 'hidden'
    get disabledButton() {
        if (this.bolsaForm.valid &&
            JSON.stringify(this.originalBolsa) !=
            JSON.stringify(this.bolsaForm.value)) {

            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }

    onSubmit(form?:any) {

        if (this.bolsaForm.valid) {
            this.disabledSaveButton = 'visible'
            this._admService.EditBolsa(this.bolsaForm.value)
                .subscribe(
                    sucesso => { this.onSubmitSucesso(sucesso) },
                    falha => { this.onSubmitErro(falha) }
                )
        }
    }

    onSubmitSucesso(resp?:any) {
        this.disabledSaveButton = 'hidden'
        this.dialogRef.close({ clicked: true })
    }

    onSubmitErro(error?:any) {
        this.disabledSaveButton = 'hidden'
    }
}