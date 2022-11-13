import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { AlunoSiaService } from '../services/aluno-sia.service';
import { ReqsCriarComponent } from './criar/reqs-criar.component';
import { OpenRequerimentoCreateModalConfig, ViewRequerimentoModalConfig } from '../services/aluno-sia.modal';
import { HttpClient } from '@angular/common/http';
import { ReqViewComponent } from './view/req-view.component';

@Component({
  selector: 'app-aluno-reqs',
  templateUrl: './aluno-reqs.component.html',
  styleUrls: ['./aluno-reqs.component.scss']
})
export class AlunoReqsComponent extends BaseComponent implements OnInit {

  public requerimentos: any[] = new Array<any>()
  constructor(
    private _http: HttpClient,
    override _snackBar: MatSnackBar,
    private _alunoService: AlunoSiaService,
    private _modal: MatDialog
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {

    this.spinnerSearch = 'visible'

    this.Pesquisar();
  }

  public Pesquisar(event?: any) {

    this.showMessageNotFound = false

    // if (this.pesquisarForm.valid) {

    this.spinnerSearch = 'visible'

    if (event != undefined) {
      this.currentPage = event.pageIndex + 1
    } else {
      this.currentPage = 1
    }
    this._http.get(`${this.baseUrl}/sia/pesquisa/requerimentos/?itemsPerPage=` + this.pageSize + `&currentPage=${this.currentPage}`)
      .subscribe(
        sucesso => { this.processarSucesso(sucesso, event) },
        falha => { this.processarFalha(falha) }
      );
    // }

    return event
  }

  processarSucesso(response: any, event?: any) {

    this.requerimentos = Object.assign([], response['data']);

    this.length = response['totalItemsInDatabase']

    this.spinnerSearch = 'hidden'
    if (event != undefined) {
      this.pageIndexNumber = (event.pageIndex * this.pageSize)
    } else {
      this.pageIndexNumber = 0
      if (this.paginator != undefined) {
        this.paginator.firstPage();
      }
    }
  }

  processarFalha(fail: any) {

    if (fail['status'] == 404) {
      this.mensagemNotFound = "Sua pesquisa não encontrou nenhum registro correspondente"
      this.showMessageNotFound = true
      this.requerimentos = new Array<any>();
    }
    if (fail['status'] != 404) {
      this.mensagemNotFound = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
      this.showMessageNotFound = true
      this.requerimentos = new Array<any>();
    }

    this.spinnerSearch = 'hidden'
  }

  public OpenReqView(req: any): void {
    const dialogRef = this._modal
      .open(ReqViewComponent, ViewRequerimentoModalConfig(req));
    dialogRef.afterClosed().subscribe((data) => {

    });
  }

  public OpenCriarRequerimento(): void {
    const dialogRef = this._modal
      .open(ReqsCriarComponent, OpenRequerimentoCreateModalConfig());

    dialogRef.afterClosed().subscribe((data) => {

    });
  }

}
