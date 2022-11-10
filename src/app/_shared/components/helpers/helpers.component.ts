import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class HelpersService {

    dialog: any
    modal: any
    public cep: CEP = new CEP()
    //private _snackBar?: MatSnackBar = new MatSnackBar()
    constructor(
        private _snackBar: MatSnackBar,
        //private _http: HttpClient
    ) {
        
    }

    public openSnackBarSucesso(mensagem?:any) {
        this._snackBar?.open(mensagem, '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass:['mat-toolbar', 'mat-primary'],
            duration: 5 * 1000,
        });
    }

    public openSnackBarError(mensagem?:any) {
        this._snackBar.open(mensagem, '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass:['mat-toolbar', 'mat-warn'],
            duration: 5 * 1000,
        });
    }

    public openSnackBarErrorDefault() {
        this._snackBar.open('Ocorreu um erro, favor procure o administrador do sistema.', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            panelClass:['mat-toolbar', 'mat-warn'],
            duration: 5 * 1000,
        });
    }

    public OpenConfirmModal(){

        return 'alou'
    }

    private CloseModalWithOK<TDialogRef>() {
        this.modal as MatDialogRef<TDialogRef>
        this.modal.close({ clicked: "Ok" });
    }

}

export class CEP {
    constructor(
        public logradouro?: string,
        public bairro?: string,
        public localidade?: string,
        public uf?: string
    ) { }
}