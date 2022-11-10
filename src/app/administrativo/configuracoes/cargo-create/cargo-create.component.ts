import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'cargocreatemodal',
    templateUrl: './cargo-create.component.html',
    styleUrls: ['./cargo-create.component.scss']
})

export class CargoCreateComponent extends BaseComponent implements OnInit {


    //baseUrl = environment.baseUrl;
    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public cargoForm: FormGroup
    public progress = false
    constructor(
        //private _helpers: HelpersService,
        private _fb: FormBuilder,
        private _admService: AdmService,
        override _snackBar: MatSnackBar,
        //private _http: HttpClient,
        public dialogRef: MatDialogRef<CargoCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
        this.cargoForm = _fb.group({
            value: ['', [Validators.required]],
            descricao: [''],
            comentario: ['', [Validators.required]],
            ativo:[true]
        })
    }

    ngOnInit() {
        //const token: any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)

    }


    onSubmit(form: FormGroup) {

        if (this.cargoForm.valid) {
            this.disabledSaveButton = 'visible'
            this.progress = true

            this._admService.SaveCargo(this.cargoForm.value)
            .subscribe(response => {

            }, (err) => {
                this.disabledSaveButton = 'hidden'
                this.progress = false
                this.OpenSnackBarErrorDefault()
            },
                () => {
                    this.OpenSnackBarSucesso("Cargo salvo com sucesso.");
                    this.progress = false
                    this.dialogRef.close({ clicked: true });
                });          
        }
    }

    //disabledSaveButton = 'hidden'

    get disabledButton() {
        if (this.cargoForm.valid) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }
}