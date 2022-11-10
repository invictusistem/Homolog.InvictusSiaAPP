import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";

@Component({
    selector: 'turmasinfoalunos-app',
    templateUrl: './turmasinfoalunos.component.html',
    styleUrls: ['./turmasinfoalunos.component.scss'],
    animations: [HighlightTrigger]

})

export class TurmasInfoAlunosPedagComponent implements OnInit {

    private _baseUrl = environment.baseUrl
    public showForm = false
    public initProgressBar = 'visible'
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
        public _dialogRef: MatDialogRef<TurmasInfoAlunosPedagComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        // this.obsForm = this._fb.group({
        //     observacoes: ['', [Validators.required]]
        // })
    }

    ngOnInit() {
      //  console.log(this.data['turma'])
        //turmas/alunosturma/{turmaId}
        this.GetAlunosTurma(this.data['turma'].id);
    }

    alunos: any[] = new Array<any>();
    private GetAlunosTurma(turmaId: number) {

        this._http.get(`${this._baseUrl}/pedag/aluno/alunos/${turmaId}`)
            .subscribe((resp: any) => {

                console.log(resp)
                this.alunos = Object.assign([], resp['alunos'])
               // console.log(this.calendarios)

            },
                (error) => {
                   // console.log(error)
                   this.initProgressBar = 'hidden'
                   this.showForm = false
                    
                },
                () => {
                    this._dialogRef.addPanelClass('myturmasinfoalunos-class')
                    this.initProgressBar = 'hidden'
                    this.showForm = true
                    
                })
    }

    concluirAula() {
        // calendárioId
    }







}




