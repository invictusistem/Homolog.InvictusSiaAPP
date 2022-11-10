import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { PedagogicoService } from "src/app/pedagogico/services/pedagogico.service";
import { HighlightTrigger } from "src/app/_shared/animation/animation";

@Component({
    selector: 'aulaeditarmodaldialog',
    templateUrl: './aulaeditar.component.html',
    styleUrls: ['./aulaeditar.component.scss'],
    animations: [HighlightTrigger]
})

export class AulaEditarModal implements OnInit {
    
    public initProgressBar = 'visible'
    public disabledProfForm = false
    public saveSpinner = 'hidden'
    public showContent = false
    public aula: any
    public originalAula: any
    public salas: any[] = new Array<any>()
    public materias: any[] = new Array<any>()
    public professores: any[] = new Array<any>()
    public aulaForm!: FormGroup
    constructor(
        private _pedagService: PedagogicoService,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<AulaEditarModal>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.aulaForm = _fb.group({
            id: [''],
            professorId: [''],
            materiaId: [''],
            salaId: [''],
            diaAula:[''],
            horaInicial:['',[Validators.required, Validators.minLength(4)]],
            horaFinal:['',[Validators.required, Validators.minLength(4)]]
        })

        this.aulaForm.valueChanges.subscribe(
            (form: any) => {

                if (this.aulaForm.get('professorId')?.value !=
                    "00000000-0000-0000-0000-000000000000") {

                    this.aulaForm.controls['materiaId'].setValidators([Validators.required])
                } else {
                    this.aulaForm.controls['materiaId'].clearValidators()
                }
            }
        );
    }

    ngOnInit() {
        this.GetAulaInfos()
    }

    get VerificarObrigariedade() {
        if (this.aulaForm.get('professorId')?.value !=
            "00000000-0000-0000-0000-000000000000") {
            return Validators.required
        } else {
            return null
        }
    }

    private GetAulaInfos() {

        this._pedagService.GetAulaEditViewModel(this.data['caled'].id)
            .subscribe(
                sucesso => { this.GetAulaInfosSucesso(sucesso) },
                falha => { this.GetAulaInfosFalha(falha) }
            )
    }

    private GetAulaInfosSucesso(resp: any) {
        this.aula = resp['aula']
        this.salas = resp['salas']
        this.materias = resp['materias']
        this.professores = resp['profsDisponiveis']
        this.aulaForm.get("id")?.setValue(this.aula.id)
        this.aulaForm.get("professorId")?.setValue(this.aula.professorId)
        this.aulaForm.get("materiaId")?.setValue(this.aula.materiaId)
        this.aulaForm.get("salaId")?.setValue(this.aula.salaId)
        this.aulaForm.get("diaAula")?.setValue(this.aula.diaAula)
        this.aulaForm.get("horaInicial")?.setValue(this.aula.horaInicial)
        this.aulaForm.get("horaFinal")?.setValue(this.aula.horaFinal)
        this.originalAula = JSON.parse(JSON.stringify(this.aulaForm.value))
        this.dialogRef.addPanelClass('aulaeditar-class')
        this.initProgressBar = 'hidden'
        this.showContent = true
    }

    private GetAulaInfosFalha(error: any) {

    }

    

    get disabledSaveButton(){

        if (this.aulaForm.valid &&
            JSON.stringify(this.originalAula) !=
            JSON.stringify(this.aulaForm.value)) {

            return this.saveSpinner != 'hidden'
        } else {
            return true
        }
    }

    public ChangeMateria() {
        if (this.aulaForm.get("materiaId")?.value == "00000000-0000-0000-0000-000000000000") {
            this.aulaForm.get("professorId")?.setValue("00000000-0000-0000-0000-000000000000")
            this.disabledProfForm = true
            return;
        }
        this.disabledProfForm = false
        this.aulaForm.get("professorId")?.setValue("00000000-0000-0000-0000-000000000000")

        this._pedagService.GetProfsHabilitados(
            this.aulaForm.get("id")?.value,
            this.aulaForm.get("materiaId")?.value)
            .subscribe(
                sucesso => { this.ChangeMateriaSucesso(sucesso) },
                error => { this.ChangeMateriaError(error) }
            )

        /*
         if - materia == 00000000-0000-0000-0000-000000000000
         se sim = tira o professor e deixa a aula sem professor
         se nao = tira o profe temporariamente, vai no back
                 e pega os prof q podem lecionar aquela matéria
         e se voltar a lita de prof vazia (nao tem prof habilitado para aquela mat?)
         deixa sem professor ?
         */

        /*
        if - professor == 00000000-0000-0000-0000-000000000000
        se sim, deixa do jeito q está podendo salvar sem prof
        se nao - trazer as materias q aquele prof pode dar e nao deixar salvar
        sem matéria
        */

    }

    private ChangeMateriaSucesso(resp:any) {
        this.professores = resp['profsDisponiveis']
    }

    private ChangeMateriaError(error:any) {

        if (error['error'].status == 404) {
            this.professores = new Array<any>()
        }
    }

    public ChangeProfessor(professor:any) {

    }

    public SaveEdit(form:any) {

        this.saveSpinner = 'visible'
        this._pedagService.EditAula(this.aulaForm.value, this.data['caled'].id)
            .subscribe(
                sucesso => { this.SaveEditSucesso(sucesso) },
                falha => { this.SaveEditFalha(falha) }
            )
    }

    private SaveEditSucesso(resp:any) {
        this.saveSpinner = 'hidden'
        this.dialogRef.close({ result: true, aula: resp['aula'] })
    }

    private SaveEditFalha(error:any) {
        this.saveSpinner = 'hidden'
    }
}