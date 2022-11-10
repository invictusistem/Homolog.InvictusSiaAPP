import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-meiopgmedit-config',
  templateUrl: './meiopgmedit-config.component.html',
  styleUrls: ['./meiopgmedit-config.component.scss']
})
export class MeiopgmeditConfigComponent extends BaseComponent implements OnInit {

  public meioPgmForm: FormGroup
  private meioPgmOriginal: any

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<MeiopgmeditConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);

    this.meioPgmForm = _fb.group({
      id: [''],
      descricao: ['', [Validators.required]],
      ativo: [true],
      unidadeId: ['']
    })
  }

  ngOnInit(): void {
    this.GetMeioPgmById()
  }

  private GetMeioPgmById() {

    this._finService.GetMeioPgmById(this.data['id'])
      .subscribe({
        next: (resp: any) => { this.GetMeioPgmSucesso(resp) },
        error: (error: any) => {
          this.OpenSnackBarErrorDefault()
          this.initProgressBar = 'hidden'
        },
        complete: () => { }
      })
  }

  private GetMeioPgmSucesso(resp: any) {
    this.meioPgmForm.patchValue(resp['result']);
    this.meioPgmOriginal = JSON.parse(JSON.stringify(this.meioPgmForm.value))
    
    this.PodeEditar()

    this.dialogRef.addPanelClass('meiopgm-edit-class')
    this.initProgressBar = 'hidden'
    this.showForm = true
  }

  private PodeEditar(){
    if(this.tokenInfo.role != 'SuperAdm'){
      this.meioPgmForm.disable()
      this.showSaveButton = 'hidden'
    }
  }

  get disabledButtonSave() {

    if (this.meioPgmForm.valid &&
            JSON.stringify(this.meioPgmOriginal) !=
            JSON.stringify(this.meioPgmForm.value)) {

            return this.matProgressSaveButton != 'hidden'
        } else {
            return true
        }   
  }

  public Save() {

    if (this.meioPgmForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.EditMeioPgm(this.meioPgmForm.value)
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
