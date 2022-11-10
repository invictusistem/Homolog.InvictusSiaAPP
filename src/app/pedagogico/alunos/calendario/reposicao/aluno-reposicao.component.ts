import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AcaoConfirmarDinamicoComponent } from 'src/app/_shared/components/acao-confirm-dinamico/acao-confirmar-dinamico.component';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { ConfirmAcaoDinamicaModalConfig, ConfirmAcaoModalConfig } from 'src/app/_shared/services/shared.modal';

@Component({
  selector: 'app-aluno-reposicao',
  templateUrl: './aluno-reposicao.component.html',
  styleUrls: ['./aluno-reposicao.component.scss']
})
export class AlunoReposicaoComponent extends BaseComponent implements OnInit {

  public disabledAgendarReposicao = false
  public calendarios: any[] = new Array<any>()
  public reposicao: FormGroup;
  constructor(
    override _snackBar: MatSnackBar,
    private _http: HttpClient,
    private _fb: FormBuilder,
    private _modal: MatDialog,
    public _dialogRef: MatDialogRef<AlunoReposicaoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);

    this.reposicao = _fb.group({
      aulaRepostaId: [''],
      aulaReposicaoId: [''],
      matriculaId: ['']
    })
  }

  ngOnInit(): void {
    console.log(this.data['caled'])
    this.reposicao.get('aulaRepostaId')?.setValue(this.data['caled'].calendarioId)
    this.reposicao.get('matriculaId')?.setValue(this.data['matriculaId'])

    this.Pesquisar()
  }

  private Pesquisar() {

    this._http.get(`${this.baseUrl}/pedag/matricula/reposicao-dias-liberados/?calendarioId=${this.data['caled'].calendarioId}&unidadeId=${this.data['caled'].unidadeId}&materiaId=${this.data['caled'].materiaId}`)
      .subscribe(
        {
          next: (response: any) => {
            this.PesquisarSucess(response)
          },
          error: (error) => {
            this.PesquisarFail(error)
          }
        }
      )

    return event
  }

  private PesquisarSucess(response: any) {
    this.calendarios = response['result']
    this.showForm = true
    this.initProgressBar = 'hidden'
  }

  private PesquisarFail(error: any) {

  }
  public AgendarReposicao(calendario: any): void {

    const dialogRef = this._modal
      .open(AcaoConfirmarDinamicoComponent, ConfirmAcaoDinamicaModalConfig(
        'Deseja confirmar o agendamento da reposição?'
      ));
    dialogRef.afterClosed().subscribe((data) => {

      if (data.clicked == true) {
        this.disabledAgendarReposicao = true
        this.initProgressBar = 'visible'
        this.reposicao.get('aulaReposicaoId')?.setValue(calendario.calendarioId)

        this._http.post(`${this.baseUrl}/pedag/matricula/reposicao`, this.reposicao.value)
          .subscribe({
            next: (response: any) => {
              this.OpenSnackBarSucesso('Agendamento realizado com sucesso.')
              this._dialogRef.close({ success: true });
            },
            error: (error) => {
              if (error['status'] == 409) {
                this.OpenSnackBarError('O aluno não tem créditos para repor aula na referida semana.')
              } else {
                this.OpenSnackBarErrorDefault();
              }
              this._dialogRef.close({ success: false });

            }
          })
      }
    })

  }

}
