import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { AddDispoComponent } from "./disponibilidade-create/disponibilidade-create.component";
import { EditDispoComponent } from "./disponibilidade-edit/disponibilidade-edit.component";
import { AddMatComponent } from "./create/materia-create.component";
import { PageEvent } from "@angular/material/paginator";
import { OpeEditDispoModalConfig, OpenAddDispoModalConfig, OpenAddMatLoteModalConfig, OpenAddMatModalConfig } from "../../services/adm-modal";
import { MateriaLoteCreateComponent } from "./create-lote/materia-lote-create.component";


@Component({
    selector: 'profmateriasmodal',
    templateUrl: './professor-materia.component.html',
    styleUrls: ['./professor-materia.component.scss'],
    animations: [HighlightTrigger]
})

export class ProfMateriasComponent implements OnInit {

    hide = true;


    // SpinnerParam: SpinnerParams = {
    //     diameter: 30,
    //     marginleft: 10,
    //     margintop: 0
    // }
    baseUrl = environment.baseUrl;
    mostrarModalPrincipal = true
    public unidades: any[] = new Array<any>()
    public typePacotes: any[] = new Array<any>()
    public profMaterias: any[] = new Array<any>()
    public materias: any[] = new Array<any>()
    public disponibilidades: any[] = new Array<any>()
    public initProgressBar = 'visible'
    public editAndSaveBar = 'hidden'
    public showForm = false
    pageEvent: PageEvent = new PageEvent()
    private jwtHelper = new JwtHelperService();
    public tokenInfo: TokenInfos = new TokenInfos();
    public disponibilidadeForm: FormGroup
    public materiaForm: FormGroup
    public unidadeForm: FormGroup

    constructor(
        private _fb: FormBuilder,
        private _helpers: HelpersService,
        private _http: HttpClient,
        private _modal: MatDialog,
        public dialogRef: MatDialogRef<ProfMateriasComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.unidadeForm = _fb.group({
            unidadeId: ['', [Validators.required]],

            //dias

        })
        this.disponibilidadeForm = _fb.group({
            //unidadeId: ['', [Validators.required]],

            //dias

        })
        this.materiaForm = _fb.group({
            materiaId: ['', [Validators.required]],

            //dias

        })
        this.disponibilidadeForm = _fb.group({
            unidadeId: ['', [Validators.required]],

            //dias

        })
    }

    // keywords = new Set(['Domingo', 'Segunda-feira', 'Terça-feira',
    //     'Quarta-feira',
    //     'Quinta-feira',
    //     'Sexta-feira',
    //     'Sábado']);
    //formControl = new FormControl(['angular']);

    //   addKeywordFromInput(event: MatChipInputEvent) {
    //     if (event.value) {
    //       this.keywords.add(event.value);
    //       event.chipInput!.clear();
    //     }
    //   }

    //   removeKeyword(keyword: string) {
    //     this.keywords.delete(keyword);
    //   }

    ngOnInit() {
        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        console.log(this.data['prof'])
        this.GetInfos()
    }

    GetInfos() {

        this._http.get(`${this.baseUrl}/professor/materias/${this.data['prof'].id}`)
            .subscribe((resp: any) => {
                this.unidades = resp['unidades']
                this.typePacotes = resp['typePacotes']
                this.profMaterias = resp['profMaterias']
                this.disponibilidades = resp['disponibilidades']
                this.length = this.profMaterias.length
            },
                (error) => {
                    this.editAndSaveBar = 'hidden'
                    this.showDeleteSpinner = false
                },
                () => {
                    // console.log(this.disponibilidades)
                    this.editAndSaveBar = 'hidden'
                    this.initProgressBar = 'hidden'
                    this.dialogRef.addPanelClass('myprofmateria-class')
                    this.showDeleteSpinner = false
                    this.mostrarModalPrincipal = false

                    this.disabledDelete = false

                    this.showForm = true
                })

    }

    showAddIcon = false
    clearFilter(typeId: any) {

        if (typeId == '') {
            this.materias = new Array<any>()
            this.showAddIcon = false
            this.materiaForm.get('materiaId')?.setValue('')
            return;
        }
        this.materias = new Array<any>()
        //.log(typeId)
        this.materiaForm.get('materiaId')?.setValue('')
        this._http.get(`${this.baseUrl}/materia-template/filtro/${typeId}`)
            .subscribe((resp: any) => {
                this.materias = resp['materias']

            },
                (error) => { },
                () => {


                    // console.log(this.unidades)
                    // this.mostrarModalPrincipal = false
                    // this.dialogRef.addPanelClass('my-class')
                })


    }

