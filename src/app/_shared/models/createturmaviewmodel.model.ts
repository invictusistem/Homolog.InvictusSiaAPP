import { Modulo } from "src/app/_shared/models/modulo.model";

export class CreateTurmaViewModel {
    constructor(
        public modulos?: Modulo[],
        public salas?: Sala[],
        //public pacotes?: Pacote[]
        public planos?: PlanoPagamento[]
    ) {

    }
}


export class Pacote {
    constructor(
        public id?: number,
        public descricao?: string,
        public unidadeId?: number
    ) {

    }
}
export class PlanoPagamento {
    constructor(
        public id?: number,
        public pacoteId?: number,
        public descricao?: string,
        public valor?: number,
        public taxaMatricula?: number,
        public parcelamento?: string,
        public materialGratuito?: boolean,
        public bonusMensalidade?: number,
        public contratoId?: number,

    ) {

    }



}


export class Sala{
    constructor(
        public id?: number,
        public descricao?: string,
        public comentarios?: string,
        public capacidade?: number,
        public unidadeId?:number,
        public titulo?:string,

    ){

    }
}


