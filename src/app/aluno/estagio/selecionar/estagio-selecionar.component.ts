import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { AlunoSiaService } from '../../services/aluno-sia.service';

@Component({
  selector: 'app-estagio-selecionar',
  templateUrl: './estagio-selecionar.component.html',
  styleUrls: ['./estagio-selecionar.component.scss']
})

export class EstagioSelecionarComponent extends BaseComponent implements OnInit {

  public estagioForm: FormGroup
  public showInfos = false
  public disabledSelectLocal = true
  public estagiosTipos: any[] = new Array<any>()
  public estagios: any[] = new Array<any>()
  public estagio: any
  semEstagio = false
  //public disabledButton = false

  constructor(
    private _http: HttpClient,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _alunoService: AlunoSiaService,
    public dialogRef: MatDialogRef<EstagioSelecionarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
    this.estagioForm = _fb.group({
      estagioId: ['', [Validators.required]],
      typeEstagioId:['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    //console.log(this.estagio)
    this.GetEstagiosTiposLiberados()
  }

  private GetEstagiosTiposLiberados() {

    this._alunoService.GetEstagiosTiposLiberados()
      .subscribe(
        sucesso => { this.Sucesso(sucesso) },
        falha => { this.Erro(falha) }
      );
  }

  private Sucesso(resp: any) {

    this.initProgressBar = 'hidden'
    this.showForm = true
    this.estagiosTipos = resp['tipos']
  }

  private Erro(error: any) {
    console.log(error['status'])

    if (error['status'] == 404) {
      this.initProgressBar = 'hidden'
      this.semEstagio = true
    }else {
      this.OpenSnackBarErrorDefault()
      this.dialogRef.close({ sucesso: false })

    }
  }

  public GetEstagios(tipoId: any) {

    //this.showForm = false
   // this.showInfos = false
    this.estagios = new Array<any>()
    this.estagioForm.get('estagioId')?.setValue('')
   // this.estagio = undefined
    this._alunoService.GetEstagiosLiberados(tipoId)
      .subscribe(
        sucesso => { this.EstagioSucesso(sucesso) },
        falha => { this.EstagioErro(falha) }
      );
  }

  private EstagioSucesso(resp: any) {

    this.initProgressBar = 'hidden'
    this.disabledSelectLocal = false
    this.showForm = true
    this.estagios = resp['estagios']
  }

  private EstagioErro(error: any) {


  }

  public SelectEstagio(estagioId: any) {
    this._alunoService.GetEstagio(estagioId)
      .subscribe(
        sucesso => { this.SelectEstagioSucesso(sucesso) },
        falha => { this.SelectEstagioError(falha) }
      );
  }

  private SelectEstagioSucesso(resp: any) {
    this.estagio = resp['estagio']
    this.showInfos = true
  }

  private SelectEstagioError(error: any) {
    this.OpenSnackBarErrorDefault()
  }

  public Salvar() {

    if (this.estagioForm.valid) {

      this.disabledSaveButton = 'visible'

      this._http.put(`${this.baseUrl}/estagio/matricular/selecionar/${this.estagioForm.get('estagioId')?.value}/${this.estagioForm.get('typeEstagioId')?.value}`, {})
        .subscribe({
          next: (resp: any) => {
            this.OpenSnackBarSucesso('Matricula ocorrida com sucesso.')
            this.dialogRef.close({ sucesso: true })

          },
          error: (fail: any) => {
            this.OpenSnackBarErrorDefault()
            this.disabledSaveButton = 'hidden'
          }
        })
    }
  }

  get disabledButton() {
    if (this.estagioForm.valid) {
      return this.disabledSaveButton != 'hidden'
    } else {
      return true
    }
  }




}
