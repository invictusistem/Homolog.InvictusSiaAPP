import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, ElementRef, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { Cargos, Unidades } from "src/app/_shared/models/perfil.model";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { environment } from "src/environments/environment";
import { CreateProfessorModalConfig, OpenProfMateriasModalConfig, ProfCalendarioModalConfig, ProfEditModalConfig, ProfRelatorioModalConfig } from "../services/adm-modal";
import { AdmService } from "../services/adm.service";
import { ProfCalendarioComponent } from "./calendario/professor-calend.component";
import { CreateProfessorComponent } from "./create/professor-create.component";
import { EditProfessorComponent } from "./edit/professor-edit.component";
import { ProfMateriasComponent } from "./materias/professor-materia.component";
import { ProfRelatorioComponent } from "./relatorio/professor-rel.component";


@Component({
    selector: "professores-app",
    templateUrl: './professores.component.html',
    styleUrls: ['./professores.component.scss']
})

export class ProfessoresComponent extends BaseComponent implements OnInit {

    // paginated
    //pageIndexNumber: number = 0;
    //,public spinnerSearch = 'hidden'
    actualPage = 1
    paginationInfo?: IPager;
    //pageSize: number = 5;
    //pageEvent: PageEvent  = new PageEvent()
    //length: number = 0
    public totalPages: number = 0



    professores: any[] = new Array<any>();//Colaborador[] = new Array<Colaborador>();
    //baseUrl = environment.baseUrl;




    formSubmitted: boolean = false;
    showTable: boolean = false;
    showSpinner = false
    showSpinnerFirst = false

    incluirInativos = false

    showMessage: boolean = false;
    cargos = Cargos;
    unidades = Unidades
    showMessageNoColaborador = false
    mensagem: string = "";

    //public tokenInfo: TokenInfos = new TokenInfos();
    //private jwtHelper = new JwtHelperService();

    public pesquisarForm: FormGroup
    //pagination


    constructor(
        // private elementRef: ElementRef,
        private _admService: AdmService,
        private http: HttpClient,
        private _fb: FormBuilder,
        override _snackBar: MatSnackBar,
        // private CreateColaboradoresModal: MatDialog,
        private _modal: MatDialog) {
        super(_snackBar);
        this.pesquisarForm = _fb.group({
            nome: ['', [Validators.required]],
            email: ['', [Validators.required]],
            cpf: ['', [Validators.required]],
            ativo: [false],
            todasUnidades: [false]
        });

        this.pesquisarForm.valueChanges.subscribe(
            (form: any) => {
                // console.log('form changed to:', form);
                if (this.pesquisarForm.get('nome')?.value == '' &&
                    this.pesquisarForm.get('email')?.value == '' &&
                    this.pesquisarForm.get('cpf')?.value == '') {
                    //  console.log('false valid')

                    this.pesquisarForm.controls['nome'].setErrors({ required: true });
                    this.pesquisarForm.controls['email'].setErrors({ required: true });
                    this.pesquisarForm.controls['cpf'].setErrors({ required: true });
                    // this.pesquisarForm.setErrors({required: true});
                } else {
                    //   console.log('true valid')
                    this.pesquisarForm.controls['nome'].setErrors(null);

                    this.pesquisarForm.controls['email'].setErrors(null)

                    this.pesquisarForm.controls['cpf'].setErrors(null);

                    //this.pesquisarForm.setErrors({required: false});


                }
            }
        );
    }





    ngOnInit() {
        // console.log('init colaboradores 123')
        //const token = localStorage.getItem('jwt')
    }

    pageIndex = 0


