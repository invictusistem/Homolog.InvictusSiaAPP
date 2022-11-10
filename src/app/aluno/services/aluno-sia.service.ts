import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/app/_shared/services/base.service';

@Injectable()
export class AlunoSiaService extends BaseService {

    constructor(private http: HttpClient) { super(); }
    
    // Estagio

    public GetEstagioStatus(): Observable<any> {

        let path = `/sia/estagio`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GeDocumentos(): Observable<any> {

        let path = `/sia/estagio/documentacao`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetEstagiosTiposLiberados(matriculaId:any): Observable<any> {

        let path = `/sia/estagio/tipo/${matriculaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetEstagiosLiberados(tipoId: any): Observable<any> {

        let path = `/sia/estagio/liberados/${tipoId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetEstagio(estagioId: any): Observable<any> {

        let path = `/sia/estagio/busca/${estagioId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public UploadFile(file:any, documentoId:any): Observable<any> {

        let path = `/sia/estagio/documentacao/${documentoId}`

        let response = this.http
            .post(this.BaseUrl + path, file, this.ObterHeaderUpload())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

   // Requerimento

   

}