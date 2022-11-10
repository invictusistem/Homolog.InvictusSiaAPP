import { HttpClient } from '@angular/common/http';
import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouteInfo } from '../_shared/models/route-info.model';
import { BaseComponent } from '../_shared/services/basecomponent.component';

export const ROUTES: RouteInfo[] = [
   { path: '/comercial/exportar', title: 'Lead', class: '', typeIcon: 'query_stats' },
   { path: '/comercial/pesquisa', title: 'Lead/Unidade', class: '', typeIcon: 'table_chart' },
   { path: '/comercial/filtros', title: 'Busca/Filtros', class: '', typeIcon: 'query_stats' }
  // { path: '/adm/cursos', title:'cursos', class:'', typeIcon: 'house'},
  // { path: '/adm/colaboradores', title: 'Colaboradores', class: '', typeIcon: 'engineering' },
  // { path: '/adm/produtos', title: 'Produtos', class: '', typeIcon: 'fact_check' },
]

@Component({
  selector: 'comercial-app',
  templateUrl: './comercial.component.html',
  styleUrls: ['./comercial.component.scss']
})
export class ComercialComponent extends BaseComponent implements OnInit {

  menu: any;
  public progress!: number;
  public message!: string;
  totalLeadsHoje = 0;
  totalLeads = 0;

  constructor(
    private fileService: FileService,
    // private jwtHelper: JwtHelperService,
    override _snackBar: MatSnackBar,
    private exportLeadModal: MatDialog,
    private router: Router,
    private _http: HttpClient) {
      super(_snackBar);
     }

  ngOnInit() {
    this.menu = ROUTES.filter(menu => menu);
    // this.getLeads();
  }

  getLeads() {

    //console.log(this.tokenInfo)

    this._http.get(`${this.baseUrl}/comercial/leads`)
      .subscribe((resp: any) => {
        this.totalLeadsHoje = resp['totalLeadsHoje']
        this.totalLeads = resp['totalLeads']
      },
        (error) => {
         // console.log(error)
        },
        () => { })
  }

  openExportModal(): void {
    // const dialogRef = this.exportLeadModal
    //   .open(ExportLeadComponent, {
    //     height: 'auto',
    //     width: 'auto',

    //     data: { colaborador: 'hello' },
    //     hasBackdrop: true,
    //     disableClose: true
    //   });

    // dialogRef.afterClosed().subscribe(result => {

    // });
  }

  // isUserAuthenticated() {
  //     const token: string = localStorage.getItem("jwt");
  //     if (token && !this.jwtHelper.isTokenExpired(token)) {
  //         this.router.navigate(["/customers"]);
  //         return true;
  //     }
  //     else {
  //         return false;
  //     }
  // }
  // public logOut = () => {
  //     localStorage.removeItem("jwt");
  // }

  invalidLogin!: boolean;

  //constructor(private router: Router, private http: HttpClient) { }

  // login(form: NgForm) {
  //     const credentials = JSON.stringify(form.value);
  //     console.log(credentials)
  //     this.http.post("https://localhost:44370/api/identity/login", credentials, {
  //         headers: new HttpHeaders({
  //             "Content-Type": "application/json"
  //         })
  //     }).subscribe(response => {
  //         const token = (<any>response).accessToken;
  //         console.log(response)
  //         localStorage.setItem("jwt", token);
  //         this.invalidLogin = false;
  //         this.router.navigate(["/"]);
  //     }, err => {
  //         this.invalidLogin = true;
  //     });
  // }



  // public uploadFile = (files) => {
  //     if (files.length === 0) {
  //       return;
  //     }

  //     let fileToUpload = <File>files[0];
  //     const formData = new FormData();
  //     formData.append('file', fileToUpload, fileToUpload.name);

  //     this.fileService.upload(formData).subscribe((event) => {
  //       if (event.type === HttpEventType.UploadProgress)
  //         this.progress = Math.round((100 * event.loaded) / event.total);
  //       else if (event.type === HttpEventType.Response) {
  //         this.message = 'Upload success.';
  //         this.onUploadFinished.emit(event.body);
  //       }
  //     });
  //   };

  decodedToken: any;




  refresh(): void {
    window.location.reload();
  }






}


@Injectable({
  providedIn: 'root',
})
export class FileService {
  private url = 'https://localhost:5001/api';

  constructor(private http: HttpClient) { }

  public upload(formData: FormData) {
    return this.http.post(`${this.url}/upload`, formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  public download(fileUrl: string) {
    return this.http.get(`${this.url}/download?fileUrl=${fileUrl}`, {
      reportProgress: true,
      observe: 'events',
      responseType: 'blob',
    });
  }

  public getPhotos() {
    return this.http.get(`${this.url}/getPhotos`);
  }
}
