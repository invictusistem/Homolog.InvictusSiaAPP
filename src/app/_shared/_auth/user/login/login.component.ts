import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { NavigationExtras, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { SelectUnidadeModalConfig } from "src/app/_shared/models/shared-modal";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { AuthService } from "../../auth.service";
//import { SelectUnidadeComponent } from "./selecionar-unidade/select-unidade.component";

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
      matricula: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  ngOnInit() {
    if (localStorage.getItem('jwt-aluno') != null) {
      this.router.navigate(['/aluno-sia']);
    }
  }

  public Login(form: any) {
    this.showErrorMsg = 'hidden'
    this.progress = true
    if (this.authForm.valid) {
      this.authService.Login(form)
        .subscribe(
          sucesso => { this.LoginSucess(sucesso) },
          falha => { this.LoginError(falha) });
    }

  }

  private LoginSucess(sucesso: any) {
    console.log('login sucesso')
    this.progress = false
    const navigationExtras: NavigationExtras = { state: { data: 'From Login' } };

    this.router.navigate(['/aluno-sia'], navigationExtras);
  }

  private LoginError(error: any) {
    console.log(error['status'])

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

  get disabledButton() {
    // return true
    if (this.authForm.valid) {
      return this.progress
    } else {
      return true
    }
  }

}



