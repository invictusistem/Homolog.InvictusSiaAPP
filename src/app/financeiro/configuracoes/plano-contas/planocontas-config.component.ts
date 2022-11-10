import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalConfirmarComponent } from 'src/app/_shared/components/modal-confirmar/modal-confirmar.component';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../../services/financ.service';
import { ModalconfirmarConfig } from '../../../_shared/services/shared.modal'
import { PlanocreateConfigComponent } from './create/planocreate-config.component';
import { OpenPlanoCreateConfigModal, OpenPlanoEditConfigModal, OpenSubcontaCreateConfigModal, OpenSubcontaEditConfigModal } from '../../services/financ-modal'
import { PlanoeditConfigComponent } from './edit/planoedit-config.component';
import { SubcontacreateConfigComponent } from './subconta/create/subcontacreate-config.component';
import { SubcontaeditConfigComponent } from './subconta/edit/subcontaedit-config.component';

@Component({
  selector: 'app-planocontas-config',
  templateUrl: './planocontas-config.component.html',
  styleUrls: ['./planocontas-config.component.scss']
})
export class PlanocontasConfigComponent extends BaseComponent implements OnInit {

  public planos: any[] = new Array<any>()
  public subContas: any[] = new Array<any>()
  public planoSelect: any
  public showSubConta = false
  public selectPlanoProgressBar = 'hidden'

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _modal: MatDialog,
    public dialogRef: MatDialogRef<PlanocontasConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

  }

  ngOnInit(): void {
    this.GetPlanos()
  }

  GetPlanos() {
    this._finService.GetPlanos()
      .subscribe({
        next: (resp: any) => { this.GetPlanosSucesso(resp) },
        error: (error) => { this.GetPlanosErro(error) },
        complete: () => {
          this.dialogRef.addPanelClass('plano-conta-class')
          this.initProgressBar = 'hidden'
          this.showForm = true
        }
      })
  }

  private GetPlanosSucesso(resp: any) {
    this.planos = Object.assign([], resp['result'])
  }

  private GetPlanosErro(error: any) {
    this.initProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault()
  }


  public CreatePlano(): void {
    const dialogRef = this._modal
      .open(PlanocreateConfigComponent, OpenPlanoCreateConfigModal());
    dialogRef.afterClosed().subscribe(data => {
      if (data.saved == true)
        this.GetPlanos()
    });
  }

  public EditarPlano(meioPgmId: any) {
    const dialogRef = this._modal
      .open(PlanoeditConfigComponent, OpenPlanoEditConfigModal(meioPgmId));
    dialogRef.afterClosed().subscribe((data) => {
      if (data.saved == true) {
        this.GetPlanos()
      }
    })
  }

  public CreateSubConta() {
    const dialogRef = this._modal
      .open(SubcontacreateConfigComponent, OpenSubcontaCreateConfigModal(this.planoSelect));
    dialogRef.afterClosed().subscribe(data => {
      if (data.saved == true)
        this.SelectPlano(this.planoSelect)
    });
  }

  public EditarSubconta(subContaId: any) {
    const dialogRef = this._modal
      .open(SubcontaeditConfigComponent, OpenSubcontaEditConfigModal(this.planoSelect, subContaId));
    dialogRef.afterClosed().subscribe(data => {
      if (data.saved == true)
      this.SelectPlano(this.planoSelect)
    });
  }

  public RemoverSubConta(subcontaId: any) {
    const dialogRef = this._modal
      .open(ModalConfirmarComponent, ModalconfirmarConfig(
        `configuracao-financ/subconta/${subcontaId}`,
        'delete',
        'Deseja remover a subconta?',
        'Subconta deletada com sucesso.'
      ));
    dialogRef.afterClosed().subscribe((data) => {
      if (data.confirm == true) {
        this.SelectPlano(this.planoSelect)
      }
    })
  }

  public RemoverPlano(meioPgmId: any) {

    const dialogRef = this._modal
      .open(ModalConfirmarComponent, ModalconfirmarConfig(
        `configuracao-financ/plano/${meioPgmId}`,
        'delete',
        'Deseja remover o meio de pagamento?',
        'Meio de pagamento deletado com sucesso.'
      ));
    dialogRef.afterClosed().subscribe((data) => {
      if (data.confirm == true) {
        this.GetPlanos()
      }
    })
  }

  public SelectPlano(plano: any) {
    this.showSubConta = false
    this.subContas = new Array<any>()
    this.selectPlanoProgressBar = 'visible'
    this._finService.GetSubcontasByPlanoId(plano.id)
      .subscribe({
        next: (resp: any) => { this.SelectPlanoSucesso(resp, plano) },
        error: (error) => { this.SelectPlanoError(error) },
        complete: () => {
          this.initProgressBar = 'hidden'
          this.showForm = true
        }
      })
  }

  private SelectPlanoSucesso(resp: any, plano: any) {
    this.planoSelect = plano
    this.subContas = Object.assign([], resp['result'])
    this.selectPlanoProgressBar = 'hidden'
    this.showSubConta = true
  }

  private SelectPlanoError(fail: any) {
    this.selectPlanoProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault()
  }

  get podeDeletar() {

    return this.tokenInfo.role == 'SuperAdm'
  }

}
