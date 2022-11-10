import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmAcaoModalComponent } from 'src/app/_shared/components/acao-confirm/confirm-acao.component';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { ConfirmAcaoModalConfig } from 'src/app/_shared/services/shared.modal';
import { AlunoSiaService } from '../../services/aluno-sia.service';

@Component({
  selector: 'app-estagiosia-documentacao',
  templateUrl: './estagiosia-documentacao.component.html',
  styleUrls: ['./estagiosia-documentacao.component.scss']
})
export class EstagiosiaDocumentacaoComponent extends BaseComponent implements OnInit {

  public documentos: any[] = new Array<any>()
  private disabledButtons = false
  constructor(
    override _snackBar: MatSnackBar,
    private _alunoService: AlunoSiaService,
    private _modal: MatDialog,
    public dialogRef: MatDialogRef<EstagiosiaDocumentacaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {
    this.GetDocumentacao()
  }

  public GetDocumentacao() {

    this._alunoService.GeDocumentos()
      .subscribe(
        {
          next: (response: any) => { this.GetDocumentacaoSucesso(response) },
          error: (error) => { this.GetDocumentacaoFalha(error) }
        })
  }

  private GetDocumentacaoSucesso(resp: any) {
    this.documentos = resp['documentos']
    // console.log(this.documentos)
    this.initProgressBar = 'hidden'
    this.dialogRef.addPanelClass('aluno-sia-estagio-class')
    this.showForm = true
    this.disabledButtons = false
  }

  private GetDocumentacaoFalha(error: any) {
    this.initProgressBar = 'hidden'
    this.disabledButtons = false
  }

  public Exportar(event?: any, docId?: any) {

    // console.log(event)

    var file: File = event.target.files[0];

    var fileName = file.name;

    var fileSize = file.size // 4194304 
    
    if (fileSize > 4194304) {
      this.OpenSnackBarError("O arquivo não pode ser superior a 4 megabytes.")
      return
    }

    const formData = new FormData();
    formData.append("file", file, fileName)

    // console.log(fileSize)

    const dialogRef = this._modal
      .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
    dialogRef.afterClosed().subscribe((data) => {

      if (data.clicked == true) this.UploadFile(formData, docId)

    })
    
    return event
  }

  get disabledButton(){
    return this.disabledButtons
  }

  private UploadFile(file: FormData, docId: any) {
    this.disabledButtons = true
    // console.log(file)
    // console.log(docId)

    this._alunoService.UploadFile(file, docId)
      .subscribe({
        next: (resp: any) => { 
          this.OpenSnackBarSucesso("Upload efetuado com sucesso")
          
          this.GetDocumentacao()
        },
        error: (falha: any) => { 
          this.disabledButtons = false
          this.OpenSnackBarErrorDefault()
        }
      })
  }

}
