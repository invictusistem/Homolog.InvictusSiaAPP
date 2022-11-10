import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-lead-individual',
  templateUrl: './lead-individual.component.html',
  styleUrls: ['./lead-individual.component.scss']
})
export class LeadIndividualComponent extends BaseComponent implements OnInit {

  //baseUrl = environment.baseUrl;
  //private jwtHelper = new JwtHelperService();
  //public tokenInfo: TokenInfos = new TokenInfos();
  progressBar = 'hidden'
  disableButton = false
  public progress!: number;
  public message!: string;
  @Output() public onUploadFinished = new EventEmitter();


  constructor(
    override _snackBar: MatSnackBar,
    private router: Router,
        private _fb: FormBuilder,
        private _http: HttpClient,
    public dialogRef: MatDialogRef<LeadIndividualComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
   }

  ngOnInit(): void {
  }
  //showForm = false

  onSubmit(form: any) {

      if (form.valid) {


          this._http.post(`${this.baseUrl}/colaboradores`, form.value, {

          }).subscribe(response => {

          }, (err) => {

          },
              () => {

                  this.openSnackBar()

                  this.dialogRef.close({ clicked: "Ok" });
              });
      }
  }

  buscarEmail(event: any){

  }

  openSnackBar() {
      this._snackBar.open('Lead cadastrada com sucesso.', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: 'green-snackbar',
          duration: 3 * 1000,
      });
  }

  uploadFile(files: any){

      console.log(files)
      if (files.length === 0) {

          return;
      }
      //this.decodedToken = this.jwtHelper.decodeToken(localStorage.getItem('jwt'));

      //console.log(this.decodedToken)
      //console.log(this.decodedToken['email'])
      let fileToUpload = <File>files[0];
      const formData = new FormData();
      formData.append('file', fileToUpload, fileToUpload.name);
      this.progressBar = 'visible'
      this.disableButton = true
      this._http.post(`${this.baseUrl}/comercial/lead/upload`, formData, {

          reportProgress: true, observe: 'events',

      })
          .subscribe(event => {
              if (event.type === HttpEventType.UploadProgress){
               //   this.progress = Math.round(100 * event.loaded / event.total);
              }
              else if (event.type === HttpEventType.Response) {
                  this.message = 'Upload success.';
                  this.onUploadFinished.emit(event.body);
              }
          },
              (error) => {
                //console.log(error)
                this.OpenSnackBarError("Ocorreu um erro. Entre em contato com o administrador")
                this.dialogRef.close();
               },
              () => {
                  console.log('finally')
                  this.OpenSnackBarSucesso("Leads salvas com sucesso.")
                  this.dialogRef.close({ clicked: "Ok" });

              });
   }

  exportExcel() {

      var file = "Modelo LEAD.xlsx";


      this.download().subscribe((data: any) => {
        this.progressBar = 'visible'
        this.disableButton = true

          switch (data.type) {
              case HttpEventType.Response:
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                  const a = document.createElement('a');
                  a.setAttribute('style', 'display:none;');
                  document.body.appendChild(a);
                  a.download = file;
                  a.href = URL.createObjectURL(downloadedFile);
                  a.target = '_blank';
                  a.click();
                  document.body.removeChild(a);
                  break;
          }
      },
          (err) => {
            this.progressBar = 'hidden'
            this.disableButton = false
          },
          () => {
            this.progressBar = 'hidden'
            this.disableButton = false
          }
      );
  }



  public download(): Observable<HttpEvent<Blob>> {
      return this._http.request(new HttpRequest(
          'GET', `${this.baseUrl}/comercial/lead/modelo`, null, {
          reportProgress: true,
          responseType: 'blob'
      }));
  }


  onOkClick() {

      this.dialogRef.close({ clicked: "Ok" });
  }



}
