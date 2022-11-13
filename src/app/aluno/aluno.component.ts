import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  { path: '/aluno-sia/alunofin', title: 'Financeiro', class: '', typeIcon: 'paid' },
  { path: '/aluno/alunodocs', title: 'Documentação', class: '', typeIcon: 'text_snippet' },
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
  data: string = "";
  constructor(
    private _router: Router,
    private http: HttpClient) {
    const navigation = this._router.getCurrentNavigation();
    //  console.log(navigation.extras['state'])
    if (navigation?.extras['state'] != undefined) {
      const state = navigation.extras.state as { data: string };
      this.data = state.data;
    }

  }
  ngOnInit() {
console.log('from aluno sia')
    if (this.data != "") {
      // this.getMessage();

    }
    this.menu = ROUTES.filter(menu => menu);
    this.menu2 = ROUTES2.filter(menu2 => menu2);
    this.menu3 = ROUTES3.filter(menu3 => menu3);
  }

  invalidLogin!: boolean;

  logOut() {
    localStorage.removeItem("jwt-aluno");
    this._router.navigate(["/login"]);

  }

}

