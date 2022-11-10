import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { ModuloCreateComponentModal, ModuloDetalheComponentModal, ModuloEditComponentModal } from "../services/adm-modal";
import { AdmService } from "../services/adm.service";
import { ModuloCreateComponent } from "./create/modulo-create.component";
import { ModuloEditComponent } from "./edit/modulo-edit.component";
import { ModuloViewComponent } from "./view/modulo-view.component";
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ModuloNovoComponent } from "./create-novo/modulo-novo.component";

@Component({
    selector: "modulo-app",
    templateUrl: './modulo.component.html',
    styleUrls: ['./modulo.component.scss']

})

export class ModuloComponent extends BaseComponent implements OnInit {

    public pacotes: any[] = new Array<any>()
    public typesPacotes: any = new Array<any>();
    public unidadesAutorizadas: any[] = new Array<any>()
    //public initProgressBar = 'visible'

    //public tokenInfo: TokenInfos = new TokenInfos();
    //private jwtHelper = new JwtHelperService();
    public pesquisarForm: FormGroup

    public showTeste = false

    constructor(
        private _fb: FormBuilder,
        private _admService: AdmService,
        override _snackBar: MatSnackBar,
        private _modal: MatDialog) {
        super(_snackBar);
        this.pesquisarForm = _fb.group({
            typePacoteId: ['', [Validators.required]],
            unidadeId: ['', [Validators.required]]
        });
    }

    movies = [
        'Episode I - The Phantom Menace',
        'Episode II - Attack of the Clones',
        'Episode III - Revenge of the Sith',
        'Episode IV - A New Hope',
        'Episode V - The Empire Strikes Back',
        'Episode VI - Return of the Jedi',
        'Episode VII - The Force Awakens',
        'Episode VIII - The Last Jedi',
        'Episode IX – The Rise of Skywalker',
    ];

    drop(event: CdkDragDrop<string[]>) {
        moveItemInArray(this.movies, event.previousIndex, event.currentIndex);
    }

    verOrder(){
        console.log(this.movies)
    }

    get showPhroto(){
        return this.tokenInfo.role == "SuperAdm"
    }

    ngOnInit() {

        //const token:any = localStorage.getItem('jwt')
        //this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.unidadesAutorizadas = JSON.parse(this.tokenInfo.UnidadesAutorizadas as string)

        this.pesquisarForm.get('unidadeId')?.setValue(this.tokenInfo.UnidadeId)
        this.getTypePacotes();
    }

    Pesquisar() {

        if (this.pesquisarForm.valid) {
            this.initProgressBar = 'visible'
            this._admService.PesquisarPacote(
                this.pesquisarForm.get('typePacoteId')?.value,
                this.pesquisarForm.get('unidadeId')?.value)
                .subscribe(
                    sucesso => { this.pesquisarSucesso(sucesso) },
                    falha => { this.pesquisarError(falha) })
        }
    }

    pesquisarSucesso(resposta: any) {
        this.initProgressBar = 'hidden'
        this.pacotes = Object.assign([], resposta['pacotes']);

    }

    pesquisarError(error: any) {
        this.initProgressBar = 'hidden'
        this.OpenSnackBarErrorDefault();
        // console.log(error)
    }

    getTypePacotes() {

        this._admService.GetTypePacotes()
            .subscribe(
                sucesso => { this.getTypePacotesSucesso(sucesso) },
                falha => { this.getTypePacotesError(falha) })
    }

    getTypePacotesSucesso(resposta: any) {
        this.initProgressBar = 'hidden'
        this.typesPacotes = Object.assign([], resposta['typePacotes']);
        this.showTeste = true
    }

    getTypePacotesError(error: any) {
        this.initProgressBar = 'hidden'
        //console.log(error)
    }

    createModulo(): void {
        const dialogRef = this._modal
            .open(ModuloCreateComponent, ModuloCreateComponentModal());
        dialogRef.afterClosed().subscribe(
            data => { });
    }

    createModuloNovo(): void {
        const dialogRef = this._modal
            .open(ModuloNovoComponent, ModuloCreateComponentModal());
        dialogRef.afterClosed().subscribe(
            data => { });
    }

    openEditModal(modulo: any): void {
        const dialogRef = this._modal
            .open(ModuloEditComponent, ModuloEditComponentModal(modulo.id));

        dialogRef.afterClosed().subscribe(
            data => { });
    }

    openDetailModal(modulo: any): void {
        const dialogRef = this._modal
            .open(ModuloViewComponent, ModuloDetalheComponentModal(modulo));
        dialogRef.afterClosed().subscribe(
            data => { });
    }
}
