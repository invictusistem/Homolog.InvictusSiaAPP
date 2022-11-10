/*
modo: regular - qualificação/especialização - workshop
inicio e fim? pedagógico
Descricao
duracao
online? pedagogico
idade mínima?
MEC reconhecido?
grade curricular


*/

import { Colaborador } from "./colaborador.model";

export class Turma {
    constructor(
        public id?: number,
        public identificador?: string,
        public descricao?: string,
        public prevInicio?: Date,
        public prevtermino?: Date,
        public totalAlunos?: number,
        public iniciada?: Boolean,
        public turno?: string,
        public numAlunos?: number,
        public valor?: string,
        public Professores?: number[]
    ) { }
}

export class TurmaViewModel {
    constructor(
        public id?: number,
        public identificador?: string,
        public descricao?: string,
        public moduloId?: string,
        public turno?: string,
        public vagas?: number,
        public podeIniciar?: boolean,
        public aulaIniciada?: boolean,
        public minimoAlunos?: number,
        public statusDaTurma?: string,
        public totalAlunos?: number,
        public previsionStartOne?: Date,
        public prevtermino?: Date,
        public iniciada?: Boolean,
        public previsaoAtual?: Date,
        public previsaoTerminoAtual?: Date,
        public previsao?: string,
        public professores?: number[],
        public weekDayOne?: string,
        public initialHourOne?: string,
        public calendarioId?: number,
        public finalHourOne?: string,

        public previsoes?: PrevisoesViewModel
    ) { }
}

export class PrevisoesViewModel {
    constructor(
        public PrevisoesId?: number,
        public iniciada?: boolean,
        public previsaoAtual?: string,
        public previsionStartOne?: Date,
        public previsionEndingOne?: Date,
        public previsionStartTwo?: Date,
        public previsionEndingTwo?: Date,
        public previsionStartThree?: Date,
        public previsionEndingThree?: Date
    ) { }
}
// export class Professor{
//     public id?: number,

// }

export class Materias {
    constructor(
        public id?: number,
        public materiaId?: number,
        public descricao?: string,
        public avaliacaoUm?: string,
        public avaliacaoDois?: string,
        public avaliacaoTres?: string,
        public segundaChamadaAvaliacaoUm?: string,
        public segundaChamadaAvaliacaoDois?: string,
        public segundaChamadaAvaliacaoTres?: string,
        public materia?: string,
        public profId?: number,
        public turmaId?: number,
        public turma?: string,
        public moduloId?: number,
        public temProfessor?: boolean

    ) { }
}

export class NotasViewModel {
    constructor(
        public id?: number,
        public materia?: string,
        public dataAv1?: string,
        public dataAv2?: string,
        public dataAv3?: string,
        public alunos?: AlunosNotas[]
    ) { }
}

export class AlunosNotas {
    constructor(
        public alunoId?: number,
        public listaNotasId?: number,
        public materia?: string,
        public nome?: string,
        public av1?: string,
        public av2?: string,
        public av3?: string,
        public disabledv1?: boolean,
        public disabledv2?: boolean,
        public disabledv3?: boolean,
        public historicoId?: number
    ){}
}