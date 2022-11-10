import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { NgForm } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { ConfirmModalComponent } from "src/app/_shared/components/modal-confirmar-v2/confirm-modal.component";
import { AddProfessorModalComponent } from "./add-professor/addprof.component";
import { AddPMateriaModalComponent } from "./add-materia/addmateria.component";
import { OpenAddMateriaModalConfig, OpenAddProfModalConfig } from "../../services/adm-modal";

@Component({
    selector: 'editcursomodal',
    templateUrl: './turma-edit.component.html',
    styleUrls: ['./turma-edit.component.scss'],
    animations: [HighlightTrigger]
})

export class EditCursoComponent implements OnInit {

    // pageSize: number = 5;
    // genericTasks: GenericTask[] = new Array<GenericTask>();
    // length: number;
    // pageEvent: PageEvent;
    //editedColaborador: Colaborador = new Colaborador();
    public initProgressBar = 'visible'
    public showContent = false
    turma: any;// TurmaViewModel = new TurmaViewModel()
    turmaView: any;
    view: Views = new Views();
    alunos: any[] = new Array<any>();
    professores: any[] = new Array<any>();
    previsaoTermino = "Previsão de início 1: 01/05/2021"
    BaseUrl = environment.baseUrl
    ativo = true;
    pageEvent!: PageEvent;
    length = 0;
    pageSize = 5;
    selectedPage = 1
    mensagemSemProfessores = false
    mostrarModalPrincipal = true

    constructor(
        private _http: HttpClient,
        private _helper: HelpersService,
        public _modal: MatDialog,
        public dialogRef: MatDialogRef<EditCursoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) { }

    //@Output() newItemEvent = new EventEmitter<string>();


    ngOnInit() {
        this.ativo = true;
      //  console.log(this.data['turma'])
       // this.turma = this.data['turma']
        // this.getAlunosDaTurma(this.data['turma'].id)
        //this.getCursoById(this.data['turma'].id)
        //this.getProfessores(this.data['turma'].id)

        this.GetInformacoesDaTurma(this.data['turma'].id);
    }

    GetInformacoesDaTurma(turmaId:any) {

        this._http.get(`${this.BaseUrl}/turma/info/${turmaId}`)
            .subscribe(
                (response:any) => {
                    // console.log(response)
                    // this.professores = new Array<Professor>();
                    // Object.assign(this.professores, response)
                    this.turma = response['turma']
                   // console.log(this.turma)
                    this.alunos = response['alunos']
                    this.professores = response['professores']

                },
                (error) => {
                   // console.log(error)
                    //this.initProgressBar = 'hidden'
                },
                () => {
                    this.disabledDeletProf = false
                    this.mostrarModalPrincipal = false
                    this.initProgressBar = 'hidden'
                    this.showContent = true
                    this.dialogRef.addPanelClass('myeditturma-class')
                    // console.log(this.professores)
                    // this.length = this.professores.length
                    // console.log(this.length)

                    // if(this.length == 0){
                    //     this.mensagemSemProfessores = true
                    // }else{
                    //     this.mensagemSemProfessores = false
                    // }

                    // console.log(this.length)
                }
            )
    }

    get professoresSlice(): any[] {
        let pageIndex = (this.selectedPage - 1) * this.pageSize
        //console.log(pageIndex)
        return this.professores.slice(pageIndex, pageIndex + this.pageSize);
    }

    changePage(evento: any) {
     //   console.log(evento["pageIndex"])
        this.selectedPage = evento["pageIndex"] + 1//newPage;
        //             console.log('ok get');
        //             this.showSpinner = false
        //             this.pageIndexNumber = (evento.pageIndex * this.pageSize)

    }


    vagas!: string;
    previ1!: string;
    previ2!: string;
    previ3!: string;
    previQuadro1linethrough!: boolean
    previQuadro1Color!: boolean
    previQuadro1Proximo!: boolean

    previQuadro2linethrough!: boolean
    previQuadro2Color!: boolean
    previQuadro2Proximo!: boolean

    previQuadro3linethrough!: boolean
    previQuadro3Color!: boolean
    previQuadro3Proximo!: boolean

    getProfessores(turmaId: any) {

      //  console.log('get alunos turma')
        //alunosturma
        this._http.get(`${this.BaseUrl}/turmas/professoresturma/${turmaId}`)
            .subscribe(
                (response) => {
                  //  console.log(response)
                    this.professores = new Array<any>();
                    Object.assign(this.professores, response)

                },
                (error) => {
                  //  console.log(error)
                },
                () => {
                   // console.log(this.professores)
                    this.length = this.professores.length
                   // console.log(this.length)

                    if (this.length == 0) {
                        this.mensagemSemProfessores = true
                    } else {
                        this.mensagemSemProfessores = false
                    }

                   // console.log(this.length)
                }
            )
    }

    // get vagasMatriculados() {

    //     return `${this.data['turma'].vagas}/${this.data['turma'].totalAlunos}`
    // }

    get duracaomsg() {

        return `Turma iniciada em ${new Date(this.data['turma'].previsaoAtual).toLocaleString('pt-BR', {
            day: 'numeric', // numeric, 2-digit
            year: 'numeric', // numeric, 2-digit
            month: 'numeric'
        })} com previsão de término em ${new Date(this.data['turma'].previsaoTerminoAtual).toLocaleString('pt-BR', {
            day: 'numeric', // numeric, 2-digit
            year: 'numeric', // numeric, 2-digit
            month: 'numeric'
        })}`
    }

    excluirProfessorDaTurma(profId:any) {




    }

