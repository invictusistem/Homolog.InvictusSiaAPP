import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { AlunoSiaService } from '../../services/aluno-sia.service';

@Component({
  selector: 'app-reqs-criar',
  templateUrl: './reqs-criar.component.html',
  styleUrls: ['./reqs-criar.component.scss']
})
export class ReqsCriarComponent extends BaseComponent implements OnInit {

  public requerimentoForm: FormGroup;
  public categorias: any[] = new Array<any>()
  public tipos: any[] = new Array<any>()
  public formCat = true
  public formType = true
  public formObs = true

  constructor(
    override _snackBar: MatSnackBar,
    private _alunoService: AlunoSiaService,
    private _http: HttpClient,
    private _modal: MatDialog,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<ReqsCriarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {

    super(_snackBar);

    this.requerimentoForm = _fb.group({
      catId: ['', [Validators.required]],
      typeId: ['', [Validators.required]],
      observacao: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    /*
    - trazer categorias de requerimentos

    - eselecionado a categoria, trazer os tipo e mostrar o text box


    */
    this.GetCategories()
  }

  onSubmit() {
    if(this.requerimentoForm.valid)
    {
      this.disabledSaveButton = 'visible'
      this._http.post(`${this.baseUrl}/pedag/requerimento`,this.requerimentoForm.value)
      .subscribe({
        next: (resp: any) => {
          this.OpenSnackBarSucesso("Seu requerimento foi enviado com sucesso.")
          this.dialogRef.close({salvo: true})
        },
        error: (erro:any) => { 
          this.disabledSaveButton = 'hidden'
          this.OpenSnackBarErrorDefault()
        }
      })
    }
    
    
  }

  GetCategories() {
    this.tipos = new Array<any>()
    this.formType = true
    this.requerimentoForm.get('typeId')?.setValue('')
    this._http.get(`${this.baseUrl}/pedag/requerimento/categorias`)
      .subscribe({
        next: (resp: any) => {
          this.initProgressBar = 'hidden'
          this.categorias = resp['categorias']
          this.formCat = false
        },
        error: (error: any) => {
          this.initProgressBar = 'hidden'
          this.OpenSnackBarErrorDefault()
        }
      })
  }

  public CategoriaSect(catId: any) {
    this.initProgressBar = 'visible'
    this._http.get(`${this.baseUrl}/pedag/requerimento/tipos/${catId}`)
      .subscribe({
        next: (resp: any) => {
          this.initProgressBar = 'hidden'
          this.tipos = resp['tipos']
          this.formType = false
        },
        error: (error: any) => {
          this.initProgressBar = 'hidden'
          this.OpenSnackBarErrorDefault()
        }
      })

  }



  get disabledButton() {
    if (this.requerimentoForm.valid) {
      return this.disabledSaveButton != 'hidden'
    } else {
      return true
    }

  }

}
