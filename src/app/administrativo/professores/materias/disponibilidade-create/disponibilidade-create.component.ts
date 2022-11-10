import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { environment } from "src/environments/environment";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";

@Component({
    selector: 'add-dispomodal',
    templateUrl: './disponibilidade-create.component.html',
    styleUrls: ['./disponibilidade-create.component.scss'],
    animations: [HighlightTrigger]
})

export class AddDispoComponent implements OnInit {

    // SpinnerParam: SpinnerParams = {
    //     diameter: 30,
    //     marginleft: 10,
    //     margintop: 0
    // }
    baseUrl = environment.baseUrl;
    // mostrarModalPrincipal = true
    public unidades: any[] = new Array<any>()
    // public typePacotes: any[] = new Array<any>()
    // public profMaterias: any[] = new Array<any>()
    // public materias: any[] = new Array<any>()
    // private jwtHelper = new JwtHelperService();
    // public tokenInfo: TokenInfos = new TokenInfos();
    public disponibilidadeForm: FormGroup
    // public materiaForm: FormGroup
    // public unidadeForm: FormGroup

    constructor(
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _helper: HelpersService,
        public dialogRef: MatDialogRef<AddDispoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.disponibilidadeForm = _fb.group({
            unidadeId: ['', [Validators.required]],
            pessoaId: [''],
            domingo: [false, [Validators.required]],
            segunda: [false, [Validators.required]],
            terca: [false, [Validators.required]],
            quarta: [false, [Validators.required]],
            quinta: [false, [Validators.required]],
            sexta: [false, [Validators.required]],
            sabado: [false, [Validators.required]]
        })

        this.disponibilidadeForm.valueChanges.subscribe(
            (form: any) => {

                if (this.disponibilidadeForm.get('domingo')?.value == false &&
                    this.disponibilidadeForm.get('segunda')?.value == false &&
                    this.disponibilidadeForm.get('terca')?.value == false &&
                    this.disponibilidadeForm.get('quarta')?.value == false &&
                    this.disponibilidadeForm.get('quinta')?.value == false &&
                    this.disponibilidadeForm.get('sexta')?.value == false &&
                    this.disponibilidadeForm.get('sabado')?.value == false) { //.setErrors({ required: true });

                    this.disponibilidadeForm.get('domingo')?.setErrors({ required: true });
                    this.disponibilidadeForm.get('segunda')?.setErrors({ required: true });
                    this.disponibilidadeForm.get('terca')?.setErrors({ required: true });
                    this.disponibilidadeForm.get('quarta')?.setErrors({ required: true });
                    this.disponibilidadeForm.get('quinta')?.setErrors({ required: true });
                    this.disponibilidadeForm.get('sexta')?.setErrors({ required: true });
                    this.disponibilidadeForm.get('sabado')?.setErrors({ required: true });

                } else { //.setErrors(null);
                    this.disponibilidadeForm.get('domingo')?.setErrors(null);
                    this.disponibilidadeForm.get('segunda')?.setErrors(null);
                    this.disponibilidadeForm.get('terca')?.setErrors(null);
                    this.disponibilidadeForm.get('quarta')?.setErrors(null);
                    this.disponibilidadeForm.get('quinta')?.setErrors(null);
                    this.disponibilidadeForm.get('sexta')?.setErrors(null);
                    this.disponibilidadeForm.get('sabado')?.setErrors(null);
                }
            }
        );


    }

    ngOnInit() {
        this.unidades = this.data['unidades']
        this.disponibilidadeForm.get('pessoaId')?.setValue(this.data['prof'].id)
        // console.log(this.unidades)
        // const token = localStorage.getItem('jwt')
        // this.tokenInfo = this.jwtHelper.decodeToken(token)
        //this.dialogRef.removePanelClass('my-class')
        //this.dialogRef.addPanelClass('my-class')
        // this.GetInfos()
    }

    // verDispo(){
    //     console.log(this.disponibilidadeForm.value)
    // }

