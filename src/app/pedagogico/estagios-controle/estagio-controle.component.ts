import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { InfosComponent } from "../alunos/informacoes-matricula/infos.component";
import { DocumentacaoModalConfig, EstagioMatriculaModalConfig, OpenInfoComponentModal } from "../services/pedag-modal";
import { PedagogicoService } from "../services/pedagogico.service";
import { EstagioDocumentacaoComponent } from "./documentacao/estagio-documentacao.component";
import { EstagioMatriculaComponent } from "./matricula/estagio-matricula.component";

@Component({
    selector: "estagiosdocs-app",
    templateUrl: './estagio-controle.component.html',
    styleUrls: ['./estagio-controle.component.scss']
})

export class EstagioControleComponent extends BaseComponent implements OnInit {



    //private baseUrl = environment.baseUrl;

    //public cepReturn: CepReturn = new CepReturn();
    //public docsViewModel: AlunoDto[] = new Array<AlunoDto>();
    //estagioForm: FormGroup
    //analise: any    

    public showMessageNoAluno = false
    public listAlunos: any[] = new Array<any>()   
    public pesquisarForm: FormGroup
    public mensagem = ''
    // public estagios: any[] = new Array<any>();
    // private jwtHelper = new JwtHelperService();
    // tokenInfo: TokenInfos = new TokenInfos();    

