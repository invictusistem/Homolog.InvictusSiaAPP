import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, Inject, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { environment } from "src/environments/environment";

@Component({
    selector: "estagioedit-app",
    templateUrl: './estagio-alunos.component.html',
    styleUrls: ['./estagio-alunos.component.scss'],
    animations: [HighlightTrigger]
})

export class EstagioAlunosComponent implements OnInit {

    baseUrl = environment.baseUrl;
    private jwtHelper = new JwtHelperService();
    tokenInfo: TokenInfos = new TokenInfos();
    //public cepReturn: CepReturn = new CepReturn();
    estagioForm: FormGroup
    public alunos: any[] = new Array<any>();

    constructor(
        private _snackBar: MatSnackBar,
        //private CreateMatriculaModal: MatDialog,
        private _fb: FormBuilder,
        private _http: HttpClient,
        public dialogRef: MatDialogRef<EstagioAlunosComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
        //private CreateColaboradoresModal: MatDialog,
        //private EditColaboradoresModal: MatDialog
    ) {
        this.estagioForm = _fb.group({
            nome: ["", [Validators.required]],
            dataInicio: ["", [Validators.required]],
            vagas: ["", [Validators.required]],
            //trimestre: ["",[Validators.required]],
            // inicio: ['', [Validators.required]],
            cep: ['', [Validators.required, Validators.minLength(8)]],
            logradouro: ['', [Validators.required, Validators.minLength(1)]],
            numero: ['', [Validators.required]],
            complemento: [''],
            cidade: ['', [Validators.required, Validators.minLength(1)]],
            uf: ['', [Validators.required, Validators.minLength(2)]],
            bairro: ['', [Validators.required, Validators.minLength(1)]]//,
        })

    }


    ngOnInit() {


        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.alunos = Object.assign([], this.data['estagio'].inscritos)
        //this.GetAlunosEstagio(this.data['estagio']);
    }

    GetAlunosEstagio(estagio: any) {

        this._http.get(`${this.baseUrl}/estagios/alunos/${estagio.id}`)
            .subscribe((response: any) => {
                this.alunos = Object.assign([], response['alunos'])
            }, err => { console.log(err) },
                () => {
                    // console.log('finaly') 
                });

    }



    onSubmit(form: any) {

        this._http.post(`${this.baseUrl}/estagios`, this.estagioForm.value, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": "Bear "
            })
        }).subscribe(response => {

        },
            (error) => {
                console.log(error)
                //this.disabledSpinner = false
            },
            () => {
                // this.estagioForm.reset();
                // this.cepReturn = new CepReturn();
                this.dialogRef.close({ clicked: "OK" });

            }
        )
    }

    valor: any
    onFocusOutDateEvent(event: any) {
        var data;

        if (event.target.value.length == 10) {
            var data = event.target.value.split('/')
            console.log(data)
            var dataForm: Date = new Date(parseInt(data[2]), parseInt(data[1]) - 1,
                parseInt(data[0]))
            this.estagioForm.get('dataInicio')?.setValue(dataForm)
            this.valor = dataForm.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })//dataForm.getDay
            //this.valor = dataForm//.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' })//dataForm.getDay
        }

    }
}