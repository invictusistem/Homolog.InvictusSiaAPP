import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { ConfirmAcaoModalComponent } from "src/app/_shared/components/acao-confirm/confirm-acao.component";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { environment } from "src/environments/environment";
import { EditAcessoModal, openCreateUserModalConfig, OpenEditUserModalConfig } from "../services/adm-modal";
import { AdmService } from "../services/adm.service";
import { EditAcessoComponent } from "./acesso-edit/editacesso.component";
import { CreateUserComponent } from "./create/createuser.component";
import { EditUserComponent } from "./edit/edituser.component";
import { ConfirmAcaoModalConfig } from "src/app/_shared/services/shared.modal";
import { ConsultaAcessoComponent } from "./consulta-acessos/consulta-acesso.component";
import { OpenConsultaAcessos } from '../services/adm-modal';

@Component({
    selector: "usuario-app",
    templateUrl: './usuario.component.html',
    styleUrls: ['./usuario.component.scss']
})

export class UsuarioComponent extends BaseComponent implements OnInit {

    testeDonne: string = 'done'
    //private baseUrl = environment.baseUrl;
    //pageSize: number = 5;
    //length: number = 0
    //pageIndexNumber: number = 0;
    //currentPage = 1
    usuarios: any[] = new Array<any>();// Colaborador[] = new Array<Colaborador>()
    //private jwtHelper = new JwtHelperService();
    //tokenInfo: TokenInfos = new TokenInfos();
    public pesquisarForm: FormGroup
    //public spinnerSearch = 'hidden'

    constructor(
        override _snackBar: MatSnackBar,
        //private http: HttpClient,
        private _fb: FormBuilder,
        private _admService: AdmService,
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
        //this.getUsers(1, this.pageSize)

        //const token: any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)
    }

    get disabledEdit() {

        return false
    }

    public OpenconsultaAcesso() {
            const dialogRef = this._modal
            .open(ConsultaAcessoComponent, OpenConsultaAcessos());
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    /*
        getUsers(actualPage: number, pageSize: number) {
    
            this.http.get(`${this.baseUrl}/colaboradores/users/?itemsPerPage=${pageSize}&currentPage=${actualPage}`, {
    
            }).subscribe(response => {
    
                console.log(response)
                Object.assign(this.usuarios, response['data'])
    
            },
                (error) => { console.log(error) },
                () => { })
    
        }
    */
    openCreateUserModal(): void {
        const dialogRef = this._modal
            .open(CreateUserComponent, openCreateUserModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    openEditUserModal(colaborador: any): void {
        const dialogRef = this._modal
            .open(EditUserComponent, OpenEditUserModalConfig(colaborador));
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    openAcessoModal(usuario: any) {
        const dialogRef = this._modal
            .open(EditAcessoComponent, EditAcessoModal(usuario));
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    showMessageNoColaborador = false
    mensagem: string = "";
    //params: Parametros = new Parametros()
    showSpinnerFirst = false

    onSubmit(event?: any) {

        this.showMessageNoColaborador = false

        // if (this.pesquisarForm.valid  || this.tokenInfo['role'] == 'SuperAdm') {

        this.spinnerSearch = 'visible'

        if (event != undefined) {
            this.currentPage = event.pageIndex + 1
        } else {
            this.currentPage = 1
        }

        this._admService.GetUsuarios(this.pageSize, this.currentPage, this.pesquisarForm.value)
            .subscribe(
                sucesso => { this.processarSucesso(sucesso, event) },
                falha => { this.processarFalha(falha) }
            );
        // }

        return event

    }


    processarSucesso(response: any, event?: any) {

        this.usuarios = Object.assign([], response['data']);

        this.length = response['totalItemsInDatabase']

        this.spinnerSearch = 'hidden'
        if (event != undefined) {
            this.pageIndexNumber = (event.pageIndex * this.pageSize)
        } else {
            this.pageIndexNumber = 0
            if (this.paginator != undefined) {
                this.paginator.firstPage();
            }
        }

        // this.spinnerSearch = 'hidden'

    }

    processarFalha(fail: any) {

        if (fail['status'] == 404) {
            this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
            this.showMessageNoColaborador = true
            this.usuarios = new Array<any>();
        }
        if (fail['status'] != 404) {
            this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
            this.showMessageNoColaborador = true
            this.usuarios = new Array<any>();
        }
        this.spinnerSearch = 'hidden'
        // this.spinnerSearch = false
    }

    get podeDeletar() {

        return this.tokenInfo.role == 'SuperAdm'
    }

    get disabledOpenEditButton() {

        return this.spinnerSearch != 'hidden'
    }

    public Deletar(colaboradorId: any) {

        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

            if (data.clicked == true) {
                this.spinnerSearch = 'visible'

                this._admService.DeleteUsuario(colaboradorId)
                    .subscribe(
                        response => { this.spinnerSearch = 'hidden' },
                        err => { this.spinnerSearch = 'hidden' })
            }
        })
    }

    pesquisar(nome: string, email: string, cpf: string) {

        //     console.log(nome + " " + email + " " + cpf)
        //     if (nome == "" || nome == undefined) nome = ""
        //     if (email == "" || email == undefined) email = ""
        //     if (cpf == "" || cpf == undefined) cpf = ""

        //     if ((nome == "" || nome == undefined) &&
        //         (email == "" || email == undefined) &&
        //         (cpf == "" || cpf == undefined)) {
        //         console.log("retorno")
        //         return;
        //     }
        //     this.showMessageNoColaborador = false
        //     this.mensagem = ""

        //     let query = { nome: nome, cargo: email, unidade: cpf }
        //     this.params.nome = nome
        //     this.params.email = email
        //     this.params.cpf = cpf

        //     this.showSpinnerFirst = true
        //     this.usuarios = new Array<Colaborador>();
        //     let paramsJson = JSON.stringify(this.params)
        //     console.log(query)


        //     this.http.get(`${this.baseUrl}/usuario/?paramsJson={"nome":"${nome}","email":"${email}","cpf":"${cpf}"}&itemsPerPage=` + this.pageSize + `&currentPage=1`
        //         //this.http.post(`${this.baseUrl}/colaboradores/pesquisar/?itemsPerPage=` + this.pageSize + `&currentPage=1`, paramsJson, {
        //         // headers: new HttpHeaders({
        //         //     "Content-Type": "application/json",
        //         //     "Authorization": "Bearer "
        //         // })}
        //     ).subscribe(
        //         (response) => {
        //             console.log(response)
        //             this.usuarios = Object.assign([], response['usuarios'].data);

        //             //this.length = response['totalItemsInDatabase']
        //             // if (this.length == 0) {
        //             //     this.showMessageNoColaborador = true
        //             //     this.mensagem = "Registro não localizado."
        //             // }
        //             // else if (this.usuarios.length == 0) {
        //             //     console.log("lengt zero")
        //             //     this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
        //             //     this.showMessageNoColaborador = true
        //             // }

        //         },
        //         (err) => {
        //             this.showSpinnerFirst = false
        //             console.log(err)
        //             this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
        //             this.showMessageNoColaborador = true

        //         },
        //         () => {
        //             this.showSpinnerFirst = false
        //             console.log('ok get');

        //         },
        //     )

        // }

    }
}