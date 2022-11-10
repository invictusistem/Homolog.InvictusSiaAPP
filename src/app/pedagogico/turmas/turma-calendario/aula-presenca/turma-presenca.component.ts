import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { environment } from "src/environments/environment";

@Component({
    selector: 'cal-presenca-app',
    templateUrl: './turma-presenca.component.html',
    styleUrls: ['./turma-presenca.component.scss']
})

export class TurmaPresencaEditComponent extends BaseComponent implements OnInit {

    private _baseUrl = environment.baseUrl
    //public initProgressBar = 'visible'
    public saveProgressBar = 'hidden'
    public showContent = false
    public listaPresencaDto: any[] = new Array<any>()// ListaPresencaDto[] = new Array<ListaPresencaDto>();
    public listaPresencaOriginal: any// ListaPresencaDto[] = new Array<ListaPresencaDto>();
    public infoDia: any// InfoDia = new InfoDia();
    public saveCommand: any//SavePresencaCommand = new SavePresencaCommand();
    public presenca: any
    public observacoes: string = "";
    public obsForm!: FormGroup;
    public diaAulaString: any
    constructor(
        private _http: HttpClient,
        override _snackBar: MatSnackBar,
        private _fb: FormBuilder,
        private _modal: MatDialog,
        public _dialogRef: MatDialogRef<TurmaPresencaEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);

        this.obsForm = this._fb.group({
            observacoes: ['']
        })
    }

    ngOnInit() {
         console.log(this.data['calendario'])

        this.getPresencaViewModel(this.data['calendario'].id);
    }

    getPresencaViewModel(calendarioId: number) {

        this._http.get(`${this._baseUrl}/pedag/turma/presenca-diario/${calendarioId}`)
            .subscribe((resp: any) => {

                // console.log(resp)

                this.infoDia = Object.assign({}, resp['presencas'].aulaViewModel)
                //console.log(this.infoDia)
                this.listaPresencaDto = Object.assign([], resp['presencas'].listaPresenca)
                this.listaPresencaOriginal = Object.assign([], resp['presencas'].listaPresenca)
                //this.infoDia.diaAula = new Date(this.infoDia.diaAula).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })
                // this.diaAulaString = new Date(this.infoDia.diaAula).toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })
                // this.listaPresencaDto = Object.assign([], resp['lista'])
                this.initProgressBar = 'hidden'

            },
                (error) => {

                    this.initProgressBar = 'hidden'
                },
                () => {
                    this._dialogRef.addPanelClass('presencaedit-diario-class')
                    this.showContent = true
                })
    }

    concluirAula() {
        // calendárioId
    }

    concluiraula(form: any): void {
        // console.log(this.listaPresencaDto)
        // const dialogRef = this._modal
        //     .open(ConcluirAulaModal, {
        //         height: 'auto',
        //         width: '500px',
        //         autoFocus: false,
        //         //maxHeight: '90vh',
        //         //maxWidth: '400vh',

        //         data: { form: form },
        //         hasBackdrop: true,
        //         disableClose: true
        //     });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result.clicked == true) {
        //         console.log(form.value)
        //        this.salvar(form);

        //     } else {
        //         //console.log('nao')
        //     }

        // });
    }

    get disabledSave() {

        var disabledButton = true
        var temNull = this.listaPresencaDto.filter((lista) => {
            return lista.isPresentToString == null || lista.isPresentToString == "";
        })

        //  console.log(temNull);

        if (temNull.length == 0) {
            disabledButton = false
        } else {
            disabledButton = true
        }

        if (!disabledButton && this.obsForm.valid) {
            return false
        } else {
            return true
        }



    }

    get desabilitar() {
        // listaPresencaDto
        //listaPresencaOriginal
        //console.log(this.listaPresencaDto)
        //console.log(this.listaPresencaOriginal)
        if (this.saveProgressBar == 'hidden') {

            return false
        } else {
            return true
        }
    }

    salvar(form: any) {

        if (form.valid) {
            this.saveProgressBar = 'visible'
            // console.log(this.listaPresencaDto)
            // this.saveCommand.listaPresencaDto = this.listaPresencaDto
            // this.saveCommand.calendarId = this.infoDia.id
            // this.saveCommand.observacoes = this.obsForm.get('observacoes').value
            this.infoDia.observacoes = this.obsForm.get('observacoes')?.value
            let presencaView = { infoDia: this.infoDia, listaPresencaDto: this.listaPresencaDto }


            this._http.post(`${this._baseUrl}/pedag/turma/presenca-diario/${this.data['calendario'].id}`, { aulaViewModel: this.infoDia, listaPresenca: this.listaPresencaDto }, {})
                .subscribe(resp => {



                },
                    (error) => {
                        this.saveProgressBar = 'hidden'
                        this.OpenSnackBarErrorDefault()
                        // console.log(error) 
                    },
                    () => {
                        this.OpenSnackBarSucesso("Presença(s) lançada(s) com sucesso")
                        this._dialogRef.close({ clicked: "OK" })
                    })
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
//         <button style="width: 30px;" [mat-dialog-close]="{clicked:true}" mat-button>SIM</button>
//         <button style="width: 30px;" [mat-dialog-close]="{clicked:false}" mat-button>NÃO</button>
//     </div>
// </div>`,
// })
// export class ConcluirAulaModal {

//     constructor(
//         public dialogRef: MatDialogRef<ConcluirAulaModal>,
//         @Inject(MAT_DIALOG_DATA) public data: any) { }
// }

// export class SavePresencaCommand {
//     constructor(
//         public listaPresencaDto?: ListaPresencaDto[],
//         public calendarId?: number,
//         public observacoes?: string
//     ) {

//     }
// }