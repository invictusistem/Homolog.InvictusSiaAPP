import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-bancoedit-config',
  templateUrl: './bancoedit-config.component.html',
  styleUrls: ['./bancoedit-config.component.scss']
})
export class BancoeditConfigComponent extends BaseComponent implements OnInit {

  public bancoForm: FormGroup
  private bancoOriginal: any

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<BancoeditConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);

    this.bancoForm = _fb.group({
      id: [''],
      nome: ['', [Validators.required]],
      ehCaixaEscola: [''],
      agencia: [''],
      agenciaDigito: [''],
      conta: [''],
      contaDigito: [''],
      ativo: [true],
      dataCadastro: [''],
      utilizadoParaImpressao: [''],
      unidadeId: [''],
      saldo:['']
    })
  }

  ngOnInit(): void {
    this.GetBancoById()
  }

  private GetBancoById() {

    this._finService.GetBancoById(this.data['bancoId'])
      .subscribe({
        next: (resp: any) => { this.GetBancoSucesso(resp) },
        error: (error: any) => {
          this.OpenSnackBarErrorDefault()
          this.initProgressBar = 'hidden'
        },
        complete: () => { }
      })
  }

  private GetBancoSucesso(resp: any) {
    this.bancoForm.patchValue(resp['result']);
    this.bancoOriginal = JSON.parse(JSON.stringify(this.bancoForm.value))
    console.log(this.bancoForm.value)
    this.PodeEditar()
    this.dialogRef.addPanelClass('banco-edit-class')
    this.initProgressBar = 'hidden'
    this.showForm = true
  }

  private PodeEditar(){
    // if(this.tokenInfo.role != 'SuperAdm' ){
    //   this.bancoForm.disable()
    //   this.showSaveButton = 'hidden'
    // }
  }

  get disabledButtonSave() {

    if (this.bancoForm.valid &&
            JSON.stringify(this.bancoOriginal) !=
            JSON.stringify(this.bancoForm.value)) {

            return this.matProgressSaveButton != 'hidden'
        } else {
            return true
        }   
  }

  public Save() {

    if (this.bancoForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.EditBanco(this.bancoForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Banco editado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}
