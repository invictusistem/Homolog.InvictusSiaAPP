import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { AdmService } from "../../services/adm.service";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";

@Component({
    selector: 'createplanopgmmodal',
    templateUrl: './create-plano.component.html',
    styleUrls: ['./create-plano.component.scss']
})

export class PlanoPgmCreateComponent extends BaseComponent implements OnInit {


   // baseUrl = environment.baseUrl;
    public disabledContrato = true
    //public initProgressBar = 'visible'
    public saveSpinner = 'hidden'
    public typePacotes: any
    public moduloForm: FormGroup;
    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public disabledSpinner = false
    public contratos: any[] = new Array<any>();
    constructor(
        override _snackBar: MatSnackBar,
        //private router: Router,
        //private _helper: HelpersService,
        private _fb: FormBuilder,
        private _admService: AdmService,
       // private _http: HttpClient,
        public dialogRef: MatDialogRef<PlanoPgmCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
        this.moduloForm = _fb.group({
            typePacoteId: ['', [Validators.required]],
            descricao: ['', [Validators.required]],
            valor: ['', [Validators.required]],
            taxaMatricula: [0.00],
            materialGratuito: ['', [Validators.required]],
            valorMaterial: [0.00],
            bonusPontualidade: [0.00],
            contratoId: ['', [Validators.required]],
            ativo: [true]

        })
    }

    ngOnInit() {
        //const token:any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.GetTypes()
    }

    private GetTypes() {


        this._admService.GetTypePacotes()
        .subscribe({
            next: (resp: any) => { 
                this.dialogRef.addPanelClass('create-plano-class')
                this.typePacotes = resp['typePacotes']
                this.initProgressBar = 'hidden'
                this.showForm = true
			},
            error: (error) => { 
                this.initProgressBar = 'hidden'
                this.OpenSnackBarErrorDefault()
			//console.error(error) 
			}
        })       
    }

    public GetContratos(typePacoteId:any) {

        this.moduloForm.get('contratoId')?.setValue('')
        this.initProgressBar = 'visible'
        this.disabledContrato = true
        this.contratos = new Array<any>();

        this._admService.GetContratosByTypePacote(typePacoteId, true)
        .subscribe({
            next: (resp: any) => { 
                this.disabledContrato = false
                this.contratos = resp['contratos']
                this.initProgressBar = 'hidden'
			},
            error: (error) => { 
                if(error['status'] == 404){
                    this.OpenSnackBarError("Não há contratos ativos para esse tipo de pacote.")
                }else{
                    this.OpenSnackBarErrorDefault()
                }

                this.initProgressBar = 'hidden'
			}
        })  
    }

    get disabledSave() {

        if (this.moduloForm.valid) {
            return this.saveSpinner != 'hidden'
        } else {
            return true
        }

    }

    onSubmit(form: any) {
      //  console.log(form.value)
        if (this.moduloForm.valid) {
            this.saveSpinner = 'visible'
            this.disabledSpinner = true

            this._admService.SavePlano(form.value)
            .subscribe(response => {
            }, (err) => { 
               // console.log(err) 
               this.OpenSnackBarErrorDefault()
            },
                () => {
                    this.OpenSnackBarSucesso("Plano criado com sucesso.")
                    this.dialogRef.close({ clicked: "Ok" });
                });          
        }
    }
}