import { HttpClient } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { ConfirmAcaoModalComponent } from "src/app/_shared/components/acao-confirm/confirm-acao.component";
import { ModalConfirmarComponent } from "src/app/_shared/components/modal-confirmar/modal-confirmar.component";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { ConfirmAcaoModalConfig, ModalconfirmarConfig } from "src/app/_shared/services/shared.modal";
import { environment } from "src/environments/environment";
import { InfoFinancModalConfig, ReparcelamentoComponentModal } from "../services/financ-modal";
import { InfoFinancComponent } from "./infos/aluno-informacoes.component";
import { ReparcelamentoComponent } from "./reparcelamento/reparcelamento.component";

@Component({
    selector: "alunofin-app",
    templateUrl: './alunos-financeiro.component.html',
    styleUrls: ['./alunos-financeiro.component.scss'],
    animations: [HighlightTrigger]
})

export class AlunoFinancComponent implements OnInit {


    //colaboradores: Colaborador[] = new Array<Colaborador>();
    baseUrl = environment.baseUrl;

    length: number = 0
    pageSize: number = 5;
    pageEvent!: PageEvent;
    pageIndexNumber: number = 0;
    currentPage = 1
    @ViewChild(MatPaginator) paginator!: MatPaginator

    showMessageNoAluno = false
    public spinnerSearch = 'hidden'
    // pageEvent: PageEvent;
    // pageIndexNumber: number = 0;
    // actualPage = 1
    // paginationInfo: IPager;

    // formSubmitted: boolean = false;
    // showTable: boolean = false;
    // showSpinner = false
    // showSpinnerFirst = false

    // showMessage: boolean = false;
    // cargos = Cargos;
    // unidades = Unidades
    showMessageNoColaborador = false
    mensagem: string = "";
    listAlunos: any[] = new Array<any>()// Aluno[] = new Array<Aluno>();

    public tokenInfo: TokenInfos = new TokenInfos();
    private jwtHelper = new JwtHelperService();
    public pesquisarForm: FormGroup
    //pagination


    constructor(
        private _http: HttpClient,
        private _fb: FormBuilder,
        private _modal: MatDialog) {
        this.pesquisarForm = _fb.group({
            nome: ['', [Validators.required]],
            email: ['', [Validators.required]],
            cpf: ['', [Validators.required]],
            ativo: [false]
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
        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
    }

    get mostrarEmLote() {
        return this.tokenInfo.role == 'SuperAdm'
    }
    podeDesable = false
    atualizarBoletos(): void {
        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked == true) {
                this.podeDesable = true
                this._http.put(`https://localhost:5001/api/dev/atualizar-boletos`, {})
                    .subscribe(
                        resp => { this.podeDesable = false },
                        error => { this.podeDesable = false }
                    )
            }
        });
    }


    Pesquisar(event?: any) {

        this.showMessageNoAluno = false



       // if (this.pesquisarForm.valid || this.tokenInfo['role'] == 'SuperAdm') {
            this.spinnerSearch = 'visible'

            if (event != undefined) {
                this.currentPage = event.pageIndex + 1
            } else {
                this.currentPage = 1
            }


            var formJson = JSON.stringify(this.pesquisarForm.value)
            this._http.get(`${this.baseUrl}/financeiro/alunos/?itemsPerPage=` + this.pageSize + `&currentPage=${this.currentPage}&paramsJson=${formJson}`)
                .subscribe(
                    (response: any) => {

                        this.listAlunos = Object.assign([], response['alunos'].data)

                        this.length = response['alunos'].totalItemsInDatabase

                        this.spinnerSearch = 'hidden'


                        if (event != undefined) {
                            this.pageIndexNumber = (event.pageIndex * this.pageSize)
                        } else {
                            this.pageIndexNumber = 0
                            //console.log(this.paginator)
                            if (this.paginator != undefined) {
                                this.paginator.firstPage();
                            }
                        }

                    },
                    (err) => {
                        if (err['status'] == 404) {
                            this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
                            this.showMessageNoColaborador = true
                            this.listAlunos = new Array<any>();
                        }
                        if (err['status'] != 404) {
                            this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
                            this.showMessageNoColaborador = true
                            this.listAlunos = new Array<any>();
                        }
                
                        this.spinnerSearch = 'hidden'

                    },
                    () => {
                        
                    },
                )
       // }

        return event

    }

    public OpenInfoFinanc(aluno: any): void {
        const dialogRef = this._modal
            .open(InfoFinancComponent, InfoFinancModalConfig(aluno));
        dialogRef.afterClosed().subscribe(data => {
        });
    }   

    // openInfoFinanc(aluno: any): void {
    //     const dialogRef = this._modal
    //         .open(InfoFinancComponent, {
    //             height: '650px',
    //             width: '1000px',

    //             data: { aluno: aluno },
    //             hasBackdrop: true,
    //             disableClose: true
    //         });

    //     dialogRef.afterClosed().subscribe(result => {

    //     });
    // }

    public openReparcelamentoModal(aluno: any): void {
        const dialogRef = this._modal
            .open(ReparcelamentoComponent, ReparcelamentoComponentModal(aluno));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

//     openReparcelamentoModal(aluno: any): void {
//         const dialogRef = this._modal
//             .open(ReparcelamentoComponent, {
//                 height: 'auto',
//                 width: '1000px',
//                 autoFocus: false,
//                 maxHeight: '90vh',

//                 data: { aluno: aluno },
//                 hasBackdrop: true,
//                 disableClose: true
//             });

//         dialogRef.afterClosed().subscribe(result => {

//         });
//     }
}


// export interface IPager {
//     itemsPerPage?: number;
//     totalItemsInDatabase?: number;
//     currentPage?: number;
//     totalPages?: number;
//     items?: number;
// }

// export class Parametros {
//     constructor(
//         public nome?: string,
//         public email?: string,
//         public cpf?: string) { }
// }

// function InfoFinancModal(InfoFinancModal: any, arg1: { height: string; width: string; data: { aluno: Aluno; }; hasBackdrop: true; disableClose: true; }) {
//     throw new Error("Function not implemented.");
// }
