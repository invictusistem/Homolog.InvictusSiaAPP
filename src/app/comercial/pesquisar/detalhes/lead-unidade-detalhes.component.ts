import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-lead-unidade-detalhes',
  templateUrl: './lead-unidade-detalhes.component.html',
  styleUrls: ['./lead-unidade-detalhes.component.scss']
})
export class LeadUnidadeDetalhesComponent extends BaseComponent implements OnInit {

  public leads: Array<any> = new Array<any>()
  constructor(
    private _http: HttpClient,
    override _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<LeadUnidadeDetalhesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {
    this.GetLeadDetalhes()
  }

  public GetLeadDetalhes() {

    var parametros = { start: this.data['lead'].inicio, end: this.data['lead'].fim, unidadeId: this.data['lead'].unidadeId }

    this._http.get(`${this.baseUrl}/comercial/lead/unidade/detalhes/?paramsJson=${JSON.stringify(parametros)}`)
      .subscribe({
        next: (resp: any) => {
          this.leads = resp['leads']
          this.showForm = true
          this.initProgressBar = 'hidden'
        },
        error: (fail: any) => {

          this.OpenSnackBarErrorDefault()
          this.initProgressBar = 'hidden'
        }
      });
  }

}
