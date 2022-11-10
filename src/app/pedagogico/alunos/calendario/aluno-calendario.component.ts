import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HighlightTrigger } from 'src/app/_shared/animation/animation';
import { AcaoConfirmarDinamicoComponent } from 'src/app/_shared/components/acao-confirm-dinamico/acao-confirmar-dinamico.component';
import { TokenInfos } from 'src/app/_shared/models/token.model';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { ConfirmAcaoDinamicaModalConfig } from 'src/app/_shared/services/shared.modal';
import { environment } from 'src/environments/environment';
import { ObsTurmaModalConfig, OpenAlunoReposicaoModalConfig } from '../../services/pedag-modal';
import { AlunoReposicaoComponent } from './reposicao/aluno-reposicao.component';

@Component({
  selector: 'app-aluno-calendario',
  templateUrl: './aluno-calendario.component.html',
  styleUrls: ['./aluno-calendario.component.scss'],
  animations: [HighlightTrigger]
})
export class AlunoCalendarioComponent extends BaseComponent implements OnInit {

  alunoNome: string = ''
  alunoMatricula: string = ''
  //private _baseUrl = environment.baseUrl
  public showSpin = false
  //public initProgressBar = 'visible'
  public ShowTableHeader = false
  public calendarios: any[] = new Array<any>()

  //length: number = 0
  // pageSize: number = 10;
  //pageEvent!: PageEvent;
  //pageIndexNumber: number = 0;
  // currentPage = 1
  // @ViewChild(MatPaginator) paginator!: MatPaginator;

  // private jwtHelper = new JwtHelperService();
  // tokenInfo: TokenInfos = new TokenInfos();


