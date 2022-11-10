import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmAcaoModalComponent } from 'src/app/_shared/components/acao-confirm/confirm-acao.component';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { ConfirmAcaoModalConfig } from 'src/app/_shared/services/shared.modal';
import { PedagogicoService } from '../../services/pedagogico.service';
import { TipoCreateComponent } from './create/tipo-create.component';

@Component({
  selector: 'app-estagio-tipo',
  templateUrl: './estagio-tipo.component.html',
  styleUrls: ['./estagio-tipo.component.scss']
})
export class EstagioTipoComponent extends BaseComponent implements OnInit {

  public editAndSaveBar: string = 'hidden';
  public estagioTipos: any[] = new Array<any>();

  constructor(
    private _modal: MatDialog,
    private _http: HttpClient,
    override _snackBar: MatSnackBar,
    private _pedagService: PedagogicoService,
    public dialogRef: MatDialogRef<EstagioTipoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar)
  }

  ngOnInit() {
    this.GetEstagioTipos();
  }

  public GetEstagioTipos() {
    this.showMessageNotFound = false
    this._pedagService.GetEstagioTipos()
      .subscribe(
        sucesso => { this.GetEstagiosSucesso(sucesso) },
        erro => { this.GetEstagiosFalha(erro) },
      )
  }

  private GetEstagiosSucesso(response: any) {

    this.estagioTipos = response['tipos']
    this.length = this.estagioTipos.length
    this.initProgressBar = 'hidden'
    this.showForm = true
    this.dialogRef.addPanelClass('my-estagio-tipo-class')
  }

  private GetEstagiosFalha(erro: any) {

    this.initProgressBar = 'hidden'
    this.showForm = true
    this.dialogRef.addPanelClass('my-estagio-tipo-class')

    if (erro['status'] == 404) {
      this.mensagemNotFound = "Não há tipos cadastrados"
    }
    if (erro['status'] != 404) {
      this.mensagemNotFound = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
    }
    this.spinnerSearch = 'hidden'
    this.showMessageNotFound = true
  }

  public OpenAddTipoModal(): void {

      const dialogRef = this._modal
          .open(TipoCreateComponent, {
              // minHeight: '400px',
              width: '550px',
              //  panelClass: 'my-class',
              hasBackdrop: true,
              disableClose: true
          });

      dialogRef.afterClosed().subscribe((data) => {
          if (data.clicked === true) {
             this.GetEstagioTipos()
              // this.disabledDelete = true
              // this.showDeleteSpinner = true
              // this.editAndSaveBar = 'visible'
              // this.GetInfos()
             
          } else if (data.clicked === "Cancel") {

          }
      });
  }

  get tiposSlice(): any[] {
    let pageIndex = ((this.pageIndexNumber + 1) - 1) * this.pageSize
    return this.estagioTipos.slice(pageIndex, pageIndex + 5);
  }

  public RemoverTipo(estagioTipoId: any):any {

    const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

            if (data.clicked == true) {

                this._http.delete(`${this.baseUrl}/estagio/tipo/${estagioTipoId}`)
                    .subscribe(
                        response => { this.GetEstagioTipos() }, 
                        err => { })
            }
        })
        
  }

  get disableDeleteButton(){
    if(this.tokenInfo.role != 'SuperAdm') return
    
    
  }

  public ChangePage(event?: any) {
    // console.log(event.pageIndex)
    this.pageIndexNumber = event.pageIndex

    return event
  }

}
