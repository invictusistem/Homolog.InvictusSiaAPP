import { HttpClient } from "@angular/common/http";
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { environment } from "src/environments/environment";
import { AulaEditModalConfig, ObsTurmaModalConfig, OpenCalendarioPresencaomponentModal } from "../../services/pedag-modal";
import { AulaDetalheModal } from "./aula-detalhe/aula-detalhe.component";
import { AulaEditarModal } from "./aula-edit/aulaeditar.component";
import { TurmaPresencaEditComponent } from "./aula-presenca/turma-presenca.component";
import { CalendPresencaComponent } from "./presenca/cal-presenca.component";
import { TurmaDetalheModal } from "./turma-detalhe/turma-detalhe.component";

@Component({
    selector: 'calendarioturma-app',
    templateUrl: './calendarioturma.component.html',
    styleUrls: ['./calendarioturma.component.scss'],
    animations: [HighlightTrigger]
})

export class CalendarioTurmaComponent implements OnInit {

    private _baseUrl = environment.baseUrl
    public showSpin = false
    public initProgressBar = 'visible'
    public ShowTableHeader = false
    public calendarios: any[] = new Array<any>()

    length: number = 0
    pageSize: number = 10;
    pageEvent!: PageEvent;
    pageIndexNumber: number = 0;
    currentPage = 1
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    private jwtHelper = new JwtHelperService();
    tokenInfo: TokenInfos = new TokenInfos();


    public pesquisarForm!: FormGroup
    constructor(
        private _http: HttpClient,
        private _fb: FormBuilder,
        private _modal: MatDialog,
        public _dialogRef: MatDialogRef<CalendarioTurmaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.pesquisarForm = _fb.group({
            nome: [''],
            email: [''],
            cpf: [''],
            ativo: [false],
            todasUnidades: [false],
            todosAlunos: [false],
            primeiraReq: [false]
        });
    }

    ngOnInit() {
        const token:any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)

        //console.log(this.data['turma'])

        // this.GetCalendarioTurma(this.data['turma'].id);
        this.pesquisar(undefined, true)
    }

    private GetCalendarioTurma(turmaId: number) {

        //this._http.get(`${this._baseUrl}/pedag/turma/calendario/${turmaId}`) //calendario-pagination
        this._http.get(`${this._baseUrl}/pedag/turma/calendario-pagination/${turmaId}`)
            .subscribe((resp: any) => {
                //console.log(resp)
                this.calendarios = Object.assign([], resp['calends'])
            },
                (error) => {
                    // console.log(error)
                    this.showSpin = true
                },
                () => {
                    this.ShowTableHeader = true
                    this.initProgressBar = 'hidden'
                    this.showSpin = true
                })
    }

    pesquisar(event?: any, firstConsult?: boolean) {

        //console.log(event)
        this.initProgressBar = 'visible'
        // this.showMessageNoAluno = false

        //if (this.pesquisarForm.valid || this.tokenInfo['role'] == 'SuperAdm') {

        //  this.spinnerSearch = 'visible'

        if (event != undefined) {
            this.currentPage = event.pageIndex + 1
        } else {
            this.currentPage = 1
        }

        this.pesquisarForm.get('primeiraReq')?.setValue(firstConsult)

        var formJson = JSON.stringify(this.pesquisarForm.value)
        // let path = `/colaboradores/pesquisar/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`
        this._http.get(`${this._baseUrl}/pedag/turma/calendario-pagination/?turmaId=${this.data['turma'].id}&itemsPerPage=${this.pageSize}&currentPage=${this.currentPage}&paramsJson=${formJson}`)
            .subscribe(
                sucesso => { this.processarSucesso(sucesso, event, firstConsult) },
                fallha => { this.processarFalha(fallha) }
            )

            return event
    }
    initialPage = 0
    processarSucesso(resp: any, event?: any, firstConsult?: any) {
        //console.log(resp['result'].data)
        // console.log(resp['result'].currentPage)
        // console.log(resp['result'].itemsPerPage)
        // console.log(resp['result'].totalItemsInDatabase)
        this.calendarios = Object.assign([], resp['result'].data)



        //OLD
        console.log(resp)
        // this.listAlunos = Object.assign([], response['data']);

        //this.length = resp['result'].totalItemsInDatabase

        // this.spinnerSearch = 'hidden'
        if (event != undefined) {
            this.pageIndexNumber = (event.pageIndex * this.pageSize)
        } else {

            this.pageIndexNumber = (resp['result'].currentPage -1) * this.pageSize
            //  console.log(this.paginator)
            this.initialPage = resp['result'].currentPage - 1
            if (this.paginator != undefined) {
                //this.paginator.pageIndex = resp['result'].currentPage -1
                //this.initialPage = resp['result'].currentPage -1
                //this.paginator.hasNextPage()
                ///this.paginator.firstPage();
            }
        }
        this.length = resp['result'].totalItemsInDatabase
        this._dialogRef.addPanelClass('pedagcalendar-class')
        this.ShowTableHeader = true
        this.initProgressBar = 'hidden'
        this.showSpin = true

    }

    // ngAfterViewInit() {
    //     setTimeout(() => {
    //      this.paginator.pageIndex = this.initialPage;
    //     }, 10);
    //   }

    processarFalha(fail: any) {
        this.showSpin = true
        this.initProgressBar = 'hidden'
        // if (fail['status'] == 404) {
        //     this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
        //     this.showMessageNoAluno = true
        //     this.listAlunos = new Array<any>();
        // }
        // if (fail['status'] != 404) {
        //     this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
        //     this.showMessageNoAluno = true
        //     this.listAlunos = new Array<any>();
        // }

        // this.spinnerSearch = 'hidden'
    }

    concluirAula() {
        // calendárioId
    }

    get podeEditar() {

        return this.tokenInfo.role == 'SuperAdm'
    }

    public GetNotaAulaEdit(caled:any): void {
        const dialogRef = this._modal
            .open(AulaDetalheModal, ObsTurmaModalConfig(caled));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    public GetNotaAula(caled:any): void {
        const dialogRef = this._modal
            .open(TurmaDetalheModal, ObsTurmaModalConfig(caled));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    openPresencaEdit(calend: any): void {
        const dialogRef = this._modal
            .open(TurmaPresencaEditComponent, OpenCalendarioPresencaomponentModal(calend));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    openPresenca(calend: any): void {
        const dialogRef = this._modal
            .open(CalendPresencaComponent, OpenCalendarioPresencaomponentModal(calend));
        dialogRef.afterClosed().subscribe(data => {
        });
    }

    public EditAula(caled:any): void {
        const dialogRef = this._modal
            .open(AulaEditarModal, AulaEditModalConfig(caled));
        dialogRef.afterClosed().subscribe(data => {
            if (data['result'] == true) {
                let index = this.calendarios.findIndex((obj => obj.id == data['aula'].id));
                this.calendarios[index] = data['aula']
                // console.log(this.calendarios[index])

            }
        });
    }
}

