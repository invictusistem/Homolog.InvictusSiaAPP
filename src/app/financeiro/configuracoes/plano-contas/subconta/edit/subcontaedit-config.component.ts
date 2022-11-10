import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-subcontaedit-config',
  templateUrl: './subcontaedit-config.component.html',
  styleUrls: ['./subcontaedit-config.component.scss']
})
export class SubcontaeditConfigComponent extends BaseComponent implements OnInit {

  public subcontaForm: FormGroup
  private originalSubconta: any

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<SubcontaeditConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.subcontaForm = _fb.group({
      id: [''],
      descricao: ['', [Validators.required]],
      tipo: ['', [Validators.required]],
      ativo: [true],
      planoContaId: ['']
    })
  }

  ngOnInit(): void {
    //this.subcontaForm.get('planoContaId')?.setValue(this.data['plano'].id)

    this.GetSubcontaById()
  }

  private GetSubcontaById() {

    this._finService.GetSubcontasById(this.data['subContaId'])
      .subscribe({
        next: (resp: any) => { this.Success(resp) },
        error: (error: any) => { },
        complete: () => { }
      })
  }

  private Success(resp: any) {

    this.subcontaForm.patchValue(resp['result']);
    this.originalSubconta = JSON.parse(JSON.stringify(this.subcontaForm.value))
    this.dialogRef.addPanelClass('subconta-edit-class')

    this.initProgressBar = 'hidden'
    this.showForm = true
  }

  private Error(error: any) {
    this.initProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault();
  }

  get disabledButtonSave() {
    
    if (this.subcontaForm.valid &&
      JSON.stringify(this.originalSubconta) !=
      JSON.stringify(this.subcontaForm.value)) {

      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }


  public Save() {

    if (this.subcontaForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.EditSubConta(this.subcontaForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Subconta editada com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}