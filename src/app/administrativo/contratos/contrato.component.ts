import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Observable } from "rxjs";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { OpenCreateContratoModalConfig, OpenEditContratoModalConfig } from "../services/adm-modal";
import { AdmService } from "../services/adm.service";
import { CreateContratoComponent } from "./create/contrato-create.component";
import { EditarContratoComponent } from "./edit/contrato-edit.component";

@Component({
    selector: "contrato-app",
    templateUrl: './contrato.component.html',
    styleUrls: ['./contrato.component.scss']
})

export class ContratoComponent extends BaseComponent implements OnInit {

    public typesPacotes: any = new Array<any>();
    public contratos: any[] = new Array<any>();
    public pesquisarForm: FormGroup
    public showSpinnerSearch = false

    constructor(
        private _admService: AdmService,
        private _http: HttpClient,
        private _fb: FormBuilder,
        override _snackBar: MatSnackBar,
        private _modal: MatDialog) {
        super(_snackBar);
        this.pesquisarForm = _fb.group({
            typePacoteId: ['', [Validators.required]]
        });
    }

    ngOnInit() {

        const token = localStorage.getItem('jwt')

        this.getTypePacotes();
    }

    Pesquisar() {

        if (this.pesquisarForm.valid) {
            this.initProgressBar = 'visible'
            this.showSpinnerSearch = true
            this.contratos = []
            let typePacoteId = this.pesquisarForm.get('typePacoteId')?.value
            // console.log(typePacoteId)

            this._admService.GetContratosByTypePacote(typePacoteId, false)
                .subscribe({
                    next: (resp: any) => {
                        this.contratos = Object.assign([], resp['contratos']);
                        this.showSpinnerSearch = false
                        this.initProgressBar = 'hidden'
                    },
                    error: (error) => {
                        this.initProgressBar = 'hidden'
                        this.showSpinnerSearch = false
                    }
                })
        }
    }

    getTypePacotes() {

        this._admService.GetTypePacotes()
            .subscribe({
                next: (resp: any) => {
                    this.typesPacotes = Object.assign([], resp['typePacotes']);
                    this.initProgressBar = 'hidden'
                },
                error: (error) => {
                    this.initProgressBar = 'hidden'
                }
            })
    }

    public GetSamplePDFModal(contratoId: any){

        var file = "contrato-exemplo";// "Modelo LEAD.xlsx";// this.createFileName("EXCEL");

        this.initProgressBar = 'visible'

        this.download(contratoId).subscribe(
            (data: any) => {

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
                this.OpenSnackBarErrorDefault()
                this.initProgressBar = 'hidden'
            },
            () => {
                this.OpenSnackBarSucesso("Download efetuado com sucesso.")
                this.initProgressBar = 'hidden'
            }
        );

    }

    public download(contratoId: any): Observable<HttpEvent<Blob>> {
        return this._http.request(new HttpRequest(
            'GET', `${this.baseUrl}/contrato/exemplo/${contratoId}`, null, {
            reportProgress: true,
            responseType: 'blob'
        }));
    }

    openCreateContratoModal(): void {
        const dialogRef = this._modal
            .open(CreateContratoComponent, OpenCreateContratoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    openEditContratoModal(contrato: any): void {
        const dialogRef = this._modal
            .open(EditarContratoComponent, OpenEditContratoModalConfig(contrato));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "Ok") {
                this.getTypePacotes();
            }
        });
    }
}