import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { CreateBolsaModalConfig, EditBolsaModalConfig, ShowSenhaModalConfig } from "../services/adm-modal";
import { AdmService } from "../services/adm.service";
import { CreateBolsaComponent } from "./create/create-bolsa.component";
import { EditBolsaComponent } from "./edit/edit-bolsa.component";
import { ShowSenhaComponent } from "./show/show-senha.component";

@Component({
    selector: "bolsas-app",
    templateUrl: './bolsas.component.html',
    styleUrls: ['./bolsas.component.scss']
})

export class BolsasComponent extends BaseComponent implements OnInit {

    public typesPacotes: any[] = new Array<any>();
    public bolsas: any[] = new Array<any>()
    public pesquisarForm: FormGroup

    constructor(
        private _admService: AdmService,
        override _snackBar: MatSnackBar,
        private _fb: FormBuilder,
        private _modal: MatDialog
    ) {
        super(_snackBar);
        this.pesquisarForm = _fb.group({
            typePacoteId: ['', [Validators.required]]
        })
    }

    ngOnInit() {
        this.GetTypePacotes();
    }

    GetTypePacotes() {
        this.initProgressBar = 'visible'
        this._admService.GetTypePacotes()
            .subscribe(
                sucesso => { this.GetTypePacotesSucesso(sucesso) },
                falha => { this.GetTypePacotesErro(falha) }
            )

    }

    GetTypePacotesSucesso(resposta: any) {
        this.typesPacotes = Object.assign([], resposta['typePacotes']);
        this.initProgressBar = 'hidden'
    }

    GetTypePacotesErro(error: any) {
        this.initProgressBar = 'hidden'
    }

    Pesquisar() {
        this.showMessageNotFound = false
        if (this.pesquisarForm.valid) {
            this.initProgressBar = 'visible'
            this._admService.GetBolsas(this.pesquisarForm.get('typePacoteId')?.value)
                .subscribe(
                    resposta => { this.PesquisarSucesso(resposta) },
                    falha => { this.PesquisarFalha(falha) }
                )
        }
    }

    PesquisarSucesso(resp: any) {
        this.bolsas = new Array<any>()
        this.bolsas = resp['bolsas']
        this.length = this.bolsas.length
        this.initProgressBar = 'hidden'
    }

    PesquisarFalha(Error: any) {
        this.bolsas = new Array<any>()
        this.initProgressBar = 'hidden'
        this.showMessageNotFound = true
    }

    openCreateBolsaModal(): void {
        const dialogRef = this._modal
            .open(CreateBolsaComponent, CreateBolsaModalConfig());
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

    get disabledCodigo() {
        return false
    }

    EditarBolsa(bolsaId: any) {
        const dialogRef = this._modal
            .open(EditBolsaComponent, EditBolsaModalConfig(bolsaId));
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked == true) {
                this.Pesquisar();
            }

        });
    }

    public VerCodigoBolsa(bolsaId: any) {
        this._admService.GetBolsaSenha(bolsaId)
            .subscribe(
                resposta => { this.showSenha(resposta) },
                falha => { }
            )
    }

    showSenha(resp: any): void {
        const dialogRef = this._modal
            .open(ShowSenhaComponent, ShowSenhaModalConfig(resp['senha']));
        dialogRef.afterClosed().subscribe((data) => {

        });
    }

}