import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-formacreate-config',
  templateUrl: './formacreate-config.component.html',
  styleUrls: ['./formacreate-config.component.scss']
})
export class FormacreateConfigComponent extends BaseComponent implements OnInit {

  public formaRecebForm: FormGroup
  public bancos: any[] = new Array<any>()
  public centroCustos: any[] = new Array<any>()
  public subContas: any[] = new Array<any>()
  public forncedores: any[] = new Array<any>()

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<FormacreateConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.formaRecebForm = _fb.group({
      descricao: ['', [Validators.required]],
      ativo: [true],
      ehCartao: [true],
      diasParaCompensacao: [1, [Validators.required, Validators.min(1)]],
      taxa: [0, [Validators.required, Validators.min(0)]],
      permiteParcelamento: [false],
      bancoPermitidoParaCreditoId: ['', [Validators.required]],
      subcontaTaxaVinculadaId: ['', [Validators.required]],
      fornecedorTaxaVinculadaId: ['', [Validators.required]],
      centroDeCustoTaxaVinculadaId: ['', [Validators.required]],
      compensacaoAutomatica: [true]
    })

    this.formaRecebForm.get('compensacaoAutomatica')?.valueChanges.subscribe(
      (form: any) => {

        if (this.formaRecebForm.get('compensacaoAutomatica')?.value) {
          this.formaRecebForm.get('diasParaCompensacao')?.setValue(1)  
          this.formaRecebForm.get('diasParaCompensacao')?.disable()  
        } else {
          this.formaRecebForm.get('diasParaCompensacao')?.enable()  
         // this.formaRecebForm.get('compensacaoAutomatica')?.setValue(true)
          
        }

      }

    );

    // this.formaRecebForm.get('compensacaoAutomatica')?.valueChanges.subscribe(
    //   (form: any) => {

    //     if (!this.formaRecebForm.get('ehCartao')?.value) {
    //       this.formaRecebForm.get('compensacaoAutomatica')?.setValue(true)
    //       this.formaRecebForm.get('compensacaoAutomatica')?.disable()
    //       this.formaRecebForm.get('diasParaCompensacao')?.disable()
    //       this.formaRecebForm.get('taxa')?.disable()
    //       this.formaRecebForm.get('permiteParcelamento')?.disable()
    //       this.formaRecebForm.get('bancoPermitidoParaCreditoId')?.disable()
    //       this.formaRecebForm.get('subcontaTaxaVinculadaId')?.disable()
    //       this.formaRecebForm.get('fornecedorTaxaVinculadaId')?.disable()
    //       this.formaRecebForm.get('centroDeCustoTaxaVinculadaId')?.disable()
    //       this.formaRecebForm.get('compensarAutomaticamenteId')?.disable()

    //     } else {
    //       this.formaRecebForm.get('compensacaoAutomatica')?.enable()
    //       this.formaRecebForm.get('permiteParcelamento')?.setValue(false)
    //       this.formaRecebForm.get('diasParaCompensacao')?.enable()
    //       this.formaRecebForm.get('taxa')?.enable()
    //       this.formaRecebForm.get('permiteParcelamento')?.enable()
    //       this.formaRecebForm.get('bancoPermitidoParaCreditoId')?.enable()
    //       this.formaRecebForm.get('subcontaTaxaVinculadaId')?.enable()
    //       this.formaRecebForm.get('fornecedorTaxaVinculadaId')?.enable()
    //       this.formaRecebForm.get('centroDeCustoTaxaVinculadaId')?.enable()
    //       this.formaRecebForm.get('compensarAutomaticamenteId')?.enable()
    //     }
    //   }
    // );

    
  }

  ngOnInit(): void {
    this.GetDatasFromForm()
  }

  private GetDatasFromForm() {

    this._finService.GetDatasFromFormaRecCreate()
      .subscribe({
        next: (resp: any) => { this.GetDatasFromFormSucess(resp) },
        error: (error) => { this.GetDatasFromFormError(error) },
        complete: () => { }
      })
  }

  private GetDatasFromFormSucess(resp: any) {
    this.bancos = Object.assign([], resp['bancos'])
    this.centroCustos = Object.assign([], resp['centroCustos'])
    this.subContas = Object.assign([], resp['subContas'])
    this.forncedores = Object.assign([], resp['forncedores'])
    this.formaRecebForm.get('diasParaCompensacao')?.disable()  
    this.initProgressBar = 'hidden'
    this.showForm = true

  }
  /* bancos
  centroCustos
  subContas
  forncedores
  */

  private GetDatasFromFormError(resp: any) {
    this.initProgressBar = 'hidden'
    this.showForm = false

  }

  get disabledButtonSave() {
    if (this.formaRecebForm.valid) {
      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.formaRecebForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.SaveFormaRecebimento(this.formaRecebForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Banco cadastrado com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}