import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnChanges, OnInit, SimpleChanges } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { AgendaProvas } from "src/app/_shared/models/agenda.modal";
import { NotasDisciplinas } from "src/app/_shared/models/notasdisciplinas.model";
import { NotasViewModel } from "src/app/_shared/models/Turma.model";
import { environment } from "src/environments/environment";


@Component({
    selector: 'notas-app',
    templateUrl: './notas.component.html',
    styleUrls: ['./notas.component.scss'],
    animations: [HighlightTrigger]

})

export class NotasComponent implements OnInit {

    public initProgressBar = 'visible'
    public saveProgressBar = 'hidden'
    public showMateriaEscolha = false
    public showNotas = false
    public messageNoMateria = false
    teste: any;
    materias: any[] = new Array<any>();
    agendaProvas: AgendaProvas = new AgendaProvas();
    public notasDisciplinas: NotasDisciplinas[] = new Array<NotasDisciplinas>()
    public notasDisciplinasOriginal: any

    private BaseUrl = environment.baseUrl
    showTable = false
    materiaFilter: NotasViewModel = new NotasViewModel();


    public searchForm: FormGroup;

    constructor(
        private _helper: HelpersService,
        private _fb: FormBuilder,
        private _http: HttpClient,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.searchForm = _fb.group({
            materiaId: ['', [Validators.required]]
        })
    }


    ngOnInit() {
        console.log('notas component')
        console.log(this.data)

        this.getMaterias(this.data['turma'].id);

    }

    getMaterias(turmaId: any) {

        this.atualModuloId = turmaId
        this._http.get(`${this.BaseUrl}/turma/materias-notas-v2/${turmaId}`)
            .subscribe(
                (response: any) => {
                    this.materias = Object.assign([], response['materias'])
                },
                (error) => {
                    this.initProgressBar = 'hidden'
                    if(error['status'] == 404){
                        this.messageNoMateria = true
                    }else{
                        this._helper.openSnackBarErrorDefault();
                    }
                    console.log(error)
                },
                () => {
                    this.initProgressBar = 'hidden'
                    this.showMateriaEscolha = true
                    console.log(this.materias)
                }

            )
    }

    atualMateria: any;
    buscarNotas(materia: any) {

        console.log(materia)
        if (this.atualMateria == materia) {
            return
        }
        this.initProgressBar = 'visible'
        this.showNotas = false
        //materia.preventDefault();
        // if(this.searchForm.valid && materia == 'buscar'){

        this.atualMateria = materia

        this._http.get(`${this.BaseUrl}/pedag/turma/notas/${this.data['turma'].id}/${materia.id}`)
            .subscribe((resp: any) => {
                
                this.notasDisciplinas = Object.assign([], resp['notas']);
            },
                (error) => {
                    console.log(error)
                    this._helper.openSnackBarErrorDefault();
                    this.initProgressBar = 'hidden'
                },
                () => {
                    this.showNotas = true
                    this.initProgressBar = 'hidden'
                    this.showTable = true

                    this.notasDisciplinasOriginal = JSON.stringify(this.notasDisciplinas)
                    //var discJson = JSON.stringify(this.notasDisciplinas)

                })

        // }

    }
    clickado() {
        console.log('click')
    }

    salvar() {

        this.saveProgressBar = 'visible'
        console.log(this.notasDisciplinas)
        this._http.put(`${this.BaseUrl}/pedag/turma/notas`, this.notasDisciplinas, {})
            .subscribe(response => {

            },
                (error) => {
                    console.log(error)
                    this.saveProgressBar = 'hidden'
                },
                () => {
                    this.saveProgressBar = 'hidden'
                    this.Atualizar()
                }
            )
    }

    private Atualizar() { //this.atualMateria
        
        this.initProgressBar = 'visible'
        //this.showNotas = false
        //materia.preventDefault();
        // if(this.searchForm.valid && materia == 'buscar'){

        

        this._http.get(`${this.BaseUrl}/pedag/turma/notas/${this.data['turma'].id}/${this.atualMateria.id}`)
            .subscribe((resp: any) => {
                
                this.notasDisciplinas = Object.assign([], resp['notas']);
            },
                (error) => {
                    console.log(error)
                    this._helper.openSnackBarErrorDefault();
                    this.initProgressBar = 'hidden'
                },
                () => {
                    this.showNotas = true
                    this.initProgressBar = 'hidden'
                    this.showTable = true

                    this.notasDisciplinasOriginal = JSON.stringify(this.notasDisciplinas)
                    //var discJson = JSON.stringify(this.notasDisciplinas)

                })

        // }

    }

    get disableSaveButton() {

        if (this.notasDisciplinasOriginal !=
            JSON.stringify(this.notasDisciplinas)) {

            return this.saveProgressBar != 'hidden'
        } else {
            return true
        }
    }


    atualModuloId = 0





}


