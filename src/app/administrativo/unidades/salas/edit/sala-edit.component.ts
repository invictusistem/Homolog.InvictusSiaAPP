import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { JwtHelperService } from "@auth0/angular-jwt";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { environment } from "src/environments/environment";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";

@Component({
    selector: 'sala-editarmodal',
    templateUrl: './sala-edit.component.html',
    styleUrls: ['./sala-edit.component.scss'],
    animations: [HighlightTrigger]
})

export class SalaEditarComponent implements OnInit {
  
    public initProgressBar = 'visible'
    public buscaSalaSpinner = 'hidden'
    public saveSpinner = 'hidden'

    public showContent = false
    private jwtHelper = new JwtHelperService();
    tokenInfo: TokenInfos = new TokenInfos();
    public salas: any[] = new Array<any>()
    public sala: any;
    private _baseUrl = environment.baseUrl
    public showEditSalaForm: boolean = false
    public originalSala: any
    public salaForm: FormGroup;
    constructor(
        //private service: AdmService,
        private _http: HttpClient,
        private _fb: FormBuilder,
        private _helpers: HelpersService,
        public dialogRef: MatDialogRef<SalaEditarComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.salaForm = this._fb.group({
            id: [''],
            titulo: [''],
            descricao: ['', [Validators.required]],
            capacidade: [''],
            comentarios: ['', [Validators.required, Validators.maxLength(200)]],
            ativo: [''],
            dataCriacao: [''],
            unidadeId: ['']


        })
    }


    ngOnInit() {


        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
       // console.log(this.data['unidade'])
        this.GetSalas();
    }

    GetSalas() {
        this._http.get(`${this._baseUrl}/unidade/salas/${this.data["unidade"].id}`)
            .subscribe((resp: any) => {
                this.salas = resp['salas']
            },
                (error) => {
                     //console.log(error)
                     },
                () => {
                    this.initProgressBar = 'hidden'
                    this.showContent = true
                })
    }

    buscar(salaId: any) {
        
        this.buscaSalaSpinner = 'visible'
        this.showEditSalaForm = false

        this._http.get(`${this._baseUrl}/unidade/sala/${salaId}`)
            .subscribe((resp: any) => {
                this.salaForm.patchValue(resp['sala']);
                this.originalSala = JSON.parse(JSON.stringify(this.salaForm.value))
                // this.sala = resp['sala']
                this.dialogRef.addPanelClass('sala-edit-class')
            },
                (error) => { 
                   // console.log(error)
                 },
                () => {
                    this.buscaSalaSpinner = 'hidden'
                    this.showEditSalaForm = true
                })
    }

    get saveButton() {

        if (this.salaForm.valid && 
        JSON.stringify(this.originalSala) !=
        JSON.stringify(this.salaForm.value)) {
            return this.saveSpinner != 'hidden'
        } else {
            return true
        }
    }

    onSubmit(form: any) {

        if (this.salaForm.valid) {
            this.saveSpinner = 'visible'
            this._http.put(`${this._baseUrl}/unidade/sala-editar`, this.salaForm.value, {})
                .subscribe(resp => { },
                    (error) => {
                        this._helpers.openSnackBarErrorDefault()
                        this.saveSpinner = 'hidden'
                    },
                    () => {
                        this._helpers.openSnackBarSucesso('Sala editada com sucesso.')
                        this.dialogRef.close({ clicked: "OK" })
                    })

        }
    }
}