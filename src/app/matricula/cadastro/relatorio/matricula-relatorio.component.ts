import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { MatriculaService } from "../../services/matricula.service";
import { AdmService } from "src/app/administrativo/services/adm.service";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";


@Component({
    selector: 'createnovamatriculamodal',
    templateUrl: './matricula-relatorio.component.html',
    styleUrls: ['./matricula-relatorio.component.scss'],
    animations: [HighlightTrigger]
})

export class RelatorioMatriculaComponent implements OnInit {

    public initProgressBar = 'visible'
    public showForm = false
    public showTable = false
    public msgNoRegistro = false
    public turmas: any[] = new Array<any>()
    public matriculas: any[] = new Array<any>()

    public pesquisaForm!: FormGroup
    constructor(
        private _matService: MatriculaService,
        private _helper: HelpersService,
        private _admService: AdmService,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<RelatorioMatriculaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.pesquisaForm = _fb.group({
            opcao: ['', [Validators.required]],
            inicio: [''],
            fim: [''],
            turmaId: ['']
        })

        this.pesquisaForm.valueChanges.subscribe(
            (form: any) => {

                console.log('get form valid')
                if (this.pesquisaForm.get('opcao')?.valid) {

                    if (this.pesquisaForm.get('opcao')?.value == 'periodo') {
                        console.log('get form periodo')
                        this.pesquisaForm.get('inicio')?.setValidators([Validators.required]);
                        this.pesquisaForm.get('fim')?.setValidators([Validators.required]);
                        this.pesquisaForm.get('turmaId')?.setValidators([]);


                    } else {
                        console.log('get form turma')
                        this.pesquisaForm.get('inicio')?.setValidators([]);
                        this.pesquisaForm.get('fim')?.setValidators([]);
                        this.pesquisaForm.get('turmaId')?.setValidators([Validators.required]);

                    }

                }
            }
        );

    }

    ngOnInit() {

        this.GetTurmasDaUnidade();
    }

    public GetTurmasDaUnidade() {

        this._admService.GetTodasTurmasDaUnidade()
            .subscribe(
                sucesso => { this.GetTurmasSucesso(sucesso) },
                falha => { this.GetTurmasFalha(falha) }
            )
    }

    private GetTurmasSucesso(resp: any) {

        this.turmas = resp['turmas']
        this.initProgressBar = 'hidden'
        this.showForm = true

    }

    private GetTurmasFalha(error: any) {
        this.initProgressBar = 'hidden'
        this._helper.openSnackBarErrorDefault()
    }

    public Pesquisar(form: any) {
        console.log('pesquisar...')
        if (this.pesquisaForm.valid) {
            console.log('pesquisando...')
            this.initProgressBar = 'visible'
            this.msgNoRegistro = false
            this._matService.GetMatriculaRelatorio(this.pesquisaForm.value)
                .subscribe(
                    sucesso => { this.PesquisarSucesso(sucesso) },
                    falha => { this.PesquisarFalha(falha) }
                )
        }
    }

    private PesquisarSucesso(resp: any) {
        this.matriculas = resp['matriculas']
        this.initProgressBar = 'hidden'
        this.showTable = false
        this.dialogRef.addPanelClass('relatmatricula-class')
        this.showTable = true

    }

    private PesquisarFalha(error: any) {
        this.initProgressBar = 'hidden'
        this.showTable = false
        if (error['status'] == 404) { // relatsemmatricula
            // this.dialogRef.addPanelClass('relatsemmatricula-class')
            this.msgNoRegistro = true
        } else {
            // this.dialogRef.addPanelClass('relatsemmatricula-class')
            this._helper.openSnackBarErrorDefault()
        }
    }



}