    addMateria(mat: any) {
        if (mat == '') {
            //this.materias = new Array<any>()
            this.showAddIcon = false
            return;
        }
        this.showAddIcon = true


    }

    adicionar() {

        var mat = this.profMaterias.find(element => element.pacoteMateriaId == this.materiaForm.get('materiaId')?.value)
        // console.log(mat)

        if (mat == undefined) {
            this._http.post(`${this.baseUrl}/professor/materia/${this.data['prof'].id}/${this.materiaForm.get('materiaId')?.value}`, {})
                .subscribe(resp => {

                },
                    (error) => { },
                    () => {
                        this.GetProfessorMaterias();
                    })
        }
    }

    adicionarUnidade() {
        //  console.log()
    }



    removeMateria(profMateriaId: any) {
        this.showDeleteSpinner = true
        this.editAndSaveBar = 'visible'
        this._http.delete(`${this.baseUrl}/professor/materia/${profMateriaId}`, {})
            .subscribe(resp => {
                //  this.unidades = resp['unidades']
                // this.typePacotes = resp['typePacotes']
            },
                (error) => {
                    this.editAndSaveBar = 'hidden'
                },
                () => {
                    this.GetProfessorMaterias();
                    //console.log(this.unidades)
                    //  this.mostrarModalPrincipal = false
                    // this.dialogRef.addPanelClass('my-class')
                })

    }

    GetProfessorMaterias() {
        this._http.get(`${this.baseUrl}/professor/materias-professor/${this.data['prof'].id}`)
            .subscribe((resp: any) => {
                //  this.unidades = resp['unidades']
                // this.typePacotes = resp['typePacotes']
                this.profMaterias = resp['profMaterias']
                this.length = this.profMaterias.length
            },
                (error) => {
                    this.editAndSaveBar = 'hidden'
                    this.showDeleteSpinner = false
                },
                () => {
                    this.editAndSaveBar = 'hidden'
                    this.showDeleteSpinner = false
                    //  console.log(this.unidades)
                    //  this.mostrarModalPrincipal = false
                    //  this.dialogRef.addPanelClass('my-class')
                })
    }

    openAddDispoModal(): void {
        const dialogRef = this._modal
            .open(AddDispoComponent, OpenAddDispoModalConfig(this.data['prof'], this.unidades));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "Ok") {
                this.GetInfos()
            }
        });
    }

    showDeleteSpinner = false
    get disableDeleteButton() {

        if (this.showDeleteSpinner) return true


        return false
    }

    opeEditDispoModal(dispo: any): void {
        const dialogRef = this._modal
            .open(EditDispoComponent, OpeEditDispoModalConfig(dispo,this.data['prof'].id ));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === true) {
                this._helpers.openSnackBarSucesso("Disponibilidade editada com sucesso")
                //this.atualizarUnidadesDisponiveis();
                this.GetInfos()
                //  this.getColaboradores(1, this.pageSize);
            }
        });
    }




    changePage(event?: any) {
        // console.log(event.pageIndex)
        this.pageIndex = event.pageIndex

        return event
    }

    get profMateriasSlice(): any[] {
        let pageIndex = ((this.pageIndex + 1) - 1) * this.pageSize
        return this.profMaterias.slice(pageIndex, pageIndex + 5);
    }

    disabledDelete = false
    length = 0
    pageSize = 5
    pageIndex = 0


    openAddMatModal(): void {
        const dialogRef = this._modal
            .open(AddMatComponent, OpenAddMatModalConfig(this.data['prof'].id, this.profMaterias));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === true) {
                // this.disabledDelete = false
                //this.atualizarUnidadesDisponiveis();
                this.disabledDelete = true
                this.showDeleteSpinner = true
                this.editAndSaveBar = 'visible'
                this.GetInfos()
                //  this.getColaboradores(1, this.pageSize);
            }
        });
    }


    openAddMatLoteModal(): void {
      const dialogRef = this._modal
          .open(MateriaLoteCreateComponent, OpenAddMatLoteModalConfig(this.data['prof'].id, this.profMaterias));
      dialogRef.afterClosed().subscribe((data) => {
          if (data.clicked === true) {
              // this.disabledDelete = false
              //this.atualizarUnidadesDisponiveis();
              this.disabledDelete = true
              this.showDeleteSpinner = true
              this.editAndSaveBar = 'visible'
              this.GetInfos()
              //  this.getColaboradores(1, this.pageSize);
          }
      });
  }

    atualizarUnidadesDisponiveis() {

        this._http.get(`${this.baseUrl}/professor/unidades-disponibilidades/${this.data['prof'].id}`)
            .subscribe((resp: any) => {
                this.unidades = resp['unidades']
            },
                (error) => { },
                () => {

                })
    }

}
