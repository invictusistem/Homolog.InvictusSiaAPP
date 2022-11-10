export class DocumentoAlunoDto {
    constructor(
        public id?: string,
        public matriculaId?: string,
        public descricao?: string,
        public comentario?: string,
        public nome?: string,
        public docEnviado?: Boolean,
        public analisado?: Boolean,
        public tamanho?: number,
        public validado?: Boolean,
        public tipoArquivo?: string,
        public contentArquivo?: string,
        public dataCriacao?:Date,
        public prazoValidade?: number,
        public turmaId?: string,
        public salvando: Boolean = false
    ) { }
}

