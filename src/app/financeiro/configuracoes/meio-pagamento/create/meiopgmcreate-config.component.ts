import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-meiopgmcreate-config',
  templateUrl: './meiopgmcreate-config.component.html',
  styleUrls: ['./meiopgmcreate-config.component.scss']
})
export class MeiopgmcreateConfigComponent extends BaseComponent implements OnInit {

  public meioPgmForm: FormGroup

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<MeiopgmcreateConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.meioPgmForm = _fb.group({
      descricao: ['', [Validators.required]],
      ativo: [true]
    })
  }

  ngOnInit(): void {
    this.initProgressBar = 'visible'
    this.showForm = true
  }

  get disabledButtonSave() {
    if (this.meioPgmForm.valid) {
      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.meioPgmForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.SaveMeioPgm(this.meioPgmForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Meio de pagamento cadastrado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}
