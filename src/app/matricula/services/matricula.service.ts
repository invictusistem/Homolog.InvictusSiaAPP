import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/app/_shared/services/base.service';


@Injectable()
export class MatriculaService extends BaseService {

    constructor(private http: HttpClient) { super(); }



    // getColaboradores(pageSize?: number, currentPage?: number, jsonParam?: any) : Observable<any> {       

    //     var formJson = JSON.stringify(jsonParam)

    //     let path = `/colaboradores/pesquisar/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

    //     let response = this.http
    //         .get(this.BaseUrl + path, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;
    // }


    getAlunos(pageSize?: number, currentPage?: number, jsonParam?: any) : Observable<any> {       

        var formJson = JSON.stringify(jsonParam)

        let path = `/alunos/pesquisar/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }


    public GetMatriculaRelatorio(param: any) : Observable<any> {  

        let paramJson = JSON.stringify(param)

        let path = `/pedag/matricula/relatorio/?paramJson=${paramJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

            return response;
    }

    // getSystemRoles() : Observable<any> {  

    //     let path = `/usuario/roles`

    //     let response = this.http
    //         .get(this.BaseUrl + path, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;
    // }

    // getMateriasByTypeId(typePacoteId: any) : Observable<any>{
    //     // /materia-template/filtro/${typeId}
    //     let path = `/materia-template/filtro/${typePacoteId}`

    //     let response = this.http
    //         .get(this.BaseUrl + path, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;
    // }

    // saveProfessorMateria(profId: any,materiaId: any ) : Observable<any>{
    //     // /materia-template/filtro/${typeId}
    //     let path = `/professor/materia/${profId}/${materiaId}`

    //     let response = this.http
    //         .post(this.BaseUrl + path, {}, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;
    // }

    // editDisponibilidade(dispo: any) : Observable<any>{
    //     // /materia-template/filtro/${typeId}
    //     let path = `/professor/disponibilidade`

    //     let response = this.http
    //         .put(this.BaseUrl + path, dispo, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;
    // }

    // editUsuario(usuario: any) : Observable<any>{

    //     let path = `/usuario`

    //     let response = this.http
    //         .put(this.BaseUrl + path, usuario, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;
    // }

    // CepConsulta(CEP?: any) : Observable<any> {       

    //     let url = `https://viacep.com.br/ws/${CEP}/json/`

    //     let response = this.http
    //         .get(url)
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;
    // }

    // // MODULOS

    // pesquisarPacote(typePacoteId:any, unidadeId:any): Observable<any>{

    //     let path = `/pacote/${typePacoteId}/${unidadeId}`

    //     let response = this.http
    //         .get(this.BaseUrl + path, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;

    // }

    // GetCreateModuleViewModel(): Observable<any>{

    //     let path = `/pacote/create`

    //     let response = this.http
    //         .get(this.BaseUrl + path, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;

    // }

    // GetEditModuleViewModel(pacoteId): Observable<any>{

    //     let path = `/pacote/edit/${pacoteId}`

    //     let response = this.http
    //         .get(this.BaseUrl + path, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;

    // }

    // savePacote(newPacote): Observable<any>{

    //     let path = `/pacote`

    //     let response = this.http
    //         .post(this.BaseUrl + path, newPacote, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;
    // }

    // editPacote(editedPacote): Observable<any>{

    //     let path = `/pacote`

    //     let response = this.http
    //         .put(this.BaseUrl + path, editedPacote, this.ObterHeaderJson())
    //         .pipe(
    //             map(this.extractData),
    //             catchError(this.serviceError));

    //         return response;
    // }


    // console.log(CEP);
    // if (CEP.length == 10) {


    //     //var mystring = "crt/r2002_2";
    //     CEP = CEP.replace('-', '');
    //     CEP = CEP.replace('.', '');
    //     console.log(CEP);
    //     this.http.get(`https://viacep.com.br/ws/${CEP}/json/`, {})
    //         .subscribe(response => {

    //             //  console.log(response)
    //             // this.cepReturn = new CepReturn(
    //             //     response["logradouro"],
    //             //     response["bairro"],
    //             //     response["localidade"],
    //             //     response["uf"]);
    //             //console.log(this.cepReturn)
    //             this.colaboradorForm.get('logradouro').setValue(response["logradouro"].toUpperCase());
    //             this.colaboradorForm.get('bairro').setValue(response["bairro"].toUpperCase());
    //             this.colaboradorForm.get('cidade').setValue(response["localidade"].toUpperCase());
    //             this.colaboradorForm.get('uf').setValue(response["uf"].toUpperCase());
    //             //this.bairro = this.cepReturn.bairro
    //             // const token = (<any>response).accessToken;
    //             // console.log(response)
    //             // localStorage.setItem("jwt", token);
    //             // this.invalidLogin = false;
    //             // this.router.navigate(["/main"]);
    //         }, err => { console.log(err) },
    //             () => {
    //                 //  console.log('finaly')
    //                 this.showEndereco = true



}