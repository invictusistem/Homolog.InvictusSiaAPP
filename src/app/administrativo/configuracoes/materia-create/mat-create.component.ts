import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { Modalidade } from "src/app/_shared/models/perfil.model";
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'mat-createmodal',
    templateUrl: './mat-create.component.html',
    styleUrls: ['./mat-create.component.scss']
})

export class MateriaTemplateComponent extends BaseComponent implements OnInit {


    //baseUrl = environment.baseUrl;

    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public docForm: FormGroup
    public typesPacotes: any[] = new Array<any>();
    //public progress = false
    public modalidade = Modalidade
    constructor(
        private _fb: FormBuilder,
        override _snackBar: MatSnackBar,
        //private _http: HttpClient,
        private _admService: AdmService,
        public dialogRef: MatDialogRef<MateriaTemplateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
            this.docForm = _fb.group({            
            nome: ['', [Validators.required]],
            descricao: [''],
            typePacoteId: ['', [Validators.required]],
            modalidade: ['', [Validators.required]],
            cargaHoraria: ['', [Validators.required]],
            ativo: [true]
        })
    }

    ngOnInit() {
        //const token: any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.getTypePacotes();
    }

    getTypePacotes() {

        this._admService.GetTypePacotes()
            .subscribe({
                next: (resp: any) => {
                    this.typesPacotes = Object.assign([], resp['typePacotes']);
                    this.showForm = true
                    this.initProgressBar = 'hidden'
                },
                error: (error) => {                    
                    this.initProgressBar = 'hidden'
                }
            })
    }

    onSubmit(form: FormGroup) {

        if (form.valid) {
            this.disabledSaveButton = 'visible'
            //this.progress = true
            this._admService.SaveMateria(this.docForm.value)
                .subscribe(response => {

                }, (err) => {
                    this.disabledSaveButton = 'hidden'
                this.OpenSnackBarErrorDefault()
                },
                    () => {
                        this.OpenSnackBarSucesso("Matéria salva com sucesso.");
                        this.dialogRef.close({ clicked: "Ok" });
                    });
        }
    }

    get disabledButton() {
        if (this.docForm.valid) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }
}