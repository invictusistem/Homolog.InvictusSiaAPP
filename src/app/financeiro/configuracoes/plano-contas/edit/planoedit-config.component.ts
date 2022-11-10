import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-planoedit-config',
  templateUrl: './planoedit-config.component.html',
  styleUrls: ['./planoedit-config.component.scss']
})
export class PlanoeditConfigComponent extends BaseComponent implements OnInit {

  public planoForm: FormGroup
  private planoOriginal: any

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<PlanoeditConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);

    this.planoForm = _fb.group({
      id: [''],
      descricao: ['', [Validators.required]],
      ativo: [true],
      unidadeId: ['']
    })
  }

  ngOnInit(): void {
    this.GetPlanoById()
  }

  private GetPlanoById() {

    this._finService.GetPlanosById(this.data['id'])
      .subscribe({
        next: (resp: any) => { this.GetPlanoSucesso(resp) },
        error: (error: any) => {
          this.OpenSnackBarErrorDefault()
          this.initProgressBar = 'hidden'
        },
        complete: () => { }
      })
  }

  private GetPlanoSucesso(resp: any) {
    this.planoForm.patchValue(resp['result']);
    this.planoOriginal = JSON.parse(JSON.stringify(this.planoForm.value))
    
    this.PodeEditar()

    this.dialogRef.addPanelClass('planocusto-edit-class')
    this.initProgressBar = 'hidden'
    this.showForm = true
  }

  private PodeEditar(){
    if(this.tokenInfo.role != 'SuperAdm'){
      this.planoForm.disable()
      this.showSaveButton = 'hidden'
    }
  }

  get disabledButtonSave() {

    if (this.planoForm.valid &&
            JSON.stringify(this.planoOriginal) !=
            JSON.stringify(this.planoForm.value)) {

            return this.matProgressSaveButton != 'hidden'
        } else {
            return true
        }   
  }

  public Save() {

    if (this.planoForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.EditPlano(this.planoForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Meio de pagamento editado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}
