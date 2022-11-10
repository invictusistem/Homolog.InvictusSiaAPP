import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-lead-formulario',
  templateUrl: './lead-formulario.component.html',
  styleUrls: ['./lead-formulario.component.scss']
})
export class LeadFormularioComponent extends BaseComponent implements OnInit {

  public formulario: FormGroup
  constructor(
    override _snackBar: MatSnackBar,
    private _http: HttpClient,
    public _fb: FormBuilder,
    public dialogRef: MatDialogRef<LeadFormularioComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);

    this.formulario = _fb.group({
      nome:['',[Validators.required]],
      email:['',[Validators.required, Validators.email]],
      telefone:[''],
      bairro:[''],
      cursoPretendido:['',[Validators.required]]
    })
   }

  ngOnInit(): void {
  }

  get disabledButton(){

    if(this.formulario.valid){
      return this.disabledSaveButton != 'hidden'

    }else{
      return true
    }
  }

  onSubmit(){

    if(this.formulario.valid){
    this.disabledSaveButton = 'visible'
      this._http.post(`${this.baseUrl}/comercial/lead`,this.formulario.value)
          .subscribe({
            next: (resp:any) => {
              this.OpenSnackBarSucesso('Lead cadastrda com sucesso.')
              this.dialogRef.close(); },
            error: (resp:any) => {
              this.disabledSaveButton = 'hidden'
              this.OpenSnackBarErrorDefault()}
          })

    }

  }

}
