import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ConfirmAcaoModalComponent } from 'src/app/_shared/components/acao-confirm/confirm-acao.component';
import { ExtractFile } from 'src/app/_shared/models/utils.model';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { ConfirmAcaoModalConfig } from 'src/app/_shared/services/shared.modal';
import { PedagogicoService } from '../../services/pedagogico.service';

@Component({
  selector: 'app-estagio-documentacao',
  templateUrl: './estagio-documentacao.component.html',
  styleUrls: ['./estagio-documentacao.component.scss']
})

export class EstagioDocumentacaoComponent extends BaseComponent implements OnInit {

  public disabledDownload = false
  public documentacao: any[] = new Array<any>()

  constructor(
    override _snackBar: MatSnackBar,
    private _pedagService: PedagogicoService,
    private _modal: MatDialog,
    private _http: HttpClient,
    public dialogRef: MatDialogRef<EstagioDocumentacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {
    this.GetDocumentacoes()
  }

  private GetDocumentacoes() {

    this._pedagService.GetDocumentacaoAlunoEstagio(this.data['aluno'].matriculaId)
      .subscribe({
        next: (response: any) => { this.GetDocumentacoesSucesso(response) },
        error: (error: any) => { this.GetDocumentacoesError(error) }
      })
  }

  private GetDocumentacoesSucesso(resp: any) {
    this.documentacao = resp['docs']
    console.log(this.documentacao)
    this.initProgressBar = 'hidden'
    this.disabledDownload = false
    this.showForm = true

  }

  private GetDocumentacoesError(error: any) {
    this.OpenSnackBarErrorDefault()
    this.disabledDownload = false
    this.initProgressBar = 'hidden'
  }

  
  public DownloadArquivo(doc: any) {

    this.disabledDownload = true
    this.initProgressBar = 'visible'

    this.download(doc.id)
      .subscribe(
        (data: any) => {

          switch (data.type) {
            case HttpEventType.Response:
              // this.showSpinner = false;
              //this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
              const downloadedFile = new Blob([data.body], { type: data.body.type });
              const a = document.createElement('a');
              a.setAttribute('style', 'display:none;');
              document.body.appendChild(a);
              a.download = doc.nomeArquivo;
              a.href = URL.createObjectURL(downloadedFile);
              a.target = '_blank';
              a.click();
              document.body.removeChild(a);
              break;
          }
        },
        (err) => {
          this.disabledDownload = false
          this.initProgressBar = 'hidden'
          this.OpenSnackBarErrorDefault()
        },
        () => {

          this.initProgressBar = 'hidden'
          this.disabledDownload = false
          //this.downloadTabProgressBar = 'hidden'
        }
      );





    // this.disabledDownload = true
    // this.initProgressBar = 'visible'
    // this._pedagService.GetFileById(doc.id)
    //   .subscribe({
    //     next: (data: any) => { this.DownloadSuccess(data, doc) },
    //     error: (err) => { this.DownloadError(err) }
    //   });
  }

  public download(docId: any): Observable<HttpEvent<Blob>> {
    return this._http.request(new HttpRequest(
      'GET', `${this.baseUrl}/estagio/document/${docId}`, null, {
      reportProgress: true,
      responseType: 'blob'
    }));
  }

  public DownloadSuccess(data: any, doc: any) {
    console.log('download')
    ExtractFile(data, doc.nomeArquivo)
    this.initProgressBar = 'hidden'
    this.disabledDownload = false
  }

  public DownloadError(error: any) {
    this.disabledDownload = false
    this.initProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault()
  }


  public UploadArquivo(event?: any, docId?: any) {

    var file: File = event.target.files[0];

    var fileName = file.name;

    var fileSize = file.size // 4194304 

    if (fileSize > 4194304) {
      this.OpenSnackBarError("O arquivo não pode ser superior a 4 megabytes.")
      return
    }

    const formData = new FormData();
    formData.append("file", file, fileName)

    const dialogRef = this._modal
      .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
    dialogRef.afterClosed().subscribe((data) => {

      if (data.clicked == true) this.UploadFile(formData, docId)

    })

    return event
  }

  private UploadFile(file: FormData, docId: any) {
    this.disabledDownload = true
    this.initProgressBar = 'visible'
    // console.log(file)
    // console.log(docId)

    this._pedagService.AnexarArquivo(file, docId)
      .subscribe({
        next: (resp: any) => {
          this.OpenSnackBarSucesso("Upload efetuado com sucesso")

          this.GetDocumentacoes()
        },
        error: (falha: any) => { this.UploadFileError(falha) }
      })
  }

  private UploadFileError(error: any) {
    this.disabledDownload = false
    this.initProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault()
  }

  public Aprovar(doc: any) {

    const dialogRef = this._modal
      .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
    dialogRef.afterClosed().subscribe((data) => {

      if (data.clicked == true) {
        this.disabledDownload = true
        this.initProgressBar = 'visible'
        this._http.put(`${this.baseUrl}/estagio/aluno/${doc.id}/documentos-estagio/true`, {})
          .subscribe(
            response => {
              this.initProgressBar = 'hidden'
              doc.analisado = true
              doc.validado = true
              this.GetDocumentacoes()
            },
            err => {
              this.disabledDownload = false
              this.initProgressBar = 'hidden'
              this.OpenSnackBarErrorDefault()
            })
      }
    })
  }

  public Reprovar(doc: any) {

    const dialogRef = this._modal
      .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
    dialogRef.afterClosed().subscribe((data) => {

      if (data.clicked == true) {
        this.disabledDownload = true
        this.initProgressBar = 'visible'
        this._http.put(`${this.baseUrl}/estagio/aluno/${doc.id}/documentos-estagio/false`, {})
          .subscribe(
            response => {
              this.initProgressBar = 'hidden'
              doc.analisado = true
              doc.validado = false
              this.GetDocumentacoes()
            },
            err => {
              this.disabledDownload = false
              this.initProgressBar = 'hidden'
              this.OpenSnackBarErrorDefault()
            })
      }
    })

  }


}