    Pesquisar(event?: any) {

        this.showMessageNoColaborador = false

       // if (this.pesquisarForm.valid || this.tokenInfo['role'] == 'SuperAdm') {

            this.spinnerSearch = 'visible'

            if (event != undefined) {
                this.currentPage = event.pageIndex + 1
            } else {
                this.currentPage = 1
            }

            this._admService.GetProfessores(this.pageSize, this.currentPage, this.pesquisarForm.value)
                .subscribe({
                    next: (resp: any) => { this.processarSucesso(resp, event) },
                    error: (error: any) => { this.processarFalha(error) }
                })
            //             (response: any) => {

            //                 this.professores = Object.assign([], response['results'].data);

            //                 this.length = response['results'].totalItemsInDatabase
            //                 this.totalPages = Math.ceil(this.length / this.pageSize)
            //                 console.log(this.length)
            //                 if (this.professores.length == 0) {
            //                     // console.log("lengt zero")
            //                     this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
            //                     this.showMessageNoColaborador = true
            //                 }
            //                 // this.applyFiler()
            //             },
            //             (err) => {
            //                 if (err['status'] == 404) {
            //                     this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
            //                     this.showMessageNoColaborador = true
            //                     this.professores = new Array<any>();
            //                 }
            //                 if (err['status'] != 404) {
            //                     this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
            //                     this.showMessageNoColaborador = true
            //                     this.professores = new Array<any>();
            //                 }

            //                 this.showSpinnerFirst = false
            //                 this.showSpinner = false
            //                 // console.log(err)
            //                  this.spinnerSearch = 'hidden'
            //                 //this.openSnackBar(err)

            //             },
            //             () => {
            //                 this.showMessageNoColaborador = false
            //                 this.showSpinnerFirst = false
            //                 this.showSpinner = false
            //                 this.spinnerSearch = 'hidden'
            //                 //  console.log('ok get');

            //                 //this.pageIndexNumber = (evento.pageIndex * this.pageSize)
            //             },
            //         )
       // }
        return event
    }

    processarSucesso(response: any, event?: any) {

        this.professores = Object.assign([], response['results'].data);

        this.length = response['results'].totalItemsInDatabase

        this.spinnerSearch = 'hidden'
        if (event != undefined) {
            this.pageIndexNumber = (event.pageIndex * this.pageSize)
        } else {
            this.pageIndexNumber = 0
            if (this.paginator != undefined) {
                this.paginator.firstPage();
            }
        }
    }

    processarFalha(fail: any) {

        if (fail['status'] == 404) {
            this.mensagemNotFound = "Sua pesquisa não encontrou nenhum registro correspondente"
            this.showMessageNotFound = true
            this.professores = new Array<any>();
        }
        if (fail['status'] != 404) {
            this.mensagemNotFound = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
            this.showMessageNotFound = true
            this.professores = new Array<any>();
        }

        this.spinnerSearch = 'hidden'
    }

    get disabledOpenEditButton() {

        return this.spinnerSearch != 'hidden'
    }



    changePage(event?: any, element?: any) {
        // console.log(event)
        //console.log(element.target)

        this.showSpinner = true
        this.showMessageNoColaborador = false
        var formJson = JSON.stringify(this.pesquisarForm.value)
        var currentPage = event.pageIndex + 1
        if (this.pesquisarForm.valid) {
            this.http.get(`${this.baseUrl}/colaboradores/pesquisar/?itemsPerPage=${this.pageSize}&currentPage=${currentPage}&paramsJson=${formJson}`)
                .subscribe(
                    (response: any) => {

                        this.professores = Object.assign([], response['data']);

                        this.length = response['totalItemsInDatabase']

                        if (this.professores.length == 0) {
                            // console.log("lengt zero")
                            this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
                            this.showMessageNoColaborador = true
                        }
                        // this.applyFiler()
                    },
                    (err) => {
                        this.showSpinnerFirst = false
                        this.showSpinner = false
                        // console.log(err)
                        //this.openSnackBar(err)

                    },
                    () => {
                        this.showMessageNoColaborador = false
                        this.showSpinnerFirst = false
                        this.showSpinner = false
                        //  console.log('ok get');
                        this.pageIndexNumber = (event.pageIndex * this.pageSize)
                        //this.pageIndexNumber = (evento.pageIndex * this.pageSize)
                    },
                )
        }

        return event

    }

