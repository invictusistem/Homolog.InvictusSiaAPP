export class Produto{
    constructor(
        public id?: number,
        public codigoProduto?: string,
        public nome?: string,
        public descricao?: string,
        public preco?: number,
        public precoCusto?: number,
        public quantidade?: number,
        public nivelMinimo?: number,
        public unidadeId?: number,
        public dataCadastro?: Date,
        public observacoes?: string
    ){

        //this.preco.toFixed(2) 
    }

   
}

export class CompraProdutoCommand{
    constructor(
        public meioPagamento?: string,
        public parcelas?: string,
        public valorTotal?: number,
        public cpf_comprador?: string,
        public matriculaAluno?: string,
        public produtos?: ProdutosCommand[]
    ){
        this.produtos = new Array<ProdutosCommand>();
    }
}

export class ProdutosCommand{
    constructor(
        public id?: number,
        public codigoProduto?: string,
        public nome?: string,
        public descricao?: string,
        public preco?: number,
        public precoCusto?: number,
        public quantidadeComprada?: number,
        public nivelMinimo?: number,
        public unidadeId?: number,
        public dataCadastro?: Date,
    ){

    }
}