    disabledDeletProf = false
    confirmModal(prof?: any): void {
        const dialogRef = this._modal
            .open(ConfirmModalComponent, {
                height: 'auto',
                width: '500px',

                data: {
                    msg: "Confirmar exclusão do professor da turma?",
                    url: `${this.BaseUrl}/pedag/turma/professor/${prof.id}/${this.data['turma'].id}`
                },
                hasBackdrop: true,
                disableClose: true
            });

        dialogRef.afterClosed().subscribe((data) => {
          //  console.log(data)
            if (data.clicked == true) {
                this.disabledDeletProf = true
                this._helper.openSnackBarSucesso('Professor excluído com sucesso')
                //let profIndex = this.professores.findIndex(prof)
                //this.professores.splice(profIndex, 1)
                this.GetInformacoesDaTurma(this.data['turma'].id);


            }
        });
    }


    getCursoById(id: any) {
       // console.log(id)
        this._http.get(`${this.BaseUrl}/turmas/${id}`)
            .subscribe(
                (response) => {
                   // console.log(response)
                    this.turma = Object.assign({}, response as any);
                },
                (error) => { },
                () => {
                    this.vagas = `${this.turma.vagas}/${this.turma.totalAlunos}`
                    this.descricaoCompleta = `Turma ${this.turma.identificador} (${this.turma.descricao})`
                    this.previ1 = `Previsão de início 1: ${new Date(this.turma.previsoes.previsionStartOne).toLocaleDateString()}`

                    this.previ2 = `Previsão de início 2: ${new Date(this.turma.previsoes.previsionStartTwo).toLocaleDateString()}`

                    this.previ3 = `Previsão de início 3: ${new Date(this.turma.previsoes.previsionStartThree).toLocaleDateString()}`

                 //   console.log(this.previ1)

                    if (this.turma.previsao == '1ª previsão') {
                        this.previQuadro1linethrough = false
                        this.previQuadro1Color = false
                        this.previQuadro1Proximo = true

                        this.previQuadro2linethrough = false
                        this.previQuadro2Color = false
                        this.previQuadro2Proximo = false

                        this.previQuadro3linethrough = false
                        this.previQuadro3Color = false
                        this.previQuadro3Proximo = false

                    } else if (this.turma.previsao == '2ª previsão') {
                        this.previQuadro1linethrough = true
                        this.previQuadro1Color = true
                        this.previQuadro1Proximo = false

                        this.previQuadro2linethrough = false
                        this.previQuadro2Color = false
                        this.previQuadro2Proximo = true

                        this.previQuadro3linethrough = false
                        this.previQuadro3Color = false
                        this.previQuadro3Proximo = false

                    } else if (this.turma.previsao == '3ª previsão') {
                        this.previQuadro1linethrough = true
                        this.previQuadro1Color = true
                        this.previQuadro1Proximo = false

                        this.previQuadro2linethrough = true
                        this.previQuadro2Color = true
                        this.previQuadro2Proximo = false

                        this.previQuadro3linethrough = false
                        this.previQuadro3Color = false
                        this.previQuadro3Proximo = true
                    }
                }
            )
    }

    descricaoCompleta: string = ""
    getAlunosDaTurma(turmaId: any) {
       // console.log('get alunos turma')
        // alunosturma
        this._http.get(`${this.BaseUrl}/turmas/alunosturma/?turmaId=${turmaId}`)
            .subscribe(
                (response) => {
                  //  console.log(response)

                    Object.assign(this.alunos, response)

                },
                (error) => { 
                    //console.log(error) 
                },
                () => {
                   // console.log(this.alunos)

                }
            )
    }

    openAddProfModal(): void {
        const dialogRef = this._modal
            .open(AddProfessorModalComponent, OpenAddProfModalConfig(this.data['turma'].id));
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data["clicked"] == true) {
                // console.log(result["profsIds"])
                 //this.saveProfs(result["profsIds"])
                 this.GetInformacoesDaTurma(this.data['turma'].id);
             }
        });
    }

    openAddMateriaModal(prof:any): void {
        const dialogRef = this._modal
            .open(AddPMateriaModalComponent, OpenAddMateriaModalConfig(this.data['turma'].id, prof));
        dialogRef.afterClosed().subscribe((result:any) => {
            if (result["clicked"] == true) {
                // console.log(result["profsIds"])
                 this.GetInformacoesDaTurma(this.data['turma'].id);
             }
        });
    }

    saveProfs(profIds: number[]) {
       // console.log(this.data['turma'].id)
      //  console.log(profIds)
        var saveProfs: SaveProfsCommand = new SaveProfsCommand();
        saveProfs.turmaId = this.data['turma'].id
        saveProfs.listProfsIds = profIds
       // console.log(saveProfs)
        this._http.post(`${this.BaseUrl}/pedag/turma/professores`, saveProfs, {

        })
            .subscribe(
                (response) => {
                   // console.log(response)

                    //

                },
                (error) => {
                    // console.log(error)
                     },
                () => {

                    this.GetInformacoesDaTurma(this.data['turma'].id);
                    //console.log(this.alunos)

                }
            )
    }


    submitForm(form: NgForm) {
        if (form.valid) {
          //  console.log('form valid')
            // this.model.saveProduct(this.product);
            // //this.product = new Product();
            // //form.reset();
            // this.originalProduct = this.product;
            // this.router.navigateByUrl("/");
        }
    }

}

export class SaveProfsCommand {
    constructor(
        public turmaId?: number,
        public listProfsIds?: number[]
    ) { }

}


export class Views {
    constructor(
        public descricaoCompleta?: string
    ) {

    }
}