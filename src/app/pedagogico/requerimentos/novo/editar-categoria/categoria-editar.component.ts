import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PedagogicoService } from 'src/app/pedagogico/services/pedagogico.service';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-categoria-editar',
  templateUrl: './categoria-editar.component.html',
  styleUrls: ['./categoria-editar.component.scss']
})
export class CategoriaEditarComponent extends BaseComponent implements OnInit {

  public planoForm: FormGroup
  private planoOriginal: any

  constructor(
    private _pedagService: PedagogicoService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoriaEditarComponent>,
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
    this.GetReqCategoriaById()
  }

  private GetReqCategoriaById() {

    this._pedagService.GetCategoriaById(this.data['id'])
      .subscribe({
        next: (resp: any) => { this.GetPlanoSucesso(resp) },
        error: (error: any) => {
          this.OpenSnackBarErrorDefault()
          this.initProgressBar = 'hidden'
        },
        complete: () => { }
      })

    // Moq
    //var cat = { resp: { id:'', descricao:'CATEGORIA', ativo: true } }
    //this.GetPlanoSucesso(cat)
  }

  private GetPlanoSucesso(resp: any) {
    this.planoForm.patchValue(resp['categoria']);
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
      this._pedagService.EditCategoria(this.planoForm.value)
        .subscribe({
          next: () => { },
          error: (error: any) => {
            this.OpenSnackBarErrorDefault()
            this.matProgressSaveButton = 'hidden'
          },
          complete: () => {
            this.OpenSnackBarSucesso("Categoria editada com sucesso.")
            this.dialogRef.close({ saved: true })
          }
        })
    }
  }

}