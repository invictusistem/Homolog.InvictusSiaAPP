import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { JwtHelperService } from "@auth0/angular-jwt";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";

@Component({
    selector: 'produto-editmodal',
    templateUrl: './produto-edit.component.html',
    styleUrls: ['./produto-edit.component.scss'],
    animations: [HighlightTrigger]
})

export class ProdutoEditComponent extends BaseComponent implements OnInit {

    // pageSize: number = 5;
    // genericTasks: GenericTask[] = new Array<GenericTask>();
    // length: number;
    // pageEvent: PageEvent;
   // baseUrl = environment.baseUrl;
    //public cepReturn: CepReturn = new CepReturn();
    public produtoForm: FormGroup;
    public produtoOriginal: any
    //public unidades: any[] = new Array<any>();
    //private jwtHelper = new JwtHelperService();
    //public tokenInfo: TokenInfos = new TokenInfos();
    public produto: any//= new any()
    // public validadeEmailMsg = false
    // public validadeCPFMsg = false
    //cargos = Cargos;
    //mensagem = "";
    //showMensagem = false
    //public bairro: string = null;
    //@Input() disabled = true;
    //unidades = Unidades;//: string[] = new Array("Campo Grande II", "Jacarepaguá");
    constructor(
        //private service: AdmService,
        override _snackBar: MatSnackBar,
        //private _snackBar: MatSnackBar,
        private router: Router,
        private _fb: FormBuilder,
        private http: HttpClient,
        public dialogRef: MatDialogRef<ProdutoEditComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            super(_snackBar);
        this.produtoForm = _fb.group({
            id:[''],
            codigoProduto:[''],
            nome: ['', [Validators.required, Validators.minLength(5)]],
            descricao: ['', [Validators.required]],
            preco: ['', [Validators.required]],
            precoCusto: ['', [Validators.required]],
            quantidade: [, [Validators.required,Validators.min(0)]],
            nivelMinimo: [, [Validators.required,Validators.min(0)]],
            unidadeId: ['', [Validators.required]],
            dataCadastro:[''],
            ativo: [''],
            observacoes: [''],
            
        })
    }

    ngOnInit() {
       
        this.GetProduto();
    }

    private GetProduto(){
        this.http.get(`${this.baseUrl}/produto/${this.data['produto'].id}`)
        .subscribe((response: any) => {
                  //  console.log(response)
                    this.produtoForm.patchValue(response['produto'])
                    
                    this.produtoOriginal = JSON.parse(JSON.stringify(this.produtoForm.value))
        
                }, err => { 
                    this.initProgressBar = 'hidden'
                    this.OpenSnackBarError('Houve um erro ao buscar o produto. Procure o administrador do sistema.')
                    //console.log(err)
                },
                    () => { 
                        this.initProgressBar = 'hidden'
                        this.showForm = true
                        this.dialogRef.addPanelClass('produto-edit-class')
                    });
    }  
        
   

    get disabledButton() {
        if (this.produtoForm.valid &&
            JSON.stringify(this.produtoOriginal) !=
            JSON.stringify(this.produtoForm.value)) {

            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }

   
    onSubmit(){
     
        if (this.produtoForm.valid) {
           
            this.disabledSaveButton = 'visible'
            this.http.put(`${this.baseUrl}/produto`, this.produtoForm.value, {
               
            }).subscribe(response => {
             
            }, (err) => {
               // console.log(err)
               this.OpenSnackBarErrorDefault()
               this.disabledSaveButton = 'hidden'
            },
                () => {
                    this.OpenSnackBarSucesso("Produto editado com sucesso.")
                    this.dialogRef.close({ clicked: "Ok" });
                });
        }
    }  
}