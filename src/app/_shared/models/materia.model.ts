export class Materia {
    constructor(
        public id?: number,
        public descricao?: string,
        public qntAulas?: number,
        public semestre?: number,
        public cargaHoraria?: number,
        public moduloId?: number,
        public modalidade?: string
    ) { }
}