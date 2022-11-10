import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-pedag-req-edit',
  templateUrl: './pedag-req-edit.component.html',
  styleUrls: ['./pedag-req-edit.component.scss']
})
export class PedagReqEditComponent extends BaseComponent implements OnInit {

  public respostaForm: FormGroup;

  constructor(
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<PedagReqEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);

    this.respostaForm = _fb.group({
      status: ['', [Validators.required]],
      observacao: ['', [Validators.required]]
      // cpf: ['', [Validators.required, Validators.minLength(11)]],
      // celular: [null, [Validators.required, Validators.minLength(5)]],
      // cargoId: ['', [Validators.required]],
      // ativo: [true, [Validators.required]]


  })

  }

  ngOnInit(): void {
  }

  public SaveResp(){

  }

  get disabledButton() {
    if (this.respostaForm.valid) {
        return this.disabledSaveButton != 'hidden'
    } else {
        return true
    }
}

}
