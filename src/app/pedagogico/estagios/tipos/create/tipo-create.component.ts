import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { PedagogicoService } from "src/app/pedagogico/services/pedagogico.service";

@Component({
    selector: 'tipo-create-modal',
    templateUrl: './tipo-create.component.html',
    styleUrls: ['./tipo-create.component.scss']
})

export class TipoCreateComponent extends BaseComponent implements OnInit {
   
    estagioTipoForm!: FormGroup
    public showConflict = false

    constructor(
        override _snackBar: MatSnackBar,
        private _pedagService: PedagogicoService,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<TipoCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(_snackBar)
        this.estagioTipoForm = _fb.group({
            nome: ['', [Validators.required]],
            observacao: ['', [Validators.required, Validators.maxLength(250)]],
            ativo:[true]
        })
    }

    ngOnInit() {
       
    }   

    public Save() { 

        if (this.estagioTipoForm.valid) {
            this.showConflict = false
            this.disabledSaveButton = 'visible'

            this._pedagService.AddEstagioTipo(this.estagioTipoForm.value)
                .subscribe({
                    next: (sucesso: any) => { this.SaveSucess() },
                    error: (fail:any)  => { this.SaveError(fail) }
                }
                )
        }
    }

    private SaveSucess(){
        this.OpenSnackBarSucesso("Matéria adicionada com sucesso.")
        this.dialogRef.close({ clicked: true });
    }
    
    private SaveError(error: any){
       
        if(error['status'] == 409){
            this.showConflict = true
            this.disabledSaveButton = 'hidden'
        }else{
            this.disabledSaveButton = 'hidden'
            this.OpenSnackBarError("Ocorreu um erro, entre em contato com o administrador do sistema.")
        }
        
    }
    
    get disabledButton() {
        if (this.estagioTipoForm.valid) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }
}