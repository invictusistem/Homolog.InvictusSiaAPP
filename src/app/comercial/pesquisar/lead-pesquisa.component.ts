import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { OpenDetalhesLeadModalConfig } from '../services/comercial-modal';
import { LeadUnidadeDetalhesComponent } from './detalhes/lead-unidade-detalhes.component';

@Component({
  selector: 'app-lead-pesquisa',
  templateUrl: './lead-pesquisa.component.html',
  styleUrls: ['./lead-pesquisa.component.scss']
})
export class LeadPesquisaComponent extends BaseComponent implements OnInit {

  public pesquisarForm: FormGroup
  public unidades: any[] = new Array<any>()
  public leads: any[] = new Array<any>()
  public disabledForm = true
  public totalAtraso: any
  public totalPago: any
  public totalPagar: any

  public total: any


  constructor(
    override _snackBar: MatSnackBar,
    //private _financService: FinanceiroService,
    private _http: HttpClient,
    private _fb: FormBuilder,
    private _modal: MatDialog
  ) {
    super(_snackBar);

    this.pesquisarForm = _fb.group({
      //unidadeId: [null],
      start: ['', [Validators.required]],
      end: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    //this.spinnerSearch = "visible"
    this.GetPessoas()
  }

  GetPessoas() {

  }

  public Pesquisar(event?: any) {

    this.showMessageNotFound = false

    if (this.pesquisarForm.valid) {
      this.spinnerSearch = 'visible'
      this.showMessageNotFound = false
      this.leads = new Array<any>()

      this.pesquisarForm.get('meioPagamentoId')?.value,
        new Date(this.pesquisarForm.get('start')?.value).toISOString(),
        new Date(this.pesquisarForm.get('end')?.value).toISOString()


      this._http.get(`${this.baseUrl}/comercial/lead/unidade/?paramsJson=${JSON.stringify(this.pesquisarForm.value)}`)
        .subscribe({
          next: (resp: any) => {
            //this.totalAtraso = resp['totalAtraso']
            //this.totalPagar = resp['totalPagar']
            //this.totalPago = resp['valorPago']
            this.leads = Object.assign([], resp['leads'])
            this.spinnerSearch = 'hidden'
          },
          error: (fail: any) => {
            this.spinnerSearch = 'hidden'
            if (fail['status'] == 404) {
              this.showMessageNotFound = true
              this.mensagemNotFound = "Nenhum registro foi localizado no período informado."
            } else {
              this.OpenSnackBarErrorDefault()
            }
          }
        });
    }

  }

  public DetalhesLEad(lead: any){
    const dialogRef = this._modal
            .open(LeadUnidadeDetalhesComponent, OpenDetalhesLeadModalConfig(lead));
        dialogRef.afterClosed().subscribe((data) => {

        });
  }

  get totalLeads(){

    var total = this.leads.map(l => l.total).reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    return total
  }

  get totalEfetivadas(){

    var total = this.leads.map(l => l.efetivadas).reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    return total;
  }



}
