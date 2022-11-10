import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { AlunoSiaService } from '../services/aluno-sia.service';
import { ReqsCriarComponent } from './criar/reqs-criar.component';
import { OpenRequerimentoCreateModalConfig } from '../services/aluno-sia.modal';

@Component({
  selector: 'app-aluno-reqs',
  templateUrl: './aluno-reqs.component.html',
  styleUrls: ['./aluno-reqs.component.scss']
})
export class AlunoReqsComponent extends BaseComponent implements OnInit {

  constructor(
    override _snackBar: MatSnackBar,
    private _alunoService: AlunoSiaService,
    private _modal: MatDialog
  ) {
    super(_snackBar);
   }

  ngOnInit(): void {

  
  }

  public OpenCriarRequerimento():void {
    const dialogRef = this._modal
      .open(ReqsCriarComponent, OpenRequerimentoCreateModalConfig());

    dialogRef.afterClosed().subscribe((data) => {

    });
  }

}