    disabledSaveButton = false
    get disabledButton() {
        if (this.disponibilidadeForm.valid) {
            return this.disabledSaveButton
        } else {
            return true
        }
    }

    onSubmit() {

        if (this.disponibilidadeForm.valid) {
            this.disabledSaveButton = true

            this._http.post(`${this.baseUrl}/professor/disponibilidade`, this.disponibilidadeForm.value, {})
                .subscribe(resp => {

                },
                    (error) => { },
                    () => {
                        this._helper.openSnackBarSucesso('Disponibilidade salva com sucesso')
                        this.dialogRef.close({ clicked: "Ok" });
                    })

        }

    }


    // showAddIcon = false
    // clearFilter(typeId) {

    //     if (typeId == '') {
    //         this.materias = new Array<any>()
    //         this.showAddIcon = false
    //         this.materiaForm.get('materiaId').setValue('')
    //         return;
    //     }
    //     this.materias = new Array<any>()
    //     console.log(typeId)
    //     this.materiaForm.get('materiaId').setValue('')
    //     this._http.get(`${this.baseUrl}/materia-template/filtro/${typeId}`)
    //         .subscribe(resp => {
    //             this.materias = resp['materias']

    //         },
    //             (error) => { },
    //             () => {


    //                 // console.log(this.unidades)
    //                 // this.mostrarModalPrincipal = false
    //                 // this.dialogRef.addPanelClass('my-class')
    //             })


    // }

    // addMateria(mat) {
    //     if (mat == '') {
    //         //this.materias = new Array<any>()
    //         this.showAddIcon = false
    //         return;
    //     }
    //     this.showAddIcon = true


    // }

    // adicionar() {

    //     var mat = this.profMaterias.find(element => element.pacoteMateriaId == this.materiaForm.get('materiaId').value)
    //     console.log(mat)

    //     if (mat == undefined) {
    //         this._http.post(`${this.baseUrl}/professor/materia/${this.data['prof'].id}/${this.materiaForm.get('materiaId').value}`, {})
    //             .subscribe(resp => {

    //             },
    //                 (error) => { },
    //                 () => {
    //                     this.GetProfessorMaterias();
    //                 })
    //     }
    // }

    // adicionarUnidade() {
    //     console.log()
    // }

    // GetInfos() {

    //     this._http.get(`${this.baseUrl}/professor/materias/${this.data['prof'].id}`)
    //         .subscribe(resp => {
    //             this.unidades = resp['unidades']
    //             this.typePacotes = resp['typePacotes']
    //             this.profMaterias = resp['profMaterias']
    //         },
    //             (error) => { },
    //             () => {
    //                 console.log(this.profMaterias)
    //                 this.mostrarModalPrincipal = false
    //                 this.dialogRef.addPanelClass('my-class')
    //             })

    // }

    // removeMateria(profMateriaId) {

    //     this._http.delete(`${this.baseUrl}/professor/materia/${profMateriaId}`, {})
    //         .subscribe(resp => {
    //             //  this.unidades = resp['unidades']
    //             // this.typePacotes = resp['typePacotes']
    //         },
    //             (error) => { },
    //             () => {
    //                 this.GetProfessorMaterias();
    //                 //console.log(this.unidades)
    //                 //  this.mostrarModalPrincipal = false
    //                 // this.dialogRef.addPanelClass('my-class')
    //             })

    // }

    // GetProfessorMaterias() {
    //     this._http.get(`${this.baseUrl}/professor/materias-professor/${this.data['prof'].id}`)
    //         .subscribe(resp => {
    //             //  this.unidades = resp['unidades']
    //             // this.typePacotes = resp['typePacotes']
    //             this.profMaterias = resp['profMaterias']
    //         },
    //             (error) => { },
    //             () => {
    //                 //  console.log(this.unidades)
    //                 //  this.mostrarModalPrincipal = false
    //                 //  this.dialogRef.addPanelClass('my-class')
    //             })
    // }

}