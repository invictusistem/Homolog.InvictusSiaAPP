import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'idade' })
export class IdadePipe implements PipeTransform {


    transform(value:any) {

        console.log(value)
        //console.log(event.target.value);
        //console.log(this.alunoForm.get('nascimento').value)
        if (value != '') {
            let idadeAluno: any
            var dataForm: Date = new Date(value)


            let timeDiff = Math.abs(Date.now() - dataForm.getTime());
            idadeAluno = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);


            console.log(idadeAluno)
            return idadeAluno
        } else {

            return ''
        }
    }
}