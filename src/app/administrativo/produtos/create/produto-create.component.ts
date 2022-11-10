import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Produto } from "src/app/_shared/models/produto.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";

@Component({
    selector: 'produto-createmodal',
    templateUrl: './produto-create.component.html',
    styleUrls: ['./produto-create.component.scss']
})

export class ProdutoCreateComponent extends BaseComponent implements OnInit {

    public produtoForm: FormGroup;
    public unidades: any[] = new Array<any>();

    constructor(
        override _snackBar: MatSnackBar,
        private router: Router,
        private _fb: FormBuilder,
        private _http: HttpClient,
        public dialogRef: MatDialogRef<ProdutoCreateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        super(_snackBar);
        this.produtoForm = _fb.group({
            nome: ['', [Validators.required, Validators.minLength(5)]],
            descricao: ['', [Validators.required]],
            preco: ['', [Validators.required]],
            precoCusto: ['', [Validators.required]],
            quantidade: [, [Validators.required, Validators.min(0)]],
            nivelMinimo: [, [Validators.required, Validators.min(0)]],
            //unidadeId: ['', [Validators.required]],
            ativo: [true],
            observacoes: [''],

        })
    }

    ngOnInit() {

        if (this.tokenInfo.role == 'SuperAdm' || this.tokenInfo.role == 'MasterAdm') {
            this.GetUnidades()
        } else {
            this.unidades.push({ sigla: this.tokenInfo.Unidade, id: this.tokenInfo.UnidadeId })
            this.produtoForm.get('unidadeId')?.setValue(this.tokenInfo.UnidadeId)
            this.showForm = true
            this.initProgressBar = 'hidden'
            this.dialogRef.addPanelClass('produto-create-class')
        }

    }

    get disabledButton() {
        if (this.produtoForm.valid) {
            return this.disabledSaveButton != 'hidden'
        } else {
            return true
        }
    }

    GetUnidades() {

        this._http.get(`${this.baseUrl}/unidade`)
            .subscribe((resp: any) => {
                this.unidades = Object.assign([], resp['unidades'])
                this.dialogRef.addPanelClass('produto-create-class')
                this.showForm = true
                this.initProgressBar = 'hidden'
            },
                (err) => {
                    this.OpenSnackBarError("Ocorreu um erro ao buscar as unidades disponíveis.")
                    this.initProgressBar = 'hidden'
                },
                () => {

                })

    }
    

    onSubmit(form: FormGroup) {

        var produto = new Produto();
        
        produto = form.value
        
        var preco = parseFloat(form.value["preco"])
        
        produto.preco = parseFloat(preco.toFixed(2))
        

        if (form.valid) {
            this.disabledSaveButton = 'visible'

            this._http.post(`${this.baseUrl}/produto`, produto, {

            }).subscribe(response => {
                
            }, (err) => {
                this.disabledSaveButton = 'hidden'
                this.OpenSnackBarErrorDefault()                

            },
                () => {
                    this.OpenSnackBarSucesso("Produto cadastrado com sucesso.")
                    this.dialogRef.close({ clicked: "Ok" });
                });
        }
    }   

}