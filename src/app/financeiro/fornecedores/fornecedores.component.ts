import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { CreateFornecedorModal, EditFornecedorModal } from "../services/financ-modal";
import { FinanceiroService } from "../services/financ.service";
import { CreateFornecedorComponent } from "./create/fornecedor-create.component";
import { EditFornecedorComponent } from "./edit/fornecedor-edit.component";

@Component({
    selector: "fornecedores-app",
    templateUrl: './fornecedores.component.html',
    styleUrls: ['./fornecedores.component.scss']
})

export class FornecedoresComponent extends BaseComponent implements OnInit {

    public fornecedores: any[] = new Array<any>();
    public showMessageNoData = false
    public mensagem: string = "";
    public pesquisarForm: FormGroup  


    constructor(       
        private _fb: FormBuilder,
        override _snackBar: MatSnackBar,
        private _finService: FinanceiroService,
        private _modal: MatDialog
    ) { 
        super(_snackBar);
        this.pesquisarForm = _fb.group({
            nome: ['', [Validators.required]],
            email: ['', [Validators.required]],
            cpf: ['', [Validators.required]],
            ativo: [false],
            todasUnidades: [false]
        });

        this.pesquisarForm.valueChanges.subscribe(
            (form: any) => {

                if (this.pesquisarForm.get('nome')?.value == '' &&
                    this.pesquisarForm.get('email')?.value == '' &&
                    this.pesquisarForm.get('cpf')?.value == '') {

                    this.pesquisarForm.controls['nome'].setErrors({ required: true });
                    this.pesquisarForm.controls['email'].setErrors({ required: true });
                    this.pesquisarForm.controls['cpf'].setErrors({ required: true });
                } else {
                    this.pesquisarForm.controls['nome'].setErrors(null);

                    this.pesquisarForm.controls['email'].setErrors(null)

                    this.pesquisarForm.controls['cpf'].setErrors(null);
                }
            }
        );
    }

    ngOnInit() {

    }



    public Pesquisar(event?: any) {

        this.showMessageNoData = false

       // if (this.pesquisarForm.valid || this.tokenInfo['role'] == 'SuperAdm') {
            
            this.spinnerSearch = 'visible'

            if (event != undefined) {
                this.currentPage = event.pageIndex + 1
            } else {
                this.currentPage = 1
            }

            this._finService.GetFornecedores(this.pageSize, this.currentPage, this.pesquisarForm.value)
                .subscribe(
                    sucesso => { this.processarSucesso(sucesso, event) },
                    falha => { this.processarFalha(falha) }
                );
       // }

        return event

    }

    processarSucesso(response: any, event?: any) {
      
        this.fornecedores = Object.assign([], response['data']);

        this.length = response['totalItemsInDatabase']

        this.spinnerSearch = 'hidden'
        if (event != undefined) {
            this.pageIndexNumber = (event.pageIndex * this.pageSize)
        } else {
            this.pageIndexNumber = 0
           
            if (this.paginator != undefined) {
                this.paginator.firstPage();
            }
        }

    }

    processarFalha(fail: any) {

        if (fail['status'] == 404) {
            this.mensagem = "Sua pesquisa não encontrou nenhum registro correspondente"
            this.showMessageNoData = true
            this.fornecedores = new Array<any>();
        }
        if (fail['status'] != 404) {
            this.mensagem = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
            this.showMessageNoData = true
            this.fornecedores = new Array<any>();
        }

        this.spinnerSearch = 'hidden'
    }

    
    openCreateFornecedorModal(): void {
        const dialogRef = this._modal
            .open(CreateFornecedorComponent, CreateFornecedorModal());
        dialogRef.afterClosed().subscribe((data) => {
        });
    }

    OpenEditFornecedorModal(fornecedor:any): void {
        const dialogRef = this._modal
            .open(EditFornecedorComponent, EditFornecedorModal(fornecedor.id));
        dialogRef.afterClosed().subscribe((data) => {
        });
    }
    
    // openCreateFornecedorModal(): void {
    //     const dialogRef = this._modal
    //         .open(CreateFornecedorComponent, {
    //             height: 'auto',
    //             width: '1030px',
    //             autoFocus: false,
    //             maxHeight: '90vh',
    //             maxWidth: '400vh',

    //             data: { Hello: "Hello World" },
    //             hasBackdrop: true,
    //             disableClose: true
    //         });


    //     dialogRef.afterClosed().subscribe((data) => {
    //         if (data.clicked === "Ok") {
    //             // Reset form here
    //             console.log('afte close ok')
    //             //this.getColaboradores(1, this.pageSize);
    //         } else if (data.clicked === "Cancel") {
    //             // Do nothing. Cancel any events that navigate away from the
    //             // component.
    //         }
    //     });
    // }
    chooseSearch = ""
    // openEditUserModal(fornecedor: Fornecedor): void {
    //     const dialogRef = this._modal
    //         .open(EditFornecedorComponent, {
    //             height: 'auto',
    //             width: '1030px',
    //             autoFocus: false,
    //             maxHeight: '90vh',
    //             maxWidth: '400vh',

    //             data: { fornecedor: fornecedor },
    //             hasBackdrop: true,
    //             disableClose: true
    //         });


    //     dialogRef.afterClosed().subscribe((data) => {
    //         if (data.clicked === "Ok") {
    //             // Reset form here
    //             console.log('afte close ok')
    //             console.log(this.chooseSearch)
    //             //this.getColaboradores(1, this.pageSize);
    //         } else if (data.clicked === "Cancel") {
    //             // Do nothing. Cancel any events that navigate away from the
    //             // component.
    //         }
    //     });
    // }

    openFornecedorVenda(fornecedor: any): void {
        // const dialogRef = this._modal
        //     .open(FornecedorVendaComponent, {
        //         height: 'auto',
        //         width: '600px',
        //         autoFocus: false,
        //         maxHeight: '90vh',
        //         maxWidth: '400vh',
        //         data: { fornecedor: fornecedor },
        //         hasBackdrop: true,
        //         disableClose: true
        //     });


        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data.clicked === "Ok") {
            
        //     } else if (data.clicked === "Cancel") {
               
        //     }
        // });
    }

    openFornecedorCompra(fornecedor: any): void {
        // const dialogRef = this._modal
        //     .open(FornecedorCompraComponent, {
        //         height: 'auto',
        //         width: '600px',
        //         autoFocus: false,
        //         maxHeight: '90vh',
        //         maxWidth: '400vh',
        //         data: { fornecedor: fornecedor },
        //         hasBackdrop: true,
        //         disableClose: true
        //     });


        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data.clicked === "Ok") {              
        //     } else if (data.clicked === "Cancel") {
              
        //     }
        // });
    }
    deleteColaborador() { }

}
