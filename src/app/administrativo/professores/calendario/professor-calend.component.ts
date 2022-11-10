import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";

@Component({
    selector: 'prof-calendario-app',
    templateUrl: './professor-calend.component.html',
    styleUrls: ['./professor-calend.component.scss'],
    animations: [HighlightTrigger]

})

export class ProfCalendarioComponent implements OnInit {

    private _baseUrl = environment.baseUrl
    public showSpin = false
    public initProgressBar = 'visible'
    public ShowTableHeader = false
    public infoNenhumDado = false
    // public listaPresencaDto: ListaPresencaDto[] = new Array<ListaPresencaDto>();
    // public infoDia: InfoDia = new InfoDia();
    //public saveCommand: SavePresencaCommand = new SavePresencaCommand();
    // public observacoes: string = "";
    // public obsForm: FormGroup;
    // public diaAulaString: any
    public calendarios: any[] = new Array<any>()
    constructor(
        private _http: HttpClient,
        private _fb: FormBuilder,
        private _modal: MatDialog,
        public _dialogRef: MatDialogRef<ProfCalendarioComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        // this.obsForm = this._fb.group({
        //     observacoes: ['', [Validators.required]]
        // })
    }

    ngOnInit() {
       // console.log(this.data)
        this._dialogRef.addPanelClass('profcalendar-class')
        this.GetProfessorCalendario();
    }

    private GetProfessorCalendario() {

        this._http.get(`${this._baseUrl}/professor/calendario-professor/${this.data['prof'].id}`)
            .subscribe((resp: any) => {

                //console.log(resp)
                this.calendarios = Object.assign([], resp['calendario'])
              // console.log(this.calendarios)

            },
                (error) => {
                   // console.log(error)
                    this.showSpin = false
                    this.initProgressBar = 'hidden'
                    this.infoNenhumDado = true

                },
                () => {
                    this.ShowTableHeader = true
                    this.initProgressBar = 'hidden'
                    this.showSpin = true
                    //this._dialogRef.addPanelClass('pedagcalendar-class')
                })
    }

    concluirAula() {
        // calendárioId
    }

    public GetNotaAula(caled: any): void {
        // const dialogRef = this._modal
        //     .open(ObservacoesTurmaModal, ObsTurmaModalConfig(caled));
        // dialogRef.afterClosed().subscribe(data => {
        // });
    }

    public EditAula(caled: any): void {
        // const dialogRef = this._modal
        //     .open(AulaEditarModal, AulaEditModalConfig(caled));
        // dialogRef.afterClosed().subscribe(data => {
        //     if (data['result'] == true) {
        //         let index = this.calendarios.findIndex((obj => obj.id == data['aula'].id));
        //         this.calendarios[index] = data['aula']
        //         console.log(this.calendarios[index])

        //     }
        // });
    }
}

