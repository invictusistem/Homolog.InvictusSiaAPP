import { Component, Inject, Input, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { PedagogicoService } from "src/app/pedagogico/services/pedagogico.service";
//import { TemplateTasks } from 'src/app/shared/models/templateTasks.model';

@Component({
    selector: 'confirmamat',
    templateUrl: './confirmamat.component.html'
    //; styleUrls: ['./confirm.component.scss']
})

export class ConfirmMatriculaComponent implements OnInit {

    hidden = 'hidden'
    msgSpan = 'hidden'
    msg = 'fazendo download do contrato...'
    baseUrl = environment.baseUrl;


    constructor(
        //private service: AdmService,
        private _http: HttpClient,
        private CreateMatriculaModal: MatDialog,
        private router: Router,
        private _pedagService: PedagogicoService,
        public dialogRef: MatDialogRef<ConfirmMatriculaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }



    ngOnInit() {
        // console.log("on init")
        //this.getTasks(1, this.pageSize);
        //this.colaboradorForm.get('logradouro').disable()

    }

    Confirm(msg: Boolean) {
        if (msg == true) {
            this.disabledButton = true
            this.BaixarContrato()

        } else {

            this.dialogRef.close();

        }
    }


    disabledButton = false

    BaixarContrato() {
        var file = 'contrato';//doc.nome;// "Modelo LEAD.xlsx";// this.createFileName("EXCEL");
        this.hidden = 'visible'
        this.msgSpan = 'visible'
        this.msg = 'fazendo download do contrato...'
        this.downloadContrato().subscribe((data: any) => {

            switch (data.type) {
                case HttpEventType.Response:
                    // this.showSpinner = false;
                    //this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.download = file;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }
        },
            (err) => {
                this.dialogRef.close();
            },
            () => {
                this.BaixarFicha()
            }
        );
    }


    BaixarFicha() {
        var file = 'ficha';//doc.nome;// "Modelo LEAD.xlsx";// this.createFileName("EXCEL");
        this.hidden = 'visible'
        this.msgSpan = 'visible'
        this.msg = 'fazendo download da ficha de matrícula...'
        this.downloadFicha().subscribe((data: any) => {

            switch (data.type) {
                case HttpEventType.Response:
                    // this.showSpinner = false;
                    //this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.download = file;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }
        },
            (err) => {
                this.dialogRef.close();
            },
            () => {
                this.dialogRef.close();
            }
        );
    }


    public downloadContrato(): Observable<HttpEvent<Blob>> {
        return this._http.request(new HttpRequest(
            'GET', `${this.baseUrl}/pedag/doc/getcontrato/${this.data['matriculaId']}`, null, {
            reportProgress: true,
            responseType: 'blob'
        }));
    }

    public downloadFicha(): Observable<HttpEvent<Blob>> {
        return this._http.request(new HttpRequest(
            'GET', `${this.baseUrl}/pedag/doc/getficha/${this.data['matriculaId']}`, null, {
            reportProgress: true,
            responseType: 'blob'
        }));
    }


    onOkClick() {
        //console.log("I do nothing");
        this.dialogRef.close({ clicked: "Ok" });
    }

}