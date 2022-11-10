import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateColaboradoresComponent } from 'src/app/administrativo/colaboradores/create/colaborador-create.component';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { MatriculaLiberarModalConfig } from '../../services/pedag-modal';
import { PedagogicoService } from '../../services/pedagogico.service';
import { MatriculaLiberarComponent } from './liberar/matricula-liberar.component';

@Component({
  selector: 'app-estagio-matricula',
  templateUrl: './estagio-matricula.component.html',
  styleUrls: ['./estagio-matricula.component.scss']
})

export class EstagioMatriculaComponent extends BaseComponent implements OnInit {

  public estagioTipos:any[] = new Array<any>()
  public matriculaForm!: FormGroup
  constructor(
    private _pedagService: PedagogicoService,
    override _snackBar: MatSnackBar,
    private _modal: MatDialog,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<CreateColaboradoresComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);

    this.matriculaForm = _fb.group({
      tipoEstagioId:['',[Validators.required]],
      matriculaId:['',[Validators.required]]
    })
  }

  ngOnInit() {
    this.matriculaForm.get('matriculaId')?.setValue(this.data['aluno'].matriculaId)
    this.GetEstagioTipos()
  }

  public GetEstagioTipos() {
    this.showMessageNotFound = false
    //OBS: Trazer apenas tipo que estiverem sendo vinculados a algum estágio existente
    this._pedagService.GetEstagiosLiberados(this.matriculaForm.get('matriculaId')?.value)
      .subscribe(
        sucesso => { this.GetEstagiosSucesso(sucesso) },
        erro => { this.GetEstagiosFalha(erro) },
      )
  }

  private GetEstagiosSucesso(response: any) {
    
    this.initProgressBar = 'hidden'
    this.estagioTipos = response['tipos']
    //this.length = this.estagioTipos.length
    this.initProgressBar = 'hidden'
    this.showForm = true
    this.dialogRef.addPanelClass('my-estagio-create-class')
  }

  private GetEstagiosFalha(erro: any) {

    this.initProgressBar = 'hidden'
    this.showForm = false
    //this.dialogRef.addPanelClass('my-estagio-create-class')

    if (erro['status'] == 404) {
      this.mensagemNotFound = "Não há tipos cadastrados. Favor, cadastrar um tipo para poder cadastrar um estágio."
      //this.msgNotFound = 'visible'
    }
    if (erro['status'] != 404) {
      this.mensagemNotFound = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
    }
    //this.spinnerSearch = 'hidden'
    this.showMessageNotFound = true
    //this.msgNotFound = 'visible'
  }



  public LiberarMatricula(): void {
    const dialogRef = this._modal
      .open(MatriculaLiberarComponent, MatriculaLiberarModalConfig(this.matriculaForm.value));
    dialogRef.afterClosed().subscribe((data) => {
      if (data.confirm == true) {
        this.dialogRef.close({ confirm: true });
      } 
    });
  }

}
