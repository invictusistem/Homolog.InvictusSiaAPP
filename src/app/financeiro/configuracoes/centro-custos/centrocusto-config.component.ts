import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalConfirmarComponent } from 'src/app/_shared/components/modal-confirmar/modal-confirmar.component';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../../services/financ.service';
import { CentrocreateConfigComponent } from './create/centrocreate-config.component';
import { CentroeditConfigComponent } from './edit/centroedit-config.component';
import { OpenCentroCustoCreateConfigModal, OpenCentroCustoEditConfigModal } from '../../services/financ-modal'
import { ModalconfirmarConfig } from '../../../_shared/services/shared.modal'

@Component({
  selector: 'app-centrocusto-config',
  templateUrl: './centrocusto-config.component.html',
  styleUrls: ['./centrocusto-config.component.scss']
})
export class CentrocustoConfigComponent extends BaseComponent implements OnInit {

  public centroCustos: any[] = new Array<any>()

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _modal: MatDialog,
    public dialogRef: MatDialogRef<CentrocustoConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
        super(_snackBar); }

  ngOnInit(): void {
    this.GetCentrosCustos()
  }

  public GetCentrosCustos(){
    this._finService.GetCentrosCustos()
      .subscribe({
        next: (resp: any) => { this.GetCCSucesso(resp) },
        error: (error) => { this.GetCCErro(error) },
        complete: () => {
          this.initProgressBar = 'hidden'
          this.showForm = true
        }
      })
  }

  private GetCCSucesso(resp: any) {
    this.centroCustos = Object.assign([], resp['result'])
  }

  private GetCCErro(error: any) {
    this.initProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault()
  }
  

  public CreateCentroCusto(): void {
    const dialogRef = this._modal
      .open(CentrocreateConfigComponent, OpenCentroCustoCreateConfigModal());
    dialogRef.afterClosed().subscribe(data => {
      if (data.saved == true)
        this.GetCentrosCustos()
    });
  }

  public EditarCentroCusto(centroId: any){
    const dialogRef = this._modal
            .open(CentroeditConfigComponent, OpenCentroCustoEditConfigModal(centroId));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.saved == true) {
              this.GetCentrosCustos()
            }
        })
  }

  public RemoverCentroCusto(meioPgmId:any){

    const dialogRef = this._modal
            .open(ModalConfirmarComponent, ModalconfirmarConfig(
              `configuracao-financ/meio-pgm/${meioPgmId}`,
              'delete',
              'Deseja remover o centro de custo?',
              'Centro de custo deletado com sucesso.'
            ));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.confirm == true) {
              this.GetCentrosCustos()
            }
        })
  }  

  get podeDeletar() {

    return this.tokenInfo.role == 'SuperAdm'
  }

}
