import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DomSanitizer } from "@angular/platform-browser";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { AngularEditorConfig } from "@kolkov/angular-editor";

@Component({
    selector: 'editcontratomodal',
    templateUrl: './contrato-edit.component.html',
    styleUrls: ['./contrato-edit.component.scss']
})

export class EditarContratoComponent extends BaseComponent implements OnInit {
    public htmlContent: any;
    showSpinnerSearch = true
    //baseUrl = environment.baseUrl;
    //public cepReturn: CepReturn = new CepReturn();
    public contratoForm: FormGroup;
    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public validadeEmailMsg = false
    public validadeCPFMsg = false
    //cargos = Cargos;
    mensagem = "";
    showMensagem = false
    public contrato: any;
    public originalContrato: any;
    //public showForm = false

    //unidades = Unidades;
    constructor(
        private sanitizer: DomSanitizer,
        override _snackBar: MatSnackBar,
        //private router: Router,
        private _fb: FormBuilder,
        // private _http: HttpClient,
        private _admService: AdmService,
        public dialogRef: MatDialogRef<EditarContratoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(_snackBar);
        this.contratoForm = _fb.group({
            titulo: ['', [Validators.required]],
            conteudo: ['', [Validators.required]],

        })
    }

    ngOnInit() {
        //const token:any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)

        this.GetContrato(this.data['contrato'].id)
    }

    private GetContrato(contratoId: number) {

        this._admService.GetContrato(contratoId)
            .subscribe({
                next: (resp: any) => {
                    this.contrato = Object.assign({}, resp['contrato'])
                    this.originalContrato = Object.assign({}, resp['contrato'])
                    this.dialogRef.addPanelClass('contrato-edit-class')
                    this.showForm = true
                    this.showSpinnerSearch = false
                },
                error: (error) => {
                    this.showSpinnerSearch = false
                }
            })
    }

    onSubmit(form: any) {

        //console.log(form.valid)
        //console.log(form.value)
        //console.log(this.contrato)

        if (form.valid) {
            this.disabledSaveButton = 'visible'
            this._admService.EditContrato(this.contrato)
                .subscribe(resp => {

                }, (error) => {
                    this.disabledSaveButton = 'hidden'
                    this.OpenSnackBarErrorDefault()
                    //console.log(error) 
                },
                    () => {
                        
                        this.OpenSnackBarSucesso("contrato editado com sucesso.")
                        this.dialogRef.close({ clicked: "Ok" });
                    })
        }
    }

    get disabledButton() {

        return this.disabledSaveButton != 'hidden'

    }

    // safeHTML(unsafe: string) {
    //     return this.sanitizer.bypassSecurityTrustHtml(unsafe);
    // }

    config: AngularEditorConfig = {
        editable: true,
        sanitize: false,
        spellcheck: true,
        height: '22rem',
        minHeight: '22rem',
        placeholder: 'Enter text here...',
        translate: 'no',
        defaultParagraphSeparator: 'p',
        defaultFontName: 'Arial',
        toolbarHiddenButtons: [
        ],
        customClasses: [
            {
                name: "quote",
                class: "quote",
            },
            {
                name: 'redText',
                class: 'redText'
            },
            {
                name: "titleText",
                class: "titleText",
                tag: "h1",
            },
        ]
    };

}