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

  login(model: any, unidadeId:any) {

    let url = `${this.baseURL}/identity/login/${unidadeId}`

   
    return this.http
      .post(url, model, {

      }).pipe(
        map((response: any) => {
          const user = response;
         
          if (user) {
            localStorage.setItem('jwt', user.accessToken);
            //this.decodedToken = this.jwtHelper.decodeToken(user.userToken);
            sessionStorage.setItem('username', user.userToken.nome);
          }
        })
      );
  }

  public extractData(response: any) {
    return response || {};
  }

  preLogin(model: any) {
   
    let url = `${this.baseURL}/identity/pre-login`
   
    let response = this.http
      .post(url, model, {

      }).pipe(
        map(this.extractData),
        catchError(this.serviceError));

    return response;
  }

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
