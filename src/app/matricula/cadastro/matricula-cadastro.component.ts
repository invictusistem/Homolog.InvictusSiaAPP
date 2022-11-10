import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { ConfirmAcaoModalComponent } from "src/app/_shared/components/acao-confirm/confirm-acao.component";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { ConfirmAcaoModalConfig } from "src/app/_shared/services/shared.modal";
import { OpenRelatorioMatriculaComponentModal } from "../services/mat-modal";
import { MatriculaService } from "../services/matricula.service";
import { NovaMatriculaCreateComponent } from "./create/matricula-criar.component";
import { MatriculaLoteComponent } from "./matricula-lote/matricula-lote.component";
import { RelatorioMatriculaComponent } from "./relatorio/matricula-relatorio.component";
import { OpenMatriculaLoteModal } from '../services/mat-modal'
import { AlunoEditComponent } from "src/app/pedagogico/alunos/edit/aluno-edit.component";
import { AlunoMatriculaComponent } from "src/app/pedagogico/alunos/matricular/aluno-matricula.component";
import { InfoFinancPedagComponent } from "src/app/pedagogico/alunos/financeiro-informacoes/infofinanc.component";
import { InfoFinancComponentModal, OpenInfoComponentModal } from "../../pedagogico/services/pedag-modal"
import { BoletimAlunoComponent } from "src/app/pedagogico/alunos/boletim/boletim.component";
import { InfosComponent } from "src/app/pedagogico/alunos/informacoes-matricula/infos.component";
import { CreateCursoComponent } from "src/app/administrativo/turmas/create/turma-create.component";
import { OpenCreateCursoModalConfig } from "src/app/administrativo/services/adm-modal";


@Component({
  selector: "nova-matricula-app",
  templateUrl: './matricula-cadastro.component.html',
  styleUrls: ['./matricula-cadastro.component.scss'],
  animations: [HighlightTrigger]
})


export class MatriculaCadastroComponent implements OnInit {

  showMessageNoAluno = false
  length: number = 0
  mensagem: string = "";
  // length: number;
  pageSize: number = 5;
  pageEvent!: PageEvent;
  pageIndexNumber: number = 0;
  private jwtHelper = new JwtHelperService();
  public tokenInfo: TokenInfos = new TokenInfos();
  // formSubmitted: boolean = false;
  // showTable: boolean = false;
  // paginationInfo: IPager;
  // showMessage: boolean = false;
  spinnerSearch = false
  showMessageNoColaborador = false
  //params: Parametros = new Parametros()
  alunos: any[] = new Array<any>();
  currentPage = 1

  public pesquisarForm!: FormGroup

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    //private _snackBar: MatSnackBar,
    private _newMatService: MatriculaService,
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

  podeDesable = false
  get mostrarEmLote() {
    return this.tokenInfo.role == 'SuperAdm'
  }
  public SalvarEmLote(): void {
    const dialogRef = this._modal
      .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
    dialogRef.afterClosed().subscribe((data) => {
      if (data.clicked == true) {
        this.podeDesable = true
        this._http.get(`https://localhost:5001/api/teste/readexcelalunos`)
          .subscribe(
            resp => { this.podeDesable = false },
            error => { this.podeDesable = false }
          )
      }
    });
  }

  public DeletarRegistroDaPlanilha(): void {
    const dialogRef = this._modal
      .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
    dialogRef.afterClosed().subscribe((data) => {
      if (data.clicked == true) {
        this.podeDesable = true
        this._http.get(`https://localhost:5001/api/teste/delete-registros`)
          .subscribe(
            resp => { this.podeDesable = false },
            error => { this.podeDesable = false }
          )
      }
    });
  }

  public MatricularRegistroDaPlanilha(): void {
    const dialogRef = this._modal
      .open(MatriculaLoteComponent, OpenMatriculaLoteModal());
    dialogRef.afterClosed().subscribe((data) => {
      if (data.confirm == true) {
        console.log('salvar')
        console.log(data.form)
        this.podeDesable = true
        this._http.post(`https://localhost:5001/api/teste/matricular-registros`, data.form, {})
          .subscribe(
            resp => { this.RespMats(resp) },
            error => { this.podeDesable = false }
          )
      }
    });
  }

  one = new Promise<string>((resolve, reject) => { });
  listaCpfs: any[] = new Array<any>()
  aluCont = 1
  RespMats(resp: any) {
    console.log('send command')
    console.log(resp['commands'].length)
    //console.log(this.aluCont)
    let commands = resp['commands']

    // this.one.then(value => {
    //     console.log('resolved', value);
    //   });

    // commands.forEach(async element => {
    //    this.MatricularFinal(element)

    // });
    this.MatricularFinal(commands)
  }

