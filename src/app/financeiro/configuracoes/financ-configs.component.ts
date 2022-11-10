import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { FinanceiroService } from '../services/financ.service';
import { BancosConfigComponent } from './bancos/bancos-config.component';
import { CentrocustoConfigComponent } from './centro-custos/centrocusto-config.component';
import { FormarecebimentoConfigComponent } from './forma-recebimento/formarecebimento-config.component';
import { MeiopagamentoConfigComponent } from './meio-pagamento/meiopagamento-config.component';
import { PlanocontasConfigComponent } from './plano-contas/planocontas-config.component';
import {
  OpenBancosConfigModal,
  OpenCentroCustoConfigModal,
  OpenFormaRecebimentoconfigModal,
  OpenMeioPagamentoConfigModal,
  OpenPlanocontasConfigModal
} from "../services/financ-modal";

@Component({
  selector: 'app-financ-configs',
  templateUrl: './financ-configs.component.html',
  styleUrls: ['./financ-configs.component.scss']
})
export class FinancConfigsComponent extends BaseComponent implements OnInit {

  constructor(
    private _financService: FinanceiroService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _modal: MatDialog
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {
  }

  public OpenBancoModal(): void {
    const dialogRef = this._modal
      .open(BancosConfigComponent, OpenBancosConfigModal());
    dialogRef.afterClosed().subscribe(data => {
    });
  }

  public OpencentroCustoModal(): void {
    const dialogRef = this._modal
      .open(CentrocustoConfigComponent, OpenCentroCustoConfigModal());
    dialogRef.afterClosed().subscribe(data => {
    });
  }

  public OpenFormaRecebimentoModal(): void {
    const dialogRef = this._modal
      .open(FormarecebimentoConfigComponent, OpenFormaRecebimentoconfigModal());
    dialogRef.afterClosed().subscribe(data => {
    });
  }

  public OpenMeioPagamentoModal(): void {
    const dialogRef = this._modal
      .open(MeiopagamentoConfigComponent, OpenMeioPagamentoConfigModal());
    dialogRef.afterClosed().subscribe(data => {
    });
  }

  public OpenPlanoContasModal(): void {
    const dialogRef = this._modal
      .open(PlanocontasConfigComponent, OpenPlanocontasConfigModal());
    dialogRef.afterClosed().subscribe(data => {
    });
  }


}
