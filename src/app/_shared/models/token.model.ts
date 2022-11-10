export class TokenInfos {
    constructor(
        public Nome?: string,
        public Unidade?: string,
        public UnidadeId?: string,
        public Codigo?: string,
        public UnidadeBairro?: string,
        public UnidadesAutorizadas?: string,
        public Telas?:string[],
        public role?: string,
        public email?: string
    ) { }
}