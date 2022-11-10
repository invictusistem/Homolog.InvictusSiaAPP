import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { AdmService } from "../../services/adm.service";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'createbolsamodal',
    templateUrl: './create-bolsa.component.html',
    styleUrls: ['./create-bolsa.component.scss']
})

export class CreateBolsaComponent extends BaseComponent implements OnInit {
    
    //public initProgressBar = 'visible'
    public showContent = false
    public typesPacotes: any[] = new Array<any>()
    public bolsaForm: FormGroup

    constructor(
        override _snackBar: MatSnackBar,
        private _admService: AdmService,
        //private _helper: HelpersService, 
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateBolsaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
        this.bolsaForm = _fb.group({
            nome:['',[Validators.required]],
            percentualDesconto:['',[Validators.required,Validators.min(1), Validators.max(100)]],
            typePacoteId:['',[Validators.required]],
            dataExpiracao:['',[Validators.required]]
        })        
    }   

    ngOnInit() {
        this.GetTypePacotes();
    }

    GetTypePacotes() {
        this.initProgressBar = 'visible'
        this._admService.GetTypePacotes()
            .subscribe(
                sucesso => { this.GetTypePacotesSucesso(sucesso) },
                falha => { this.GetTypePacotesErro(falha) }
            )

    }

    GetTypePacotesSucesso(resposta?:any) {
        this.typesPacotes = Object.assign([], resposta['typePacotes']);
        this.initProgressBar = 'hidden'
        this.dialogRef.addPanelClass('createbolsa-class')
        this.showContent = true
    }

    GetTypePacotesErro(error?:any) {
        this.initProgressBar = 'hidden'
    }

    //disabledSaveButton = 'hidden'
    get disabledButton() {
        if (this.bolsaForm.valid) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }

    onSubmit(form?:any){

        if(this.bolsaForm.valid){
            this.disabledSaveButton = 'visible'
            this._admService.SaveBolsa(this.bolsaForm.value)
                .subscribe(
                    sucesso => { this.onSubmitSucesso(sucesso) },
                    falha => { this.onSubmitErro(falha) }
                )}
    }

    onSubmitSucesso(resp?:any){
        this.disabledSaveButton = 'hidden'       
        this.OpenSnackBarSucesso('Bolsa cadastrada com sucesso.')
        this.dialogRef.close({ clicked: true})
    }

    onSubmitErro(error?:any){
        this.disabledSaveButton = 'hidden'      
    }
}