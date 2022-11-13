import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-req-view',
  templateUrl: './req-view.component.html',
  styleUrls: ['./req-view.component.scss']
})
export class ReqViewComponent extends BaseComponent implements OnInit {

  public requerimento: any
  public showtablePrincipal = false

  constructor(
    private _http: HttpClient,
    override _snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<ReqViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
  }

  ngOnInit(): void {
    console.log(this.data['req'])
    this.GetRequerimento()
  }

  private GetRequerimento() {

    this._http.get(`${this.baseUrl}/requerimento/pesquisar/${this.data['req'].id}/view`)
      .subscribe({
        next: (resp: any) => {
          this.initProgressBar = 'hidden'
          this.requerimento = resp
          //this.respostaForm.get('id')?.setValue(resp.id)
          this.showtablePrincipal = true
        },
        error: (fail: any) => {
          this.OpenSnackBarErrorDefault()
          this.dialogRef.close({ sucesso: false })
        }

      })

  }

}
