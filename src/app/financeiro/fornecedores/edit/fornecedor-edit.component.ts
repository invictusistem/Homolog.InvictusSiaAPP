import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { FinanceiroService } from "../../services/financ.service";

@Component({
    selector: 'editfornecedormodal',
    templateUrl: './fornecedor-edit.component.html',
    styleUrls: ['./fornecedor-edit.component.scss']
})

export class EditFornecedorComponent extends BaseComponent implements OnInit {

    //baseUrl = environment.baseUrl;
    //public cepReturn: CepReturn = new CepReturn();
    public fornecedorForm!: FormGroup;
    public endereco: FormGroup;
    //public validadeEmailMsg = false
    //public validadeCPFMsg = false
    //cargos = Cargos;
    //mensagem = "";
    //showMensagem = false

    //public showForm = false
    public saveSpinner = 'hidden'
    fornecedor: any;
    originalFornecedor: any;

    //unidades = Unidades;
    constructor(
        //private _snackBar: MatSnackBar,
        //private router: Router,
        override _snackBar: MatSnackBar,
        private _fb: FormBuilder,
        private _finService: FinanceiroService,
        //private http: HttpClient,
        public dialogRef: MatDialogRef<EditFornecedorComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        super(_snackBar);
        this.fornecedorForm = _fb.group({
            id: [''],
            nome: ['', [Validators.required]],
            ie_rg: [''],
            cnpj: ['', [Validators.required, Validators.minLength(11)]],
            email: ['', [Validators.required, Validators.email]],
            telefoneContato: [''],
            telWhatsapp: [''],
            nomeContato: ['', [Validators.required]],
            ativo: [''],
            unidadeId: [''],
            pessoaRespCadastroId:[''],
            tipoPessoa:[''],
            dataCadastro:[''],
            endereco: this.endereco = _fb.group({
                id: [''],
                cep: ['', [Validators.required, Validators.minLength(8)]],
                logradouro: [''],
                complemento: [''],
                numero: ['', [Validators.required]],
                cidade: ['', [Validators.required]],
                uf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],//,
                bairro: ['', [Validators.required]],
                pessoaId: ['']
            })

        })
    }

    ngOnInit() {
        this.GetFornecedor();
    }

    private GetFornecedor() {

        this._finService.GetFornecedorById(this.data['fornecedor'])
            .subscribe(
                sucesso => { this.GetFornecedorSucesso(sucesso) },
                falha => { this.GetFornecedorFalha(falha) }
            )
    }

    GetFornecedorSucesso(resp: any) {
        this.fornecedorForm.patchValue(resp['fornecedor']);
        this.originalFornecedor = JSON.parse(JSON.stringify(this.fornecedorForm.value))
        this.dialogRef.updateSize('680px', '605px')
        //this.dialogRef.addPanelClass('myfornecedoredit-class')
        this.initProgressBar = 'hidden'
        this.showForm = true
    }

    GetFornecedorFalha(error: any) {
        this.initProgressBar = 'hidden'
    }


    public SaveEdit() {
        if (!this.fornecedorForm.valid) return

        this.saveSpinner = 'visible'

        this._finService.EditFornecedor(this.fornecedorForm.value)
            .subscribe(
                sucesso => { this.SaveEditSucesso(sucesso) },
                falha => { this.SaveEditFalha(falha) }
            )
    }

    private SaveEditSucesso(resp: any) {
        this.saveSpinner = 'hidden'
        this.OpenSnackBarSucesso("Fornecedor editado com sucesso.")
        this.dialogRef.close();
    }

    private SaveEditFalha(error: any) {
        this.saveSpinner = 'hidden'
        this.OpenSnackBarErrorDefault();
    }

    public ConsultaCEP(CEP: string) {
        //console.log(CEP);
        if (CEP.length == 10) {


            //var mystring = "crt/r2002_2";
            CEP = CEP.replace('-', '');
            CEP = CEP.replace('.', '');
            //  console.log(CEP);
            this._finService.CepConsulta(CEP)
                .subscribe(response => {

                    this.endereco.get('logradouro')?.setValue(response["logradouro"].toUpperCase());
                    this.endereco.get('bairro')?.setValue(response["bairro"].toUpperCase());
                    this.endereco.get('cidade')?.setValue(response["localidade"].toUpperCase());
                    this.endereco.get('uf')?.setValue(response["uf"].toUpperCase());

                }, err => { console.log(err) })
        }
    }

    get disabledButton() {
        // console.log(this.fornecedorForm.valid)
        if (this.fornecedorForm.valid &&
            JSON.stringify(this.originalFornecedor) !=
            JSON.stringify(this.fornecedorForm.value)) {
            return this.saveSpinner != 'hidden'
        } else {
            return true
        }
    }
}

