// Alunos
export function InfoFinancModalConfig(aluno?: any) {
    return {
        width: '1150px',
        data: { aluno: aluno },
        hasBackdrop: true,
        disableClose: true
    }
}

export function ReceberComponentModal(debito?: any, aluno?: any) {
    return {
        //height: '545px',
        width: '650px',
        data: { debito: debito, aluno: aluno },
        hasBackdrop: true,
        disableClose: true
    }
}


export function ConferenciaConfirmarComponentModal(contaId?: any) {
    return {
        //height: '545px',
        width: '450px',
        data: { contaId: contaId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenSaldoComponentModal() {
    return {
        height: 'auto',
        width: '400px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function PagarProdutoComponentModal(produtos: any[], matriculaId: any) {
    return {
        height: '545px',
        width: '650px',
        data: { produtos: produtos, matriculaId: matriculaId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function PagarComponentModal(debito: any, aluno?: any) {
    return {
        //height: '545px',
        width: '650px',
        data: { debito: debito, aluno: aluno },
        hasBackdrop: true,
        disableClose: true
    }
}

export function ReparcelamentoComponentModal(aluno: any) {
    return {
        //height:'545px',
        width: '1000px',
        data: { aluno: aluno },
        hasBackdrop: true,
        disableClose: true
    }
}

// contas Receber

export function OpenNovaContaReceberModal() {
    return {
        width: '520px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEditarContaReceberModal(conta: any) {
    return {
        width: '520px',
        data: { conta: conta },
        hasBackdrop: true,
        disableClose: true
    }
}

// Contas Pagar

export function OpenNovaContaPagarModal() {
    return {
        width: '600px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEditContaPagarModal(conta: any) {
    return {
        width: '600px',
        data: { conta: conta },
        hasBackdrop: true,
        disableClose: true
    }
}



// fornecedor

export function CreateFornecedorModal() {
    return {
        height: '590px',
        width: '680px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function EditFornecedorModal(fornecedor?: any) {
    return {
        width: '680px',
        data: { fornecedor: fornecedor },
        hasBackdrop: true,
        disableClose: true
    }
}

// configurações

//banco
export function OpenBancosConfigModal() {
    return {
        width: '680px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenBancoCreateConfigModal() {
    return {
        height: '335px',
        width: '480px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenBancoEditConfigModal(bancoId: any) {
    return {
        width: '480px',
        data: { bancoId: bancoId },
        hasBackdrop: true,
        disableClose: true
    }
}
// centro custo
export function OpenCentroCustoConfigModal() {
    return {
        width: '680px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenCentroCustoCreateConfigModal() {
    return {
        width: '580px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenCentroCustoEditConfigModal(centroId: any) {
    return {
        width: '580px',
        data: { id: centroId },
        hasBackdrop: true,
        disableClose: true
    }
}

// forma recebimento
export function OpenFormaRecebimentoconfigModal() {
    return {
        width: '680px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenFormaRecebimentoCreateConfigModal() {
    return {
        width: '580px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenFormaRecebimentoEditConfigModal(formaRecId: any) {
    return {
        width: '580px',
        data: { id: formaRecId },
        hasBackdrop: true,
        disableClose: true
    }
}


// meio pgm
export function OpenMeioPagamentoConfigModal() {
    return {
        width: '680px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenMeioPagamentoCreateConfigModal() {
    return {
        width: '580px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenMeioPagamentoEditConfigModal(meioPgmId: any) {
    return {
        width: '580px',
        data: { id: meioPgmId },
        hasBackdrop: true,
        disableClose: true
    }
}

// plano 
export function OpenPlanocontasConfigModal() {
    return {
        //height: '600px',
        width: '680px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenPlanoCreateConfigModal() {
    return {
        width: '580px',
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenPlanoEditConfigModal(meioPgmId: any) {
    return {
        width: '580px',
        data: { id: meioPgmId },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenSubcontaCreateConfigModal(plano: any) {
    return {
        width: '480px',
        data: { plano: plano },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenSubcontaEditConfigModal(plano: any, subContaId: any) {
    return {
        width: '480px',
        data: { plano: plano, subContaId: subContaId },
        hasBackdrop: true,
        disableClose: true
    }
}