import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-comercial-filtros',
  templateUrl: './comercial-filtros.component.html',
  styleUrls: ['./comercial-filtros.component.scss']
})
export class ComercialFiltrosComponent extends BaseComponent implements OnInit {

  public pesquisarForm: FormGroup
  public alunos: any[] = new Array<any>()
  public consultores: any[] = new Array<any>()
  public leads: any[] = new Array<any>()

  constructor(
    private _fb: FormBuilder,
    private _http: HttpClient,
    override _snackBar: MatSnackBar
  ) {
    super(_snackBar);
    this.pesquisarForm = _fb.group({
      consultorId: ['', [Validators.required]],
      alunoId: ['']
    });
  }

  ngOnInit(): void {

    this.GetParametros()
  }

  public GetParametros() {

    this._http.get(`${this.baseUrl}/comercial/lead/filtro-params`)
      .subscribe({
        next: (resp: any) => {
          this.alunos = resp['alunos']
          this.consultores = resp['consultores']
          this.initProgressBar = 'hidden'
        },
        error: (erro) => {
          this.initProgressBar = 'hidden'
          this.OpenSnackBarErrorDefault()
        }
      })

  }

  public Pesquisar(event?: any) {

    this.initProgressBar = 'visible'

    if (!this.pesquisarForm.valid) return
    this.showMessageNotFound = false



    this.spinnerSearch = 'visible'

    // if (event != undefined) {
    //   this.currentPage = event.pageIndex + 1
    // } else {
    //   this.currentPage = 1
    // }
    var formJson = JSON.stringify(this.pesquisarForm.value)

    //let path = `/colaboradores/pesquisar/?itemsPerPage=` + this.pageSize + `&currentPage=${this.currentPage}&paramsJson=${formJson}`
    let path = `?paramsJson=${formJson}`

    this._http.get(`${this.baseUrl}/comercial/lead/desempenho/${path}`)
      .subscribe(
        sucesso => { this.processarSucesso(sucesso, event) },
        falha => { this.processarFalha(falha) }
      );
    // }

    return event
  }

  processarSucesso(response: any, event?: any) {

    this.leads = Object.assign([], response['leads']);
    this.length = this.leads.length
    this.initProgressBar = 'hidden'
    //this.length = response['totalItemsInDatabase']

    // this.spinnerSearch = 'hidden'
    // if (event != undefined) {
    //   this.pageIndexNumber = (event.pageIndex * this.pageSize)
    // } else {
    //   this.pageIndexNumber = 0
    //   if (this.paginator != undefined) {
    //     this.paginator.firstPage();
    //   }
    // }
  }

  processarFalha(fail: any) {

    this.initProgressBar = 'hidden'

    if (fail['status'] == 404) {
      this.mensagemNotFound = "Sua pesquisa não encontrou nenhum registro correspondente"
      this.showMessageNotFound = true
      this.leads = new Array<any>();
    }
    if (fail['status'] != 404) {
      this.mensagemNotFound = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
      this.showMessageNotFound = true
      this.leads = new Array<any>();
    }

    this.spinnerSearch = 'hidden'
  }

}
