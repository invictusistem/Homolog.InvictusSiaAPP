import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { BaseComponent } from '../../services/basecomponent.component';

@Component({
  selector: 'app-confirm-deletarconta',
  templateUrl: './confirm-deletarconta.component.html',
  styleUrls: ['./confirm-deletarconta.component.scss']
})
export class ConfirmDeletarcontaComponent extends BaseComponent implements OnInit {

  //private baseUrl: string = environment.baseUrl
  public contaForm: FormGroup
  constructor(
    override _snackBar: MatSnackBar,
    private _http: HttpClient,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ConfirmDeletarcontaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);
    this.contaForm = _fb.group({
      motivo: ['', [Validators.required, Validators.minLength(20)]]
    })

  }

  ngOnInit() {

  }



  public Save(confirmar: any) {
    console.log(confirmar)
    if (confirmar == false) {
      this.dialogRef.close({ clicked: false });
    } else {
      this.disabledSaveButton = 'visible'
      this.disabledCloseModalIcon = true
      this._http.delete(`${this.baseUrl}/financeiro/contas/${this.data['contaId']}`)
        .subscribe({
          next: () => {
            this.OpenSnackBarSucesso("Crédito/Débito desativado com sucesso")
            this.dialogRef.close({ confirm: true });
          },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault();
            this.dialogRef.close({ confirm: false });
          }
        })
    }
  }

  get disabledClickSave(){
    
    if(this.disabledSaveButton == 'visible'){
      return true
    }else{
      return false
    }
  }

  get habilitarSave() {
    console.log(this.contaForm.valid)
    if (this.contaForm.valid == true) {
      return 'visible'
    } else {
      return 'hidden'
    }
  }

}