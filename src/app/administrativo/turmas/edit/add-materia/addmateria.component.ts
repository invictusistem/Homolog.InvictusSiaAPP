import { getTreeMultipleDefaultNodeDefsError } from "@angular/cdk/tree";
import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";

@Component({
    selector: 'addmateria-modal',
    templateUrl: './addmateria.component.html',
    styleUrls: ['./addmateria.component.scss'],
    animations: [HighlightTrigger]
})

export class AddPMateriaModalComponent implements OnInit {

    private baseUrl = environment.baseUrl
    public materias: any[] = new Array<any>();
    public originalMaterias: any;
    public showNoMateria = 'hidden'
    
    public listaMaterias: FormGroup

    public initProgressBar = 'visible'
    public showContent = false
    public disabledSaveButton = false

    constructor(
        private _http: HttpClient,
        private _fb: FormBuilder,
        public _dialogRef: MatDialogRef<AddPMateriaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) {
        this.listaMaterias = _fb.group({
            materias: _fb.array([])
        })

    }
    ngOnInit() {
        this.getMateria()
    }

    get listaMats() {
        return this.listaMaterias.get('materias') as FormArray
    }

    addMaterias(resp: any) {

        this.materias = Object.assign([], resp['matsView'])

        

        this.materias.forEach(element => {

            const mat = this._fb.group({
                id: [element.id],
                nome: [element.nome],
                professorId: [element.professorId],
                isProfessor: [element.isProfessor]
            })
            this.listaMats.push(mat)
        });

        this.originalMaterias = JSON.parse(JSON.stringify(this.listaMaterias.value))

    }

    getMateria() {

        //this.http.get(`${this.baseUrl}/colaboradores/professores/?unidade=Campo Grande&itemsPerPage=${itemsPerPage}&currentPage=${currentPage}`)
        this._http.get(`${this.baseUrl}/pedag/turma/materias/${this.data['turmaId']}/${this.data['professor'].id}`)
            .subscribe(
                (result: any) => {

                    // console.log(result['matsView'])
                    this.materias = Object.assign([], result['matsView'])

                    //  console.log(this.materias)
                    if (this.materias.length > 0) {
                    //    this.addMaterias(result)
                    }


                },
                (error) => {
                    this.initProgressBar = 'hidden'
                    this.showNoMateria = 'visible'
                    // console.log(error) 
                },
                () => {
                    this.initProgressBar = 'hidden'
                    this.showContent = true
                    this._dialogRef.addPanelClass('turmaaddmateria-class')
                    // this.materias.forEach(element => {
                    //     console.log(element.profId)
                    
                    // });
                    //console.log(this.listaMaterias.get('materias')?.value)


                }
            )
    }

    get sabeButtom() {

        return this.disabledSaveButton
    }

    Checar() {
        return true
    }
    checked = true
    Atualizar() {
        // console.log(this.listProfId)
        // console.log(this.data['turmaId'])
        // console.log(this.data['professor'])
        // this.materias.forEach(element => {
        //     console.log(element.temProfessor)
        //     if(element.temProfessor){
        //         element.profId = this.data['professor'].id
        //     }else{
        //         element.profId = 0
        //     }
        // });

        // console.log(this.materias)
        this.initProgressBar = 'visible'

        this.disabledSaveButton = true
        this._http.put(`${this.baseUrl}/pedag/turma/materias/${this.data['turmaId']}/${this.data['professor'].id}`, this.materias, {

        })
            .subscribe(
                (result) => {

                    //  console.log(result)

                },
                (error) => {
                    // console.log(error) 
                },
                () => {
                    this._dialogRef.close({ clicked: true, profsIds: this.listProfId });
                }
            )


    }

    listProfId: number[] = new Array<number>()

    onCheckboxChange(event: any) {
        //console.log(profId)
        // console.log(event.checked)
        // console.log(this.materias)
        // console.log(this.data['professor'])
        // if (event.checked) {
        //     this.listProfId.push(profId)
        // } else {
        //     let index = this.listProfId.indexOf(profId)
        //     this.listProfId.splice(index, 1);
        // }

        // console.log(this.listProfId)
    }
}