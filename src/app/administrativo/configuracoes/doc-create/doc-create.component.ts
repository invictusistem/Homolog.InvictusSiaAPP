import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'doctemplatemodal',
    templateUrl: './doc-create.component.html',
    styleUrls: ['./doc-create.component.scss']
})

export class DocTemplateComponent extends BaseComponent implements OnInit {


    //baseUrl = environment.baseUrl;

    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public docForm: FormGroup
    public progress = false
    constructor(
        private _fb: FormBuilder,
        override _snackBar: MatSnackBar,
        private _admService: AdmService,
        public dialogRef: MatDialogRef<DocTemplateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
        this.docForm = _fb.group({
            nome: [null, [Validators.required]],
            descricao: [null],
            validadeDias: [null, [Validators.required]]
        })
    }

    ngOnInit() {
        //const token: any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)
    }

    get disabledSave(){
        if (this.docForm.valid) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }

    onSubmit(form: FormGroup) {

        if (form.valid) {
            this.disabledSaveButton = 'visible'
            this.progress = true
            this._admService.SaveDocumento(this.docForm.value)
                .subscribe(response => {

                }, (err) => {
                    this.disabledSaveButton = 'hidden'
                    this.OpenSnackBarErrorDefault()
                },
                    () => {
                        this.disabledSaveButton = 'visible'
                        this.dialogRef.close({ clicked: true });
                    });
        }
    }

    
}