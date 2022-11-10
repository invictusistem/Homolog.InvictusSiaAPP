export class ListaPresencaDto {
    constructor(
        public nome?: string,
        public id?: number,
        public calendarioId?: number,
        public isPresent?: boolean,
        public isPresentToString?: string,
        public alunoId?: number,
    ) { }
}

export class InfoDia {
    constructor(
        public id?: number,
        public diaAula?: Date,
        public titulo?: string,
        public descricao?: string,
        public nome?: string) {

    }
}