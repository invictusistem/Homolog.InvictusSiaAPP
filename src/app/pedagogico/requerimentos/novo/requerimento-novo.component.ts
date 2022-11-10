import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { PedagogicoService } from '../../services/pedagogico.service';
import { CreateCategoriaModalConfig, EditarTipoModalConfig } from '../../services/pedag-modal';
import { CategoriaCreateComponent } from './nova-categoria/categoria-create.component';
import { CategoriaEditarComponent } from './editar-categoria/categoria-editar.component';
import { EditCategoriaModalConfig } from '../../services/pedag-modal';
import { ReqCriarComponent } from './nova-tipo/req-criar.component';
import { CreateTipoModalConfig } from '../../services/pedag-modal';
import { TipoEditarComponent } from './editar-tipo/tipo-editar.component';

@Component({
  selector: 'app-requerimento-novo',
  templateUrl: './requerimento-novo.component.html',
  styleUrls: ['./requerimento-novo.component.scss']
})
export class RequerimentoNovoComponent extends BaseComponent implements OnInit {

  public reqs: any[] = new Array<any>()
  public tipos: any[] = new Array<any>()
  public catSelect: any
  selectPlanoProgressBar = 'hidden'
  showType = false

  constructor(
    override _snackBar: MatSnackBar,
    private _pedagService: PedagogicoService,
    private _fb: FormBuilder,
    private _modal: MatDialog,
    public dialogRef: MatDialogRef<RequerimentoNovoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {
    this.GetRequerimentosCategoria()
  }

  GetRequerimentosCategoria() {

    this._pedagService.GetCategorias()
      .subscribe({
        next: (resp:any) => { this.Sucesso(resp)},
        error: (error:any) => { }
      })
  }

  Sucesso(resp: any) {
    console.log(resp)
    this.reqs = resp['categorias']
    this.dialogRef.addPanelClass('requerimento-class')
    this.initProgressBar = 'hidden'
    this.showForm = true


  }

  Erro() {

  }

  CreateCategoria() {
    const dialogRef = this._modal
      .open(CategoriaCreateComponent, CreateCategoriaModalConfig());
    dialogRef.afterClosed().subscribe(data => {
      if (data.saved == true)
        this.GetRequerimentosCategoria()
    });
  }

  EditarCategoria(id: any) {
    const dialogRef = this._modal
    .open(CategoriaEditarComponent, EditCategoriaModalConfig(id));
  dialogRef.afterClosed().subscribe(data => {
    if (data.saved == true)
      this.GetRequerimentosCategoria()
  });
  }

  RemoverCategoria(id: any) {

  }

  CreateTipo() {

    const dialogRef = this._modal
      .open(ReqCriarComponent, CreateTipoModalConfig(this.catSelect));
    dialogRef.afterClosed().subscribe(data => {
      if (data.saved == true)
        this.SelectCategoria(this.catSelect)
    });

  }

  SelectCategoria(cat: any) {
    this.showType = false
    this.tipos = new Array<any>()
    this.selectPlanoProgressBar = 'visible'
    this._pedagService.GetTipoByCategoriaId(cat.id)
      .subscribe({
        next: (resp: any) => { this.SelectPlanoSucesso(resp, cat) },
        error: (error:any) => { this.SelectPlanoError(error) },
        complete: () => {
          this.initProgressBar = 'hidden'
          this.showForm = true
        }
      })
    //moq
    // this.SelectPlanoSucesso({ result:[ {id: '', descricao:'DECLARAÇÃO DE MATRÍCULA', ativo: true}]},
    // { id: '4305780c-c06e-4698-9d83-a78a47e63dbd', descricao: 'CERTIDÃO/DECLARAÇÃO',ativo: true}
    // ) 

  }

  private SelectPlanoSucesso(resp: any, plano: any) {
    this.catSelect = plano
    this.tipos = Object.assign([], resp['tipos'])
    this.selectPlanoProgressBar = 'hidden'
    this.showType = true
  }

  private SelectPlanoError(fail: any) {
    this.selectPlanoProgressBar = 'hidden'
    this.OpenSnackBarErrorDefault()
  }

  EditarTipo(id: any) {

    const dialogRef = this._modal
      .open(TipoEditarComponent, EditarTipoModalConfig(id));
    dialogRef.afterClosed().subscribe(data => {
      if (data.saved == true)
        this.SelectCategoria(this.catSelect)
    });

  }

  RemoverTipo(id: any) {

  }

  get podeDeletar() {

    return this.tokenInfo.role == 'SuperAdm'
  }
}
