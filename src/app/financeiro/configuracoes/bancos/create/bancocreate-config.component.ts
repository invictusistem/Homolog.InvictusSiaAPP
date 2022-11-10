import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-bancocreate-config',
  templateUrl: './bancocreate-config.component.html',
  styleUrls: ['./bancocreate-config.component.scss']
})
export class BancocreateConfigComponent extends BaseComponent implements OnInit {

  public bancoForm: FormGroup

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<BancocreateConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.bancoForm = _fb.group({
      nome: ['', [Validators.required]],
      ehCaixaEscola: [false],
      agencia: [''],
      agenciaDigito: [''],
      conta: [''],
      contaDigito: [''],
      ativo: [true]
    })
  }

  ngOnInit(): void {
    this.GetBancos()
  }

  private GetBancos() {
    this.initProgressBar = 'visible'
    this.showForm = true
  }

  get disabledButtonSave() {
    if (this.bancoForm.valid) {
      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.bancoForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.SaveBanco(this.bancoForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Banco cadastrado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}
