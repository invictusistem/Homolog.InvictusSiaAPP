import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedagogicoService } from 'src/app/pedagogico/services/pedagogico.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-tipo-editar',
  templateUrl: './tipo-editar.component.html',
  styleUrls: ['./tipo-editar.component.scss']
})
export class TipoEditarComponent extends BaseComponent implements OnInit {

  public tipoReqForm: FormGroup
  public tipoReqOriginal: any

  constructor(
    private _pedagService: PedagogicoService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<TipoEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.tipoReqForm = _fb.group({
      id:[''],
      descricao: ['', [Validators.required]],
      ativo: [true],
      categoriaId: ['']
    })
  }

  ngOnInit(): void {
    // this.tipoReqForm.get('categoriaId')?.setValue(this.data['id'])
    // this.initProgressBar = 'hidden'
    // this.showForm = true
    this.GetTipoReq()
  }

  GetTipoReq(){ 

    this._pedagService.GetTipoById(this.data['id'])
      .subscribe((resp:any) => {
        this.tipoReqForm.patchValue(resp['tipo']);
        this.tipoReqOriginal = JSON.parse(JSON.stringify(this.tipoReqForm.value))
        this.dialogRef.addPanelClass('subconta-edit-class')
    
        this.initProgressBar = 'hidden'
        this.showForm = true
      }, (error:any) => {}

      )

    

  }

  get disabledButtonSave() {
    if (this.tipoReqForm.valid &&
      JSON.stringify(this.tipoReqOriginal) !=
      JSON.stringify(this.tipoReqForm.value)) {

      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.tipoReqForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._pedagService.EditTipo(this.tipoReqForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Tipo editado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}