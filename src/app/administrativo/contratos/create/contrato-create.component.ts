import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { Cargos } from "src/app/_shared/models/perfil.model";
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { AngularEditorConfig } from "@kolkov/angular-editor";

@Component({
    selector: 'contrato-createmodal',
    templateUrl: './contrato-create.component.html',
    styleUrls: ['./contrato-create.component.scss']
})

export class CreateContratoComponent extends BaseComponent implements OnInit {

   
    public htmlContent: string = "";
    public typePacotes: any
    // pageSize: number = 5;
    // genericTasks: GenericTask[] = new Array<GenericTask>();
    // length: number;
    // pageEvent: PageEvent;
    //baseUrl = environment.baseUrl;
    //public cepReturn: CepReturn = new CepReturn();
    public contratoForm: FormGroup;
    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public validadeEmailMsg = false
    public validadeCPFMsg = false
    cargos = Cargos;
    mensagem = "";
    showMensagem = false
    //public bairro: string = null;
    //@Input() disabled = true;
    //unidades = Unidades;//: string[] = new Array("Campo Grande II", "Jacarepaguá");
    constructor(
        //private service: AdmService,
        //private _snackBar: MatSnackBar,
        override _snackBar: MatSnackBar,
        //private router: Router,
        private _fb: FormBuilder,
        //private _http: HttpClient,
        private _admService: AdmService,
        public dialogRef: MatDialogRef<CreateContratoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
        this.contratoForm = _fb.group({
            titulo: ['', [Validators.required]],
            typePacoteId: ['', [Validators.required]],
            ativo: [true],
            conteudo: ['', [Validators.required]],

        })

    }

    ngOnInit() {        
        this.GetTypes()
    }

    private GetTypes() {

        this._admService.GetTypePacotes()
        .subscribe({
            next: (resp: any) => { 
                this.typePacotes = resp['typePacotes']
                this.dialogRef.addPanelClass('contrato-create-class')
			},
            error: (error) => { 
                if (error['status'] == 404) {

                }
			}
        })
    }    

    showConteudo(valor:any){

    }

    onSubmit(form: FormGroup) {
       // console.log(this.htmlContent)

       // console.log(form.value)
       // console.log(this.htmlContent)

        if (this.contratoForm.valid) {
            this.disabledSaveButton = 'visible'
            this._admService.SaveContrato(form.value)
            .subscribe(resp => {

            }, (error) => { 
                //console.log(error) 
                this.OpenSnackBarErrorDefault()
                this.disabledSaveButton = 'hidden'
            },
                () => {
                    this.OpenSnackBarSucesso("Contrato salvo com sucesso.")
                    this.dialogRef.close({ clicked: "OK" });
                })
        }
    }

    get disabledButton(){
        if(this.contratoForm.valid){
return this.disabledSaveButton == 'visible'
        }else{
            return true;
        }
        return ""
    }

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
          ['bold']
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