    openCreateUserModal(): void {
        const dialogRef = this._modal
            .open(CreateProfessorComponent, CreateProfessorModalConfig());
        dialogRef.afterClosed().subscribe(data => {
            if (data.clicked == true) this.getColaboradores(1, this.pageSize);
        });
    }

    public OpenProfCalendarioodal(prof: any): void {
        const dialogRef = this._modal
            .open(ProfCalendarioComponent, ProfCalendarioModalConfig(prof));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    public OpenProfRelatorio(prof: any): void {
        const dialogRef = this._modal
            .open(ProfRelatorioComponent, ProfRelatorioModalConfig(prof));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    public openEditUserModal(prof: any): void {
        const dialogRef = this._modal
            .open(EditProfessorComponent, ProfEditModalConfig(prof));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    // openEditUserModal(prof: any): void { // ProfEditModalConfig
    //     const dialogRef = this._modal
    //         .open(EditProfessorComponent, {
    //             height: '520px',
    //             width: '680px',

    //             data: { prof: prof },
    //             hasBackdrop: true,
    //             disableClose: true
    //         });

    //     dialogRef.afterClosed().subscribe(result => {

    //     });
    // }

    getColaboradores(actualPage: number, pageSize: number) {

        var itemsPerPage = pageSize;
        var currentPage = actualPage;

        this.http.get(`${this.baseUrl}/colaboradores/?itemsPerPage=` + itemsPerPage + `&currentPage=` + currentPage, {
            //this.http.post("http://api.invictustemp.com.thor.hostazul.com.br/api/identity/login", credentials, {

            // headers: new HttpHeaders({
            //     "Content-Type": "application/json",
            //     "Authorization": "Bear "
            // })
        }).subscribe((response: any) => {

            // console.log(response)
            this.professores = Object.assign([], response['data'])
            this.length = response['totalItemsInDatabase']
            //console.log(this.length)
            //console.log(this.professores)
            // this.dialogRef.close();
        }, err => {
            //console.log(err)
        },
            () => { });

    }


    params: Parametros = new Parametros()


    paginationChange(pageEvt: PageEvent) {
        console.log(pageEvt)

    }

    openProfMateriasModal(prof: any): void {
        const dialogRef = this._modal
            .open(ProfMateriasComponent, OpenProfMateriasModalConfig(prof));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "Ok") {

                //  console.log('afte close ok')
                this.getColaboradores(1, this.pageSize);
            }
        });
    }


    // openCreateUserModal(): void {
    //     const dialogRef = this._modal
    //         .open(CreateProfessorComponent, {
    //             minHeight: '420px',
    //             width: '680px',

    //             //data: { Hello: "Hello World" },
    //             hasBackdrop: true,
    //             disableClose: true
    //         });


    //     dialogRef.afterClosed().subscribe((data) => {
    //         if (data.clicked === "Ok") {
    //             // Reset form here
    //             console.log('afte close ok')
    //             this.getColaboradores(1, this.pageSize);
    //         } else if (data.clicked === "Cancel") {
    //             // Do nothing. Cancel any events that navigate away from the
    //             // component.
    //         }
    //     });
    // }



    deleteColaborador(id: number) {

        this.http.delete(`${this.baseUrl}/colaboradores/${id}`, {
            //this.http.post("http://api.invictustemp.com.thor.hostazul.com.br/api/identity/login", credentials, {

            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": "Bear "
            })
        }).subscribe(response => {

            // console.log(response)

        }, err => {
            // console.log(err)
        },
            () => {
                // TODO mudar status e perfil acesso
            });

    }

}


export interface IPager {
    itemsPerPage?: number;
    totalItemsInDatabase?: number;
    currentPage?: number;
    totalPages?: number;
    items?: number;
}

export class Parametros {
    constructor(
        public nome?: string,
        public email?: string,
        public cpf?: string) { }
}