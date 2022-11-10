import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { PedagogicoService } from '../services/pedagogico.service';
import { RequerimentoNovoComponent } from './novo/requerimento-novo.component';
import { CreateRequerimentoModalConfig, EditRequerimentoModalConfig } from '../services/pedag-modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PedagReqEditComponent } from './edit-requerimento/pedag-req-edit.component';

@Component({
  selector: 'app-pedag-reqs',
  templateUrl: './pedag-reqs.component.html',
  styleUrls: ['./pedag-reqs.component.scss']
})
export class PedagReqsComponent extends BaseComponent implements OnInit {

  public pesquisarForm: FormGroup
  public requerimentos: any[] = new Array<any>();

  constructor(
    private _pedagService: PedagogicoService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _modal: MatDialog,
  ) {
    super(_snackBar);
    this.pageSize = 10

    this.pesquisarForm = _fb.group({
      matricula: [''],
      status: [0, [Validators.required]],
      todasUnidades: [false]
    });

    this.pesquisarForm.valueChanges.subscribe(
      (form: any) => {

        if (this.pesquisarForm.get('nome')?.value == '' &&
          this.pesquisarForm.get('status')?.value == '') {

          this.pesquisarForm.controls['nome'].setErrors({ required: true });
          this.pesquisarForm.controls['status'].setErrors({ required: true });

        } else {
          this.pesquisarForm.controls['nome'].setErrors(null);

          this.pesquisarForm.controls['status'].setErrors(null)


        }
      }
    );
  }

  ngOnInit(): void {
  }

  public Pesquisar(event?: any) {

    this.showMessageNotFound = false

    if (this.pesquisarForm.valid) {

      this.spinnerSearch = 'visible'

      if (event != undefined) {
        this.currentPage = event.pageIndex + 1
      } else {
        this.currentPage = 1
      }

      this._pedagService.GetRequerimentos(this.pageSize, this.currentPage, this.pesquisarForm.value)
        .subscribe(
          sucesso => { this.processarSucesso(sucesso, event) },
          falha => { this.processarFalha(falha) }
        );
    }

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

  openCreateRequerimento(): void {
    const dialogRef = this._modal
      .open(RequerimentoNovoComponent, CreateRequerimentoModalConfig());
    dialogRef.afterClosed().subscribe((data) => {

    });
  }

  public OpenReqEdit():void{
    const dialogRef = this._modal
            .open(PedagReqEditComponent, EditRequerimentoModalConfig(""));
        dialogRef.afterClosed().subscribe((data) => {

        });
  }


}

export enum StatusRequerimento
    {
        EmAberto = 0,
        Deferido = 1,
        Indeferido = 2
    }
