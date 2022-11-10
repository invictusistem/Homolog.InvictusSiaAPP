import { JwtHelperService } from "@auth0/angular-jwt";
import { RouteInfo } from "./route-info.model"
import { TokenInfos } from "./token.model";

export function GetNavBarProperties() {

  const jwtHelper = new JwtHelperService();

  var token: any = localStorage.getItem('jwt');

  const tokenInfo: TokenInfos = jwtHelper.decodeToken(token)

  var rotas: RouteInfo[] = []

  if (tokenInfo.role != 'Aluno') {
    rotas = [
      { path: './adm', title: 'Administrativo', class: '', typeIcon: '' },
      { path: './mat', title: 'Matrícula', class: '', typeIcon: '' },
      { path: './pedag', title: 'Pedagógico', class: '', typeIcon: '' },
      { path: './comercial', title: 'Comercial', class: '', typeIcon: '' },
      { path: './financeiro', title: 'Financeiro', class: '', typeIcon: '' }
    ]
  }

  if (tokenInfo.role == 'Aluno') {
    rotas = [
      { path: './aluno-sia', title: 'Aluno/Sia', class: '', typeIcon: '' }
    ]
  }

  const ROUTES: RouteInfo[] = rotas

  return ROUTES;
}

export function PreventRoteRoleGuard(setor: Setor): boolean {

  const jwtHelper = new JwtHelperService();
  var token: any = localStorage.getItem('jwt');
  const tokenInfo: TokenInfos = jwtHelper.decodeToken(token)

  const role = tokenInfo.role

  if (role == Role.SuperAdm.toString()) {
    return setor.toString() != Setor.Aluno
  }

  if (role == Role.Aluno.toString()) {
    return setor.toString() == Setor.Aluno
  }

  return false

}

export enum Role {
  SuperAdm = 'SuperAdm',
  Aluno = 'Aluno'
}

export enum Setor {
  Admin = 'Admin',
  Matricula = 'Matricula',
  Pedag = 'Pedag',
  Comercial = 'Comercial',
  Financeiro = 'Financeiro',
  Aluno = 'Aluno'
}
