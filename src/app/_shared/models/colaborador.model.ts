import { Materias } from "./Turma.model";

export class Colaborador {

    constructor(
        public id?:string,
        public nome?: string,
        public email?: string,
        public cpf?: string,
        public celular?: string,
        public cargo?: string,
        public unidade?: string,
        public perfil?: string,
        public perfilAtivo?: boolean,
        public ativo?: boolean,
        public cep?: string,
        public logradouro?: string,
        public complemento?: string,
        public numero?: string,
        public bairro?: string,
        public cidade?: string,
        public uf?: string
        ) { }

}


export class Professor {

    constructor(
        public id?:string,
        public nome?: string,
        public email?: string,
        public materias?: Materias[]
        ) { }

}