import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedagogicoService } from 'src/app/pedagogico/services/pedagogico.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-matricula-liberar',
  templateUrl: './matricula-liberar.component.html',
  styleUrls: ['./matricula-liberar.component.scss']
})

export class MatriculaLiberarComponent extends BaseComponent implements OnInit {

  constructor(
    override _snackBar: MatSnackBar,
    private _pedagService: PedagogicoService,
    public dialogRef: MatDialogRef<MatriculaLiberarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);
  }

  ngOnInit(): void {
    console.log(this.data['info'])
    console.log(this.data['info'].tipoEstagioId)
    console.log(this.data['info'].matriculaId)
  }

  get saveButton() {

    return this.disabledSaveButton != 'hidden'
  }

  confirmar() {

    this.disabledSaveButton = 'visible'

    this._pedagService.LiberarMatricula(this.data['info'])
      .subscribe(
        sucesso => { this.ConfirmarSucesso() },
        falha => { this.ConfirmarFalha(falha) }
      )
  }

  private ConfirmarSucesso() {
    this.dialogRef.close({ confirm: true });
  }

  private ConfirmarFalha(error: any) {
    this.disabledSaveButton = 'hidden'
    this.OpenSnackBarErrorDefault()
  }

  cancelar() {
    this.dialogRef.close({ confirm: false });
  }

}
