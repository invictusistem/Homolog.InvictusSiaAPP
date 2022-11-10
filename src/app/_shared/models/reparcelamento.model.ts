export class ReparcelamentoDebito {
    constructor(
        public id?: string,
        public vencimento?: Date,
        public dataPagamento?: Date,
        public valor?: number,
        public valorPago?: number,
        public juros?: number,
        public jurosFixo?: number,
        public multa?: string,
        public multaFixo?: string,
        public desconto?: string,
        public diasDesconto?: string,
        public statusBoleto?: string,
        public reparcelamentoId?: string,
        public centroCustoUnidadeId?: string,
        public informacaoDebitoId?: string,
        //public BoletoResponseInfo InfoBoletos { get; private set; }
        public id_unico?: string,
        public id_unico_original?: string,
        public status?: string,
        public msg?: string,
        public nossonumero?: string,
        public linkBoleto?: string,
        public linkGrupo?: string,
        public linhaDigitavel?: string,
        public pedido_numero?: string,
        public banco_numero?: string,
        public token_facilitador?: string,
        public credencial?: string,
        public selected?: boolean
    ) {

    }
}