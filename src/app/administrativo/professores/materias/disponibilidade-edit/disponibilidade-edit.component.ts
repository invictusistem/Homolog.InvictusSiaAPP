import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";
import { environment } from "src/environments/environment";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { AdmService } from "src/app/administrativo/services/adm.service";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";

@Component({
    selector: 'edit-dispomodal',
    templateUrl: './disponibilidade-edit.component.html',
    styleUrls: ['./disponibilidade-edit.component.scss'],
    animations: [HighlightTrigger]
})

export class EditDispoComponent implements OnInit {

    baseUrl = environment.baseUrl;
    originalDispo: any;// = new Any()
    dispo:any
    

    constructor(
        private _fb: FormBuilder,
        private _admService: AdmService,
        private _http: HttpClient,
        private _helper: HelpersService,
        public dialogRef: MatDialogRef<EditDispoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        

    }

    ngOnInit() {
      
        //console.log(this.data['dispo'])
        this.originalDispo = Object.assign({}, this.data['dispo'])
        this.dispo = Object.assign({}, this.data['dispo'])
      
    }

    

    disabledSaveButton = false
    get disabledButton() {
        if(this.disabledSaveButton){
            return true
        }
        if (JSON.stringify(this.dispo) === JSON.stringify(this.originalDispo)) {
            return true
        } else {
            return false
        }
    }

    saveEdit(form: any) {
        this.disabledSaveButton = true
        this._admService.EditDisponibilidade(this.dispo)
        .subscribe(
            sucesso => {  this.dialogRef.close({ clicked: true }); },
            falha => {  this.dialogRef.close({ clicked: false }); }
        )
    }


    

}