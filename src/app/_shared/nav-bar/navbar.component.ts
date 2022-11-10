import { Component, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { GetNavBarProperties } from "../models/nav-bar-routes";
import { RouteInfo } from "../models/route-info.model";
import { TrocaSenhaModalConfig } from "../models/shared-modal";
import { TokenInfos } from "../models/token.model";
import { AuthService } from "../_auth/auth.service";
import { TrocaSenhaComponent } from "../_auth/user/troca-senha/troca-senha.component";

export const ROUTES: RouteInfo[] = [
  { path: './adm', title: 'Administrativo', class: '', typeIcon: '' },
  { path: './mat', title: 'Matrícula', class: '', typeIcon: '' },
  { path: './pedag', title: 'Pedagógico', class: '', typeIcon: '' },
  { path: './comercial', title: 'Comercial', class: '', typeIcon: '' },
  { path: './financeiro', title: 'Financeiro', class: '', typeIcon: '' }
  //{ path: './aluno-sia', title: 'Aluno/Sia', class: '', typeIcon: '' }
]

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['navbar.component.scss']
})

export class NavBarComponent implements OnInit {

  private jwtHelper = new JwtHelperService();
  public tokenInfo: TokenInfos = new TokenInfos();

  menu: any;
  constructor(
    private _router: Router,
    public authService: AuthService,
    private _modal: MatDialog,

  ) {
    //const rotas = GetNavBarProperties();
    //this.menu = rotas.filter(menu => menu);
   }

  ngOnInit() {
    //GetNavBarProperties()
    //var token: any = localStorage.getItem('jwt');
    //this.tokenInfo = this.jwtHelper.decodeToken(token)

    this.menu = ROUTES.filter(menu => menu);
    console.log("nav bar")
  }

  public TrocarSenha(): void {
    const dialogRef = this._modal
      .open(TrocaSenhaComponent, TrocaSenhaModalConfig());
    dialogRef.afterClosed().subscribe(data => {
      if (data.clicked === true) {

        localStorage.removeItem("jwt");

        this._router.navigateByUrl('user/login');
      } else if (data.clicked === "Cancel") {

      }
    });
  }

  public Logout() {
    this.menu = []
    localStorage.removeItem("jwt");
    this._router.navigateByUrl('user/login');
  }

}
