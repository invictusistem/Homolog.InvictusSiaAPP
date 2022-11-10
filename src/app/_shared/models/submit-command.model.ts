export class submitMatriculaForm {
    constructor(
        public idAluno?: number,
        public idTurma?: number,
        public ciencia?: string,
        public meioPagamento?: string,
        public parcelas?: string,
        public diaVencimento?: string,
        public percentualDesconto?: number,
        public primeiraParceJaPaga?: Boolean,
        //public aVista?: Boolean
    ) { }
}