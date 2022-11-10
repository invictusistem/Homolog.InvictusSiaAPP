import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { environment } from "src/environments/environment";

@Component({
    selector: 'confirmdialog',
    templateUrl: 'confirmariniciar.component.html',
    animations: [HighlightTrigger]
})
export class ConfirmarIniciarTurmaModal {

    baseUrl = environment.baseUrl;
    public msg: string = ''
    public url: string = ''
    public hidden = 'hidden'
    public disabledSaveButton = false

    constructor(
        private _helper: HelpersService,
        private _http: HttpClient,
        public dialogRef: MatDialogRef<ConfirmarIniciarTurmaModal>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

        confirmar() {
            this.hidden = 'visible'
            this.disabledSaveButton = true

            this._http.put(`${this.baseUrl}/turma/iniciar/${this.data['turmaId']}`, {

                }).subscribe(result => {

                },
                    (error) => { 
                        this._helper.openSnackBarErrorDefault()
                        this.dialogRef.close({ clicked: false });
                    },
                    () => {
                        this._helper.openSnackBarSucesso("Turma iniciada com sucesso.")
                        this.dialogRef.close({ clicked: true });
                    }
                )
        }
    
        cancelar() {
            
            this.dialogRef.close({ clicked: false });
        }
}