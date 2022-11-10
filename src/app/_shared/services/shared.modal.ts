export function ConfirmAcaoModalConfig() {
    return {
        height: 'auto',
        width: '500px'
    }
}

export function ConfirmAcaoDinamicaModalConfig(msg?: any) {
  return {
      height: 'auto',
      width: '500px',
      data: { msg: msg},
  }
}

export function ConfirmDeletarContaModalConfig(contaId:any) {
    return {
        height: 'auto',
        width: '500px',
        data: { contaId: contaId},
        hasBackdrop: true,
        disableClose: true
    }
}

export function ModalconfirmarConfig(
    url: string,
    metodo: string,
    msgModal: string,
    msgSucesso: string,
    payload?: any) {
    return {
        height: 'auto',
        width: '500px',
        data: {
            url: url,
            metodo: metodo,
            mensagemModal: msgModal,
            mensagemSucesso: msgSucesso,
            payload: payload
        },
        hasBackdrop: true,
        disableClose: true
    }
}
