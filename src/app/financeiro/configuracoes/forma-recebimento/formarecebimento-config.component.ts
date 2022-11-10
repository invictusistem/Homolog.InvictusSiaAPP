import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalConfirmarComponent } from 'src/app/_shared/components/modal-confirmar/modal-confirmar.component';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../../services/financ.service';
import { ModalconfirmarConfig } from '../../../_shared/services/shared.modal'
import { FormacreateConfigComponent } from './create/formacreate-config.component';
import { OpenFormaRecebimentoCreateConfigModal, OpenFormaRecebimentoEditConfigModal } from '../../services/financ-modal'
import { FormaeditConfigComponent } from './edit/formaedit-config.component';

@Component({
  selector: 'app-formarecebimento-config',
  templateUrl: './formarecebimento-config.component.html',
  styleUrls: ['./formarecebimento-config.component.scss']
})
export class FormarecebimentoConfigComponent extends BaseComponent implements OnInit {

  public formasRecebimento: any[] = new Array<any>();

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _modal: MatDialog,
    public dialogRef: MatDialogRef<FormarecebimentoConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);
  }

  ngOnInit(): void {
    this.GetFormasRecebimentosCustos()
  }

  public GetFormasRecebimentosCustos() {
    this._finService.GetFormasRecebimentos()
      .subscribe({
        next: (resp: any) => { this.GetFormasRecSucesso(resp) },
        error: (error) => { this.GetFormasRecErro(error) },
        complete: () => {
          this.initProgressBar = 'hidden'
          this.showForm = true
        }
      })
  }

  private GetFormasRecSucesso(resp: any) {
    this.formasRecebimento = Object.assign([], resp['result'])
  }

  private GetFormasRecErro(error: any) {
    this.initProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault()
  }


  public CreateFormaRecebimento(): void {
    const dialogRef = this._modal
      .open(FormacreateConfigComponent, OpenFormaRecebimentoCreateConfigModal());
    dialogRef.afterClosed().subscribe(data => {
      if (data.saved == true)
        this.GetFormasRecebimentosCustos()
    });
  }

  public EditarFormaRecebimento(formaId: any) {
    const dialogRef = this._modal
            .open(FormaeditConfigComponent, OpenFormaRecebimentoEditConfigModal(formaId));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.saved == true) {
              this.GetFormasRecebimentosCustos()
            }
        })
  }

  public RemoveForma(formaId: any) {

    const dialogRef = this._modal
      .open(ModalConfirmarComponent, ModalconfirmarConfig(
        `configuracao-financ/forma-recebimento/${formaId}`,
        'delete',
        'Deseja remover a forma de recebimento?',
        'Forma de recebimento deletado com sucesso.'
      ));

    dialogRef.afterClosed().subscribe((data) => {
      if (data.confirm == true) {
        this.GetFormasRecebimentosCustos()
      }
    })

  }
  
  get podeDeletar() {

    return this.tokenInfo.role == 'SuperAdm'
  }

}