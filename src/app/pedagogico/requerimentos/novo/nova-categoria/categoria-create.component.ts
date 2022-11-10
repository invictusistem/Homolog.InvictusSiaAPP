import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedagogicoService } from 'src/app/pedagogico/services/pedagogico.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-categoria-create',
  templateUrl: './categoria-create.component.html',
  styleUrls: ['./categoria-create.component.scss']
})
export class CategoriaCreateComponent extends BaseComponent implements OnInit {

  public planoForm: FormGroup

  constructor(
    private _pedagService: PedagogicoService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoriaCreateComponent>,
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
      this._pedagService.SaveCategoria(this.planoForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Categoria cadastrado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }

  }

}