  // funcao(CPFs) {
  //     let fit = Object.assign([], CPFs)
  //     console.log(fit)
  //     const jarOfPromises =[];
  //     fit.forEach(Module => {
  //     jarOfPromises.push(
  //       this._http.get(`https://localhost:5001/api/teste/matricular-final-registros/${Module}`)
  //       .toPromise())
  //     });

  //     Promise.all(jarOfPromises).then(results=>{
  //         console.log(results)
  //     /** your code **/
  //     });
  // }

  index = 0
  totalItens = 0
  commands: any[] = new Array<any>()
  public async MatricularFinal(command?: any, item?: any) { // matricular-registros
    //console.log(item)
    //console.log(command)
    //console.log(this.ids)
    this.aluCont++
    if (item == undefined) { this.totalItens = command.length; this.commands = command }
    // if(id != undefined)

    this.podeDesable = true
    //console.log('matricula final')
    //if(id.length)
    this._http.post(`https://localhost:5001/api/teste/matricular-final-registros/${this.commands[this.index].turmaId}/${this.commands[this.index].alunoId}`, this.commands[this.index])
      .subscribe(
        resp => {
          //console.log('retorno matricula')
          this.index = this.index + 1
          console.log(this.index)
          this.MatricularFinal(undefined, this.commands[this.index])

        },
        error => {
          // console.log('erro')
        }
      )
  }



  ngOnInit() {
    const token: any = localStorage.getItem('jwt')
    this.tokenInfo = this.jwtHelper.decodeToken(token)
  }

  openCreateCursoModal(): void {
    const dialogRef = this._modal
        .open(CreateCursoComponent, OpenCreateCursoModalConfig());
    dialogRef.afterClosed().subscribe((result: any) => {
        if (result.clicked === "OK") {
            //this.getCursos();
           // console.log('afte close ok')
        }
    });
}

  public OpenRelatorioMatricula(): void {
    const dialogRef = this._modal
      .open(RelatorioMatriculaComponent, OpenRelatorioMatriculaComponentModal());
    dialogRef.afterClosed().subscribe((data) => {
      if (data.clicked === "OK") {
      } else if (data.clicked === "Cancel") {
      }
    });
  }

  submitPesquisa(event?: any) {

    this.showMessageNoColaborador = false

    //if (this.pesquisarForm.valid) {
    this.spinnerSearch = true

    if (event != undefined) {
      this.currentPage = event.pageIndex + 1
    } else {
      this.currentPage = 1
      this.alunos = new Array<any>()
    }


    this._newMatService.getAlunos(this.pageSize, this.currentPage, this.pesquisarForm.value)
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

    this.spinnerSearch = false
    if (event != undefined) {
      this.pageIndexNumber = (event.pageIndex * this.pageSize)
    } else {
      this.pageIndexNumber = 0

      this.paginator.firstPage();
    }

  }

  processarFalha(fail: any) {

    // if (fail['status'] == 404) {
    //     this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
    //     this.showMessageNoColaborador = true
    //     this.colaboradores = new Array<any>();
    // }
    // if (fail['status'] != 404) {
    //     this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
    //     this.showMessageNoColaborador = true
    //     this.colaboradores = new Array<any>();
    // }

    // this.spinnerSearch = false
  }

  openMatriculaModal(): void {
    const dialogRef = this._modal
      .open(NovaMatriculaCreateComponent, {
        height: 'auto',
        width: '1000px',
        autoFocus: false,
        hasBackdrop: true,
        disableClose: true
      });

    dialogRef.afterClosed().subscribe((data) => {
      if (data.clicked === "OK") {


      } else if (data.clicked === "Cancel") {

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

        this.submitPesquisa();

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
        this.submitPesquisa();

      } else if (data.clicked === "Cancel") {

      }
    });
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

  openInfoFinancModal(aluno: any): void {
    const dialogRef = this._modal
      .open(InfoFinancPedagComponent, InfoFinancComponentModal(aluno));
    dialogRef.afterClosed().subscribe(
      data => { });
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

}

// function OpenInfoComponentModal(aluno: any): import("@angular/material/dialog").MatDialogConfig<any> | undefined {
//     throw new Error("Function not implemented.");
// }
// function InfoFinancComponentModal(aluno: any): import("@angular/material/dialog").MatDialogConfig<any> | undefined {
//     throw new Error("Function not implemented.");
// }