    constructor(
      override _snackBar: MatSnackBar,
        private _modal: MatDialog,
        private _pedagService: PedagogicoService,
        private _fb: FormBuilder
        //private CreateColaboradoresModal: MatDialog,
        //private EditColaboradoresModal: MatDialog
    ) {
      super(_snackBar);
        this.pesquisarForm = _fb.group({
            nome: ['', [Validators.required]],
            email: ['', [Validators.required]],
            cpf: ['', [Validators.required]],
            ativo: [false],
            todasUnidades: [false],
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
        // this.pesquisarForm = _fb.group({
        //     nome: ['', [Validators.required]],
        //     email: ['', [Validators.required]],
        //     cpf: ['', [Validators.required]],
        //     ativo: [false]
        // });

    }
    ngOnInit() {


        //const token = localStorage.getItem('jwt')
        // this.tokenInfo = this.jwtHelper.decodeToken(token)

        // console.log('init matricula')
        // this.getInfoEstagios();
    }

    public Pesquisar(event?: any) {


        this.showMessageNoAluno = false

        if (this.pesquisarForm.valid  || this.tokenInfo['role'] == 'SuperAdm') {
            this.spinnerSearch = 'visible'

            if (event != undefined) {
                this.currentPage = event.pageIndex + 1
            } else {
                this.currentPage = 1
            }


            this._pedagService.GetAlunosEstagio(this.pageSize, this.currentPage, this.pesquisarForm.value)
                .subscribe(
                    sucesso => { this.ProcessarSucesso(sucesso, event) },
                    falha => { this.ProcessarFalha(falha) }
                );
        }

        return event
    }

    private ProcessarSucesso(response: any, event?: any) {

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

    private ProcessarFalha(fail: any) {

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

    public OpenInfoModal(aluno: any): void {
        const dialogRef = this._modal
            .open(InfosComponent, OpenInfoComponentModal(aluno));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "OK") {
            } else if (data.clicked === "Cancel") {
            }
        });
    }
    
    public matricular(aluno: any): void {
        const dialogRef = this._modal
            .open(EstagioMatriculaComponent, EstagioMatriculaModalConfig(aluno));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "OK") {
            } else if (data.clicked === "Cancel") {
            }
        });
    }

    public Documentacao(aluno: any): void {
        const dialogRef = this._modal
            .open(EstagioDocumentacaoComponent, DocumentacaoModalConfig(aluno));
        dialogRef.afterClosed().subscribe((data) => {
            // if (data.clicked === "OK") {
            // } else if (data.clicked === "Cancel") {
            // }
        });

    }


    // exportar(doc: AlunoDocument) {
    //     //..console.log(doc:Document)
    //     var file = doc.nome;// "Modelo LEAD.xlsx";// this.createFileName("EXCEL");
    //     // this.showSpinner = true;
    //     // this.testehabilitar = false

    //     this.download(doc.alunoId, doc.docId).subscribe(data => {
    //         //console.log(data)
    //         switch (data.type) {
    //             case HttpEventType.Response:
    //                 // this.showSpinner = false;
    //                 //this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
    //                 const downloadedFile = new Blob([data.body], { type: data.body.type });
    //                 const a = document.createElement('a');
    //                 a.setAttribute('style', 'display:none;');
    //                 document.body.appendChild(a);
    //                 a.download = file;
    //                 a.href = URL.createObjectURL(downloadedFile);
    //                 a.target = '_blank';
    //                 a.click();
    //                 document.body.removeChild(a);
    //                 break;
    //         }
    //     },
    //         (err) => {
    //             //this.showSpinner = false;
    //             //this.testehabilitar = true;
    //         },
    //         () => {
    //             //this.showSpinner = false;
    //             // this.testehabilitar = true;
    //         }
    //     );
    // }

    // public download(alunoid: number, docId: number): Observable<HttpEvent<Blob>> {
    //     return this._http.request(new HttpRequest(
    //         'GET', `${this.baseUrl}/estagios/file/?alunoid=${alunoid}&docid=${docId}`, null, {
    //         reportProgress: true,
    //         responseType: 'blob'
    //     }));
    // }

    // aprovar(aluno: AlunoDto, doc: AlunoDocument) {
    //     //var index1 = this.docsViewModel.findIndex(d => d.id == doc.docId)
    //     // var index1 = this.docsViewModel.findIndex(a => a.id == aluno.id)
    //     // var index2 = this.docsViewModel[index1].documentos.findIndex(a => a.docId == doc.docId)
    //     // console.log(index1)
    //     // console.log(index2)

    //     // this.docsViewModel[index1].documentos[index2].analisado = true
    //     // this.docsViewModel[index1].documentos[index2].validado = true
    //     var param = { alunoId: aluno.id, docId: doc.docId, validado: true }

    //     this._http.put(`${this.baseUrl}/estagios`, param, {

    //     }).subscribe(resp => { },
    //         (error) => { console.log(error) },
    //         () => {

    //             var index1 = this.docsViewModel.findIndex(a => a.id == aluno.id)
    //             var index2 = this.docsViewModel[index1].documentos.findIndex(a => a.docId == doc.docId)
    //             this.docsViewModel[index1].documentos[index2].analisado = true
    //             this.docsViewModel[index1].documentos[index2].validado = true


    //         })

    //     //this.analise = true
    // }

    // reprovar(aluno: AlunoDto, doc: AlunoDocument) {


    //     var param = { alunoId: aluno.id, docId: doc.docId, validado: false }
    //     this._http.put(`${this.baseUrl}/estagios`, param, {

    //     }).subscribe(resp => { },
    //         (error) => { console.log(error) },
    //         () => {

    //             var index1 = this.docsViewModel.findIndex(a => a.id == aluno.id)
    //             var index2 = this.docsViewModel[index1].documentos.findIndex(a => a.docId == doc.docId)
    //             this.docsViewModel[index1].documentos[index2].analisado = true
    //             this.docsViewModel[index1].documentos[index2].validado = false

    //         })
    // }

    // getInfoEstagios() {

    //     this._http.get(`${this.baseUrl}/estagios/documentos`)
    //         .subscribe(result => {

    //             console.log(result)
    //             Object.assign(this.docsViewModel, result['documentos'])
    //            // Object.assign(this.estagios, result['estagios'])

    //             console.log(this.docsViewModel)
    //         },
    //             (error) => { console.log(error) },
    //             () => { })
    // }
    //EstagioCadastroComponent     cadastroEstagio
    // cadastroEstagio(): void {
    // const dialogRef = this._cadastroEstagioModal
    //     .open(EstagioCadastroComponent, {
    //         height: 'auto',
    //         width: '600px',

    //         data: { Hello: "Hello World" },
    //         hasBackdrop: true,
    //         disableClose: true
    //     });


    // dialogRef.afterClosed().subscribe((data) => {
    //     if (data.clicked === "Ok") {
    //         // Reset form here
    //         console.log('afte close ok')
    //         //this.getColaboradores(1, this.pageSize);
    //     } else if (data.clicked === "Cancel") {
    //         // Do nothing. Cancel any events that navigate away from the
    //         // component.
    //     }
    // });
    // }

}

