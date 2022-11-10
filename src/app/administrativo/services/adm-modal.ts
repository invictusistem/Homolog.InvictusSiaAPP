import { HttpEventType } from "@angular/common/http";

//#region /Bolas

export function CreateBolsaModalConfig(usuario?: any) {
    return {
        width: '600px',
        data: { usuario: usuario },
        hasBackdrop: true,
        disableClose: true
    }
}

export function EditBolsaModalConfig(bolsaId?: any) {
    return {
        width: '600px',
        data: { bolsaId: bolsaId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function ShowSenhaModalConfig(senha?: any) {
    return {
        height: '100px',
        width: '130px',
        data: { senha: senha },
    }
}

//#endregion


//#region /Calendario


//#endregion

//#region /Colaboradores

export function EditColaboradorModalConfig(data?: any) {
    return {
        //minHeight: '420',
        width: '710px',
        data: { colaborador: data },
        hasBackdrop: true,
        disableClose: true
    }
}

export function CreateColaboradorModalConfig(data?: any) {
    return {
        //height:'570px',
        width: '710px',
        hasBackdrop: true,
        disableClose: true
    }
}

//#endregion


//#region /Configuracoes



export function OpenCreateMateriaConfig(data?: any) {
    return {
        //height:
        width: '850px',
        data: { data: data },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEditMateriaConfig(matId?: any) {
    return {
        //height:
        width: '850px',
        data: { matId: matId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEditTipoConfig(Id?: any) {
  return {
      //height:
      width: '850px',
      data: { Id: Id },
      hasBackdrop: true,
      disableClose: true
  }
}

export function OpenCreateDocModalConfig(data?: any) {
    return {
        //height:
        width: '700px',
        data: { data: data },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEditDocModalConfig(docId?: any) {
    return {
        //height:
        width: '700px',
        data: { docId: docId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenCreateCargoModalConfig(data?: any) {
    return {
        //height:
        width: '700px',
        data: { data: data },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenCreateTipoModalConfig(data?: any) {
  return {
      //height:
      width: '700px',
      data: { data: data },
      hasBackdrop: true,
      disableClose: true
  }
}

export function OpenEditCargoModalConfig(cargoId?: any) {
    return {
        //minHeight: '420',
        width: '700px',
        data: { cargoId: cargoId },
        hasBackdrop: true,
        disableClose: true
    }
}


//#endregion

//#region /Contratos

export function OpenCreateContratoModalConfig(data?: any) {
    return {
        //height:
        width: '1000px',
        data: { data: data },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEditContratoModalConfig(contrato: any) {
    return {
        //height:
        width: '1000px',
        data: { contrato: contrato },
        hasBackdrop: true,
        disableClose: true
    }
}

//#endregion

//#region /MessageModal


//#endregion

//#region /Modulos

export function ModuloCreateComponentModal(data?: any) {
    return {
        width: '850px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function ModuloEditComponentModal(data?: any) {
    return {
        width: '850px',
        data: { moduloId: data },
        hasBackdrop: true,
        disableClose: true
    }
}

export function ModuloDetalheComponentModal(modulo?: any) {
    return {
        width: '850px',
        data: { modulo: modulo },
        hasBackdrop: true,
        disableClose: true
    }
}

//#endregion

//#region /PlanoPgm

export function CreatePlanoModalConfig(data?: any) {
    return {
        //height:
        width: '600px',
        data: { data: data },
        hasBackdrop: true,
        disableClose: true
    }
}

export function EditPlanoModalConfig(plano?: any) {
    return {
        //height:
        width: '600px',
        data: { plano: plano },
        hasBackdrop: true,
        disableClose: true
    }
}

//#endregion

//#region /Produtos

export function OpenCreateProdutoModalConfig(data?: any) {
    return {
        //height:
        width: '600px',
        data: { data: data },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEditProdutoModalConfig(produto?: any) {
    return {
        //height:
        width: '600px',
        data: { produto: produto },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenDoacaoProdutoModalConfig(produto?: any) {
    return {
        //height:
        width: '900px',
        data: { produto: produto },
        hasBackdrop: true,
        disableClose: true
    }
}

//#endregion

//#region /Professores


export function CreateProfessorModalConfig() {
    return {
        height: '620px',
        width: '680px',
        //maxHeight: '90vh',
        //maxWidth: '450vh',
        //data: { prof: prof },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenAddDispoModalConfig(prof: any, unidades: any) {
    return {
        //height:
        width: '480px',
        data: { prof: prof, unidades: unidades },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpeEditDispoModalConfig(dispo?: any, profId?: any) {
    return {
        //height:
        width: '480px',
        data: { dispo: dispo, profId: profId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenAddMatModalConfig(profId?: any, profMaterias?: any) {
    return {
        //height:
        width: '550px',
        data: { profId: profId, materias: profMaterias },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenAddMatLoteModalConfig(profId?: any, profMaterias?: any) {
  return {
      //height:
      width: '550px',
      data: { profId: profId, materias: profMaterias },
      hasBackdrop: true,
      disableClose: true
  }
}

export function OpenProfMateriasModalConfig(prof?: any) {
    return {
        //height:
        width: '880px',
        data: { prof: prof },
        hasBackdrop: true,
        disableClose: true
    }
}

export function ProfCalendarioModalConfig(prof?: any) {
    return {
        height: 'auto',
        width: '1230px',
        maxHeight: '90vh',
        maxWidth: '450vh',
        data: { prof: prof },
        hasBackdrop: true,
        disableClose: true
    }
}

export function ProfRelatorioModalConfig(prof?: any) {
    return {
        //height:'570px',
        width: '710px',
        data: { prof: prof },
        hasBackdrop: true,
        disableClose: true
    }
}

export function ProfEditModalConfig(prof?: any) {
    return {
        //height: '520px',
        width: '680px',
        data: { prof: prof },
        hasBackdrop: true,
        disableClose: true
    }
}


//#endregion

//#region /Turmas

export function OpenTurmaEditmodel(turma?: any) {
    return {
        width: '1030px',
        data: { turma: turma },
        hasBackdrop: true,
        disableClose: true
    }
}

export function ConfirmModalConfig(prof?: any) {
    return {
        //height:
        width: '500px',
        data: { prof: prof },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenAddProfModalConfig(turmaId?: any) {
    return {
        //height:
        width: '800px',
        data: { turmaId: turmaId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenAddMateriaModalConfig(turmaId?: any, prof?: any) {
    return {
        //height:
        width: '850px',
        data: { turmaId: turmaId, professor: prof },
        hasBackdrop: true,
        disableClose: true
    }
}

export function iniciarTurmaModalConfig(turmaId?: any) {
    return {
        //height:
        width: '500px',
        data: { turmaId: turmaId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenCreateCursoModalConfig() {
    return {
        //height:
        width: '720px',
        hasBackdrop: true,
        disableClose: true
    }
}

//#endregion

//#region /Unidades

export function OpenUnidadeCreateModalConfig() {
    return {
        height: '480px',
        width: '650px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEditUnidadeConfig(unidade?: any) {
    return {
        //        height: '450px',
        width: '670px',
        data: { unidade: unidade },
        hasBackdrop: true,
        disableClose: true
    }
}

export function AddSalaConfig(unidade?: any) {
    return {
        //height:
        width: '600px',
        data: { unidade: unidade },
        hasBackdrop: true,
        disableClose: true
    }
}

export function EditSalaModalConfig(unidade?: any) {
    return {
        //height:
        width: '600px',
        data: { unidade: unidade },
        hasBackdrop: true,
        disableClose: true
    }
}


//#endregion


//#region /Usuarios

export function openCreateUserModalConfig() {
    return {
        //height:
        width: '600px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEditUserModalConfig(colaborador?: any) {
    return {
        //height:
        width: '600px',
        data: { colaborador: colaborador },
        hasBackdrop: true,
        disableClose: true
    }
}

export function EditAcessoModal(usuario?: any) {
    return {
        width: '600px',
        data: { usuario: usuario },
        hasBackdrop: true,
        disableClose: true
    }
}


export function OpenConsultaAcessos() {
    return {
        width: '450px',

        hasBackdrop: true,
        disableClose: true
    }
}


//#endregion















// Bolas


// Calendario


// Colaboradores


// Configuracoes



// Contratos


// MessageModal


// Modulos



// PlanoPgm


// Produtos


// Professores






// Relatorios

// RelatoriosAdm

//turmas




// Unidades

//Usuarios







