import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { DetalheAcessoModalConfig } from "../services/pedag-modal";
import { PedagogicoService } from "../services/pedagogico.service";
import { DetalheComponent } from "./edit/detalhe.component";

@Component({
    selector: "aluno-acesso-app",
    templateUrl: './aluno-acesso.component.html',
    styleUrls: ['./aluno-acesso.component.scss'],
    animations: [HighlightTrigger]
})

export class AlunoAcessoComponent implements OnInit {
    public alunos: any[] = new Array<any>();
    private jwtHelper = new JwtHelperService();
    public tokenInfo: TokenInfos = new TokenInfos();
    // testeDonne: string = 'done'
    // private baseUrl = environment.baseUrl;
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    pageSize: number = 5;
    length: number = 0
    pageIndexNumber: number = 0;

    public showMessageNoAluno = false
    public mensagem = ''

    public spinnerSearch = 'hidden'

    currentPage = 1
    // usuarios: any[] = new Array<any>();
    // private jwtHelper = new JwtHelperService();
    // tokenInfo: TokenInfos = new TokenInfos();
    public pesquisarForm: FormGroup

    constructor(
        private _fb: FormBuilder,
        private _pedagService: PedagogicoService,
        private _modal: MatDialog
        // private _admService: AdmService,
        // private _modal: MatDialog
    ) {

        this.pesquisarForm = _fb.group({
            nome: ['', [Validators.required]],
            email: ['', [Validators.required]],
            cpf: ['', [Validators.required]],
            ativo: [false]
        });

        this.pesquisarForm.valueChanges.subscribe(
            (form: any) => {

                if (this.pesquisarForm.get('nome')?.value == '' &&
                    this.pesquisarForm.get('email')?.value == '' &&
                    this.pesquisarForm.get('cpf')?.value == '') {

                    this.pesquisarForm.controls['nome'].setErrors({ required: true });
                    this.pesquisarForm.controls['email'].setErrors({ required: true });
                    this.pesquisarForm.controls['cpf'].setErrors({ required: true });
                } else {
                    this.pesquisarForm.controls['nome'].setErrors(null);

                    this.pesquisarForm.controls['email'].setErrors(null)

                    this.pesquisarForm.controls['cpf'].setErrors(null);
                }
            }
        );

    }


    ngOnInit() {

        const token:any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        //const token = localStorage.getItem('jwt')
        // this.tokenInfo = this.jwtHelper.decodeToken(token)
    }

    Desbloquear(aluno: any): void {
        const dialogRef = this._modal
            .open(DetalheComponent, DetalheAcessoModalConfig(aluno));
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    submitPesquisa(event?: any) {

        // this.showMessageNoColaborador = false
        this.showMessageNoAluno = false
       // if (this.pesquisarForm.valid || this.tokenInfo['role'] == 'SuperAdm') {
            //     this.spinnerSearch = true

            if (event != undefined) {
                this.currentPage = event.pageIndex + 1
            } else {
                this.currentPage = 1
            }
            this.spinnerSearch = 'visible'

            this._pedagService.getAlunosAcesso(this.pageSize, this.currentPage, this.pesquisarForm.value)
                .subscribe(
                    sucesso => { this.processarSucesso(sucesso, event) },
                    falha => { this.processarFalha(falha) }
                );
       // }

        return event
    }

    processarSucesso(response: any, event?: any) {

        this.alunos = Object.assign([], response['data']);

        this.length = response['totalItemsInDatabase']

        this.spinnerSearch = 'hidden'

        if (event != undefined) {
            this.pageIndexNumber = (event.pageIndex * this.pageSize)
        } else {
            this.pageIndexNumber = 0

            if (this.paginator != undefined)
                this.paginator.firstPage();
        }
    }

    processarFalha(fail: any) {

        this.spinnerSearch = 'hidden'

        if (fail['status'] == 404) {
            this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
            this.showMessageNoAluno = true
            this.alunos = new Array<any>();
        }
        if (fail['status'] != 404) {
            this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
            this.showMessageNoAluno = true
            this.alunos = new Array<any>();
        }
    }



    // get disabledEdit() {

    //     return false
    // }


    // openCreateUserModal(): void {
    //     const dialogRef = this._modal
    //         .open(CreateUserComponent, {
    //             height: 'auto',
    //             width: '700px',

    //             data: { Hello: "Hello World" },
    //             hasBackdrop: true,
    //             disableClose: true
    //         });


    //     dialogRef.afterClosed().subscribe(result => {

    //     });
    // }

    // openEditUserModal(item: Colaborador): void {
    //     const dialogRef = this._modal
    //         .open(EditUserComponent, {
    //             height: '300px',
    //             width: '600px',

    //             data: { colaborador: item },
    //             hasBackdrop: true,
    //             disableClose: true
    //         });


    //     dialogRef.afterClosed().subscribe(result => {

    //     });
    // }

    // openAcessoModal(usuario) {
    //     const dialogRef = this._modal
    //         .open(EditAcessoComponent, EditAcessoModal(usuario));
    //     dialogRef.afterClosed().subscribe((data) => {

    //     });
    // }

    // showMessageNoColaborador = false
    // mensagem: string = "";
    // params: Parametros = new Parametros()
    // showSpinnerFirst = false

    // onSubmit(event?: any) {

    //     this.showMessageNoColaborador = false

    //     if (this.pesquisarForm.valid) {

    //         if (event != undefined) {

    //         } else {

    //         }

    //         this._admService.getUsuarios(this.pageSize, this.currentPage, this.pesquisarForm.value)
    //             .subscribe(
    //                 sucesso => { this.processarSucesso(sucesso, event) },
    //                 falha => { this.processarFalha(falha) }
    //             );
    //     }

    // }


    // processarSucesso(response: any, event?: any) {

    //     this.usuarios = Object.assign([], response['data']);

    //     this.length = response['totalItemsInDatabase']


    //     if (event != undefined) {
    //         this.pageIndexNumber = (event.pageIndex * this.pageSize)
    //     } else {
    //         this.pageIndexNumber = 0


    //     }

    // }

    // processarFalha(fail: any) {

    //     if (fail['status'] == 404) {
    //         this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
    //         this.showMessageNoColaborador = true
    //         this.usuarios = new Array<any>();
    //     }
    //     if (fail['status'] != 404) {
    //         this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
    //         this.showMessageNoColaborador = true
    //         this.usuarios = new Array<any>();
    //     }


    // }


}