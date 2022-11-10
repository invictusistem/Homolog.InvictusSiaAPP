import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Router } from "@angular/router";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";


@Component({
    selector: 'troca-senhamodal',
    templateUrl: './troca-senha.component.html',
    styleUrls: ['./troca-senha.component.scss'],
    animations: [HighlightTrigger]
})

export class TrocaSenhaComponent implements OnInit {

    baseUrl = environment.baseUrl;

    trocaSenhaForm: FormGroup
    private jwtHelper = new JwtHelperService();
    public tokenInfo: TokenInfos = new TokenInfos();
    constructor(
        private _fb: FormBuilder,
        private _http: HttpClient,
        // private _service: PedagService,
        private _router: Router,
        private _modal: MatDialog,
        public dialogRef: MatDialogRef<TrocaSenhaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.trocaSenhaForm = _fb.group({
            senha: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
            senhaNova: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]],
            senhacomparacao: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(10)]]
        })

    }

    ngOnInit() {
        const token = localStorage.getItem('jwt') || '{}';
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        //console.log(this.tokenInfo)
    }




    conferir() {
        if (this.trocaSenhaForm.get('senhaNova')?.value  === this.trocaSenhaForm.get('senhacomparacao')?.value) {
          //  console.log('igual')
        } else {
           // console.log('diferente')
        }

    }

    get showHintSenha() {
        if (this.trocaSenhaForm.get('senhaNova')?.value === this.trocaSenhaForm.get('senhacomparacao')?.value) {
            return false
        } else {
            return true
        }
    }

    initProgressBar = 'hidden'
    get desabilitar() {

        if (!this.trocaSenhaForm.valid) return true

        if (this.trocaSenhaForm.get('senhaNova')?.value === this.trocaSenhaForm.get('senhacomparacao')?.value) {
            return this.initProgressBar != 'hidden'
        } else {
            return true
        }

    }

    onSubmit() {
        //Email = this. email
        //Senha
        //SenhaConfirmacao
        var model = {
            Email: this.tokenInfo.email,
            Senha: this.trocaSenhaForm.get('senha')?.value,
            SenhaConfirmacao: this.trocaSenhaForm.get('senhacomparacao')?.value
        }

        this.initProgressBar = 'visible'
        this.trocaSenhaForm.disable()
        this._http.put(`${this.baseUrl}/identity/troca-senha`, model, {})
            .subscribe(
                sucesso => { this.onSubmitSucesso(sucesso) },
                falha => { this.onSubmitFalha(falha) }
            )
    }

    onSubmitSucesso(resposta: any) {
        this.initProgressBar = 'hidden'
        this.trocaSenhaForm.enable()
      //  console.log(resposta)

        localStorage.removeItem("jwt");
        this.dialogRef.close({click: true})
        this._router.navigateByUrl('user/login');

    }

    erroMesg = ""
    onSubmitFalha(erro: any) {
        this.initProgressBar = 'hidden'
        this.trocaSenhaForm.enable()
      //  console.log(erro['error'].errors)
        let mensagens = erro['error'].errors
        this.erroMesg = mensagens['Mensagens'][0]
       // console.log(this.erroMesg)
    }




}