import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { PageEvent } from "@angular/material/paginator";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TooltipComponent } from "@angular/material/tooltip";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { environment } from "src/environments/environment";
import { FinanceiroService } from "../services/financ.service";
import { VendaCaixaComponent } from "./caixa-venda/venda-caixa.component";

@Component({
    selector: "fincaixa-app",
    templateUrl: './fincaixa.component.html',
    styleUrls: ['./fincaixa.component.scss']
})

export class FinCaixaComponent extends BaseComponent implements OnInit {
    
    mensagem: string = "";
    public pesquisarForm: FormGroup;
    public vendas: any[] = new Array<any>();
    totalVendas!: number;

    constructor(
        private _http: HttpClient,
        private _finService: FinanceiroService,
        override _snackBar: MatSnackBar,
        private _modal: MatDialog,
        private _fb: FormBuilder
    ) {
        super(_snackBar);
        this.pesquisarForm = _fb.group({
            start: ['', [Validators.required]],
            end: ['', [Validators.required]]
        });

        this.pageSize = 50;
    }


    ngOnInit() {
        // var message = 'message'
        // Object.defineProperty(TooltipComponent.prototype, message, {
        //     Console.log(message)
        //     set(v: any) {
        //         const el = document.querySelectorAll('.mat-tooltip');
         
        //         if (el) {
        //             el[el.length - 1].innerHTML = v;
        //         }
        //     },
        //  });
    }

    
    public Pesquisar(event?: any) {

        this.showMessageNotFound = false

        if (this.pesquisarForm.valid) {

            this.spinnerSearch = 'visible'
            this._http.get(`${this.baseUrl}/venda/busca/?start=${new Date(this.pesquisarForm.get('start')?.value).toISOString()}&end=${new Date(this.pesquisarForm.get('end')?.value).toISOString()}`)
                    .subscribe(
                    sucesso => { this.ProcessarSucesso(sucesso) },
                    falha => { this.ProcessarFalha(falha) }
                );
        }

    //    var resp = new Array<any>()
    //    resp.push({id: '', descricao: 'VENDA PRODUTO', qntItems: 5, valorTotal: 199.50, parcelas:3, 
    //     meioPagamento: 'CARTÃO STONE', infoItems: '<h6>. 4 blusa invitus</h6><h6>.1 calça invictus</h6>', dataVenda: new Date(2022,6,28,0,0,0)})

    //     resp.push({id: '', descricao: 'VENDA PRODUTO', qntItems: 1, valorTotal: 199, parcelas:1, 
    //     meioPagamento: 'DINHEIRO', infoItems: '<h6>. 1 blusa invitus</h6>', dataVenda: new Date(2022,6,28,0,0,0)})

        //this.ProcessarSucesso({ data: resp, totalItemsInDatabase: 2, totalVendas: 498.50 })
        

    }

    private ProcessarSucesso(response: any) {

        this.vendas = Object.assign([], response['vendas']);

        this.length = this.vendas.length;//response['totalItemsInDatabase']

        this.totalVendas = response['totalVendas']

        this.spinnerSearch = 'hidden'
        // if (event != undefined) {
        //     this.pageIndexNumber = (event.pageIndex * this.pageSize)
        // } else {
        //     this.pageIndexNumber = 0
            
        //     if (this.paginator != undefined) {
        //         this.paginator.firstPage();
        //     }
        // }
    }

    private ProcessarFalha(fail: any) {

        if (fail['status'] == 404) {
            this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
            this.showMessageNotFound = true
            this.vendas = new Array<any>();
        }
        if (fail['status'] != 404) {
            this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
            this.showMessageNotFound = true
            this.vendas = new Array<any>();
        }

        this.spinnerSearch = 'hidden'
    }


    openCaixaModal(): void {
        const dialogRef = this._modal
            .open(VendaCaixaComponent, {
                height: 'auto',
                width: '900px',
                autoFocus: false,
                maxHeight: '90vh',
                maxWidth: '400vh',

                data: { Hello: "Hello World" },
                hasBackdrop: true,
                disableClose: true
            });


        dialogRef.afterClosed().subscribe((data) => {
            // if (data.clicked === "Ok") {

            // } else if (data.clicked === "Cancel") {
            // }
        });
    }

    openVendaUnidades(): void {
        // const dialogRef = this._modal
        //     .open(VendaUnidadeComponent, {
        //         height: 'auto',
        //         width: '900px',
        //         autoFocus: false,
        //         maxHeight: '90vh',
        //         maxWidth: '400vh',

        //         data: { Hello: "Hello World" },
        //         hasBackdrop: true,
        //         disableClose: true
        //     });


        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data.clicked === "Ok") {
        //     } else if (data.clicked === "Cancel") {
        //     }
        // });
    }

    openCaixaDiario(): void {
        // const dialogRef = this._modal
        //     .open(CaixaDiarioComponent, {
        //         height: 'auto',
        //         width: '900px',
        //         autoFocus: false,
        //         maxHeight: '90vh',
        //         maxWidth: '400vh',

        //         data: { Hello: "Hello World" },
        //         hasBackdrop: true,
        //         disableClose: true
        //     });


        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data.clicked === "Ok") {

        //     } else if (data.clicked === "Cancel") {

        //     }
        // });
    }

}
