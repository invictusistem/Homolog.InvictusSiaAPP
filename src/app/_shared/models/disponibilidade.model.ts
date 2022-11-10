export class DisponibilidadeDto {
    constructor(
        public horarioDisponivelView?: string,
        public diaSemana?: string,
        public diaSemanaView?: string,
        public diaData?: Date,
        public horarios?: HorariosViewDto[]
    ) { }
}

export class HorariosViewDto {
    constructor(
        public inicio?: string,
        public fim?: string,
    ) { }
}
//vV2

export class DisponibilidadeDtoV2 {
    constructor(
        public horarioDisponivelView?: string,
        public availabilityDayOne?: DisponibilidadeDayOneDtoV2,
        public availabilityTwo?: DisponibilidadeDayTwoDtoV2[]
    ) { }
}

export class DisponibilidadeDayOneDtoV2 {
    constructor(
        public diaSemana?: string,

        public horaIni?: Date,
        public horaFim?: Date,
        public ranges?: RangeDatas[],
        //
        public diaSemanaView?: string,
        public diaData?: Date
    ) { }
}

export class RangeDatas {
    constructor(
        public item1?: Date,
        public item2?: Date
    ) {

    }
}

export class DisponibilidadeDayTwoDtoV2 {
    constructor(
        public diaSemana?: string,
        public horaIni?: Date,
        public horaFim?: Date,
        //
        public diaSemanaView?: string,
        public diaData?: Date
    ) { }
}