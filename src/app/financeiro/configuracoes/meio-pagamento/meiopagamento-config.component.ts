import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../../services/financ.service';
import { MeiopgmcreateConfigComponent } from './create/meiopgmcreate-config.component';
import { MeiopgmeditConfigComponent } from './edit/meiopgmedit-config.component';
import { OpenMeioPagamentoCreateConfigModal, OpenMeioPagamentoEditConfigModal } from "../../services/financ-modal";
import { ModalConfirmarComponent } from 'src/app/_shared/components/modal-confirmar/modal-confirmar.component';
import { ModalconfirmarConfig } from '../../../_shared/services/shared.modal'

@Component({
  selector: 'app-meiopagamento-config',
  templateUrl: './meiopagamento-config.component.html',
  styleUrls: ['./meiopagamento-config.component.scss']
})

export class MeiopagamentoConfigComponent extends BaseComponent implements OnInit {

  public meioPagamentos: any[] = new Array<any>()

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _modal: MatDialog,
    public dialogRef: MatDialogRef<MeiopagamentoConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);    

  }

  ngOnInit(): void {
    this.GetMeioPgms()
  }

  GetMeioPgms(){
    this._finService.GetMeioPagamentos()
      .subscribe({
        next: (resp: any) => { this.GetMeioPgmSucesso(resp) },
        error: (error) => { this.GetMeioPgmErro(error) },
        complete: () => {
          this.initProgressBar = 'hidden'
          this.showForm = true
        }
      })
  }

  private GetMeioPgmSucesso(resp: any) {
    this.meioPagamentos = Object.assign([], resp['result'])
  }

  private GetMeioPgmErro(error: any) {
    this.initProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault()
  }
  

  public CreateMeioPgm(): void {
    const dialogRef = this._modal
      .open(MeiopgmcreateConfigComponent, OpenMeioPagamentoCreateConfigModal());
    dialogRef.afterClosed().subscribe(data => {
      if (data.saved == true)
        this.GetMeioPgms()
    });
  }

  public EditarMeioPgm(meioPgmId: any){
    const dialogRef = this._modal
            .open(MeiopgmeditConfigComponent, OpenMeioPagamentoEditConfigModal(meioPgmId));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.saved == true) {
              this.GetMeioPgms()
            }
        })
  }

  public RemoverMeioPgm(meioPgmId:any){

    const dialogRef = this._modal
            .open(ModalConfirmarComponent, ModalconfirmarConfig(
              `configuracao-financ/meio-pgm/${meioPgmId}`,
              'delete',
              'Deseja remover o meio de pagamento?',
              'Meio de pagamento deletado com sucesso.'
            ));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.confirm == true) {
              this.GetMeioPgms()
            }
        })
  }  

  get podeDeletar() {

    return this.tokenInfo.role == 'SuperAdm'
  }

}
