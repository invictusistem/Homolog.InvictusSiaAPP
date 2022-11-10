import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RouteInfo } from '../_shared/models/route-info.model';
import { TokenInfos } from '../_shared/models/token.model';

export const ROUTES: RouteInfo[] = [
    { path: '/pedag/aluno', title: 'Alunos', class: '', typeIcon: 'face' },
    { path: '/pedag/alunoacesso', title: 'Alunos/Acesso', class: '', typeIcon: 'face' },
  //  { path: '/pedag/pedagalunos', title: 'Alunos', class: '', typeIcon: 'face' },
    { path: '/pedag/transf', title: 'Transferência', class: '', typeIcon: 'sync_alt' },
   // { path: '/pedag/reposicoes', title: 'Reposições', class: '', typeIcon: 'change_circle' },
    { path: '/pedag/turmasinfo', title: 'Turmas', class: '', typeIcon: 'school' },
    { path: '/pedag/turmas', title: 'Diário de Classe', class: '', typeIcon: 'assignment' },
    { path: '/pedag/requerimentos', title: 'Requerimentos', class: '', typeIcon: 'article' },
    { path: '/pedag/analisedocs', title: 'Documentação', class: '', typeIcon: 'description' },
    { path: '/pedag/estagio', title: 'Estágios', class: '', typeIcon: 'settings_applications' },
    { path: '/pedag/estagiosdoc', title: 'Estágios/Gestão', class: '', typeIcon: 'settings_applications' },
    { path: '/pedag/relatorios', title: 'Relatórios', class: '', typeIcon: 'summarize' },
]

@Component({
    selector: 'pedagogico-app',
    templateUrl: './pedagogico.component.html',
    styleUrls: ['./pedagogico.component.scss']
})

export class PedagogicoComponent implements OnInit{


    menu: any;
    private jwtHelper = new JwtHelperService();
    public tokenInfo: TokenInfos = new TokenInfos();

    constructor(
        private router: Router,
        private http: HttpClient
        ) {

        }
    ngOnInit(){
        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
       this.menu = ROUTES.filter(menu => menu);
    }


    //invalidLogin: boolean;

    logOut() {
        localStorage.removeItem("jwt");
        this.router.navigate(["/login"]);
    }

}
