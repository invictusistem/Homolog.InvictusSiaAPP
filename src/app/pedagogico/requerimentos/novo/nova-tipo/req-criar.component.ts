import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedagogicoService } from 'src/app/pedagogico/services/pedagogico.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-req-criar',
  templateUrl: './req-criar.component.html',
  styleUrls: ['./req-criar.component.scss']
})
export class ReqCriarComponent extends BaseComponent implements OnInit {

  public tipoReqForm: FormGroup

  constructor(
    private _pedagService: PedagogicoService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ReqCriarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.tipoReqForm = _fb.group({
      descricao: ['', [Validators.required]],
      ativo: [true],
      categoriaId: ['']
    })
  }

  ngOnInit(): void {
    this.tipoReqForm.get('categoriaId')?.setValue(this.data['cat'].id)
    this.initProgressBar = 'hidden'
    this.showForm = true
    //this.GetBancos()
  }

  get disabledButtonSave() {
    if (this.tipoReqForm.valid) {
      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.tipoReqForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._pedagService.SaveTipo(this.tipoReqForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Tipo de requerimento cadastrado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}