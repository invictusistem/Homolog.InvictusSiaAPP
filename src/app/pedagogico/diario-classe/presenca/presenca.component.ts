import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { ListaPresencaDto } from "src/app/_shared/models/infodia.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { environment } from "src/environments/environment";
import { ConcluirAulaModalComponent } from "./concluir/concluir-aula-modal.component";

@Component({
    selector: 'presenca-app',
    templateUrl: './presenca.component.html',
    styleUrls: ['./presenca.component.scss']
})

export class PresencaComponent extends BaseComponent implements OnInit {

    //private baseUrl = environment.baseUrl
    //public initProgressBar = 'visible'
    public saveProgressBar = 'hidden'
    public showContent = false
    public listaPresencaDto: any[] = new Array<any>()// ListaPresencaDto[] = new Array<ListaPresencaDto>();
    public infoDia: any// InfoDia = new InfoDia();
    public saveCommand: any//SavePresencaCommand = new SavePresencaCommand();
    public presenca: any
    public observacoes: string = "";
    public obsForm: FormGroup;
    public diaAulaString: any
    constructor(
      override _snackBar: MatSnackBar,
        private _http: HttpClient,
        private _fb: FormBuilder,
        private _modal: MatDialog,
        public _dialogRef: MatDialogRef<PresencaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
          super(_snackBar);
        this.obsForm = this._fb.group({
            observacoes: ['', [Validators.required]]
        })
    }

    ngOnInit() {
        console.log(this.data['turma'])

        this.getPresencaViewModel(this.data['turma'].calendarioId);
    }

    getPresencaViewModel(calendarioId: number) {

        this._http.get(`${this.baseUrl}/pedag/turma/presenca-diario/${calendarioId}`)
            .subscribe((resp: any) => {

                console.log(resp)

                this.infoDia = Object.assign({}, resp['presencas'].aulaViewModel)
                this.obsForm.get('observacoes')?.setValue(this.infoDia.observacoes)
                //console.log(this.infoDia)
                this.listaPresencaDto = Object.assign([], resp['presencas'].listaPresenca)
                //this.infoDia.diaAula = new Date(this.infoDia.diaAula).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })
               // this.diaAulaString = new Date(this.infoDia.diaAula).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })
               // this.listaPresencaDto = Object.assign([], resp['lista'])
                this.initProgressBar = 'hidden'

            },
                (error) => {

                    this.initProgressBar = 'hidden' },
                () => {
                    this._dialogRef.addPanelClass('presenca-diario-class')
                    this.showContent = true
                 })
    }

    concluirAula() {
        // calendárioId
    }

    salvar(form: any) {

        if (form.valid) {
             console.log(this.listaPresencaDto)
            // this.saveCommand.listaPresencaDto = this.listaPresencaDto
            // this.saveCommand.calendarId = this.infoDia.id
            // this.saveCommand.observacoes = this.obsForm.get('observacoes').value
            this.infoDia.observacoes = this.obsForm.get('observacoes')?.value
            //let presencaView = { infoDia: this.infoDia, listaPresencaDto: this.listaPresencaDto }


            this._http.post(`${this.baseUrl}/pedag/turma/presenca-diario/${this.data['turma'].calendarioId}`,
             { aulaViewModel: this.infoDia, listaPresenca: this.listaPresencaDto }, {})
                .subscribe(resp => {



                },
                    (error) => { console.log(error) },
                    () => {
                        this._dialogRef.close({ clicked: "OK" })
                    })
        }
    }

    concluiraula(): void {
        console.log(this.listaPresencaDto)
        const dialogRef = this._modal
            .open(ConcluirAulaModalComponent, {
                height: 'auto',
                width: '500px',
                autoFocus: false,
                data: {
                infoDia: this.infoDia,
                obsForm: this.obsForm.get('observacoes')?.value,
                listaPresencaDto: this.listaPresencaDto,
                calendarioId: this.data['turma'].calendarioId
            },
                hasBackdrop: true,
                disableClose: true
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result.clicked == true) {
                this._dialogRef.close({ clicked: "OK" })
            }

        });
    }

    get disabledSave() {

        var disabledButton = true
        var temNull = this.listaPresencaDto.filter((lista) => {
            return lista.isPresentToString == null || lista.isPresentToString == "";
        })

       //console.log(temNull);

        if (temNull.length == 0) {
            disabledButton = false
        } else {
            disabledButton = true
        }

        if(!disabledButton && this.obsForm.valid){
            return  false
        }else{
            return  true
        }



    }




    presente = true

}


// @Component({
//     selector: 'confirmdialog',
//     template: `<div class="container">
//     <div class="row" style="margin-bottom: 10px;">
//         <div style="font-size: 1.2em;">Tem certeza que deseja concluir a aula?</div>
//         <div>
//             Após a conclusão, não será possível retornar a tela de presenças novamente.
//         </div>
//     </div>
//     <div class="row">

//     </div>
// </div>`,
// })
// export class ConcluirAulaModal {

//     constructor(
//         public dialogRef: MatDialogRef<ConcluirAulaModal>,
//         @Inject(MAT_DIALOG_DATA) public data: any) { }
// }

export class SavePresencaCommand {
    constructor(
        public listaPresencaDto?: ListaPresencaDto[],
        public calendarId?: number,
        public observacoes?: string
    ) {

    }
}
