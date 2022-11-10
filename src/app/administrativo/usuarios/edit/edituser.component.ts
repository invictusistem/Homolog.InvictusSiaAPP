import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from "@angular/material/snack-bar";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { AdmService } from "../../services/adm.service";

@Component({
    selector: 'editusermodal',
    templateUrl: './edituser.component.html',
    styleUrls: ['./edituser.component.scss']
})

export class EditUserComponent extends BaseComponent implements OnInit {

    // pageSize: number = 5;
    // genericTasks: GenericTask[] = new Array<GenericTask>();
    // length: number;
    // pageEvent: PageEvent;
    // private baseUrl = environment.baseUrl
    private originalForm: any
    public roles: string[] = new Array<string>();
    public usuarioForm: FormGroup
    public showContent = false
    public usuario: any;// = new any();// Colaborador = new Colaborador();
    //public initProgressBar = 'visible'
    //ativo = true;
    //selected: any
    //perfilAtivo: boolean = true
    //isChecked = true;
    // showForm = false
    constructor(
        private _fb: FormBuilder,
        // private http: HttpClient,
        override _snackBar: MatSnackBar,
        private _service: AdmService,
        public dialogRef: MatDialogRef<EditUserComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(_snackBar);
        this.usuarioForm = _fb.group({
            id: [''],
            nome: [''],
            email: [''],
            unidadeSigla: [''],
            roleName: [''],
            ativo: ['']
            //claims

        })
    }

    //@Output() newItemEvent = new EventEmitter<string>();


    ngOnInit() {
        //  this.ativo = true;

        this.usuario = Object.assign({}, this.data['colaborador'])
        //console.log(this.data['colaborador'])

        this.usuarioForm.patchValue(this.data['colaborador']);
        this.originalForm = JSON.parse(JSON.stringify(this.usuarioForm.value))
        //this.getTasks(1, this.pageSize);
        //this.selected = this.usuario.perfil
        //this.perfilAtivo = this.usuario.perfilAtivo

        //this.isChecked = this.usuario.perfilAtivo

        this.getSystemRoles()
    }

    getSystemRoles() {

        this._service.GetSystemRoles()
            .subscribe(
                sucesso => { this.getSystemRolesSuccess(sucesso) },
                falha => { this.getSystemRolesError(falha) }
            )
    }

    get disabledButton() {
        if (this.usuarioForm.valid &&
            JSON.stringify(this.originalForm) !=
            JSON.stringify(this.usuarioForm.value)) {

            return this.hideSaveProgressBar != 'hidden'
        } else {
            return true
        }
    }

    getSystemRolesSuccess(resposta: any) {
        this.roles = resposta['roles']
        this.initProgressBar = 'hidden'
        this.dialogRef.addPanelClass('usuarios-edit-class')
        this.showContent = true

    }

    getSystemRolesError(error: any) {
        this.initProgressBar = 'hidden'
        this.OpenSnackBarErrorDefault();
    }


    submitForm(form: any) {
        //console.log(form.value)
        //this.usuario.perfilAtivo = form.value['perfilAtivo']
        //this.usuario.perfil = form.value['perfil']
        //  console.log(this.usuario)
        this.hideSaveProgressBar = 'visible'
        this._service.EditUsuario(this.usuarioForm.value)
            .subscribe(
                sucesso => { this.submitFormSucesso() },
                falha => { this.submitFormErro(falha) }
            )
    }

    submitFormSucesso() {
        this.OpenSnackBarSucesso('Acesso editado com sucesso.')
        this.dialogRef.close({ clicked: true })
    }

    submitFormErro(error: any) {
        this.hideSaveProgressBar = 'hidden'
        this.OpenSnackBarErrorDefault();
    }

}