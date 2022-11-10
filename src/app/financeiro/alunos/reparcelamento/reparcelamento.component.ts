import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { ConfirmarParcelamento } from "./confirmar/reparcelamento-confirmar.component";
import { ReparcelamentoDebito } from "src/app/_shared/models/reparcelamento.model";

@Component({
    selector: 'reparcelamentomodal',
    templateUrl: './reparcelamento.component.html',
    styleUrls: ['./reparcelamento.component.scss']
})

export class ReparcelamentoComponent extends BaseComponent implements OnInit {


    tabs = ['Financeiro', 'Responsável Financeiro', 'Responsável (menor)'
        , 'Financeiro', 'Documentação'];

    public showAluno: boolean = false
    public showRespFinanc: boolean = false
    public showRespMenor: boolean = false
    public nome: string = ''
    public aluno: any;// = new any();
    // public debitos: Debito[] = new Array<Debito>();
    //public debitos: ReparcelamentoDebito[] = new Array<ReparcelamentoDebito>();
    public debitos: any[] = new Array<any>();
    public turma: any
    public originalAluno: any
    public originalRespFin: any
    public originalRespMenor: any

    //private respFinId: number = 0;
    // private respMenorId: number = 0;

    public reparcelamentoform!: FormGroup;
    //public respFinancForm!: FormGroup;
    //public respMenorForm!: FormGroup;

    constructor(
        override _snackBar: MatSnackBar,
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _modal: MatDialog,
        public dialogRef: MatDialogRef<ReparcelamentoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        super(_snackBar);

        this.reparcelamentoform = _fb.group({
            totalSelecionado: ['', [Validators.required, Validators.min(0.01)]],
            juros: [0],
            totalFinal:[''],
            desconto: [0],
            acrescimo: [0],
            vencimento: ['', [Validators.required]],
            valorEntrada: [0],
            parcelas: [1 ,[Validators.required, Validators.min(1)]]// [Validators.required]]
        })
    }

    ngOnInit() {

        this.nome = this.data['aluno'].nome
        // console.log(this.data['aluno'])
        this.getInfoFinancAlunos(this.data['aluno'].matriculaId)
    }

    getInfoFinancAlunos(matriculaId: any) {

        this._http.get(`${this.baseUrl}/financeiro/debitos/${matriculaId}`)
            .subscribe(
                (resp: any) => {
                    this.debitos = Object.assign([], resp['debitos']);
                    this.turma = Object.assign({}, resp['turma']);
                    this.debitos.forEach(element => {

                        element.selected = false;

                    });
                },
                (error) => {
                    this.initProgressBar = 'hidden'
                    //  console.log(error)
                },
                () => {

                    this.initProgressBar = 'hidden'
                    this.showForm = true
                    this.dialogRef.addPanelClass('reparcelamento-class')
                    // console.log(this.debitos);
                })
    }

    public boletoUrl = ""

    //public cepReturn: CepReturn = new CepReturn();

    public localidade = ''
    public uf = ''


    saveEditAluno() {

        //  console.log(this.aluno)

    }

    valorEntrada = 0
    parcelas = 0

    juros = 0
    desconto = 0
    acrescimo = 0

    totalValor = 0
    get totalSelecionado() {
        //console.log('parcelar')
        this.totalValor = 0
        this.debitos.forEach((element: any) => {
            if (element.selected == true) {
                this.totalValor += element.valor
            }
        });

        this.reparcelamentoform.get('totalSelecionado')?.setValue(this.totalValor.toFixed(2))
        //console.log(`R$ ${this.totalValor.toFixed(2)}`)
        return `R$ ${this.totalValor.toFixed(2)}`
    }

    totalFinal = 0
    get totalParcelar() {
        //console.log('parcelar')
        this.totalFinal = this.totalValor + this.juros - this.desconto + this.acrescimo
        this.reparcelamentoform.get('totalFinal')?.setValue(this.totalFinal)
        return `R$ ${this.totalFinal.toFixed(2)}`
    }

    //vencimento: any;


    vencimento: any
    onFocusOutDateEvent(event: any) {
        var data;

        if (event.target.value.length == 10) {
            var data = event.target.value.split('/')
            // console.log(data)
            var dataForm: Date = new Date(parseInt(data[2]), parseInt(data[1]) - 1,
                parseInt(data[0]))

            this.vencimento = dataForm.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })//dataForm.getDay
            //this.valor = dataForm//.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })//dataForm.getDay
        }


    }

    debitosIds: any[] = new Array<any>()

    public Calcular(): void {
        console.log(this.debitos)
        this.debitosIds = new Array<any>()
        this.debitos.forEach((element: any) => {
            if (element.selected == true) {
                this.totalValor += element.valor
                this.debitosIds.push(element.id)
            }
        });
         console.log(this.debitosIds)
        const dialogRef = this._modal
            .open(ConfirmarParcelamento, {
                height: 'auto',
                width: '600px',
                autoFocus: false,
                // maxHeight: '90vh',

                data: {
                    totalFinal: this.reparcelamentoform.get('totalFinal')?.value, //colocar no form tb
                    debitosIds: this.debitosIds, // ok
                    parcelas: this.reparcelamentoform.get('parcelas')?.value, //trazer do form
                    vencimento: this.reparcelamentoform.get('vencimento')?.value, // trazer do form
                    valorEntrada: this.reparcelamentoform.get('valorEntrada')?.value // trazer do form
                },
                hasBackdrop: true,
                disableClose: true
            });

        dialogRef.afterClosed().subscribe(data => {
          //  this.getInfoFinancAlunos(this.data['aluno'].id)

            if (data.clicked == true) {
                this.getInfoFinancAlunos(this.data['aluno'].id)
            } 
                });
    }
}












