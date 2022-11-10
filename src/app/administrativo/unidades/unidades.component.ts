import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { AddSalaConfig, EditSalaModalConfig, OpenEditUnidadeConfig, OpenUnidadeCreateModalConfig } from "../services/adm-modal";
import { CreateUnidadeComponent } from "./create/unidade-create.component";
import { EditUnidadeComponent } from "./edit/unidade-edit.component";
import { CreateSalaComponent } from "./salas/create/sala-create.component";
import { SalaEditarComponent } from "./salas/edit/sala-edit.component";

@Component({
    selector: "unidades-app",
    templateUrl: './unidades.component.html',
    styleUrls: ['./unidades.component.scss'],
    animations: [HighlightTrigger]
})

export class UnidadesComponent implements OnInit {

    private _baseUrl = environment.baseUrl;
    //public salas: Sala[] = new Array<Sala>();
    public unidades: any[] = new Array<any>()
    public spinnerSearch = 'visible'

    constructor(
        private _http: HttpClient,
        private _modal: MatDialog
        ) { }


    ngOnInit() {

        this.getUnidades();

    }

    getUnidades() {

        this._http.get(`${this._baseUrl}/unidade`)
            .subscribe((response: any) => {

                Object.assign(this.unidades, response['unidades'])
            },
                (error) => { 
                    this.spinnerSearch = 'hidden'
                 },
                () => {
                    this.spinnerSearch = 'hidden'
                })

    }

    
    openUnidadeCreateModal(): void {
        const dialogRef = this._modal
            .open(CreateUnidadeComponent, OpenUnidadeCreateModalConfig());
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data.created == true) {
                this.getUnidades();
            }
        });
    }
    
    openEditUnidade(unidade: any): void {
        const dialogRef = this._modal
            .open(EditUnidadeComponent, OpenEditUnidadeConfig(unidade));
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data.edited == true) {
                this.getUnidades();
            }
        });
    }

    addSala(unidade: any): void {
        const dialogRef = this._modal
            .open(CreateSalaComponent, AddSalaConfig(unidade));
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data.clicked === "Ok") {
                this.getUnidades();
            }
        });
    }

    editSala(unidade: any): void {
        const dialogRef = this._modal
            .open(SalaEditarComponent, EditSalaModalConfig(unidade));
        dialogRef.afterClosed().subscribe((data: any) => {
            if (data.clicked === "OK") {
                this.getUnidades();
            }
        });
    }

}