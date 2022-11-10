import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-centrocreate-config',
  templateUrl: './centrocreate-config.component.html',
  styleUrls: ['./centrocreate-config.component.scss']
})

export class CentrocreateConfigComponent extends BaseComponent implements OnInit {

  public centroCustoForm: FormGroup

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<CentrocreateConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.centroCustoForm = _fb.group({
      
      descricao: ['', [Validators.required]],
      ativo: [true],
      alertaMediaGastos: [false]
      
    })
  }

  ngOnInit(): void {
    this.initProgressBar = 'visible'
    this.showForm = true
  }

  get disabledButtonSave() {
    if (this.centroCustoForm.valid) {
      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.centroCustoForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.SaveCentroCusto(this.centroCustoForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Centro de custo cadastrado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}