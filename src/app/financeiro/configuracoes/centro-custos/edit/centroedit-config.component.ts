import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-centroedit-config',
  templateUrl: './centroedit-config.component.html',
  styleUrls: ['./centroedit-config.component.scss']
})
export class CentroeditConfigComponent extends BaseComponent implements OnInit {

  public centroCustoForm: FormGroup
  private centroCustoOriginal: any

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<CentroeditConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);

    this.centroCustoForm = _fb.group({
      id: [''],
      descricao: ['', [Validators.required]],
      ativo: [true],
      alertaMediaGastos: [''],
      unidadeId: ['']

    })
  }

  ngOnInit(): void {
    this.GeCentroCustoById()
  }

  private GeCentroCustoById() {

    this._finService.GetCentroCustoById(this.data['id'])
      .subscribe({
        next: (resp: any) => { this.GetCCSucesso(resp) },
        error: (error: any) => {
          this.OpenSnackBarErrorDefault()
          this.initProgressBar = 'hidden'
        },
        complete: () => { }
      })
  }

  private GetCCSucesso(resp: any) {
    this.centroCustoForm.patchValue(resp['result']);
    this.centroCustoOriginal = JSON.parse(JSON.stringify(this.centroCustoForm.value))

    this.PodeEditar()

    this.dialogRef.addPanelClass('centrocusto-edit-class')
    this.initProgressBar = 'hidden'
    this.showForm = true
  }

  private PodeEditar() {
    if (this.tokenInfo.role != 'SuperAdm') {
      this.centroCustoForm.disable()
      this.showSaveButton = 'hidden'
    }
  }

  get disabledButtonSave() {

    if (this.centroCustoForm.valid &&
      JSON.stringify(this.centroCustoOriginal) !=
      JSON.stringify(this.centroCustoForm.value)) {

      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.centroCustoForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.EditCentroCusto(this.centroCustoForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Centro de custo editado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}