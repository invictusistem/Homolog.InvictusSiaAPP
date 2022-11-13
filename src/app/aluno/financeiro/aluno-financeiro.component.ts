import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { InfoFinancModalConfig } from '../services/aluno-sia.modal';
import { AlunoFinViewComponent } from './view/aluno-fin-view.component';

@Component({
  selector: 'app-aluno-financeiro',
  templateUrl: './aluno-financeiro.component.html',
  styleUrls: ['./aluno-financeiro.component.scss']
})
export class AlunoFinanceiroComponent extends BaseComponent implements OnInit {

  constructor(
    //private _http: HttpClient,
    override _snackBar: MatSnackBar,
    private _modal: MatDialog
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {
  }

  public OpenconsultaFinanceira() {
    const dialogRef = this._modal
      .open(AlunoFinViewComponent, InfoFinancModalConfig());
    dialogRef.afterClosed().subscribe(data => {
    });
  }

}
