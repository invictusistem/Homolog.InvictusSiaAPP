import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Modalidade } from 'src/app/_shared/models/perfil.model';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { AdmService } from '../../services/adm.service';

@Component({
  selector: 'app-mat-edit',
  templateUrl: './mat-edit.component.html',
  styleUrls: ['./mat-edit.component.scss']
})

export class MatEditComponent extends BaseComponent implements OnInit {


  //baseUrl = environment.baseUrl;

  //private jwtHelper = new JwtHelperService();
  //public tokenInfo: TokenInfos = new TokenInfos();
  public matForm: FormGroup
  private originalMat: any
  public typesPacotes: any[] = new Array<any>();
  //public progress = false
  public modalidade = Modalidade
  constructor(
    private _fb: FormBuilder,
    override _snackBar: MatSnackBar,
    //private _http: HttpClient,
    private _admService: AdmService,
    public dialogRef: MatDialogRef<MatEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);
    this.matForm = _fb.group({
      id:[''],
      nomeDesc:[''],
      nome: ['', [Validators.required]],
      descricao: [''],
      typePacoteId: ['', [Validators.required]],
      modalidade: ['', [Validators.required]],
      cargaHoraria: ['', [Validators.required]],
      ativo: [true]
    })
  }

  ngOnInit() {
    //const token: any = localStorage.getItem('jwt')
    //this.tokenInfo = this.jwtHelper.decodeToken(token)
    this.GetMateriaById();
  }

  private GetMateriaById() {

    this._admService.GetMateriaById(this.data['matId'])
      .subscribe({
        next: (resp: any) => {
          this.typesPacotes = Object.assign([], resp['types']);

          this.matForm.patchValue(resp['results']);
          this.originalMat = JSON.parse(JSON.stringify(this.matForm.value))


          this.showForm = true
          this.initProgressBar = 'hidden'
        },
        error: (error) => {
          this.OpenSnackBarErrorDefault()
          this.initProgressBar = 'hidden'
        }
      })
  }

  onSubmit(form: FormGroup) {

    if (form.valid) {
      this.disabledSaveButton = 'visible'
      //this.progress = true
      this._admService.EditMateria(this.matForm.value)
        .subscribe(response => {

        }, (err) => {
          this.disabledSaveButton = 'hidden'
          this.OpenSnackBarErrorDefault()
        },
          () => {
            this.OpenSnackBarSucesso("Matéria editada com sucesso.");
            this.dialogRef.close({ clicked: "Ok" });
          });
    }
  }

  get disabledButton() {
    if (this.matForm.valid &&
      JSON.stringify(this.originalMat) !=
      JSON.stringify(this.matForm.value)) {

      return this.disabledSaveButton != 'hidden'
    } else {
      return true
    }
  }
}