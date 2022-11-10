import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { AdmService } from '../../services/adm.service';

@Component({
  selector: 'app-tipo-pacote-edit',
  templateUrl: './tipo-pacote-edit.component.html',
  styleUrls: ['./tipo-pacote-edit.component.scss']
})
export class TipoPacoteEditComponent extends BaseComponent implements OnInit {

  public niveis = ['INTERMEDIÁRIO', 'AVANÇADO']

  public tipoForm: FormGroup
  private originalDoc: any;
  public progress = false
  constructor(
    private _fb: FormBuilder,
    override _snackBar: MatSnackBar,
    private _admService: AdmService,
    public dialogRef: MatDialogRef<TipoPacoteEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);
    this.tipoForm = _fb.group({
      nome: ['', [Validators.required]],
      nivel: ['', [Validators.required]],
      observacao: [''],
      ativo: [true]
    })
  }

  ngOnInit(): void {
    this.GetTypePacote()
  }

  private GetTypePacote() {

    this.disabledSaveButton = 'visible'
    this._admService.GetTypePacoteById(this.data['Id'])
      .subscribe({
        next: (resp: any) => {
          this.tipoForm.patchValue(resp['typePacote'])
          this.initProgressBar = 'hidden'
          this.showForm = true
        },
        error: (erro: any) => {
          this.OpenSnackBarErrorDefault()
          this.dialogRef.close()

          //this.dialogRef.close()
        }
      })


  }

  onSubmit() {

    if (this.tipoForm.valid) {
      this.disabledSaveButton = 'visible'
      this._admService.SaveTypePacotes(this.tipoForm.value)
        .subscribe({
          next: (resp: any) => {
            this.OpenSnackBarSucesso('Tipo salvo com sucesso')
            this.dialogRef.close()
          },
          error: (erro: any) => {
            this.OpenSnackBarErrorDefault()
            this.disabledSaveButton = 'hidden'
            //this.dialogRef.close()
          }
        })

    }
  }

  get disabledButton() {
    if (this.tipoForm.valid) {
      return this.disabledSaveButton != 'hidden'
    } else {
      return true
    }
  }

}