  public pesquisarForm!: FormGroup
  constructor(
    private _http: HttpClient,
    private _fb: FormBuilder,
    private _modal: MatDialog,
    override _snackBar: MatSnackBar,
    public _dialogRef: MatDialogRef<AlunoCalendarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);
    this.pesquisarForm = _fb.group({
      nome: [''],
      email: [''],
      cpf: [''],
      ativo: [false],
      todasUnidades: [false],
      todosAlunos: [false],
      primeiraReq: [false]
    });
  }

  ngOnInit() {
    this.alunoNome = this.data['matricula'].nome
    this.alunoMatricula = this.data['matricula'].numeroMatricula
    this.pesquisar(undefined, true)
  }

  private GetCalendarioTurma(turmaId: number) {

    //this._http.get(`${this._baseUrl}/pedag/turma/calendario/${turmaId}`) //calendario-pagination
    this._http.get(`${this.baseUrl}/pedag/turma/calendario-pagination/${turmaId}`)
      .subscribe((resp: any) => {
        //console.log(resp)
        this.calendarios = Object.assign([], resp['calends'])
      },
        (error) => {
          // console.log(error)
          this.showSpin = true
        },
        () => {
          this.ShowTableHeader = true
          this.initProgressBar = 'hidden'
          this.showSpin = true
        })
  }

  pesquisar(event?: any, firstConsult?: boolean) {

    console.log(this.data['matricula'])
    this.initProgressBar = 'visible'
    // this.showMessageNoAluno = false

    //if (this.pesquisarForm.valid || this.tokenInfo['role'] == 'SuperAdm') {

    //  this.spinnerSearch = 'visible'

    if (event != undefined) {
      this.currentPage = event.pageIndex + 1
    } else {
      this.currentPage = 1
    }

    this.pesquisarForm.get('primeiraReq')?.setValue(firstConsult)

    var formJson = JSON.stringify(this.pesquisarForm.value)
    // let path = `/colaboradores/pesquisar/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`
    this._http.get(`${this.baseUrl}/pedag/matricula/calendario-pagination/?matriculaId=${this.data['matricula'].matriculaId}&itemsPerPage=${this.pageSize}&currentPage=${this.currentPage}&paramsJson=${formJson}`).subscribe(
      sucesso => { this.processarSucesso(sucesso, event, firstConsult) },
      fallha => { this.processarFalha(fallha) }
    )

    return event
  }


  initialPage = 0
  processarSucesso(resp: any, event?: any, firstConsult?: any) {
    //console.log(resp['result'].data)
    // console.log(resp['result'].currentPage)
    // console.log(resp['result'].itemsPerPage)
    // console.log(resp['result'].totalItemsInDatabase)
    this.calendarios = Object.assign([], resp['result'].data)



    //OLD
    console.log(resp)
    // this.listAlunos = Object.assign([], response['data']);

    //this.length = resp['result'].totalItemsInDatabase

    // this.spinnerSearch = 'hidden'
    if (event != undefined) {
      this.pageIndexNumber = (event.pageIndex * this.pageSize)
    } else {

      this.pageIndexNumber = (resp['result'].currentPage - 1) * this.pageSize
      //  console.log(this.paginator)
      this.initialPage = resp['result'].currentPage - 1
      if (this.paginator != undefined) {
        //this.paginator.pageIndex = resp['result'].currentPage -1
        //this.initialPage = resp['result'].currentPage -1
        //this.paginator.hasNextPage()
        ///this.paginator.firstPage();
      }
    }
    this.length = resp['result'].totalItemsInDatabase
    this._dialogRef.addPanelClass('pedagcalendar-class')
    this.ShowTableHeader = true
    this.initProgressBar = 'hidden'
    this.showSpin = true

  }

  // ngAfterViewInit() {
  //     setTimeout(() => {
  //      this.paginator.pageIndex = this.initialPage;
  //     }, 10);
  //   }

  processarFalha(fail: any) {
    this.showSpin = true
    this.initProgressBar = 'hidden'
    // if (fail['status'] == 404) {
    //     this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
    //     this.showMessageNoAluno = true
    //     this.listAlunos = new Array<any>();
    // }
    // if (fail['status'] != 404) {
    //     this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
    //     this.showMessageNoAluno = true
    //     this.listAlunos = new Array<any>();
    // }

    // this.spinnerSearch = 'hidden'
  }

  concluirAula() {
    // calendárioId
  }

  get podeEditar() {

    return this.tokenInfo.role == 'SuperAdm'
  }

  public OpenReposicaoModal(cale: any) {

    const dialogRef = this._modal
      .open(AlunoReposicaoComponent, OpenAlunoReposicaoModalConfig(cale, this.data['matricula'].matriculaId));
    dialogRef.afterClosed().subscribe(data => {
    });

  }

  public DeleteReposicao(reposicaoId: any): void {



    const dialogRef = this._modal
      .open(AcaoConfirmarDinamicoComponent, ConfirmAcaoDinamicaModalConfig(
        'Deseja excluir a reposição?'
      ));
    dialogRef.afterClosed().subscribe((data) => {

      if (data.clicked == true) {
        // this.disabledAgendarReposicao = true
        // this.initProgressBar = 'visible'
        // this.reposicao.get('aulaReposicaoId')?.setValue(calendario.calendarioId)

        this._http.delete(`${this.baseUrl}/pedag/matricula/reposicao/${reposicaoId}`)
          .subscribe({
            next: (response: any) => {
              this.OpenSnackBarSucesso('Reposição deletada com sucesso.')
              //this._dialogRef.close({ success: true });
              // TODO atualizar

              var index = this.calendarios.findIndex(i => i.reposicaoId == reposicaoId);
              this.calendarios[index].reposicao = null
              this.calendarios[index].reposicaoId = null

            },
            error: (error) => {

              this.OpenSnackBarErrorDefault();
            }}
          )
      }
    })
  }

  // public GetNotaAulaEdit(caled:any): void {
  //     const dialogRef = this._modal
  //         .open(AulaDetalheModal, ObsTurmaModalConfig(caled));
  //     dialogRef.afterClosed().subscribe(data => {
  //     });
  // }

  // public GetNotaAula(caled:any): void {
  //     const dialogRef = this._modal
  //         .open(TurmaDetalheModal, ObsTurmaModalConfig(caled));
  //     dialogRef.afterClosed().subscribe(data => {
  //     });
  // }

  // openPresencaEdit(calend: any): void {
  //     const dialogRef = this._modal
  //         .open(TurmaPresencaEditComponent, OpenCalendarioPresencaomponentModal(calend));
  //     dialogRef.afterClosed().subscribe(data => {
  //     });
  // }

  // openPresenca(calend: any): void {
  //     const dialogRef = this._modal
  //         .open(CalendPresencaComponent, OpenCalendarioPresencaomponentModal(calend));
  //     dialogRef.afterClosed().subscribe(data => {
  //     });
  // }

  // public EditAula(caled:any): void {
  //     const dialogRef = this._modal
  //         .open(AulaEditarModal, AulaEditModalConfig(caled));
  //     dialogRef.afterClosed().subscribe(data => {
  //         if (data['result'] == true) {
  //             let index = this.calendarios.findIndex((obj => obj.id == data['aula'].id));
  //             this.calendarios[index] = data['aula']
  //             // console.log(this.calendarios[index])

  //         }
  //     });
  // }
}

