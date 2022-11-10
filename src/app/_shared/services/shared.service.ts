import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/app/_shared/services/base.service';

@Injectable()
export class SharedService extends BaseService {

    constructor(private http: HttpClient) { super(); }

    public CepConsulta(CEP?: any): Observable<any> {

        let url = `https://viacep.com.br/ws/${CEP}/json/`

        let response = this.http
            .get(url)
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }
}