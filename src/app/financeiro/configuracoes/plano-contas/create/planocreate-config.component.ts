import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-planocreate-config',
  templateUrl: './planocreate-config.component.html',
  styleUrls: ['./planocreate-config.component.scss']
})
export class PlanocreateConfigComponent extends BaseComponent implements OnInit {

  public planoForm: FormGroup

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<PlanocreateConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.planoForm = _fb.group({
      descricao: ['', [Validators.required]],
      ativo: [true]
    })
  }

  ngOnInit(): void {
    this.initProgressBar = 'visible'
    this.showForm = true
  }

  get disabledButtonSave() {
    if (this.planoForm.valid) {
      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.planoForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.SavePlano(this.planoForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Plano de conta cadastrado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}