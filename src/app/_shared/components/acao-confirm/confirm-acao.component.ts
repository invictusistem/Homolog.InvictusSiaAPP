import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HighlightTrigger } from "../../animation/animation";

@Component({
    selector: 'confirm-acao-modal',
    templateUrl: './confirm-acao.component.html',
    styleUrls: ['./confirm-acao.component.scss'],
    animations: [HighlightTrigger]
})

export class ConfirmAcaoModalComponent implements OnInit {
    
    constructor(
        public dialogRef: MatDialogRef<ConfirmAcaoModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }

    ngOnInit() {
    }

    confirmar() {

        this.dialogRef.close({ clicked: true });

    }

    cancelar() {
        this.dialogRef.close({ clicked: false });
    }
}