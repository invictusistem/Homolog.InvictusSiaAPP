
export class InfoFinanceiras {
    constructor(
        public id?: number,
        public alunoId?: number,
        public turmaId?: number,
        public parcelas?: number,
        public entrada?: ValorEntrada,
        public debitos?: Debito[]

    ) {

    }
}

export class ValorEntrada{
    constructor(
        public descricao?: string,
        public valor?:number,
        public vencimento?:Date,
        public dataPagamento?:Date,
        

    ){

    }
}

export class Debito{
    constructor(
        public id?: number,
        public competencia?: Date,
        public status?:string,
        public valorTitulo?: number,
        public valorPago?: number,
        public dataVencimento?: Date,
        public dataPagamento?: Date,
        public descricao?:string,
        public boletoId?: number
    ){

    }
}
    
  