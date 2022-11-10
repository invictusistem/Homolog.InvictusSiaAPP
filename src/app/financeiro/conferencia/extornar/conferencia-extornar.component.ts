import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-conferencia-extornar',
  templateUrl: './conferencia-extornar.component.html',
  styleUrls: ['./conferencia-extornar.component.scss']
})
export class ConferenciaExtornarComponent extends BaseComponent implements OnInit {

  public saveProgressBar = 'hidden'
  public extornoForm: FormGroup
  constructor(
    override _snackBar: MatSnackBar,
    public _http: HttpClient,
    public _fb: FormBuilder,
    public dialogRef: MatDialogRef<ConferenciaExtornarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);

    this.extornoForm = this._fb.group({
      motivo: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(300)]]
    })
  }

  ngOnInit(): void {
  }

  public confirmar() {
    if (this.extornoForm.valid) {
      this.saveProgressBar = 'visible'

      this._http.put(`${this.baseUrl}/financeiro/contas/estornar/${this.data['contaId']}/?motivo=${this.extornoForm.value}`, {})
        .subscribe({
          next: (resp: any) => { this.Sucess(resp) },
          error: (error: any) => { this.Fail(error) }
        })
    }
  }

  Sucess(response?: any) {
    //this.saveProgressBar = 'hidden'
    this.OpenSnackBarSucesso("Extorno confirmado")
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
    if (this.extornoForm.valid) {
      return this.saveProgressBar != 'hidden'
    } else {
      return
    }

  }


}
