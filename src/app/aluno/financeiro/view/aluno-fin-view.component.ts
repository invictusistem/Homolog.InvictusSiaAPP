import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HighlightTrigger } from 'src/app/_shared/animation/animation';
import { HelpersService } from 'src/app/_shared/components/helpers/helpers.component';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { environment } from 'src/environments/environment';
import { AlunoBoletoComponent } from './boleto/aluno-boleto.component';

@Component({
  selector: 'app-aluno-fin-view',
  templateUrl: './aluno-fin-view.component.html',
  styleUrls: ['./aluno-fin-view.component.scss']
  //animations: [HighlightTrigger]
})
export class AlunoFinViewComponent extends BaseComponent implements OnInit {

  //baseUrl = environment.baseUrl;
  tabs = ['Financeiro', 'Responsável Financeiro', 'Responsável (menor)'
    , 'Financeiro', 'Documentação'];

  public disableGetBoletoButton = false
  public showAluno: boolean = false
  public showRespFinanc: boolean = false
  public showRespMenor: boolean = false
  public nome: string = ''
  public numeroMatricula: string = ''
  public aluno: any;// = new any Aluno = new Aluno();
  public debitos: any[] = new Array<any>();// Debito[] = new Array<Debito>();
  public turma: any;
  public initialSpinner = 'visible'
  public showcontent = false
  public originalAluno: any
  public originalRespFin: any
  public originalRespMenor: any

  private respFinId: number = 0;
  private respMenorId: number = 0;

  // public alunoForm: FormGroup;
  // public respFinancForm: FormGroup;
  // public respMenorForm: FormGroup;

  constructor(
    override _snackBar: MatSnackBar,
    private _helper: HelpersService,
    private _fb: FormBuilder,
    private _http: HttpClient,
    private _modal: MatDialog,
    // private _service: PedagService,
    public dialogRef: MatDialogRef<AlunoFinViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

  }

  ngOnInit() {

    this.nome = this.GetTokenInfos().Nome!// this.data['aluno'].nome
    // console.log(this.data['aluno'])
    this.numeroMatricula = this.GetTokenInfos().matricula!//.m Object.assign({}, this.data['aluno'])
    this.GetInfoFinancAlunos()
  }

  private GetInfoFinancAlunos() {
    this.initialSpinner = 'visible'
    console.log('aluno fin')
    var user = this.GetTokenInfos()

    console.log(user)

    this._http.get(`${this.baseUrl}/financeiro/debitos/${user.matriculaId}`)
      .subscribe((resp: any) => {
        this.debitos = Object.assign([], resp['debitos']);
        this.turma = Object.assign({}, resp['turma']);
        //console.log(this.debitos)
      },
        (error) => {
          this._helper.openSnackBarErrorDefault()
          this.showcontent = false
          this.initialSpinner = 'hidden'
          //console.log(error)
        },
        () => {
          this.dialogRef.addPanelClass('infofinanc-class')
          this.showcontent = true
          this.initialSpinner = 'hidden'
          //  console.log(this.debitos);
        })
  }

  public boletoUrl = ""

  getBoleto(debs: any) {


   // window.open(debs.linkBoleto);


    this.disableGetBoletoButton = true
    this._http.get(`${this.baseUrl}/financeiro/debitos/get-boleto/${debs.id}`)
      .subscribe({
        next: (resp: any) => {
          this.boletoUrl = resp['boletoUrl']
          window.open(this.boletoUrl);
          this.disableGetBoletoButton = false
        },
        error: (fail: any) => {
          this.OpenSnackBarErrorDefault()
          this.disableGetBoletoButton = false

        }
      })

  }

  openEdit(debs: any): void {
    const dialogRef = this._modal
      .open(AlunoBoletoComponent, {
        height: 'auto',
        width: '1000px',
        data: { debito: debs, aluno: this.nome, turma: this.turma, matricula: this.numeroMatricula },
        hasBackdrop: true,
        disableClose: true
      });

    dialogRef.afterClosed().subscribe(data => {
      // console.log(data)
      // if (data.clicked == true) {
      //     this.GetInfoFinancAlunos(this.data['aluno'].matriculaId)
      // }
    });
  }

  receber(debs: any): void {
    // const dialogRef = this._modal
    //     .open(ReceberComponent, ReceberComponentModal(debs, this.aluno));
    // dialogRef.afterClosed().subscribe((data) => {

    //     if(data.clicked == true){
    //         this.GetInfoFinancAlunos(this.data['aluno'].matriculaId)
    //     }

    // });
  }



}
