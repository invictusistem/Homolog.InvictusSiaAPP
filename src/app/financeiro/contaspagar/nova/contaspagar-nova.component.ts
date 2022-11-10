import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../../services/financ.service';

@Component({
  selector: 'app-contaspagar-nova',
  templateUrl: './contaspagar-nova.component.html',
  styleUrls: ['./contaspagar-nova.component.scss']
})
export class ContaspagarNovaComponent extends BaseComponent implements OnInit {

  public contaForm: FormGroup
  public colaboradores: any[] = new Array<any>()
  public fornecedores: any[] = new Array<any>()
  public subcontas: any[] = new Array<any>()
  public meioPagamentos: any[] = new Array<any>()
  public centroCustos: any[] = new Array<any>()
  public bancos: any[] = new Array<any>()
  public eHfornecedor = true

  constructor(
    override _snackBar: MatSnackBar,
    private _financService: FinanceiroService,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ContaspagarNovaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    super(_snackBar);

    this.contaForm = _fb.group({
      vencimento: ['', [Validators.required]],
      valor: ['', [Validators.required]],
      ehFornecedor: [true],
      ehColaborador: [true],
      pessoaId: ['', [Validators.required]],
      historico: [''],
      meioPgmId: [''],
      centrocustoId: ['', [Validators.required]],
      subcontaId: [''],
      bancoId: ['']
    })

    this.contaForm.get('ehFornecedor')?.valueChanges.subscribe(
      (form: any) => {

        if (this.contaForm.get('ehFornecedor')?.value) {
          this.contaForm.get('pessoaId')?.setValue('')
          this.eHfornecedor = true
        } else {
          this.contaForm.get('pessoaId')?.setValue('')
          this.eHfornecedor = false
        }
      }
    );

    this.contaForm.get('pessoaId')?.valueChanges.subscribe(
      (form: any) => {
        if (this.contaForm.get('pessoaId')?.value) {
          if (!this.contaForm.get('ehFornecedor')?.value) {

            var colab = this.colaboradores.find(x => x.id == this.contaForm.get('pessoaId')?.value)

            this.contaForm.get('ehColaborador')?.setValue(colab.isColaborador)
            //this.eHfornecedor = true
          }
        }
      }
    );

  }

  ngOnInit() {

    this.GetColaboradoresEProfessoresFromUnidade()
  }

  public GetColaboradoresEProfessoresFromUnidade() {
    // GetAlunosFromUnidade
    this._financService.GetColaboradoresEProfessoresUnidade()
      .subscribe({
        next: (resp: any) => { this.colaboradores = Object.assign([], resp['colaboradores']) },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { this.GetFornecedoresFromUnidade() }
      })
  }

  public GetFornecedoresFromUnidade() {
    // GetFornecedoresFromUnidades
    this._financService.GetFornecedoresFromUnidades()
      .subscribe({
        next: (resp: any) => { this.fornecedores = Object.assign([], resp['fornecedores']) },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { this.GetAllBancosFromUnidade() }
      })
  }

  public GetAllBancosFromUnidade() {
    //GetBancosAtivosFromUnidade
    this._financService.GetBancosAtivosFromUnidade()
      .subscribe({
        next: (resp: any) => { this.bancos = Object.assign([], resp['result']) },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { this.GetMeioPagamentos() }
      })
  }

  public GetMeioPagamentos() {
    this._financService.GetMeioPagamentos()
      .subscribe({
        next: (resp: any) => { this.meioPagamentos = Object.assign([], resp['result']) },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { this.GetCentroCustos() }
      })
  }

  public GetCentroCustos() {
    this._financService.GetCentrosCustos()
      .subscribe({
        next: (resp: any) => { this.centroCustos = Object.assign([], resp['result']) },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { this.GetAllSubcontasFromUnidade() }
      })
  }


  public GetAllSubcontasFromUnidade() {
    // GetSubcontasAtivas
    this._financService.GetSubcontasAtivasDebito()
      .subscribe({
        next: (resp: any) => { this.subcontas = Object.assign([], resp['result']) },
        error: (error: any) => { this.initProgressBar = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => {
          //
          this.dialogRef.addPanelClass('contapagar-nova-class')
          this.initProgressBar = 'hidden'
          this.showForm = true
        }
      })
  }

  get disabledButtonSave() {
    if (this.contaForm.valid) {
      return this.matProgressSaveButton != 'hidden'
    } else {
      return true
    }
  }

  public Save() {
    this.matProgressSaveButton = 'visible'
    this._financService.SaveContaPagar(this.contaForm.value)
      .subscribe({
        next: (resp: any) => { this.OpenSnackBarSucesso('Conta cadastrada com sucesso.'); this.dialogRef.close({ saved: true }) },
        error: (error: any) => { this.matProgressSaveButton = 'hidden'; this.OpenSnackBarErrorDefault() },
        complete: () => { }
      })
  }

}