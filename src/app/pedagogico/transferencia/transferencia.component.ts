import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TransfInternaComponent } from './transf-interna/transf-interna.component';
import { TransfTurmasComponent } from './transf-turmas/transf-turmas.component';

@Component({
    selector: 'transferencia-app',
    templateUrl: './transferencia.component.html',
    styleUrls: ['./transferencia.component.scss']
})
export class TransferenciaComponent implements OnInit {

    constructor(
        private _modal: MatDialog,
    ) {

    }
    ngOnInit() {
    }
    

    openTransfTurmaModal(): void {

        const dialogRef = this._modal
            .open(TransfTurmasComponent, {
                height: 'auto',
                width: '1000px',
                autoFocus: false,
                hasBackdrop: true,
                disableClose: true
            });

        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "OK") {


            } else if (data.clicked === "Cancel") {

            }
        });

    }

    openTransfInternalModal(): void {
        const dialogRef = this._modal
            .open(TransfInternaComponent, {
                height: 'auto',
                width: '1000px',
                autoFocus: false,
                hasBackdrop: true,
                disableClose: true
            });

        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "OK") {


            } else if (data.clicked === "Cancel") {

            }
        });
    }

}