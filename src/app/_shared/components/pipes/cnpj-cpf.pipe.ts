import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'cnpjORcpf' })
export class CNPJCPFPipe implements PipeTransform {
    transform(value: any) {
        if (value != null) {
            if (value.length <= 11) {
                console.log('cpf piep')
                console.log(value.length)

                var cpf = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4")
                console.log(cpf)
                return cpf//value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "\$1.\$2.\$3\-\$4")
            } else {
                console.log('cnpj piep')
                console.log(value.length)
                var cnpj = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5")
                console.log(cnpj)
                return cnpj//value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "\$1.\$2.\$3\/\$4\-\$5")
            }
        }
    }
}