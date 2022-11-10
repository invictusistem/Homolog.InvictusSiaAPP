// Aluno-docs


// AlunosAcesso


// Analise-docs


// estagios

export function CreateEstagioModalConfig(data?:any) {
    return {
        //height: '520px',
        width: '700px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function EstagioTipoModalConfig(data?:any) {
    return {
        //height: '600px',
        width: '700px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function EditEstagioModalConfig(estagio:any) {
    return {
        width: '700px',
        data: { estagio: estagio },
        hasBackdrop: true,
        disableClose: true
    }
}

// estagio-controle

export function EstagioMatriculaModalConfig(aluno:any) {
    return {
        width: '700px',
        data: { aluno: aluno },
        hasBackdrop: true,
        disableClose: true
    }
}

export function MatriculaLiberarModalConfig(info:any) {
    return {
        width: '550px',
        data: { info: info },
        hasBackdrop: true,
        disableClose: true
    }
}

export function DocumentacaoModalConfig(aluno:any) {
    return {
        //height: '600px',
        width: '1100px',
        data: { aluno: aluno },
        hasBackdrop: true,
        disableClose: true
    }
}

// matricula


// pedag-alunos


//pedag-models


// relatorios


// reposicoes


// transferencia


// turmapedag



// Requerimento

export function CreateRequerimentoModalConfig(data?:any) {
    return {
        //height: '520px',
        width: '700px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function EditRequerimentoModalConfig(req:any) {
  return {
      height: '580px',
      width: '700px',
      data: { req: req },
      hasBackdrop: true,
      disableClose: true
  }
}

export function CreateCategoriaModalConfig(data?:any) {
    return {
        width: '580px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function EditCategoriaModalConfig(catId?:any) {
    return {
        width: '580px',
        data: { id: catId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function CreateTipoModalConfig(cat?:any) {
    return {
        width: '480px',
        data: { cat: cat },
        hasBackdrop: true,
        disableClose: true
    }
}

export function EditarTipoModalConfig(id?:any) {
    return {
        width: '480px',
        data: { id: id },
        hasBackdrop: true,
        disableClose: true
    }
}


//turmaInfos



export function InfoFinancComponentModal(data?:any){
    return {
        width: '1050px',
        data: { aluno: data },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenMatriculaCalendariotModal(matricula?:any){
  return {
    width: '1230px',
    data: { matricula: matricula },
    hasBackdrop: true,
    disableClose: true
}
}


export function OpenInfoComponentModal(aluno?:any){
    return {
        width: '1000px',
        data: { aluno: aluno },
        hasBackdrop: true,
        disableClose: true
    }
}

export function ConfirmMatriculaModalConfig(matriculaId?:any){
    return {
        height: '180px',
        width: '500px',
        data: { matriculaId: matriculaId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function DetalheAcessoModalConfig(aluno:any){
    return {
        width: '700px',
        data: { aluno: aluno },
        hasBackdrop: true,
        disableClose: true
    }
}

// TurmasInfos

export function ObsTurmaModalConfig(caled:any){
    return {
        width: '700px',
        data: { caled: caled },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenAlunoReposicaoModalConfig(caled:any,matriculaId:any){
  return {
      width: '900px',
      data: { caled: caled, matriculaId: matriculaId },
      hasBackdrop: true,
      disableClose: true
  }
}

export function AulaEditModalConfig(caled:any){
    return {
        width: '700px',
        data: { caled: caled },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenCertificadoComponentModal(matricula?:any){
    return {
        width: '500px',
        data: { matricula: matricula },
        hasBackdrop: true,
        disableClose: true
    }
}


export function OpenCalendarioPresencaomponentModal(calendario?:any){
    return {
        width: '1030px',
        data: { calendario: calendario },
        hasBackdrop: true,
        disableClose: true
    }
}

// Diario de Claase

export function OpenPresencaComponentModal(turma?:any){
    return {
        width: '1030px',
        data: { turma: turma },
        hasBackdrop: true,
        disableClose: true
    }
}


