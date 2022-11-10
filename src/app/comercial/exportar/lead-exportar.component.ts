import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { LeadFormularioComponent } from './formulario/lead-formulario.component';
import { LeadIndividualComponent } from './individual/lead-individual.component';

@Component({
  selector: 'app-lead-exportar',
  templateUrl: './lead-exportar.component.html',
  styleUrls: ['./lead-exportar.component.scss']
})
export class LeadExportarComponent extends BaseComponent implements OnInit {

  cursos: any[] = new Array<any>();
  turmas: any[] = new Array<any>();

  showTurmas = false
  showMessage = false
  showSpinner = false

  constructor(
    private router: Router,
    public _modal: MatDialog,
    private _http: HttpClient,
    override _snackBar: MatSnackBar
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {

  }


  criarLead(): void {
    const dialogRef = this._modal
      .open(LeadFormularioComponent, {
        height: 'auto',
        width: '720px',
        autoFocus: false,
        maxHeight: '90vh',


        data: { Hello: "Hello World" },
        hasBackdrop: true,
        disableClose: true
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result.clicked === "OK") {


      }

    });
  }

  exportar(): void {
    const dialogRef = this._modal
      .open(LeadIndividualComponent, {
        height: 'auto',
        width: '300px',
        autoFocus: false,
        //maxHeight: '90vh',


        data: { Hello: "Hello World" },
        hasBackdrop: true,
        disableClose: true
      });


    dialogRef.afterClosed().subscribe(result => {
      if (result.clicked === "OK") {

      }

    });
  }



}