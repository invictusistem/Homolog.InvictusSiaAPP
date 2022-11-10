import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NavigationExtras, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { SelectUnidadeModalConfig } from "src/app/_shared/models/shared-modal";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { AuthService } from "../../auth.service";
import { SelectUnidadeComponent } from "./selecionar-unidade/select-unidade.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [HighlightTrigger]
})
export class LoginComponent implements OnInit {

  titulo = 'Login';
  //model: any = {};
  private jwtHelper = new JwtHelperService();
  public tokenInfo: TokenInfos = new TokenInfos();

  hide = true;
  progress = false
  showErrorMsg = 'hidden'
  errorMsg = 'Ocorreu um erro desconhecido. Entre em contato com o administrador do sistema.'
  unidades: any[] = new Array<any>()
  public authForm: FormGroup
  constructor(private authService: AuthService,
    private _fb: FormBuilder,
    public router: Router,
    private _modal: MatDialog
    //, private toastr: ToastrService
  ) {
    this.authForm = _fb.group({
      email: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  ngOnInit() {
    if (localStorage.getItem('jwt') != null) {
      this.router.navigate(['/adm']);
    }
  }

  preLogin(form: any) {
    this.showErrorMsg = 'hidden'
    this.progress = true
    if (this.authForm.valid) {
      this.authService.preLogin(form)
        .subscribe(
          sucesso => { this.preLoginSucess(sucesso) },
          falha => { this.preLoginError(falha) });
    }

  }

  preLoginSucess(sucesso: any) {
    //console.log(sucesso)
    this.unidades = sucesso['unidades']
    this.progress = false
    if (this.unidades.length == 1) {

      // this.authService.login(this.authForm.value)
      //   .subscribe(
      //     sucesso => { this.preLoginSucesso(sucesso) },
      //     falha => { this.preLoginError(falha) });

      this.login(this.unidades[0].unidadeId)

    } else {

      this.openSelectUnidadeModal()

    }
  }

  openSelectUnidadeModal(): void {
    const dialogRef = this._modal
      .open(SelectUnidadeComponent, SelectUnidadeModalConfig(
        this.authForm.value,
        this.unidades));
    dialogRef.afterClosed().subscribe((data) => {
      // if(data.clicked == true){
      //   this.login(data.unidadeId)
      // }
    });
  }



  preLoginError(error: any) {
    //console.log(error['status'])

    if (error['status'] == 401) {
      this.progress = false
      this.errorMsg = 'Usuário não autorizado.'
      this.showErrorMsg = 'visible'
    } else {
      this.progress = false
      this.errorMsg = error['error'].errors.Mensagens[0]
      this.showErrorMsg = 'visible'
    }
  }

  login(unidadeId: any) {
    //console.log(this.authForm.value)
    //console.log(unidadeId)
    this.showErrorMsg = 'hidden'
    this.progress = true

    if (this.authForm.valid) {
      this.authService.login(this.authForm.value, unidadeId)
        .subscribe(
          sucesso => { this.loginSucesso(sucesso) },
          falha => { this.loginError(falha) });
    }
  }

  loginSucesso(resposta: any) {

    this.progress = false
    const navigationExtras: NavigationExtras = { state: { data: 'From Login' } };

    //var token: any = localStorage.getItem('jwt');
    //this.tokenInfo = this.jwtHelper.decodeToken(token)
    // if (this.tokenInfo.role == 'Aluno') {
    //   this.router.navigate(['/aluno-sia'], navigationExtras);
    // } else {
    //   this.router.navigate(['/adm'], navigationExtras);
    // }


    this.router.navigate(['/adm'], navigationExtras);
  }

  loginError(error: any) {

    // console.log(error['status'])

    if (error['status'] != 0) {
      this.progress = false
      this.errorMsg = error['error'].errors.Mensagens[0]
      this.showErrorMsg = 'visible'
    } else {
      this.progress = false
      this.errorMsg = 'Ocorreu um erro desconhecido. Entre em contato com o administrador do sistema.'
      this.showErrorMsg = 'visible'
    }
  }

  get disabledButton() {
    // return true
    if (this.authForm.valid) {
      return this.progress
    } else {
      return true
    }
  }

}



