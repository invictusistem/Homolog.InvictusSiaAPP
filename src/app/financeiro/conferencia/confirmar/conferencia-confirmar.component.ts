import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-conferencia-confirmar',
  templateUrl: './conferencia-confirmar.component.html',
  styleUrls: ['./conferencia-confirmar.component.scss']
})

export class ConferenciaConfirmarComponent extends BaseComponent implements OnInit {

  public saveProgressBar = 'hidden'

  constructor(
    override _snackBar: MatSnackBar,
    public _http: HttpClient,
    public dialogRef: MatDialogRef<ConferenciaConfirmarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {
  }

  public confirmar() {
    this.saveProgressBar = 'visible'

    this._http.put(`${this.baseUrl}/financeiro/contas/confirmar/${this.data['contaId']}`, {})
    .subscribe({
      next: (resp:any) => { this.Sucess(resp) },
      error: (error:any) => { this.Fail(error) }
    })
    

  }

  Sucess(response?: any) {
    //this.saveProgressBar = 'hidden'
    this.OpenSnackBarSucesso("Compensação confirmada")
    this.dialogRef.close({ confirm: true });
}

Fail(error: any) {
  this.OpenSnackBarErrorDefault();
  this.saveProgressBar = 'hidden'
  //this.dialogRef.close({ confirm: false });
}

  public cancelar() {
    this.dialogRef.close({ confirm: false });
  }

  get disabledButton() {

    return this.saveProgressBar != 'hidden'

  }


}
