import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-pedag-turma-mensagem',
  templateUrl: './pedag-turma-mensagem.component.html',
  styleUrls: ['./pedag-turma-mensagem.component.scss']
})

export class PedagTurmaMensagemComponent extends BaseComponent implements OnInit {

  public emailForm: FormGroup;

  constructor(
    override _snackBar: MatSnackBar,
    private _http: HttpClient,
    private _fb: FormBuilder,
    public dialogRef: MatDialogRef<PedagTurmaMensagemComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.emailForm = _fb.group({
      titulo: ['', [Validators.required, Validators.minLength(5)]],
      conteudo: ['', [Validators.required]],
      turmaId:['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    console.log(this.data)
    this.emailForm.get('turmaId')?.setValue(this.data['turma'].id)
  }


  onSubmit() {

    if (this.emailForm.valid) {
      this.disabledSaveButton = 'visible'

      this._http.post(`${this.baseUrl}/mensagem/turma`, this.emailForm.value)
      .subscribe({
        next: (resp) =>{
          this.OpenSnackBarSucesso('E-mail enviado para os alunos da turma.')
          this.dialogRef.close({sucesso: true})
        },
        error: (error) =>{
          this.disabledSaveButton = 'hidden'
          this.OpenSnackBarErrorDefault()
        }
      })

    }

  }

  get disabledButton() {
    if (this.emailForm.valid) {
      return this.disabledSaveButton != 'hidden'
    } else {
      return true
    }
  }


  config: AngularEditorConfig = {
    editable: true,
    sanitize: false,
    spellcheck: true,
    height: '10rem',
    minHeight: '10rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
    ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };

}
