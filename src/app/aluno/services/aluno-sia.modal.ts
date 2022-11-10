// Estagio
export function OpenEstagioDocModalConfig(usuario?: any) {
    return {
        width: '1100px',
        data: { usuario: usuario },
        hasBackdrop: true,
        disableClose: true
    }
}

export function OpenEstagioSelecionarModalConfig(usuario?: any) {
    return {
        width: '710px',
        data: { usuario: usuario },
        hasBackdrop: true,
        disableClose: true
    }
}

// Requerimento

export function OpenRequerimentoCreateModalConfig() {
    return {
        width: '750px',
        hasBackdrop: true,
        disableClose: true
    }
}