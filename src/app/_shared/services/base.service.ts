import { HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

export abstract class BaseService {
    
    protected BaseUrl: string = environment.baseUrl

    protected ObterHeaderJson() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${localStorage.getItem('jwt')}`
            })
        };
    }


    protected ObterHeaderDownload() {
        return {
            headers: new HttpHeaders({
                'reportProgress': 'true',
                'responseType':'blob',
                'Authorization':`Bearer ${localStorage.getItem('jwt')}`
            })
        };
    }

    protected ObterHeaderUpload() {
        return {
            headers: new HttpHeaders({
                'reportProgress': 'true',
                'observe': 'events',
                'Authorization':`Bearer ${localStorage.getItem('jwt')}`
            })
        };
    }

    protected extractData(response: any) {
        return response || {};
    }

    protected extractDataDownload(response: any) {
        return response;
    }


    protected serviceError(response: Response | any) {
        let customError: string[] = [];

        if (response instanceof HttpErrorResponse) {

            if (response.statusText === "Unknown Error") {
                customError.push("Ocorreu um erro desconhecido");
                response.error.errors = customError;
            }
        }      
      
        return throwError(response);
    }
}