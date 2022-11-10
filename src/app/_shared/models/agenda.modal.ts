export class AgendaProvas{
    constructor(
        public id?: number,
        public avaliacaoUm?: string,
        public segundaChamadaAvaliacaoUm?: string,
        public avaliacaoDois?: string,
        public segundaChamadaAvaliacaoDois?: string,
        public avaliacaoTres?: string,
        public segundaChamadaAvaliacaoTres?: string,
        public materiaId?: number,
        public materia?: string,
        public turmaId?: number,
    ){

    }
}