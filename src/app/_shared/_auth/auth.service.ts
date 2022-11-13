import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { JwtHelperService } from "@auth0/angular-jwt";
import { throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  baseURL = environment.baseUrl;
  jwtHelper = new JwtHelperService();
  decodedToken: any;

  constructor(private http: HttpClient) { }

  public Login(model: any) {

    let url = `${this.baseURL}/sia/login`

    console.log(model)
    console.log(url)


    return this.http
      .post(url, model, {

      }).pipe(
        map((response: any) => {
         // if (token) {
            localStorage.setItem('jwt-aluno', response['token']);
         // }
        })
      );
  }

  public extractData(response: any) {
    return response || {};
  }

  // preLogin(model: any) {

  //   let url = `${this.baseURL}/identity/pre-login`

  //   let response = this.http
  //     .post(url, model, {

  //     }).pipe(
  //       map(this.extractData),
  //       catchError(this.serviceError));

  //   return response;
  // }

  public serviceError(response: Response | any) {
    let customError: string[] = [];

    if (response instanceof HttpErrorResponse) {

      if (response.statusText === "Unknown Error") {
        customError.push("Ocorreu um erro desconhecido");
        response.error.errors = customError;
      }
    }


    return throwError(response);
  }

  loggedIn() {
    var token: string | null  = localStorage.getItem('jwt') || '{}';

    return !this.jwtHelper.isTokenExpired(token);
  }

}
