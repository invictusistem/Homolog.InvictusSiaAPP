import { HttpClient, HttpHandler } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { HighlightTrigger } from '../animation/animation';
import { TokenInfos } from '../models/token.model';
import { SharedService } from './shared.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
@Component({
    selector: 'app-base',
    template: ``,
    styles: [],
    animations: [HighlightTrigger]

})
export class BaseComponent {

    // Urls
    public baseUrl: string = environment.baseUrl

    // paginated
    public length: number = 0
    public pageSize: number = 5;
    public pageEvent: PageEvent = new PageEvent()
    public pageIndexNumber: number = 0;
    public currentPage = 1
    @ViewChild(MatPaginator) paginator!: MatPaginator
    // JWT
    private jwtHelper = new JwtHelperService();
    public tokenInfo: TokenInfos = new TokenInfos();
    // Spinners
    public spinnerSearch = 'hidden'
    public initProgressBar = 'visible'
    public showForm = false
    // Variables
    public showMessageNotFound = false
    public mensagemNotFound: string = "";
    public disabledSaveButton = 'hidden'
    public hideSaveProgressBar = 'hidden'
    public disabledCloseModalIcon = false
    public showSaveButton = 'visible'
    public matProgressSaveButton = 'hidden'
    //public disabledButtonSave = false
    // handelr!: HttpHandler
    // client = new HttpClient(this.handelr)
    // private sharedService:SharedService = new SharedService(this.client)
    client: any
    service: any
    constructor(
        public _snackBar: MatSnackBar,
        //private _sharedService?: SharedService

    ) {
        this.GetTokenInfos()
        this.client = new HttpClient(this.handelr)
        this.service = new SharedService(this.client);
    }

    handelr!: HttpHandler
    //client = new HttpClient(this.handelr)
    //private service = new SharedService(new HttpClient());

    public OpenSnackBarSucesso(mensagem?: any) {

        this._snackBar?.open(mensagem, '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-primary'],
            duration: 5 * 1000,
        });
    }

    public OpenSnackBarError(mensagem?: any) {
        this._snackBar?.open(mensagem, '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-warn'],
            duration: 5 * 1000,
        });
    }

    public OpenSnackBarErrorDefault() {
        this._snackBar?.open('Ocorreu um erro, favor procure o administrador do sistema.', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass: ['mat-toolbar', 'mat-warn'],
            duration: 5 * 1000,
        });
    }

    // public ConsultaCEP(CEP: string) {
    //     // let handelr!: HttpHandler
    //     // let client = new HttpClient(this.handelr)
    //     //if (this.colaboradorForm.get('cep')?.valid) {
    //     // let handelr!: HttpHandler
    //     // let client = new HttpClient(handelr)
    //     // let sharedService: SharedService = new SharedService(client)
    //     //CEP = '123'
    //     console.log(CEP)
    //     this.service.CepConsulta(CEP)
    //         .subscribe(
    //             (response: any) => {
    //                 console.log(response)
    //                 //return response

    //             }, (err: any) => {
    //                 console.log('erro consulta CEP')
    //                 this.openSnackBarErrorDefault()
    //             },
    //             () => {

    //             });
    //     // }
    // }

    protected GetTokenInfos() {
        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)

        return this.tokenInfo
    }
}