export class NotasDisciplinas{
    constructor(
        public id?: number,
        public nome?: string,
        public trimestre?: number,
        public avaliacaoUm?: string,
        public segundaChamadaAvaliacaoUm?: string,
        public avaliacaoDois?: string,
        public segundaChamadaAvaliacaoDois?: string,
        public avaliacaoTres?: string,
        public segundaChamadaAvaliacaoTres?: string,
        public materiaId?: number,
        public materiaDescricao?: string,
        public resultado?: string,
        public alunoId?: number,
        public turmaId?: number,
        public boletimEscolarId?: number,
    ){

    }
}