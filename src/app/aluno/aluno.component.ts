import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { PreventRoteRoleGuard, Setor } from '../_shared/models/nav-bar-routes';

declare interface RouteInfo {
  path: string;
  title: string;
  class: string;
  typeIcon: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/aluno/estagio', title: 'Cadastro', class: '', typeIcon: 'person' },
  { path: '/aluno/estagio', title: 'Notas', class: '', typeIcon: 'domain' },
  { path: '/aluno/estagio', title: 'Frequência', class: '', typeIcon: 'edit_calendar' },
  { path: '/aluno/estagio', title: 'Financeiro', class: '', typeIcon: 'paid' },
  { path: '/aluno/alunodocs', title: 'Documentação', class: '', typeIcon: 'text_snippet' }
  //{ path: '/aluno/alunodocs', title: 'Requerimentos', class: '', typeIcon: 'attachment' }
]

export const ROUTES2: RouteInfo[] = [
  { path: '/aluno-sia/estagio-sia', title: 'Estágio', class: '', typeIcon: 'domain' }
  //{ path: '/aluno/estagio', title: 'Estágio/', class: '', typeIcon: 'domain' },
  //{ path: '/aluno/estagio', title: 'Estágios', class: '', typeIcon: 'domain' },
  // { path: '/aluno/alunodocs', title: 'Documentação', class: '', typeIcon: 'attachment' },
  // { path: '/aluno/alunodocs', title: 'Requerimentos', class: '', typeIcon: 'attachment' }
]

export const ROUTES3: RouteInfo[] = [
  { path: '/aluno-sia/requerimentos', title: 'Requerimentos', class: '', typeIcon: 'read_more' }
  //{ path: '/aluno/estagio', title: 'Estágio/', class: '', typeIcon: 'domain' },
  //{ path: '/aluno/estagio', title: 'Estágios', class: '', typeIcon: 'domain' },
  // { path: '/aluno/alunodocs', title: 'Documentação', class: '', typeIcon: 'attachment' },
  // { path: '/aluno/alunodocs', title: 'Requerimentos', class: '', typeIcon: 'attachment' }
]

@Component({
  selector: 'aluno-app',
  templateUrl: './aluno.component.html',
  styleUrls: ['./aluno.component.scss']
})

export class AlunoSiaComponent implements OnInit {
  menu: any;
  menu2: any;
  menu3: any;
  constructor(
    //private jwtHelper: JwtHelperService,
    private router: Router,
    private http: HttpClient) { }
  ngOnInit() {
    console.log('aluno component')
    var authorize = PreventRoteRoleGuard(Setor.Aluno)

    if(!authorize){
      this.router.navigate(['/adm']);
    }

    // this.isUserAuthenticated();
    this.menu = ROUTES.filter(menu => menu);
    this.menu2 = ROUTES2.filter(menu2 => menu2);
    this.menu3 = ROUTES3.filter(menu3 => menu3);
  }

  invalidLogin!: boolean;

  logOut() {
    localStorage.removeItem("jwt");
    this.router.navigate(["/login"]);

  }

}

