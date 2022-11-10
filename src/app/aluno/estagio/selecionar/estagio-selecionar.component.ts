import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  constructor(
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _alunoService: AlunoSiaService,
    public dialogRef: MatDialogRef<EstagioSelecionarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
    this.estagioForm = _fb.group({

    })
  }

  ngOnInit(): void {
    this.GetEstagiosTiposLiberados()
  }

  private GetEstagiosTiposLiberados(){

            this._alunoService.GetEstagiosTiposLiberados("D41BC26F-DC80-4F33-8EEC-3727B37846C0")
                .subscribe(
                    sucesso => { this.Sucesso(sucesso ) },
                    falha => { this.Erro(falha) }
                );   
  }

  private Sucesso(resp:any){

    this.initProgressBar = 'hidden'
    this.showForm = true
    this.estagiosTipos = resp['tipos']
  }

  private Erro(error:any){

  }

  public GetEstagios(tipoId: any){

    this._alunoService.GetEstagiosLiberados(tipoId)
                .subscribe(
                    sucesso => { this.EstagioSucesso(sucesso ) },
                    falha => { this.EstagioErro(falha) }
                ); 
  }

   private EstagioSucesso(resp:any){

    this.initProgressBar = 'hidden'
    this.disabledSelectLocal = false
    this.showForm = true
    this.estagios = resp['estagios']
  }

  private EstagioErro(error:any){

  }

  public SelectEstagio(estagioId: any){
    this._alunoService.GetEstagio(estagioId)
    .subscribe(
        sucesso => { this.SelectEstagioSucesso(sucesso ) },
        falha => { this.SelectEstagioError(falha) }
    ); 
  }

  private SelectEstagioSucesso(resp: any){
    this.estagio = resp['estagio']
    this.showInfos = true
  }

  private SelectEstagioError(error: any){
    this.OpenSnackBarErrorDefault()
  }

  public Salvar() {

  }

}
