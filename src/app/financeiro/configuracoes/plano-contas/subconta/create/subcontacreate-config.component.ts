import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-subcontacreate-config',
  templateUrl: './subcontacreate-config.component.html',
  styleUrls: ['./subcontacreate-config.component.scss']
})

export class SubcontacreateConfigComponent extends BaseComponent implements OnInit {

  public subcontaForm: FormGroup

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<SubcontacreateConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.subcontaForm = _fb.group({
      descricao: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      ativo: [true],
      planoContaId: ['']
    })
  }

  ngOnInit(): void {
    this.subcontaForm.get('planoContaId')?.setValue(this.data['plano'].id)
    this.initProgressBar = 'hidden'
    this.showForm = true
    //this.GetBancos()
  }

  get disabledButtonSave() {
    if (this.subcontaForm.valid) {
      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.subcontaForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.SaveSubConta(this.subcontaForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Subconta cadastrada com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}