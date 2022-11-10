import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { environment } from "src/environments/environment";
import { OpenCreateProdutoModalConfig, OpenDoacaoProdutoModalConfig, OpenEditProdutoModalConfig } from "../services/adm-modal";
import { ProdutoCreateComponent } from "./create/produto-create.component";
import { ProdutoDoacaoComponent } from "./doacao/produto-doacao.component";
import { ProdutoEditComponent } from "./edit/produto-edit.component";

@Component({
    selector: "produtos-app",
    templateUrl: './produtos.component.html',
    styleUrls: ['./produtos.component.scss']
})

export class ProdutosComponent extends BaseComponent implements OnInit {

    //private baseUrl = environment.baseUrl;
    public produtos: any[] = new Array<any>();
    //public tokenInfo: TokenInfos = new TokenInfos();
    //private jwtHelper = new JwtHelperService();
    //public spinnerSearch = 'visible'

    constructor(
        override _snackBar: MatSnackBar,
        private _http: HttpClient,
        private _modal: MatDialog
    ) {
        super(_snackBar);
     }

    ngOnInit() {
        //const token: any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)

        this.GetProdutos();
    }

    GetProdutos(){
        this.spinnerSearch = 'visible'
        this._http.get(`${this.baseUrl}/produto`)
        .subscribe((resp:any) => {
            this.produtos = Object.assign([], resp['produtos'])
            this.spinnerSearch = 'hidden'
        }, (error) => { 
            this.spinnerSearch = 'hidden'
         })

    }

    pesquisar(nome: string, cargo: string, unidade: string) {


    }


    openCreateProdutoModal(): void {
        const dialogRef = this._modal
            .open(ProdutoCreateComponent, OpenCreateProdutoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "Ok") {

                this.GetProdutos();
               
            }
        });
    }

    openEditProdutoModal(produto: any): void {
        const dialogRef = this._modal
            .open(ProdutoEditComponent, OpenEditProdutoModalConfig(produto));
        dialogRef.afterClosed().subscribe((result) => {
            if (result.clicked === "Ok") {

                this.GetProdutos();
               
            }
        });
    }

    openDoacaoProdutoModal(produto: any): void{
        const dialogRef = this._modal
            .open(ProdutoDoacaoComponent, OpenDoacaoProdutoModalConfig(produto));
        dialogRef.afterClosed().subscribe((result) => {
            if (result.clicked === "Ok") {

                this.GetProdutos();
               
            }
        });
    }


}