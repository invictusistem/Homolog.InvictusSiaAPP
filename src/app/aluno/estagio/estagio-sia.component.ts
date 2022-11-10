import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { OpenEstagioDocModalConfig, OpenEstagioSelecionarModalConfig } from '../services/aluno-sia.modal';
import { AlunoSiaService } from '../services/aluno-sia.service';
import { EstagiosiaDocumentacaoComponent } from './documentos/estagiosia-documentacao.component';
import { EstagioSelecionarComponent } from './selecionar/estagio-selecionar.component';

@Component({
  selector: 'app-estagio-sia',
  templateUrl: './estagio-sia.component.html',
  styleUrls: ['./estagio-sia.component.scss']
})
export class EstagioSiaComponent extends BaseComponent implements OnInit {

  public status: any
  public semLiberacao = false
  public envioDocContainer = false

  constructor(
    override _snackBar: MatSnackBar,
    private _alunoService: AlunoSiaService,
    private _modal: MatDialog
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {

    this.VerificarStatus()
  }

  private VerificarStatus() {

    this._alunoService.GetEstagioStatus()
      .subscribe(
        {
          next: (response: any) => { this.ResponseSucesso(response) },
          error: (error) => { this.ResponseFalha(error) }
        })
  }

  private ResponseSucesso(response: any) {
    this.status = response['status']  //status = "sem liberação"

    if (this.status == "sem liberação") {
      this.initProgressBar = 'hidden'
      this.semLiberacao = true
      this.showForm = true
    } // no aguardo

    if (this.status == "no aguardo") {
      this.initProgressBar = 'hidden'
      this.envioDocContainer = true
      this.showForm = true
    }

    if (this.status == "liberado") {
      this.initProgressBar = 'hidden'
      this.envioDocContainer = true
      this.showForm = true
    }
  }

  private ResponseFalha(error: any) {

  }


  // OpenEstagioDocModalConfig

  public OpenDocModal(): void {
    const dialogRef = this._modal
      .open(EstagiosiaDocumentacaoComponent, OpenEstagioDocModalConfig());

    dialogRef.afterClosed().subscribe((data) => {

    });
  }

  public OpenEscolhaEstagio():void {
    const dialogRef = this._modal
      .open(EstagioSelecionarComponent, OpenEstagioSelecionarModalConfig());

    dialogRef.afterClosed().subscribe((data) => {

    });
  }

}
