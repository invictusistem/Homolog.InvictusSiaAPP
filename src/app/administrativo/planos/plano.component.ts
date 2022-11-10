import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { ConfirmAcaoModalComponent } from "src/app/_shared/components/acao-confirm/confirm-acao.component";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { BaseComponent } from "src/app/_shared/services/basecomponent.component";
import { ConfirmAcaoModalConfig } from "src/app/_shared/services/shared.modal";
import { environment } from "src/environments/environment";
import { CreatePlanoModalConfig, EditPlanoModalConfig } from "../services/adm-modal";
import { AdmService } from "../services/adm.service";
import { PlanoPgmCreateComponent } from "./create/create-plano.component";
import { PlanoPgmEditComponent } from "./edit/edit-plano.component";

@Component({
  selector: "plano-app",
  templateUrl: './plano.component.html',
  styleUrls: ['./plano.component.scss']
})

export class PlanoPgmComponent extends BaseComponent implements OnInit {

  //baseUrl = environment.baseUrl;
  // public spinnerSearch = 'visible'
  public modulos: any[] = new Array<any>();

  public pesquisarForm: FormGroup
  //public tokenInfo: TokenInfos = new TokenInfos();
  //private jwtHelper = new JwtHelperService();
  public planos: any[] = new Array<any>();
  public typesPacotes: any[] = new Array<any>();
  public disabledForm = true
  constructor(
    // private _http: HttpClient,
    private _admService: AdmService,
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _modal: MatDialog) {
    super(_snackBar);
    this.pesquisarForm = _fb.group({
      typePacoteId: ['', [Validators.required]]
      // unidadeId: ['', [Validators.required]]
    });

  }

  ngOnInit() {
    //console.log('init colaboradores 123')
    const token = localStorage.getItem('jwt')

    // this.GetPlanos();
    this.getTypePacotes();
  }

  getTypePacotes() {
    this.spinnerSearch = 'visible'
    this._admService.GetTypePacotes()
      .subscribe({
        next: (resp: any) => {

          //console.log(resp)
          this.typesPacotes = Object.assign([], resp['typePacotes']);
          this.disabledForm = false
          this.spinnerSearch = 'hidden'
        },
        error: (error) => {
          this.spinnerSearch = 'hidden'
        }
      })
  }

  public Pesquisar() {

    if (this.pesquisarForm.valid) {
      this.spinnerSearch = 'visible'
      let typePacoteId = this.pesquisarForm.get('typePacoteId')?.value
      //let unidadeId = this.pesquisarForm.get('unidadeId').value
      // console.log(typePacoteId)
      this._admService.GetPlanoPacoteById(typePacoteId)
        .subscribe({
          next: (resp: any) => this.PesquisarResult(resp),
          error: (error) => { }
        })
    }
  }

  private PesquisarResult(resp: any) {
    this.planos = Object.assign([], resp['planos']);
    this.spinnerSearch = 'hidden'

  }

  private GetPlanos() {

    this._admService.GetPlanos()
      .subscribe(resp => {
        this.planos = Object.assign([], resp);
      }, (error) => {

        //console.log(error)
      },
        () => {
          //console.log(this.planos)
        })
  }

  getModulos() {

    this._admService.GetModulosUnidade()
      .subscribe(resp => {
        this.modulos = Object.assign([], resp);
      }, (error) => {
        //console.log(error)
      },
        () => {

        })
  }

  DeletePlano(planoId: any) {

    const dialogRef = this._modal
            .open(ConfirmAcaoModalComponent, ConfirmAcaoModalConfig());
        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked == true) {

              this._admService.DeletePlano(planoId)
              .subscribe(resp => {

              }, (error) => {
                //console.log(error)
                this.OpenSnackBarErrorDefault()
              },
                () => {
                  this.OpenSnackBarSucesso("Plano deletado com sucesso.")
                  this.GetPlanos();
                })
            }
        });

  }

  get podeDeletar() {
    return this.tokenInfo.role == 'SuperAdm'
}

  createPlano(): void {
    const dialogRef = this._modal
      .open(PlanoPgmCreateComponent, CreatePlanoModalConfig());
    dialogRef.afterClosed().subscribe((data) => {
      if (data.clicked === "Ok") {
        this.GetPlanos();
      }
    });
  }

  // PlanoPgmEditComponent
  EditPlano(plano: any): void {
    const dialogRef = this._modal
      .open(PlanoPgmEditComponent, EditPlanoModalConfig(plano));
    dialogRef.afterClosed().subscribe((data) => {
      if (data.clicked === "Ok") {
        this.GetPlanos();
      }
    });
  }

  pesquisar() {

  }
}
