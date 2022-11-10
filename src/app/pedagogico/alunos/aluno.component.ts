import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { ConfirmAcaoModalComponent } from "src/app/_shared/components/acao-confirm/confirm-acao.component";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { ConfirmAcaoModalConfig } from "src/app/_shared/services/shared.modal";
import { environment } from "src/environments/environment";
import { InfoFinancComponentModal, OpenInfoComponentModal, OpenMatriculaCalendariotModal } from "../services/pedag-modal";
import { PedagogicoService } from "../services/pedagogico.service";
import { BoletimAlunoComponent } from "./boletim/boletim.component";
import { AlunoCalendarioComponent } from "./calendario/aluno-calendario.component";
import { AlunoEditComponent } from "./edit/aluno-edit.component";
import { InfoFinancPedagComponent } from "./financeiro-informacoes/infofinanc.component";
import { InfosComponent } from "./informacoes-matricula/infos.component";
import { AlunoMatriculaComponent } from "./matricular/aluno-matricula.component";
import { AlunosMensagemComponent } from "./mensagem/alunos-mensagem.component";

@Component({
    selector: "aluno-app",
    templateUrl: './aluno.component.html',
    styleUrls: ['./aluno.component.scss'],
    animations: [HighlightTrigger]
})

export class AlunoComponent implements OnInit {

    baseUrl = environment.baseUrl

    showMessageNoAluno = false
    mensagem: string = "";
    private jwtHelper = new JwtHelperService();
    public tokenInfo: TokenInfos = new TokenInfos();
    public pesquisarForm!: FormGroup
    // length: number;
    length: number = 0
    pageSize: number = 5;
    pageEvent!: PageEvent;
    pageIndexNumber: number = 0;
    currentPage = 1
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    // formSubmitted: boolean = false;
    // showTable: boolean = false;
    // paginationInfo: IPager;
    // showMessage: boolean = false;
    public spinnerSearch = 'hidden'
    //params: Parametros = new Parametros()
    listAlunos: any[] = new Array<any>();


    public testeForm: FormGroup



    constructor(
        //private _snackBar: MatSnackBar,
        private _helpers: HelpersService,
        private _pedagService: PedagogicoService,
        private _modal: MatDialog,
        private _fb: FormBuilder,
        private _http: HttpClient
    ) {
        this.pesquisarForm = _fb.group({
            nome: ['', [Validators.required]],
            email: ['', [Validators.required]],
            cpf: ['', [Validators.required]],
            ativo: [false],
            todasUnidades: [false],
            todosAlunos: [false]
        });

        this.pesquisarForm.valueChanges.subscribe(
            (form: any) => {
                // console.log('form changed to:', form);
                //if (this.tokenInfo['role'] != 'SuperAdm') {

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

                // } else {
                //     this.pesquisarForm.controls['nome'].setErrors(null);

                //     this.pesquisarForm.controls['email'].setErrors(null)

                //     this.pesquisarForm.controls['cpf'].setErrors(null);
                // }


            }


        );

        this.testeForm = _fb.group({
            nome: ['', [Validators.required]],
            child: this._fb.group({
                nome: ['', [Validators.required]]
            })
        });

    }

    get disabledTest() {

        return !this.testeForm.valid

    }

    get searchTodosAlunosButton() {

        // console.log(this.tokenInfo['role'] != 'SuperAdm')
        return this.tokenInfo['role'] == 'SuperAdm'
    }

    salvarTeste() {

        this._http.post(`${this.baseUrl}/teste/salvarteste`, this.testeForm.value, {})
            .subscribe(resp => {

            },
                (error) => { })
    }
    ngOnInit() {
        const token:any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.testeForm.get('child')?.disable()
        //this.getColaboradores(1, this.pageSize);
    }
    // pageIndex = 0


    getColaboradores(actualPage: number, pageSize: number) {

    }

    clicar(evento: any) {

    }

    paginationChange(pageEvt: PageEvent) {
      //  console.log(pageEvt)

    }

    // GetAll(event?: any,getAll?:any) {

    //     //this.pesquisar(event)

    //     this.showMessageNoAluno = false
    //     this.spinnerSearch = 'visible'
    //     if (event != undefined) {
    //         this.currentPage = event.pageIndex + 1
    //     } else {
    //         this.currentPage = 1
    //     }
    //     this._pedagService.getAllAlunos(this.pageSize, this.currentPage, this.pesquisarForm.value)
    //         .subscribe(
    //             sucesso => { this.processarSucesso(sucesso, event) },
    //             falha => { this.processarFalha(falha) }
    //         );


    // }

    openMensagem(matricula: any): void {
      const dialogRef = this._modal
        .open(AlunosMensagemComponent, {
          width: '800px',
          data: { matricula: matricula },
          hasBackdrop: true,
          disableClose: true
        });

      dialogRef.afterClosed().subscribe(result => {
        if (result.success == true) {

        }

      });
    }

    pesquisar(event?: any) {

        this.showMessageNoAluno = false

       //// if (this.pesquisarForm.valid || this.tokenInfo['role'] == 'SuperAdm') {

            this.spinnerSearch = 'visible'

            if (event != undefined) {
                this.currentPage = event.pageIndex + 1
            } else {
                this.currentPage = 1
            }

            this._pedagService.getAlunos(this.pageSize, this.currentPage, this.pesquisarForm.value)
                .subscribe(
                    sucesso => { this.processarSucesso(sucesso, event) },
                    falha => { this.processarFalha(falha) }
                );
       // }

        return event
    }

