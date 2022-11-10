import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { ConfirmAcaoModalComponent } from "src/app/_shared/components/acao-confirm/confirm-acao.component";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { ConfirmAcaoModalConfig } from "src/app/_shared/services/shared.modal";
import { CreateColaboradorModalConfig, EditColaboradorModalConfig } from "../services/adm-modal";
import { AdmService } from "../services/adm.service";
import { CreateColaboradoresComponent } from "./create/colaborador-create.component";
import { EditColaboradoresComponent } from "./edit/colaborador-edit.component";

@Component({
    selector: "colaboradores-app",
    templateUrl: './colaboradores.component.html',
    styleUrls: ['./colaboradores.component.scss']
})

export class ColaboradoresComponent extends BaseComponent implements OnInit {

    colaboradores: any[] = new Array<any>();
    public pesquisarForm: FormGroup

    constructor(
        private _admService: AdmService,
        override _snackBar: MatSnackBar,
        //private _http: HttpClient,
        private _fb: FormBuilder,
        private _modal: MatDialog) {

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
      console.log(this.tokenInfo.role)

    }

    public Pesquisar(event?: any) {

        this.showMessageNotFound = false

       // if (this.pesquisarForm.valid || this.tokenInfo['role'] == 'SuperAdm') {

            this.spinnerSearch = 'visible'

            if (event != undefined) {
                this.currentPage = event.pageIndex + 1
            } else {
                this.currentPage = 1
            }

            this._admService.GetColaboradores(this.pageSize, this.currentPage, this.pesquisarForm.value)
                .subscribe(
                    sucesso => { this.processarSucesso(sucesso, event) },
                    falha => { this.processarFalha(falha) }
                );
       // }

        return event
    }

    get podeDeletar() {

        return this.tokenInfo.role == 'SuperAdm'
    }

    processarSucesso(response: any, event?: any) {

        this.colaboradores = Object.assign([], response['data']);

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
            this.mensagemNotFound = "Sua pesquisa não encontrou nenhum registro correspondente"
            this.showMessageNotFound = true
            this.colaboradores = new Array<any>();
        }
        if (fail['status'] != 404) {
            this.mensagemNotFound = "Ocorreu um erro desconhecido, por favor, procure o administrador do sistema"
            this.showMessageNotFound = true
            this.colaboradores = new Array<any>();
        }

        this.spinnerSearch = 'hidden'
    }

    get disabledOpenEditButton() {

        return this.spinnerSearch != 'hidden'
    }

    public Deletar(colaboradorId: any) {

        const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

            if (data.clicked == true) {
                this.spinnerSearch = 'visible'

                this._admService.DeleteColaborador(colaboradorId)
                    .subscribe(
                        response => { this.spinnerSearch = 'hidden' },
                        err => { this.spinnerSearch = 'hidden' })
            }
        })
    }



    openCreateUserModal(): void {
        const dialogRef = this._modal
            .open(CreateColaboradoresComponent, CreateColaboradorModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

        });
    }



    openEditUserModal(item: any): void {
        const dialogRef = this._modal
            .open(EditColaboradoresComponent, EditColaboradorModalConfig(item));
        dialogRef.afterClosed().subscribe(data => {
        });
    }
}
