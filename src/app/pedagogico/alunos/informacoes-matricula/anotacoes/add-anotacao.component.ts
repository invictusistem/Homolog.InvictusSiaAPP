import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";

@Component({
    selector: 'add-anotacaomodal',
    templateUrl: './add-anotacao.component.html',
    styleUrls: ['./add-anotacao.component.scss'],
    animations: [HighlightTrigger]
})

export class AddAnotacaoComponent implements OnInit {

    baseUrl = environment.baseUrl;
    public comentario!: string

    constructor(
        private _http: HttpClient,
        public dialogRef: MatDialogRef<AddAnotacaoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

    }

    ngOnInit() {

    }


    saveComent(comentForm: any) {

        if (comentForm.valid) {

            this.dialogRef.close({ clicked: "OK", comentario: this.comentario });

        }
    }

}