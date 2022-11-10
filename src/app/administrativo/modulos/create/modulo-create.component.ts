import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AdmService } from "../../services/adm.service";
import { TitularDoc } from "src/app/_shared/models/perfil.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
    selector: 'modulocreatemodal',
    templateUrl: './modulo-create.component.html',
    styleUrls: ['./modulo-create.component.scss']
})

export class ModuloCreateComponent extends BaseComponent implements OnInit {

    public saveProgressBar = 'hidden'

    public showContent = false
    public addMateriasForm = false

    public moduloForm: FormGroup;
    public addMateriaForm: FormGroup;
    public addDocForm: FormGroup;

    public errorMsg: any[] = new Array<any>()
    public unidadesAutorizadas: any[] = new Array<any>();
    public materiasTemplate: any[] = new Array<any>();
    public documentosTemplate: any[] = new Array<any>();

    public typePacotes: any
    public docTemplates: any

    public titularDoc = TitularDoc

    constructor(
        override _snackBar: MatSnackBar,
        private _admService: AdmService,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<ModuloCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(_snackBar);
        this.addMateriaForm = _fb.group({
            pacote: ['', [Validators.required]]
        })

        this.addDocForm = _fb.group({
            documento: ['', [Validators.required]]
        })

        this.moduloForm = _fb.group({
            descricao: ['', [Validators.required]],
            totalHoras: [''],
            typePacoteId: ['', [Validators.required]],            
            ativo: [true],

            materias: this._fb.array([], [Validators.required]),
            documentosExigidos: this._fb.array([])

        })
    }

    ngOnInit() {
        this.unidadesAutorizadas = JSON.parse(this.tokenInfo.UnidadesAutorizadas as string)
        this.GetViewModels()
    }

    get materias() {
        return this.moduloForm.get('materias') as FormArray;
    }
    get documentos() {
        return this.moduloForm.controls["documentosExigidos"] as FormArray;
    }

    addMateria(form: any) {

        let pacote = form.value['pacote']

        if (form.valid) {
            let pacotId = this.materias.value.find((element: any) => 
                element.materiaId == pacote.id);

            if (pacotId != undefined) return;

            const matForm = this._fb.group({

                materiaId: [pacote.id],
                nome: [pacote.nome],
                descricao: [pacote.descricao],
                modalidade: [pacote.modalidade],
                cargaHoraria: [pacote.cargaHoraria],
                typePacoteId: [pacote.typePacoteId],

            });

            this.materias.push(matForm);
            //var index = this.materias.controls.indexOf(matForm); // 0

        }
    }

    addDocumentos(form: any) {

        let documento = form.value['documento']

        if (form.valid) {

            const docsForm = this._fb.group({
                obrigatorioParaMatricula: [false],
                descricao: [documento.nome],
                comentario: ['', [Validators.required]],
                titular: ['', [Validators.required]],
                validadeDias: [documento.validadeDias]
            });

            this.documentos.push(docsForm);
        }
    }

    deleteLesson(index: number) {
        this.materias.removeAt(index);
    }
    deleteDocumento(index: number) {
        this.documentos.removeAt(index);
    }

    drop(event: CdkDragDrop<string[]>) {
        moveItemInFormArray(this.materias, event.previousIndex, event.currentIndex);
    }

    get totalHoras() {
        let total = 0

        if (this.moduloForm.get('materias')?.value.length > 0) {
            const sum = this.moduloForm.get('materias')?.value.reduce((horas: any, a: any) => ({
                cargaHoraria: horas.cargaHoraria + a.cargaHoraria
            }));

            if (sum != null) {
                total = sum['cargaHoraria']
            } else {
                total = 0
            }
        }

        this.moduloForm.get('totalHoras')?.setValue(total)

        return total
    }


    get disabledSave() {

        if (this.saveProgressBar == 'visible') return true

        if (this.moduloForm.valid) return false

        return true
    }

    GetViewModels() {

        this._admService.GetCreateModuleViewModel()
            .subscribe(
                sucesso => { this.GetViewModelsSucesso(sucesso) },
                erro => { this.GetViewModelsErro(erro) })
    }

    GetViewModelsSucesso(response: any) {
        this.typePacotes = response['typePacotes']
        this.docTemplates = response['documentos']

        this.initProgressBar = 'hidden'
        this.dialogRef.addPanelClass('mymodulocreate-class')
        this.showContent = true

    }

    GetViewModelsErro(error: any) {
        this.initProgressBar = 'hidden'
    }

    buscarMaterias(typePacoteId: any) {
        this.materias.clear()
        this.initProgressBar = 'visible'
        this._admService.GetMateriasByTypeId(typePacoteId)
            .subscribe(
                sucesso => { this.buscarMateriasSucesso(sucesso) },
                erro => { this.buscarMateriasErro(erro) })
    }

    buscarMateriasSucesso(resposta: any) {
        this.materiasTemplate = resposta['materias']
        this.initProgressBar = 'hidden'
        this.addMateriasForm = true
    }

    buscarMateriasErro(error: any) {
        this.initProgressBar = 'hidden'
    }

    onSubmit(form: any) {
        if (form.valid) {
            this.saveProgressBar = 'visible'
            this._admService.SavePacote(this.moduloForm.value)
                .subscribe(
                    sucesso => { this.onSubmitSucesso(sucesso) },
                    erro => { this.onSubmitErro(erro) })
        }
    }

    onSubmitSucesso(resposta: any) {
        this.dialogRef.close({ clicked: true });
        this.saveProgressBar = 'hidden'
    }

    onSubmitErro(error: any) {
        if (error['status'] == 409) {
            this.errorMsg = error['error'].erros
        }
        this.saveProgressBar = 'hidden'

    }

}

export function moveItemInFormArray(
    formArray: FormArray,
    fromIndex: number,
    toIndex: number
): void {
    const dir = toIndex > fromIndex ? 1 : -1;

    const item = formArray.at(fromIndex);
    for (let i = fromIndex; i * dir < toIndex * dir; i = i + dir) {
        const current = formArray.at(i + dir);
        formArray.setControl(i, current);
    }
    formArray.setControl(toIndex, item);
}