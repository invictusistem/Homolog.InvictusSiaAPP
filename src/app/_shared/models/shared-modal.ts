export function SelectUnidadeModalConfig(form: any, unidades: any) {
    return {
        width: '400px',
        height: '190px',
        data: { form: form, unidades: unidades },
        hasBackdrop: true,
        disableClose: true
    }
}

export function TrocaSenhaModalConfig() {
    return {
        width: '420px',
        height: '420px',
        hasBackdrop: true,
        disableClose: true
    }
}

