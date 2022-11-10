import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { AdmService } from "../../services/adm.service";
import { TitularDoc } from "src/app/_shared/models/perfil.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { CdkDragDrop } from '@angular/cdk/drag-drop';

@Component({
    selector: 'moduloeditmodal',
    templateUrl: './modulo-edit.component.html',
    styleUrls: ['./modulo-edit.component.scss']
})

export class ModuloEditComponent extends BaseComponent implements OnInit {

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

    public typePacote: any
    public docTemplates: any

    public titularDoc = TitularDoc

    public modulo: any// = new any();
    // materiasTemplate: any//
    //public documentos: any//

    constructor(
        private _admService: AdmService,
        override _snackBar: MatSnackBar,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<ModuloEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(_snackBar);
        this.addMateriaForm = _fb.group({
            pacote: ['', [Validators.required]]
        })

        this.addDocForm = _fb.group({
            documento: ['', [Validators.required]]
        })

        this.moduloForm = _fb.group({
            id: [''],
            descricao: ['', [Validators.required]],
            totalHoras: [''],
            typePacoteId: ['', [Validators.required]],
            ativo: [''],

            unidadeId: ['', [Validators.required]],
            dataCriacao: [''],

            materias: this._fb.array([], [Validators.required]),
            documentosExigidos: this._fb.array([])

        })
    }

    ngOnInit() {

        this.GetEditPacoteView(this.data['moduloId'])
    }

    //#region 
    GetEditPacoteView(pacoteId: any) {

        this._admService.GetEditModuleViewModel(pacoteId)
            .subscribe(
                sucesso => { this.GetEditPacoteViewSucesso(sucesso) },
                error => { this.GetEditPacoteViewErro(error) })
    }

    GetEditPacoteViewSucesso(response: any) {
        this.modulo = response['pacote']
        this.materiasTemplate = response['materias']
        this.docTemplates = response['docs']
        this.typePacote = response['typePacote']

        this.MappingForm();
    }

    GetEditPacoteViewErro(error: any) {
        this.initProgressBar = 'hidden'
        //console.log(error)
    }
originalform:any
    MappingForm() {
        this.modulo.materias.forEach((element: any) => {
            this.addMateriaInitial(element)
        });

        this.modulo.documentosExigidos.forEach((element: any) => {
            this.addDocumentacaoInitial(element)
        });

        this.moduloForm.get('id')?.setValue(this.modulo.id)
        this.moduloForm.get('descricao')?.setValue(this.modulo.descricao)
        this.moduloForm.get('dataCriacao')?.setValue(this.modulo.dataCriacao)
        this.moduloForm.get('totalHoras')?.setValue(this.modulo.totalHoras)
        this.moduloForm.get('typePacoteId')?.setValue(this.modulo.typePacoteId)
        this.moduloForm.get('unidadeId')?.setValue(this.modulo.unidadeId)
        this.moduloForm.get('ativo')?.setValue(this.modulo.ativo)


        //this.colaboradorForm.patchValue(response['colaborador']);
        this.originalform = JSON.parse(JSON.stringify(this.moduloForm.value))


        this.initProgressBar = 'hidden'
        this.dialogRef.addPanelClass('mymoduloedit-class')
        this.showContent = true
        this.addMateriasForm = true
    }

    addMateriaInitial(form: any) {

        let pacote = form//.value['pacote']

        // if (form.valid) {
        //     let pacotId = this.materias.value.find(element =>
        //         element.materiaId == pacote.id);
        //         if (pacotId != undefined) return;
        //     }


        const matForm = this._fb.group({
            //id: [pacote.id],
            materiaId: [pacote.materiaId],
            nome: [pacote.nome],
            descricao: [pacote.descricao],
            modalidade: [pacote.modalidade],
            cargaHoraria: [pacote.cargaHoraria],
            //pacoteId: [pacote.pacoteId],
            //ordem: [pacote.ordem]
        });

        this.materias.push(matForm);
        //}
    }

    addDocumentacaoInitial(form: any) {

        let pacote = form//.value['pacote']

        // if (form.valid) {
        //     let pacotId = this.materias.value.find(element =>
        //         element.materiaId == pacote.id);
        //         if (pacotId != undefined) return;
        //     }


        const docsForm = this._fb.group({
           // id: [pacote.id],
           obrigatorioParaMatricula: [pacote.obrigatorioParaMatricula],
            descricao: [pacote.descricao],
            comentario: [pacote.comentario],
            titular: [pacote.titular],
            validadeDias: [pacote.validadeDias],
           
           // pacoteId: [pacote.pacoteId],


        });

        this.documentos.push(docsForm);
        //}

    }

//#endregion
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
                //id: [pacote.id],
                materiaId: [pacote.id],
                nome: [pacote.nome],
                descricao: [pacote.descricao],
                modalidade: [pacote.modalidade],
                cargaHoraria: [pacote.cargaHoraria],
                //pacoteId: [pacote.pacoteId],

            });

            this.materias.push(matForm);
        }
    }

    addDocumentos(form: any) {

        let documento = form.value['documento']

        if (form.valid) {

            const docsForm = this._fb.group({
                //id: [documento.id],
                obrigatorioParaMatricula: [false],
                //nome: [documento.nome],
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

        if (this.moduloForm.valid &&
            JSON.stringify(this.originalform) !=
            JSON.stringify(this.moduloForm.value)) {

            return this.saveProgressBar != 'hidden'
        } else {
            return true
        }
    }


    onSubmit(form: any) {
        console.log(JSON.stringify(this.moduloForm.value))
        if (this.moduloForm.valid) {
            this.saveProgressBar = 'visible'
            this._admService.EditPacote(this.moduloForm.value)
                .subscribe(
                    sucesso => { this.onSubmitSucesso(sucesso) },
                    falha => { this.onSubmitErro(falha) })
        }
    }

    onSubmitSucesso(resposta: any) {
        this.OpenSnackBarSucesso("Pacote editado com sucesso.")
        this.dialogRef.close({ saved: true })
    }

    onSubmitErro(error: any) {
        this.saveProgressBar = 'hidden'
        this.OpenSnackBarErrorDefault()
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