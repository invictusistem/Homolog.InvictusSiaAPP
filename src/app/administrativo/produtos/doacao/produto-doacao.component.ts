import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MeioPagamento } from "src/app/_shared/models/perfil.model";
import { Parcelas } from "src/app/_shared/models/utils.model";
import { CompraProdutoCommand, ProdutosCommand } from "src/app/_shared/models/produto.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";

@Component({
    selector: 'produto-doacaomodal',
    templateUrl: './produto-doacao.component.html',
    styleUrls: ['./produto-doacao.component.scss'],
    animations: [HighlightTrigger]
})

export class ProdutoDoacaoComponent extends BaseComponent implements OnInit {

    // baseUrl = environment.baseUrl;

    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public meioPagamento = MeioPagamento
    public showParcelas = false;
    public msg = ""
    public showMgs = false
    public produtosCesta: any[] = new Array<any>();
    public totalParcelas?: number
    public parcelas = Parcelas
    public unidades: any;
    public unidadeId: number = 0;
    public produtos: any[] = new Array<any>();
    public produto: any;
    public doacaoForm: FormGroup
    public qntProduto: number = 1


    constructor(
        override _snackBar: MatSnackBar,
        //private _snackBar: MatSnackBar,
        private router: Router,
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _modal: MatDialog,
        public dialogRef: MatDialogRef<ProdutoDoacaoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(_snackBar);
        this.doacaoForm = _fb.group({
            produtoId: [''],
            unidadeDonatariaId: ['', [Validators.required]],
            qntDoada: ['']
        })

        // produtoId, UnidadeDonatariaId, Qnt Doada
    }


    //showForm = false
    ngOnInit() {
        const token: any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)
        //  console.log(this.tokenInfo)

        console.log(this.data['produto'])
        this.GetProdutoDoacao();
        this.produtos = Object.assign([], this.data['produto'])
        this.productCommand = Object.assign({}, this.data['produto'])
        this.productCommand.quantidadeComprada = 1;
        this.compraProdutoCommand.produtos?.push(this.productCommand)
        //this.produtos.push(this.data['produto'] as Produto)
    }

    // messageError = ""
    showeMsgError = false
    GetProdutoDoacao() {

        this._http.get(`${this.baseUrl}/produto/doacao/${this.data['produto'].id}/${this.data['produto'].observacoes}`)
            .subscribe((resp: any) => {
                this.unidades = Object.assign([], resp['unidades'])
                this.produto = Object.assign({}, resp['produto'])
                console.log(this.produto)
                this.initProgressBar = 'hidden'
            },
                (err) => {
                    this.initProgressBar = 'hidden'
                    // console.log(err)
                    // this.messageError = "Não há unidade outras cadastradas"
                    this.showeMsgError = true
                },
                () => {
                    this.showForm = true
                })
    }


    onSubmit() {

        if (this.doacaoForm.valid) {
            this.disabledSaveButton = 'visible'
            this.doacaoForm.get('produtoId')?.setValue(this.produto.id)
            this.doacaoForm.get('qntDoada')?.setValue(this.qntProduto)

            this._http.post(`${this.baseUrl}/produto/doacao`, this.doacaoForm.value, {})
                .subscribe(response => {

                    //  console.log(response)

                }, (err) => {
                    this.disabledSaveButton = 'hidden'
                    // console.log(err)
                    // console.log(err['error'].mensagem)
                    this.OpenSnackBarErrorDefault()

                },
                    () => {

                        this.OpenSnackBarSucesso("Doação efetuada com sucesso.")

                        this.dialogRef.close({ clicked: "Ok" });
                    });
        }
    }

    get disabledButton() {
        if (this.doacaoForm.valid) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }

    get disabledAdd() {
        return this.qntProduto == this.produto.quantidade
    }

    add() {
        if (this.qntProduto == this.produto.quantidade) {

        } else {
            this.qntProduto++
        }


        // var index = this.compraProdutoCommand.produtos.indexOf(product)
        // var qntAtual = this.compraProdutoCommand.produtos[index].quantidadeComprada
        // this.compraProdutoCommand.produtos[index].quantidadeComprada = qntAtual + 1
    }

    remove() {


        // var index = this.compraProdutoCommand.produtos.indexOf(product)
        // var qntAtual = this.compraProdutoCommand.produtos[index].quantidadeComprada
        if (this.qntProduto == 1) {

        } else {
            this.qntProduto--
        }

    }

    get valorTotalVenda() {


        var sum = 0
        this.compraProdutoCommand.produtos?.forEach((element: any) => {
            sum += element.quantidadeComprada * element.preco
        });

        this.compraProdutoCommand.valorTotal = sum

        // console.log(sum);
        // console.log(this.compraProdutoCommand.valorTotal)

        var valorTotal = this.produto.preco * this.qntProduto
        var sum2 = sum.toFixed(2)

        return `R$ ${valorTotal.toFixed(2)}`
    }

    deletar(product: any) {

        var index: any = this.compraProdutoCommand.produtos?.indexOf(product)
        //this.compraProdutoCommand.produtos[index] 
        this.compraProdutoCommand.produtos?.splice(index, 1);

    }


    private productCommand: ProdutosCommand = new ProdutosCommand();

    public compraProdutoCommand: CompraProdutoCommand = new CompraProdutoCommand();


    parcelasTotais: any
    // saveEdit(form: any) {
    //     console.log(form.value['totalParcelas'])
    //     console.log(this.compraProdutoCommand)

    //     this.compraProdutoCommand.parcelas = this.parcelasTotais

    //     console.log(this.compraProdutoCommand.meioPagamento)

    //     console.log(this.meioPagamento)
    //     if (this.compraProdutoCommand.produtos.length == 0) return

    //     var sendForm = JSON.stringify(this.compraProdutoCommand)
    //     console.log(sendForm)

    //     this._http.post(`${this.baseUrl}/financeiro/produto-doacao-unidades/${this.unidadeId}`,
    //         this.compraProdutoCommand, {
    //     })
    //         .subscribe(resp => { },
    //             (error) => { console.log(error) },
    //             () => {
    //                 this.dialogRef.close({ clicked: "Ok" });
    //             })

    //     console.log(this.compraProdutoCommand)

    // }

}