import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MeioPagamento } from 'src/app/_shared/models/perfil.model';
import { Produto } from 'src/app/_shared/models/produto.model';
import { Parcelas } from 'src/app/_shared/models/utils.model';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { environment } from 'src/environments/environment';
import { VendaCaixaPagarComponent } from './pagar/venda-caixa-pagar.component';
import { VendaPesquisaComponent } from './pesquisa/venda-pesquisa.component';
import { PagarProdutoComponentModal } from '../../services/financ-modal';

@Component({
  selector: 'app-venda-caixa',
  templateUrl: './venda-caixa.component.html',
  styleUrls: ['./venda-caixa.component.scss']
})
export class VendaCaixaComponent extends BaseComponent implements OnInit {

  //baseUrl = environment.baseUrl;

  //private jwtHelper = new JwtHelperService();
  //public tokenInfo: TokenInfos = new TokenInfos();
  public meioPagamento = MeioPagamento
  public showParcelas = false;
  public msg = ""
  public showMgs = false
  public produtosCesta: ProdutoCesta[] = new Array<ProdutoCesta>();
  public totalParcelas!: number
  parcelas = Parcelas
  public pesquisaForm: FormGroup
public vendaform: FormGroup
  public produtos: any[] = new Array<any>();
  public alunos: any[] = new Array<any>();

  constructor(
    //private service: AdmService,
    override _snackBar: MatSnackBar,
    private router: Router,
    private _fb: FormBuilder,
    private _http: HttpClient,
    private _modal: MatDialog,
    public dialogRef: MatDialogRef<VendaCaixaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.pesquisaForm = _fb.group({
      name: ['', [Validators.required]]
    })
    this.vendaform = _fb.group({
    matriculaId: ['', [Validators.required, Validators.minLength(5)]],

    })
  }

  ngOnInit() {
    //const token = localStorage.getItem('jwt')
    //this.tokenInfo = this.jwtHelper.decodeToken(token)
    //console.log(this.tokenInfo.Unidade);
    //console.log(this.tokenInfo.Codigo);
    //console.log(this.tokenInfo);
    this.GetAlunosVenda()
  }

  private GetAlunosVenda(){

    this._http.get(`${this.baseUrl}/pedag/matricula`)
    .subscribe({
      next: (resp:any) => { 
        this.alunos = Object.assign([],resp['matriculados'])
       },
      error: (error:any) => {

       }
    })

  }

  get saveVendaButton(){
    if(this.produtosCesta.length == 0){
      return true
    }

    if(this.vendaform.valid){
      return false
    }else{
      return true
    }
  }

  public Search() {

    if (this.pesquisaForm.valid) {

      this._http.get(`${this.baseUrl}/produto/busca/?nome=${this.pesquisaForm.get('name')?.value}`)
        .subscribe({
          next: (resp: any) => { this.SearchResultSucess(resp)},
          error: (error:any) => { this.SearchResultError(error) }
        })
      // MOQ

      //this.SearchResultSucess()
      //this.SearchResultError({ status: 503 })

    }


  }

  public SearchResultSucess(resp?: any) {
    /*
    var itemOne = { id: 'b729baf2-2c4a-4a92-85ba-61aa48ca3263', nome: 'blusa', descricao: 'tamanho P', preco: 99.99, estoque: 5 }
    var itemTwo = { id: '968916f9-c409-49d6-958a-a8aba963b888', nome: 'blusa', descricao: 'tamanho P', preco: 150.00, estoque: 1 }
    var products = new Array<any>()
    products.push(itemOne)
    products.push(itemTwo)
*/


    this.openPesquisaResult(resp['produtos'])

  }

  public SearchResultError(error: any) {
    console.log(error)
    if (error['status'] == 404) {
      this.OpenSnackBarError('Produto não localizado.')
    } else {
      this.OpenSnackBarErrorDefault()
    }
  }



  onSubmit(form: FormGroup) {
    // this.showMensagem = false
    console.log(form)
    console.log(form.value)
    console.log(form.valid)
    //var cel = `${form['celular'].value}`
    //console.log(cel)
    // this.dialogRef.close();
    if (form.valid) {
      console.log('form valid')
      const novoColaborador = JSON.stringify(form.value);
      //this.save(novoColaborador)
      // let newTemplate = this.mapForm(tempForm)

      this._http.post(`${this.baseUrl}/colaboradores`, novoColaborador, {
        //this.http.post("http://api.invictustemp.com.thor.hostazul.com.br/api/identity/login", credentials, {

        // headers: new HttpHeaders({
        //     "Content-Type": "application/json",
        //     "Authorization": "Bear "
        // })
      }).subscribe(response => {

        console.log(response)
        // this.colaboradores = Object.assign([], response['data'])
        // console.log(this.colaboradores)
        // this.dialogRef.close();
      }, (err) => {
        console.log(err)
        console.log(err['error'].mensagem)
        //this.mensagem = err['error'].mensagem
        //this.showMensagem = true
      },
        () => {
          //console.log(response)
          this.openSnackBar()
          //this.showMensagem = false
          this.dialogRef.close({ clicked: "Ok" });
        });
    }
  }

