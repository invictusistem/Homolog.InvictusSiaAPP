import { HttpEventType } from "@angular/common/http";



export function ExtractFile(data: any, fileName: any){
      switch (data.type) {
          case HttpEventType.Response:
              // this.showSpinner = false;
              //this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
              const downloadedFile = new Blob([data.body], { type: data.body.type });
              const a = document.createElement('a');
              a.setAttribute('style', 'display:none;');
              document.body.appendChild(a);
              a.download = fileName;
              a.href = URL.createObjectURL(downloadedFile);
              a.target = '_blank';
              a.click();
              document.body.removeChild(a);
              break;
      }
}

export const Tabs = [
    { class: '', typeIcon: 'manage_accounts' },
    // { path: '/adm/unidades', title: 'Unidades', class: '', typeIcon: 'house' },
    { class: '', typeIcon: 'house' },
    { class: '', typeIcon: 'engineering' },
    { class: '', typeIcon: 'fact_check' },
]



export const Parentesco = [
    { type: 'pais', value: 'Pai/Mãe' },
    { type: 'filhos', value: 'Filho/Filha' },
    { type: 'avos', value: 'Avô/Avó' },
    { type: 'sobrinhos', value: 'Sobinho(a)' },
    { type: 'tio', value: 'Tio(a)' },
    { type: 'conjuge', value: 'Conjugê' },
    { type: 'irmao', value: 'Irmão/Irmã' }

]

export const CienciaCurso = [
    { type: 'Balcão', value: 'Balcão' },
    { type: 'Indicação Aluno', value: 'Indicação Aluno' },
    { type: 'Rádio', value: 'Rádio' },
    { type: 'Facebook', value: 'Facebook' },
    { type: 'Internet', value: 'Internet' },
    { type: 'Site', value: 'Site' }
]

export const Parcelas = [
    { type: 'vista', value: 'A Vista' },
    { type: '2', value: '2x' },
    { type: '3', value: '3x' },
    { type: '4', value: '4x' },
    { type: '5', value: '5x' },
    { type: '6', value: '6x' },
    { type: '7', value: '7x' },
    { type: '8', value: '8x' },
    { type: '9', value: '9x' },
    { type: '10', value: '10x' },
    { type: '11', value: '11x' },
    { type: '12', value: '12x' },
    { type: '13', value: '13x' },
    { type: '14', value: '14x' },
    { type: '15', value: '15x' },
    { type: '16', value: '16x' },
    { type: '17', value: '17x' },
    { type: '18', value: '18x' },
    { type: '19', value: '19x' },
    { type: '20', value: '20x' },
]

export const DiaVencimento = [
    { type: '1', value: '1' },
    { type: '3', value: '3' },
    { type: '5', value: '5' },
    { type: '8', value: '8' },
    { type: '10', value: '10' },
    { type: '15', value: '15' }
]


