import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'createusermodal',
    templateUrl: './createuser.component.html',
    styleUrls: ['./createuser.component.scss'],
    animations: [HighlightTrigger]
})

export class CreateUserComponent implements OnInit {

    baseUrl = environment.baseUrl
    public usuario: any;//Colaborador = new Colaborador();
    public usuarioForm!: FormGroup;
    public perfisArray: any[] = new Array<any>()// = PerfilEnum;
    public initProgressBar = 'hidden'
    // pageSize: number = 5;
    // genericTasks: GenericTask[] = new Array<GenericTask>();
    // length: number;
    // pageEvent: PageEvent;
    mensagem = "no message";
    showForm = false
    showMensagem = 'hidden'
    constructor(
        //private service: AdmService,
        private _helper: HelpersService,
        public fb: FormBuilder,
        public http: HttpClient,
        public dialogRef: MatDialogRef<CreateUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.usuarioForm = fb.group({
            id: [],
            // nome: ['', [Validators.required, Validators.minLength(2)]],
            perfil: ['', [Validators.required]],
            // email: ['', [Validators.required, Validators.email]],
            perfilAtivo: [true, [Validators.required]]
        })
    }

    //@Output() newItemEvent = new EventEmitter<string>();


    ngOnInit() {
        // this.usuario.perfilAtivo = true;
        // console.log("on init")
        //this.getTasks(1, this.pageSize);
    }


    consultaUsuario(email: any) {
       // console.log(email)
        if (email == '') return;
        this.showForm = false
        this.showMensagem = 'hidden'
        this.initProgressBar = 'visible'
        this.http.get(`${this.baseUrl}/usuario/procurar/?email=${email}`).subscribe(
            (result: any) => {

                this.usuario = Object.assign({}, result['result'])
                //console.log(this.usuario)
                this.perfisArray = result['perfis']

                this.usuarioForm?.get('id')?.setValue(this.usuario.id)

            },
            (err) => {
                if(err['status'] == 401){
                    this._helper.openSnackBarError("Você não possui autorização para conceder acesso.")
                    this.dialogRef.close();
                }else{
                this.initProgressBar = 'hidden'
               // console.log(err['error'])
                this.mensagem = err['error'].mensagem
                this.showMensagem = 'visible'
                }
            },
            () => {
                this.initProgressBar = 'hidden'
                
                this.showMensagem = 'hidden'
                this.showForm = true
               
            }
        )

    }
    public sabeSpinner = 'hidden'
    disabledSaveButton = false
    get disabledButton() {
        if (this.usuarioForm?.valid) {
            return this.sabeSpinner != 'hidden'
        } else {
            return true
        }

    }

    SaveUser() {

       // console.log(form.valid)

        if (this.usuarioForm?.valid) {
            
            this.sabeSpinner = 'visible'
            this.disabledSaveButton = true
            let perfil = this.usuarioForm.get('perfil')?.value
            let perfilAtivo = this.usuarioForm.get('perfilAtivo')?.value

            this.http.post(`${this.baseUrl}/usuario/${this.usuario.id}/?perfil=${perfil}&perfilAtivo=${perfilAtivo}`, {
            }).subscribe(
                (result) => {
                },
                (err) => {
                    //console.log(err['error'].msg)
                    if(err['status'] == 400){
                        this.sabeSpinner = 'hidden'
                        this._helper.openSnackBarError(err['error'].msg)
                        this.dialogRef.close();    
                    }else{
                        this.sabeSpinner = 'hidden'
                        this._helper.openSnackBarErrorDefault()
                        this.dialogRef.close();
                    }
                    

                },
                () => {
                    this.sabeSpinner = 'hidden'
                    this._helper.openSnackBarSucesso("Acesso criado com sucesso")
                    this.dialogRef.close({ clicked: "Ok" });
                }
            )
        }
    }

}

export class JsonPatch {
    constructor(

    ) { }
}