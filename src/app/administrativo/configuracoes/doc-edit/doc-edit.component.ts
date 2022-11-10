import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';
import { AdmService } from '../../services/adm.service';

@Component({
  selector: 'app-doc-edit',
  templateUrl: './doc-edit.component.html',
  styleUrls: ['./doc-edit.component.scss']
})
export class DocEditComponent extends BaseComponent implements OnInit {

  public docForm: FormGroup
  private originalDoc: any;
  public progress = false
  constructor(
    private _fb: FormBuilder,
    override _snackBar: MatSnackBar,
    private _admService: AdmService,
    public dialogRef: MatDialogRef<DocEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);
    this.docForm = _fb.group({
      id: [''],
      nome: ['', [Validators.required]],
      descricao: [''],
      validadeDias: ['', [Validators.required]]
    })
  }

  ngOnInit() {
    //const token: any = localStorage.getItem('jwt')
    //this.tokenInfo = this.jwtHelper.decodeToken(token)
    this.GetDocByid();
  }

  public GetDocByid() {

    this._admService.GetDocById(this.data['docId'])
      .subscribe({
        next: (response: any) => {
          this.docForm.patchValue(response['doc']);
          this.originalDoc = JSON.parse(JSON.stringify(this.docForm.value))
          this.initProgressBar = 'hidden'
          this.showForm = true
        },
        error: (error) => {
          this.disabledSaveButton = 'hidden'
          this.progress = false
          this.OpenSnackBarErrorDefault()
        }
      })
  }

  get disabledSave() {
    if (this.docForm.valid &&
      JSON.stringify(this.originalDoc) !=
      JSON.stringify(this.docForm.value)) {

      return this.disabledSaveButton != 'hidden'
    } else {
      return true
    }
  }

  onSubmit(form: FormGroup) {

    if (form.valid) {
      this.disabledSaveButton = 'visible'
      this.progress = true
      this._admService.EditDocumento(this.docForm.value)
        .subscribe(response => {

        }, (err) => {
          this.disabledSaveButton = 'hidden'
          this.OpenSnackBarErrorDefault()
          this.progress = false
        },
          () => {
            this.OpenSnackBarSucesso("Documento editado com sucesso.")
            this.progress = false
            this.dialogRef.close({ clicked: "Ok" });
          });
    }
  }

}
