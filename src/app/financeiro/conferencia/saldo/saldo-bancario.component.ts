import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-saldo-bancario',
  templateUrl: './saldo-bancario.component.html',
  styleUrls: ['./saldo-bancario.component.scss']
})
export class SaldoBancarioComponent extends BaseComponent implements OnInit {

  public bancos: any[] = new Array<any>()
  public total: number = 0;
  public showContent: boolean = false
  constructor(
    override _snackBar: MatSnackBar,
    public _http: HttpClient,
    public dialogRef: MatDialogRef<SaldoBancarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {

    this.GetSaldos()
  }

  public GetSaldos() {
    this.initProgressBar = 'visible'
    this._http.get(`${this.baseUrl}/financeiro/contas/saldo-bancario`)
      .subscribe({
        next: (resp: any) => { this.Sucesso(resp) },
        error: (resp: any) => { this.Fail(resp) }
      })

  }

  public Sucesso(resp: any) {
    this.bancos = Object.assign([], resp['bancos'])
    this.total = resp['total']
    console.log(this.total)
    this.initProgressBar = 'hidden'
    this.showContent = true
  }

  public Fail(error: any) {
    this.initProgressBar = 'hidden'
    this.showContent = false
    this.OpenSnackBarErrorDefault()
  }

}
