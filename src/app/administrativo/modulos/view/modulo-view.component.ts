import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder,  FormGroup, Validators } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { AdmService } from "../../services/adm.service";
import { TitularDoc } from "src/app/_shared/models/perfil.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";

// export const Modalidade = [
//     { type: 'Presencial', value: 'Presencial' },
//     { type: 'On-line', value: 'On-line' }

// ]


@Component({
    selector: 'visualizarmodal',
    templateUrl: './modulo-view.component.html',
    styleUrls: ['./modulo-view.component.scss']
})

export class ModuloViewComponent extends BaseComponent implements OnInit {


    // initProgressBar = 'visible'
    // public moduloForm: FormGroup;
    // public addMateriaForm: FormGroup;
    // public addDocForm: FormGroup;
    // private jwtHelper = new JwtHelperService();
    // public tokenInfo: TokenInfos = new TokenInfos();
    public modulo: any// = new any();
    // materiasTemplate: any//
    public documentos: any//
    // modalidade = Modalidade
    // public titularDoc = TitularDoc
    // showForm = false

    //public initProgressBar = 'visible'
    public saveProgressBar = 'hidden'

    public showContent = false
    public addMateriasForm = false

    public moduloForm: FormGroup;
    public addMateriaForm: FormGroup;
    public addDocForm: FormGroup;

    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();

    public errorMsg: any[] = new Array<any>()
    public unidadesAutorizadas: any[] = new Array<any>();
    public materiasTemplate: any[] = new Array<any>();
    public documentosTemplate: any[] = new Array<any>();
    public typePacote: any

    public typePacotes: any
    public docTemplates: any

    public titularDoc = TitularDoc

    constructor(
        private _admService: AdmService,
        override _snackBar: MatSnackBar,
        //private router: Router,
        private _fb: FormBuilder,
        //private _http: HttpClient,
        public dialogRef: MatDialogRef<ModuloViewComponent>,
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
            dataCriacao: [''],
            totalHoras: [''],
            typePacoteId: ['', [Validators.required]],
            unidadeId: ['', [Validators.required]],
            ativo: [''],

            materias: this._fb.array([], [Validators.required]),
            documentosExigidos: this._fb.array([])

        })
    }  

    ngOnInit() {
        //const token: any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)
        //console.log(this.data)
        this.GetEditPacoteView(this.data['modulo'].id)
    }

    GetEditPacoteView(pacoteId:any) {

        this._admService.GetEditModuleViewModel(pacoteId)
            .subscribe(
                sucesso => { this.GetEditPacoteViewSucesso(sucesso) },
                error => { this.GetEditPacoteViewErro(error) })
    }

    GetEditPacoteViewSucesso(response: any) {
        this.modulo = response['pacote']
        this.materiasTemplate = response['materias']
        this.documentos = response['docs']
        this.typePacote = response['typePacote']


        this.MappingForm();
    }

    GetEditPacoteViewErro(error: any){
        this.initProgressBar = 'hidden'
        //console.log(error)
    }

    MappingForm(){
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
        
        this.initProgressBar = 'hidden'
        this.dialogRef.addPanelClass('modulo-view-class')
        this.showContent = true
        this.addMateriasForm = true
    }


    get materias() {
        return this.moduloForm.controls["materias"] as FormArray;
    }

    get documentosExig() {
        return this.moduloForm.controls["documentosExigidos"] as FormArray;
    }

    addDocumentacaoInitial(form: any) {

        let pacote = form//.value['pacote']

        // if (form.valid) {
        //     let pacotId = this.materias.value.find(element =>
        //         element.materiaId == pacote.id);
        //         if (pacotId != undefined) return;
        //     }


        const docsForm = this._fb.group({
            id: [pacote.id],
            descricao: [pacote.descricao],
            comentario: [pacote.comentario],
            titular: [pacote.titular],
            validadeDias: [pacote.validadeDias],
            obrigatorioParaMatricula: [pacote.obrigatorioParaMatricula],
            pacoteId: [pacote.pacoteId],


        });

        this.documentosExig.push(docsForm);
        //}

    }

    addMateriaInitial(form: any) {

        let pacote = form//.value['pacote']

        // if (form.valid) {
        //     let pacotId = this.materias.value.find(element =>
        //         element.materiaId == pacote.id);
        //         if (pacotId != undefined) return;
        //     }


        const matForm = this._fb.group({
            id: [pacote.id],
            materiaId: [pacote.materiaId],
            nome: [pacote.nome],
            descricao: [pacote.descricao],
            modalidade: [pacote.modalidade],
            cargaHoraria: [pacote.cargaHoraria],
            pacoteId: [pacote.pacoteId],
            ordem:[pacote.ordem]
        });

        this.materias.push(matForm);
        //}
    }

    addMateria(form: any) {

        let pacote = form.value['pacote']

        if (form.valid) {
            let pacotId = this.materias.value.find((element:any) =>
                element.materiaId == pacote.id);

            if (pacotId != undefined) return;

            const matForm = this._fb.group({
                id: [pacote.id],
                materiaId: [pacote.materiaId],
                nome: [pacote.nome],
                descricao: [pacote.descricao],
                modalidade: [pacote.modalidade],
                cargaHoraria: [pacote.cargaHoraria],
                pacoteId: [pacote.pacoteId],

            });

            this.materias.push(matForm);
        }
    }

    addDocumentos(form: any) {

        let pacote = form.value
        

        // if (form.valid) {
        //     let pacotId = this.documentosExig.value.find(element =>
        //         element.materiaId == pacote.id);
        //     if (pacotId != undefined) return;
        // }
        //console.log(form.value)

        const docsForm = this._fb.group({
            id: [pacote.id],
            nome:  [pacote.nome],
            descricao: [pacote.descricao],
            titular: ['',[Validators.required]],
            validadeDias: [pacote.modalidade],
            obrigatorioParaMatricula: [false]
        });

        this.documentosExig.push(docsForm);
        //}

    }

    deleteLesson(index: number) {
        this.materias.removeAt(index);
    }

    deleteDocs(index: number) {
        this.documentosExig.removeAt(index);
    }

    get totalHoras() {
        let total = 0

        if (this.moduloForm.get('materias')?.value.length > 0) {
            const sum = this.moduloForm.get('materias')?.value.reduce((horas:any, a:any) => ({
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


    onSubmit(form: any) {

        if(this.moduloForm.valid){

            this._admService.EditPacote(this.moduloForm.value)
                .subscribe(
                    sucesso => { this.onSubmitSucesso(sucesso)},
                    falha => { this.onSubmitErro(falha)})
        }
    }

    onSubmitSucesso(resposta:any){

    }

    onSubmitErro(error:any){

    }





}