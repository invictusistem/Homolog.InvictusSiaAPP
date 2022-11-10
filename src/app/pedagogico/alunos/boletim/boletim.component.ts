import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup } from "@angular/forms";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";

@Component({
    selector: 'boletimalunomodal',
    templateUrl: './boletim.component.html',
    styleUrls: ['./boletim.component.scss'],
    animations: [HighlightTrigger]
})

export class BoletimAlunoComponent implements OnInit {

    baseUrl = environment.baseUrl;
    // tabs = ['Financeiro', 'Responsável Financeiro', 'Responsável (menor)'
    //     , 'Financeiro', 'Documentação'];
    public initProgressBar = 'visible'
    public showForm = false
    public showAluno: boolean = false
    public showRespFinanc: boolean = false
    public showRespMenor: boolean = false
    public nome: string = ''
    public aluno: any// = new Aluno();
    public debitos: any[] = new Array<any>();
    public notasBoletim: any[] = new Array<any>();
    public turma: any;
    public originalAluno: any
    public originalRespFin: any
    public originalRespMenor: any

    private respFinId: number = 0;
    private respMenorId: number = 0;

    public alunoForm!: FormGroup;
    public respFinancForm!: FormGroup;
    public respMenorForm!: FormGroup;

    constructor(
        private _helper: HelpersService,
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _modal: MatDialog,
        // private _service: PedagService,
        public dialogRef: MatDialogRef<BoletimAlunoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {


    }

    ngOnInit() {

        //console.log(this.data['aluno'])
        this.aluno = this.data['aluno']
        this.GetBoletim(this.data['aluno'].matriculaId)
    }

    
    private GetBoletim(alunoId: any) {

        this._http.get(`${this.baseUrl}/pedag/aluno/nota/${alunoId}`)
            .subscribe(
                (resp: any) => {
               // console.log(resp)
                this.notasBoletim = resp['notas']
                this.turma = resp['turma']
            },
                (error) => { 
                    //console.log(error) 
                    this.initProgressBar = 'hidden'
                    this._helper.openSnackBarErrorDefault();
                    this.dialogRef.close({clicked: false})    
                },
                () => {
                    this.dialogRef.addPanelClass('boletimaluno-class')
                    this.initProgressBar = 'hidden'
                    this.showForm = true
                })
    }


}