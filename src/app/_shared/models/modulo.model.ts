import { Materia } from "./materia.model";

export class Modulo {
    constructor(
    public id?: number,
    public descricao?: string,
    public duracaoMeses?: number,
    public preco?: string,
    public unidadeId?: number,
    public typePacoteId?: number,
    public materias?: Materia[]
    ){}
}