    processarSucesso(response: any, event?: any) {
      //  console.log(response)
        this.listAlunos = Object.assign([], response['data']);

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
    }

    processarFalha(fail: any) {

        if (fail['status'] == 404) {
            this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
            this.showMessageNoAluno = true
            this.listAlunos = new Array<any>();
        }
        if (fail['status'] != 404) {
            this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
            this.showMessageNoAluno = true
            this.listAlunos = new Array<any>();
        }

        this.spinnerSearch = 'hidden'
    }

    deletar(aluno: any): void {

        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked == true) {

                this._http.delete(`https://localhost:5001/api/dev/deletar-aluno/${aluno.id}`, {})
                    .subscribe(resp => {

                    }, erro => {
                        this._helpers.openSnackBarErrorDefault();

                    }, () => {
                        this._helpers.openSnackBarSucesso("Cadastro excluído com sucesso.")
                    }

                    )
            }
        });
    }

    deletarMat(mat: any): void {

        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked == true) {

                this._http.delete(`https://localhost:5001/api/dev/deletar-matricula/${mat.matriculaId}`, {})
                    .subscribe(resp => {
                    }, erro => {
                        this._helpers.openSnackBarErrorDefault();
                    }
                    ), () => {
                        this._helpers.openSnackBarSucesso("Matricula excluída com sucesso.")
                    }
            }
        });
    }



    matricular(aluno: any) {
        const dialogRef = this._modal
            .open(AlunoMatriculaComponent, {
                height: '235px',
                width: '850px',

                data: { aluno: aluno },
                hasBackdrop: true,
                disableClose: true
            });

        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "Ok") {

                this.pesquisar();

            } else if (data.clicked === "Cancel") {

            }
        });

    }

    public OpenCalendarioAluno(matricula: any):void{
      const dialogRef = this._modal
      .open(AlunoCalendarioComponent, OpenMatriculaCalendariotModal(matricula));
  dialogRef.afterClosed().subscribe((data) => {
      if (data.clicked === "OK") {
      } else if (data.clicked === "Cancel") {
      }
  });
    }


    viewInfoCadastrais(aluno: any): void {
        const dialogRef = this._modal
            .open(AlunoEditComponent, {
                width: '1000px',
                data: { aluno: aluno },
                hasBackdrop: true,
                disableClose: true
            });

        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked == true) {
                this.pesquisar();

            } else if (data.clicked === "Cancel") {

            }
        });
    }

    openMatriculaModal(): void {
        // const dialogRef = this._modal
        //     .open(CreateMatriculaComponent, {
        //         width: '1000px',
        //         data: { Hello: "Hello World" },
        //         hasBackdrop: true,
        //         disableClose: true
        //     });

        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data.clicked === "OK") {
        //     } else if (data.clicked === "Cancel") {
        //     }
        // });
    }


    openInfoModal(aluno: any): void {
        const dialogRef = this._modal
            .open(InfosComponent, OpenInfoComponentModal(aluno));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "OK") {
            } else if (data.clicked === "Cancel") {
            }
        });
    }

    // openInfoModal(aluno: Aluno): void {
    //     const dialogRef = this._modal
    //         .open(InfosComponent, {
    //             height: '90vh',
    //             width: '1000px',
    //             autoFocus: false,
    //             // maxHeight: '90vh',

    //             data: { aluno: aluno },
    //             hasBackdrop: true,
    //             disableClose: true
    //         });

    //     dialogRef.afterClosed().subscribe((data) => {
    //         if (data.clicked === "OK") {
    //             //this.openSnackBar()
    //             console.log('afte close ok')
    //         } else if (data.clicked === "Cancel") {
    //             // Do nothing. Cancel any events that navigate away from the
    //             // component.
    //         }
    //     });
    // }

    openInfoFinancModal(aluno: any): void {
        const dialogRef = this._modal
            .open(InfoFinancPedagComponent, InfoFinancComponentModal(aluno));
        dialogRef.afterClosed().subscribe(
            data => { });


        // const dialogRef = this.CreateMatriculaModal
        //     .open(InfoFinancPedagComponent, {
        //         height: '90vh',
        //         width: '1050px',
        //         autoFocus: false,


        //         data: { aluno: aluno },
        //         hasBackdrop: true,
        //         disableClose: true
        //     });

        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data.clicked === "OK") {
        //         this.openSnackBar()
        //         console.log('afte close ok')
        //     } else if (data.clicked === "Cancel") {

        //     }
        // });
    }

    get podeDeletar() {
        return this.tokenInfo.role == 'SuperAdm'
    }

    openBoletimodal(aluno: any): void {
        const dialogRef = this._modal
            .open(BoletimAlunoComponent, {
                width: '1000px',
                data: { aluno: aluno },
                hasBackdrop: true,
                disableClose: true
            });

        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked == true) {
            } else if (data.clicked == false) {

            }
        });
    }


    // openSnackBar() {
    //     this._snackBar.open('Aluno matriculado com sucesso', '', {
    //         horizontalPosition: 'center',
    //         verticalPosition: 'top',
    //         panelClass: 'green-snackbar',
    //         duration: 3 * 1000,
    //     });
    // }

    deleteColaborador(id: number) {


    }

}


// export interface IPager {
//     itemsPerPage?: number;
//     totalItemsInDatabase?: number;
//     currentPage?: number;
//     totalPages?: number;
//     items?: number;
// }

// function InfoComponent(InfoComponent: any, arg1: { height: string; width: string; autoFocus: false; maxHeight: string; data: { Hello: string; }; hasBackdrop: true; disableClose: true; }) {
//     throw new Error("Function not implemented.");
// }
