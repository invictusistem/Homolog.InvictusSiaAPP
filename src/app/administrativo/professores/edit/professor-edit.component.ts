import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { Cargos, Unidades } from "src/app/_shared/models/perfil.model";
import { AdmService } from "../../services/adm.service";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";

@Component({
    selector: 'editprofessormodal',
    templateUrl: './professor-edit.component.html',
    styleUrls: ['./professor-edit.component.scss'],
    animations: [HighlightTrigger]
})

export class EditProfessorComponent implements OnInit {

    // pageSize: number = 5;
    // genericTasks: GenericTask[] = new Array<GenericTask>();
    // length: number;
    // pageEvent: PageEvent;
    baseUrl = environment.baseUrl;
    public initProgressBar = 'visible'
    editedColaborador: any;
    originalColaborador: any;//ProfessorTeste = new ProfessorTeste();
    unidades = Unidades;
    showMensagem = false
    mensagem = ''
    cpf = ''
    showForm = false
    public saveBar = 'hidden'
    //public cepReturn: CepReturn = new CepReturn();
    cargos = Cargos;
    ativo = true;
    public professorForm: FormGroup
    public endereco: FormGroup;

    constructor(
        // private _snackBar: MatSnackBar,
        private _admService: AdmService,
        private _fb: FormBuilder,
        private _helper: HelpersService,
        private http: HttpClient,
        public dialogRef: MatDialogRef<EditProfessorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.professorForm = _fb.group({
            id: [''],
            nome: ['', [Validators.required, Validators.minLength(5)]],
            email: [''],
            cpf: ['', [Validators.required, Validators.minLength(11)]],
            cnpj: [''],
            celular: [''],
            telefoneContato: [''],
            nomeContato: [''],
            dataEntrada:[''],
            dataSaida:[],
            unidadeId: [''],
            pessoaRespCadastroId:[''],
            tipoPessoa:[''],
            ativo: [''],
            endereco: this.endereco = _fb.group({
                id:[''],
                cep: [''],
                logradouro: [''],
                complemento: [''],
                numero: [''],
                cidade: [''],
                uf: [''],
                bairro: [''],
                pessoaId:['']

                //celular: [new MyTel('', '', ''), [Validators.required, Validators.minLength(1)]]
            })
            
        })
    }


    //@Output() newItemEvent = new EventEmitter<string>();


    ngOnInit() {
        this.ativo = true;
        // console.log(this.data['prof'])
        // Object.assign(this.editedColaborador, this.data['colaborador'])
        // console.log(this.data['colaborador'].id)
        this.GetProfessor()

    }

    GetProfessor() {

        this.http.get(`${this.baseUrl}/professor/${this.data['prof'].id}`)
            .subscribe((response: any) => {

               // console.log(response['result'])
                                
                this.professorForm.patchValue(response['result']);
                this.originalColaborador = JSON.parse(JSON.stringify(this.professorForm.value))

                //this.professorForm.patchValue(response['result']);
                // this.originalColaborador = response['result'] 
                // this.professorForm.patchValue(this.originalColaborador);

            }, err => {
                this.initProgressBar = 'hidden'
                //console.log(err)
            },
                () => {
                   // console.log(this.originalColaborador)
                    this.dialogRef.addPanelClass('myeditprof-class')
                    this.showForm = true
                    this.initProgressBar = 'hidden'
                });
    }



    submitForm(form: any) {

        //console.log(form.value)

        // console.log(this.editedColaborador)

        if (form.valid) {
            this.saveBar = 'visible'
            this.disabledSpinner = true
            //console.log('form valid')

            this.http.put(`${this.baseUrl}/professor`, this.professorForm.value, {})
                .subscribe(response => {
                    //console.log(response)
                }, err => {
                    // console.log(err)
                    this.saveBar = 'hidden'
                },
                    () => {
                        this.saveBar = 'hidden'
                        //this.openSnackBar()
                        this._helper.openSnackBarSucesso('Professor editado com sucesso!')
                        this.dialogRef.close();

                    });
        }
    }

    disabledSpinner = false
    // edit(form: any) {
    //     //const novoColaborador = JSON.stringify(form.value);
    //     console.log(form.valid)
    //     if (form.valid) {

    //         //this.redi(["./adm/colaboradores"]);
    //         this.http.put(`${this.baseUrl}/professor`, this.editedColaborador, {})
    //             .subscribe(response => {
    //                 console.log(response)
    //             }, err => { console.log(err) },
    //                 () => {
    //                     this.openSnackBar()
    //                     this.dialogRef.close();

    //                 });
    //     }
    // }


    // openSnackBar() {
    //     this.openSnackBar()
    // }

    isEqual = true
    get formIsValid() {

        if (JSON.stringify(this.editedColaborador) === JSON.stringify(this.originalColaborador)) {
            this.isEqual = true
        } else {
            this.isEqual = false
        }
        return this.isEqual
    }

    get desabilitar() {
          
        if (this.professorForm.valid &&
            JSON.stringify(this.originalColaborador) !=
            JSON.stringify(this.professorForm.value)) {

            return this.saveBar != 'hidden'
        } else {
            return true
        }
}


    consultaCEP(CEP: string) {
        //console.log(CEP);

        if (this.professorForm.get('cep')?.valid) {

            CEP = CEP.replace('-', '');
            CEP = CEP.replace('.', '');

            this._admService.CepConsulta(this.professorForm.get('cep')?.value)
                .subscribe(response => {

                    this.professorForm.get('logradouro')?.setValue(response["logradouro"].toUpperCase())
                    this.professorForm.get('bairro')?.setValue(response["bairro"].toUpperCase())
                    this.professorForm.get('cidade')?.setValue(response["localidade"].toUpperCase())
                    this.professorForm.get('uf')?.setValue(response["uf"].toUpperCase())

                }, err => {  },
                    () => {  });
            }
    }

}

export class ProfessorTeste{
    constructor(
        public id?: string,
        public nome?: string,
        public email?: string,
        public cpf?: string,
        public cnpj?: string,
        public celular?: string,
        public telefoneContato?: string,
        public nomeContato?: string,
        public dataEntrada?:Date,
        public dataSaida?:Date,
        public cargoId?: string,
        public ativo?: Boolean,
        public cep?: string,
        public logradouro?: string,
        public complemento?: string,
        public numero?: string,
        public cidade?: string,
        public uf?: string,
        public bairro?: string,
        public agencia?: string,
        public bancoNumero?: string,
        public conta?: string,
        public tipoConta?: string,
        public unidadeId?: string,
    ){}
}