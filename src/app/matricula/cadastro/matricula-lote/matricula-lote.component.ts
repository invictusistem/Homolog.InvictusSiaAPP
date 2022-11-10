import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-matricula-lote',
  templateUrl: './matricula-lote.component.html',
  styleUrls: ['./matricula-lote.component.scss']
})
export class MatriculaLoteComponent extends BaseComponent implements OnInit {

  //public bancos: any[] = new Array<any>()
  public turmas: any[] = new Array<any>()
  public planos: any[] = new Array<any>()

  public matForm: FormGroup

  constructor(
    //private _finService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _modal: MatDialog,
    private _http: HttpClient,
    public dialogRef: MatDialogRef<MatriculaLoteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.matForm = _fb.group({
      planilhaNome: ['', [Validators.required]],
      planilhaFin: ['', [Validators.required]],
      turmaId: ['', [Validators.required]],
      planoId: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.GetDados()
  }


  private GetDados() {

    this._http.get(`${this.baseUrl}/teste/matricula-lotes-dados`)
      .subscribe({
        next: (resp: any) => { this.Sucesso(resp) },
        error: (error) => { this.Erro(error) },
        complete: () => {
          this.initProgressBar = 'hidden'
          this.showForm = true
        }
      })
  }

  private Sucesso(resp: any) {

    this.turmas = Object.assign([], resp['turmas'])
    // this.initProgressBar = 'hidden'
    //this.showForm = true

  }

  private Erro(error: any) {
    this.initProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault()
  }

  public GetPlanos(typeId: any){

    this._http.get(`${this.baseUrl}/plano-pagamento/pacote/${typeId}`)
    .subscribe({
      next: (resp: any) => { this.PlanoSucesso(resp) },
      error: (error) => { this.PlanoError(error) },
      complete: () => {
        this.initProgressBar = 'hidden'
        this.showForm = true
      }
    })
  }

  private PlanoSucesso(resp: any){
    this.planos = Object.assign([], resp['planos'])
  }

  private PlanoError(error:any){

  }

  get disabledOpenEditButton() {
    return false
  }

get disabledButton(){

  return !this.matForm.valid
}

  get podeDeletar() {

    return this.tokenInfo.role == 'SuperAdm'
  }


  Save(){
    this.dialogRef.close({ confirm: true, form: this.matForm.value })
  }

}
