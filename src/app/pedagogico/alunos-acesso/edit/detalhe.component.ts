import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { PedagogicoService } from "../../services/pedagogico.service";

@Component({
    selector: 'detalhemodal',
    templateUrl: './detalhe.component.html',
    styleUrls: ['./detalhe.component.scss'],
    animations: [HighlightTrigger]
})

export class DetalheComponent implements OnInit {


    // // initProgressBar = 'visible'
    // // public moduloForm: FormGroup;
    // // public addMateriaForm: FormGroup;
    // // public addDocForm: FormGroup;
    // // private jwtHelper = new JwtHelperService();
    // // public tokenInfo: TokenInfos = new TokenInfos();
    // public modulo: any// = new any();
    // // materiasTemplate: any//
    // public documentos: any//
    // // modalidade = Modalidade
    // // public titularDoc = TitularDoc
    // // showForm = false

    public initProgressBar = 'visible'
    public disabledSaveButton = 'hidden'
    // public saveProgressBar = 'hidden'

    public showContent = false
    public informacoes: any;
    private originalAcesso: Boolean = false
    // public addMateriasForm = false

    // public moduloForm: FormGroup;
    // public addMateriaForm: FormGroup;
    // public addDocForm: FormGroup;

    // private jwtHelper = new JwtHelperService();
    // public tokenInfo: TokenInfos = new TokenInfos();

    // public errorMsg: any[] = new Array<any>()
    // public unidadesAutorizadas: any[] = new Array<any>();
    // public materiasTemplate: any[] = new Array<any>();
    // public documentosTemplate: any[] = new Array<any>();
    // public typePacote: any

    // public typePacotes: any
    // public docTemplates: any

    // public titularDoc = TitularDoc

    constructor(
        private _pedagervice: PedagogicoService,
        private _helper: HelpersService,
        //private _snackBar: MatSnackBar,
        //private router: Router,
        //private _fb: FormBuilder,
        //private _http: HttpClient,
        public dialogRef: MatDialogRef<DetalheComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {




    }

    ngOnInit() {
        console.log(this.data)
        this.originalAcesso = this.data['aluno'].acessoSistema
        this.informacoes = this.data['aluno']
        this.initProgressBar = 'hidden'
        this.dialogRef.addPanelClass('detalhecomponent-class')
        this.showContent = true
    }

    get disabledButton() {
        // console.log(this.originalAcesso)
        // console.log(this.data['aluno'].acessoSistema)

        if (this.originalAcesso != this.data['aluno'].acessoSistema) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }

    }

    salvarEdit() {
        this.disabledSaveButton = 'visible'
        this._pedagervice.editAcesso(this.data['aluno'].email, this.data['aluno'].acessoSistema)
            .subscribe(
                sucesso => { this.salvarEditSucesso(sucesso) },
                falha => { this.salvarEditFalha(falha) }
            )
    }

    salvarEditSucesso(resp: any) {
        this._helper.openSnackBarSucesso("Acesso editado com sucesso.")
        this.disabledSaveButton = 'hidden'
        this.originalAcesso = this.data['aluno'].acessoSistema
    }

    salvarEditFalha(error: any) {
        this.disabledSaveButton = 'hidden'
    }

    disabledEnvio = false

    enviarLogin() {

        this.disabledEnvio = true
        this._pedagervice.envioAcesso(this.data['aluno'].email)
            .subscribe(
                sucesso => { this.enviarLoginSucesso(sucesso) },
                falha => { this.enviarLoginFalha(falha) }
            )
    }

    enviarLoginSucesso(resp: any){
        this._helper.openSnackBarSucesso("E-mail com informações de acesso enviado com sucesso.")
        this.disabledEnvio = false
    }

    enviarLoginFalha(error: any){
        this._helper.openSnackBarErrorDefault()
        this.disabledEnvio = false
    }




}