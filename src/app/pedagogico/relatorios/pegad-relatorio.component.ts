import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-pegad-relatorio',
  templateUrl: './pegad-relatorio.component.html',
  styleUrls: ['./pegad-relatorio.component.scss']
})
export class PegadRelatorioComponent extends BaseComponent implements OnInit {

  public pesquisarForm: FormGroup

  constructor(
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder
  ) {
    super(_snackBar);

    this.pesquisarForm = _fb.group({
      // meioPagamentoId: [null],
      // start: ['', [Validators.required]],
      // end: ['', [Validators.required]],
      // ativo:[false]
    });
  }

  ngOnInit(): void {
  }

  public Pesquisar(){

  }

}