  openSnackBar() {
    this._snackBar.open('Colaborador salvo com sucesso.', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: 'green-snackbar',
      duration: 3 * 1000,
    });
  }



  meioPagamentoSelect(meioPag: any) {

    this.compraProdutoCommand.meioPagamento = meioPag

    console.log(meioPag)

    if (meioPag != "credito") {
      this.showParcelas = false
    } else {
      this.showParcelas = true
    }


  }

  onOkClick() {

    this.dialogRef.close({ clicked: "Ok" });

  }

  fechar() {

    this.dialogRef.close({ clicked: "Ok" });

  }



  add(product?: any) {
    //console.log(product)
    if (product.estoque > product.quantidade) {
      // var index = this.produtosCesta.indexOf(product)
      //this.produtosCesta[index].quantidade = this.produtosCesta[index].quantidade + 1
      product.quantidade++
    } else {
      this.OpenSnackBarError("Não há mais produtos no estoque desta unidade.")
    }




    // var index = this.compraProdutoCommand.produtos.indexOf(product)
    // var qntAtual = this.compraProdutoCommand.produtos[index].quantidadeComprada
    // this.compraProdutoCommand.produtos[index].quantidadeComprada = qntAtual + 1
  }

  remove(product: any) {
    if (product.quantidade > 1) {
      product.quantidade--
    } else {
      //this.OpenSnackBarError("Não há mais produtos no estoque desta unidade.")
    }
  }

  get valorTotalVenda() {

    if (this.produtosCesta.length > 0) {
      var sum = 0
      this.produtosCesta.forEach((element: any) => {
        sum += element.quantidade * element.preco
      });

      //this.compraProdutoCommand.valorTotal = sum

      var sum2 = sum.toFixed(2)

      return `R$ ${sum2}`
    } else {
      return `R$ 0,00`
    }

  }

  deletar(product: any) {

    var index = this.produtosCesta.indexOf(product)

    this.produtosCesta.splice(index, 1);

  }


  private productCommand: any;// = new ProdutosCommand();

  public compraProdutoCommand: any;// = new CompraProdutoCommand();


  openPesquisaResult(products: any[]): void {
    const dialogRef = this._modal
      .open(VendaPesquisaComponent, {
        height: '450px',
        width: '700px',
        //data: { produtos: this.produtos },
        data: { produtos: products },
        hasBackdrop: true,
        disableClose: true
      });


    dialogRef.afterClosed().subscribe((data) => {

      if (data.added == true) {

        var result = this.produtosCesta.find(element => {
          return element.id == data.produto['id']
        })

        if (result == undefined) {

          var produto = new ProdutoCesta().ProdutoFactory(
            data.produto['id'],
            data.produto['nome'],
            data.produto['preco'],
            data.produto['estoque']
          )

          this.produtosCesta.push(produto)


        } else {
          this.OpenSnackBarError('O produto selecionado já se encontra na lista.')
        }

        console.log(this.produtosCesta)
      }
    })
  }
  parcelasTotais: any

  saveEdit() {

    const dialogRef = this._modal
      .open(VendaCaixaPagarComponent, PagarProdutoComponentModal(this.produtosCesta, this.vendaform.get('matriculaId')?.value));
    dialogRef.afterClosed().subscribe((data) => {

      if (data.vendido == true) {
        this.dialogRef.close()
      }

    });

    /*
    this.compraProdutoCommand.parcelas = this.parcelasTotais
    console.log(this.compraProdutoCommand.meioPagamento)
    if (this.compraProdutoCommand.meioPagamento == undefined ||
      this.compraProdutoCommand.meioPagamento == "") return
    console.log(this.meioPagamento)
    if (this.compraProdutoCommand.produtos.length == 0) return

    if (this.compraProdutoCommand.meioPagamento != "dinherio") {
      if (form.valid && form.value['totalParcelas'] != 0) {
        console.log()

      }
    }

    var sendForm = JSON.stringify(this.compraProdutoCommand)
    console.log(sendForm)

    this._http.post(`${this.baseUrl}/financeiro/produto-venda`,
      this.compraProdutoCommand, {
    })
      .subscribe(resp => { },
        (error) => { console.log(error) },
        () => {
          this.dialogRef.close({ clicked: "Ok" });
        })

    console.log(this.compraProdutoCommand)
    */

  }




}

class ProdutoCesta {

  constructor(
    public id?: string,
    public nome?: string,
    public preco?: number,
    public quantidade: number = 1,
    public total: number = 1,
    public estoque?: number
  ) {


  }

  public Total() {

    if (this.preco == undefined) {
      return 0
    } else {
      return this.preco * this.quantidade
    }
  }

  public ProdutoFactory(id: string, nome: string, preco: number, estoque: number) {

    var produto = new ProdutoCesta();
    produto.id = id;
    produto.nome = nome;
    produto.preco = preco;
    produto.quantidade = 1;
    produto.estoque = estoque;

    return produto;

  }

}