import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FinanceiroService } from 'src/app/financeiro/services/financ.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-formaedit-config',
  templateUrl: './formaedit-config.component.html',
  styleUrls: ['./formaedit-config.component.scss']
})
export class FormaeditConfigComponent extends BaseComponent implements OnInit {

  public formaRecebForm: FormGroup
  public originalForma: any
  public bancos: any[] = new Array<any>()
  public centroCustos: any[] = new Array<any>()
  public subContas: any[] = new Array<any>()
  public forncedores: any[] = new Array<any>()

  constructor(
    private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<FormaeditConfigComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.formaRecebForm = _fb.group({
      id: [''],
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
      unidadeId: [''],
      compensacaoAutomatica: [true],
      dinheiro: ['']
      //compensarAutomaticamenteId: ['']
    })

    this.formaRecebForm.get('compensacaoAutomatica')?.valueChanges.subscribe(
      (form: any) => {
        if (this.formaRecebForm.get('ehCartao')?.value) {
          if (this.formaRecebForm.get('compensacaoAutomatica')?.value) {
            this.formaRecebForm.get('diasParaCompensacao')?.setValue(1)
            this.formaRecebForm.get('diasParaCompensacao')?.disable()
          } else {
            this.formaRecebForm.get('diasParaCompensacao')?.enable()
            // this.formaRecebForm.get('compensacaoAutomatica')?.setValue(true)

          }
        }

      }

    );


    // this.formaRecebForm.get('ehCartao')?.valueChanges.subscribe(
    //   (form: any) => {

    //     if (!this.formaRecebForm.get('ehCartao')?.value) {

    //       this.formaRecebForm.get('diasParaCompensacao')?.disable()
    //       this.formaRecebForm.get('taxa')?.disable()
    //       this.formaRecebForm.get('permiteParcelamento')?.disable()
    //       this.formaRecebForm.get('bancoPermitidoParaCreditoId')?.disable()
    //       this.formaRecebForm.get('subcontaTaxaVinculadaId')?.disable()
    //       this.formaRecebForm.get('fornecedorTaxaVinculadaId')?.disable()
    //       this.formaRecebForm.get('centroDeCustoTaxaVinculadaId')?.disable()
    //       this.formaRecebForm.get('compensarAutomaticamenteId')?.disable()

    //     } else {

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

    this._finService.GetFormaRecebimentoById(this.data['id'])
      .subscribe({
        next: (resp: any) => { this.GetFormaSucesso(resp) },
        error: (error) => { this.GetFormaError(error) },
        complete: () => { }
      })
  }

  private GetFormaSucesso(resp: any) {

    this.formaRecebForm.patchValue(resp['result']);
    this.originalForma = JSON.parse(JSON.stringify(this.formaRecebForm.value))
    this.dialogRef.addPanelClass('forma-edit-class')

    if (!resp['result'].ehCartao) {
      this.formaRecebForm.get('diasParaCompensacao')?.disable()
      this.formaRecebForm.get('taxa')?.disable()
      this.formaRecebForm.get('permiteParcelamento')?.disable()
      this.formaRecebForm.get('bancoPermitidoParaCreditoId')?.disable()
      this.formaRecebForm.get('subcontaTaxaVinculadaId')?.disable()
      this.formaRecebForm.get('fornecedorTaxaVinculadaId')?.disable()
      this.formaRecebForm.get('centroDeCustoTaxaVinculadaId')?.disable()
      this.formaRecebForm.get('compensacaoAutomatica')?.disable()

      //       this.formaRecebForm.get('taxa')?.disable()
      /*
            id: [''],
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
            unidadeId:[''],
            compensacaoAutomatica: [true],
            dinheiro:['']
            */
    }
    this.initProgressBar = 'hidden'
    this.showForm = true
  }

  private GetFormaError(error: any) {
    this.initProgressBar = 'hidden'
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
    if (this.formaRecebForm.valid &&
      JSON.stringify(this.originalForma) !=
      JSON.stringify(this.formaRecebForm.value)) {

      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {

    if (this.formaRecebForm.valid == true) {
      this.matProgressSaveButton = 'visible'
      this._finService.EditFormaRecebimento(this.formaRecebForm.value)
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
