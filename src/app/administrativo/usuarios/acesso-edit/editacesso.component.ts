import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { AdmService } from "../../services/adm.service";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
    selector: 'editacessomodal',
    templateUrl: './editacesso.component.html',
    styleUrls: ['./editacesso.component.scss']
})

export class EditAcessoComponent extends BaseComponent implements OnInit {


    public myrForm: FormGroup;
    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public mostrarModalPrincipal = true
    //public initProgressBar = 'visible'
    public saveProgressBar = 'hidden'
    public disabledEnvio = false
    public showContent = false

    acessoView: any[] = new Array<any>()
    editedAcessoView: any[] = new Array<any>()

    constructor(
        private _admService: AdmService,
        override _snackBar: MatSnackBar,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<EditAcessoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
        this.myrForm = _fb.group({
            nome: ['', [Validators.required, Validators.minLength(5)]],

        })
    }


    ngOnInit() {
        const token: any = localStorage.getItem('jwt')
        ////this.tokenInfo = this.jwtHelper.decodeToken(token)
        console.log(this.data['usuario'])
        this.getAcessos()
    }

    getAcessos() {

        this._admService.GetUsuarioAcessos(this.data['usuario'].id)
            .subscribe(
                sucesso => { this.getAcessosSucesso(sucesso) },
                falha => { this.getAcessosFalha(falha) }
            )
    }

    enviarLogin(){

        this.disabledEnvio = true
        this._admService.EnvioAcesso(this.data['usuario'].email)
            .subscribe(
                sucesso => { this.enviarLoginSucesso(sucesso) },
                falha => { this.enviarLoginFalha(falha) }
            )

    }

    enviarLoginSucesso(resp: any){
        this.OpenSnackBarSucesso("E-mail com informações de acesso enviado com sucesso.")
        this.disabledEnvio = false
    }

    enviarLoginFalha(error: any){
        this.OpenSnackBarErrorDefault()
        this.disabledEnvio = false
    }

    varJson:any
    getAcessosSucesso(sucesso:any) {
        Object.assign(this.acessoView, sucesso['acessos'])
        this.varJson = JSON.parse(JSON.stringify(sucesso['acessos']))
        Object.assign(this.editedAcessoView, sucesso['acessos'])
        this.dialogRef.addPanelClass('editacesso-class')
        this.initProgressBar = 'hidden'
        this.showContent = true
        
        
        
    }

    getAcessosFalha(error:any) {


    }

    saveAcesso() {
        this.saveProgressBar = 'visible'
        this._admService.EditAcessos(this.editedAcessoView, this.data['usuario'].id)
            .subscribe(
                sucesso => { this.saveAcessoSucesso(sucesso) },
                falha => { this.saveAcessoError(falha) }
            )
    }

    saveAcessoSucesso(sucesso:any) {
        this.saveProgressBar = 'hidden'
        this.dialogRef.close({ close: true })
    }

    saveAcessoError(falha: any) {
        this.saveProgressBar = 'hidden'
    }

    //disabledSaveButton = false
    get disabledButton() {

        // console.log(JSON.stringify(this.varJson))
        // console.log(JSON.stringify(this.editedAcessoView))
        if (this.saveProgressBar == 'visible') return true

        if (JSON.stringify(this.varJson) ===
            JSON.stringify(this.editedAcessoView)) {
            return true
        } else {
            return false
        }



        // if (this.myrForm.valid) {
        //     return this.disabledSaveButton
        // } else {
        //     return true
        // }
    }


}
// export class UnidadesAcessoViewModel{
//     constructor(
//         public id?: string,
//         public descricao?: string,
//         public sigla?: string,
//         public unidadeId?: string,
//         public acesso?: Boolean
//     ){}
// }