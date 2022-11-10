import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'cargoeditmodal',
    templateUrl: './cargo-edit.component.html',
    styleUrls: ['./cargo-edit.component.scss']
})

export class CargoEditComponent extends BaseComponent implements OnInit {


    //baseUrl = environment.baseUrl;

    //public initProgressBar = 'visible'
    //public showForm = false
    private originalCargo: any

    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public cargoForm: FormGroup
    public progress = false
    constructor(
        override _snackBar: MatSnackBar,
        private _fb: FormBuilder,
        private _admService: AdmService,
        //private _http: HttpClient,
        public dialogRef: MatDialogRef<CargoEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
        this.cargoForm = _fb.group({
            id:[''],
            value: ['', [Validators.required]],
            descricao: [''],
            comentario: ['', [Validators.required]],
            ativo:[''],
            parametrosKeyId: ['']
        })
    }

    ngOnInit() {
        //var token: any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.GetCargo()

    }

    private GetCargo(){

        this._admService.GetValue(this.data['cargoId'])
        .subscribe({
            next: (response: any) => { 
                this.cargoForm.patchValue(response['value']);
                this.originalCargo = JSON.parse(JSON.stringify(this.cargoForm.value))
                this.initProgressBar = 'hidden'
                    this.showForm = true
			},
            error: (error) => { 
                this.disabledSaveButton = 'hidden'
                this.progress = false
                this.OpenSnackBarErrorDefault()
			}
        })
    }    


    onSubmit(form: FormGroup) {

        if (this.cargoForm.valid) {
            this.disabledSaveButton = 'visible'
            this.progress = true

            this._admService.EditValue(this.cargoForm.value)
            .subscribe(response => {

            }, (err) => {
                this.disabledSaveButton = 'hidden'
                this.progress = false
                this.OpenSnackBarErrorDefault()
            },
                () => {
                    this.OpenSnackBarSucesso("Cargo editado com sucesso.");
                    this.progress = false
                    this.dialogRef.close({ clicked: true });
                });          
        }
    }

    //disabledSaveButton = 'hidden'

    get disabledButton() {
        if (this.cargoForm.valid &&
            JSON.stringify(this.originalCargo) !=
            JSON.stringify(this.cargoForm.value)) {

            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }
}