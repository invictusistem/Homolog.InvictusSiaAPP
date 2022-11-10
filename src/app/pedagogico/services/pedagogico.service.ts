import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/app/_shared/services/base.service';



@Injectable()
export class PedagogicoService extends BaseService {

    constructor(private http: HttpClient) { super(); }


    // Estagio

    public GetEstagios(): Observable<any> {

        let path = `/estagio`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetEstagioTipos(): Observable<any> {

        let path = `/estagio/tipos`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetEstagio(estagioId: any): Observable<any> {

        let path = `/estagio/${estagioId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public AddEstagio(estagio: any): Observable<any> {

        let path = `/estagio`
        // console.log(estagio)
        let response = this.http
            .post(this.BaseUrl + path, estagio, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public AddEstagioTipo(estagioTipo: any): Observable<any> {

        let path = `/estagio/tipos`
        // console.log(estagio)
        let response = this.http
            .post(this.BaseUrl + path, estagioTipo, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditEstagio(estagio: any): Observable<any> {

        let path = `/estagio`

        let response = this.http
            .put(this.BaseUrl + path, estagio, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    // Estagios-Controle

    public GetAlunosEstagio(pageSize?: number, currentPage?: number, jsonParam?: any): Observable<any> {

        var formJson = JSON.stringify(jsonParam)

        let path = `/estagio/alunos/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public AnexarArquivo(file: any, documentoId: any): Observable<any> {

        let path = `/estagio/documentacao/${documentoId}`

        let response = this.http
            .post(this.BaseUrl + path, file, this.ObterHeaderUpload())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetEstagiosLiberados(matriculaId: any): Observable<any> {

        let path = `/estagio/aluno/tipos-liberados/${matriculaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public LiberarMatricula(liberarEstagioCommand: any): Observable<any> {

        let path = `/estagio/matricular`
        // console.log(estagio)
        let response = this.http
            .post(this.BaseUrl + path, liberarEstagioCommand, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetDocumentacaoAlunoEstagio(matriculaId: any): Observable<any> {

        let path = `/estagio/aluno/${matriculaId}/documentos-estagio`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetFileById(docId: any): Observable<HttpEvent<Blob>> {
        // return this.htt p.request(new HttpRequest(
        //     'GET', `${this.baseUrl}/pedag/doc/${docId}`, null, {
        //     reportProgress: true,
        //     responseType: 'blob'
        // }));


        let path = `/estagio/document/${docId}`

        let response = this.http.request(new HttpRequest(
            'GET', `${this.BaseUrl + path}`, null, {
            reportProgress: true,
            responseType: 'blob'
        })).pipe(
            map(this.extractData),
            catchError(this.serviceError));

        return response
        //         {
        //     reportProgress: true,
        //     responseType: 'blob'
        // }
        // )
        // )


        // return this.http
        //     .get(this.BaseUrl + path, this.ObterHeaderDownload())
        // .pipe(
        //     map(this.extractDataDownload),
        //     catchError(this.serviceError));

        // console.log(response)
        // return response;
    }

    // OUTROS
    getInfoDebitos(matriculaId: any): Observable<any> {

        let path = `/financeiro/debitos/${matriculaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    getAlunos(pageSize?: number, currentPage?: number, jsonParam?: any): Observable<any> {

        var formJson = JSON.stringify(jsonParam)

        let path = `/alunos/pesquisar/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    getAllAlunos(pageSize?: number, currentPage?: number, jsonParam?: any): Observable<any> {

        var formJson = JSON.stringify(jsonParam)

        let path = `/alunos/get-all/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    //TurmasInfos.CalendariosDaTurma.AulaDetalhe

    public GetAulaViewModel(calendarioId: any): Observable<any> {

        let path = `/pedag/turma/aula/${calendarioId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetAulaEditViewModel(calendarioId: any): Observable<any> {

        let path = `/pedag/turma/aula-edit/${calendarioId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetProfsHabilitados(calendarioId: any, materiaId: any): Observable<any> {

        let path = `/pedag/turma/aula-edit/profs/${calendarioId}/${materiaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public EditAula(aula: any, calendarioId: any): Observable<any> {

        let path = `/pedag/turma/calendario/editar/${calendarioId}`

        let response = this.http
            .put(this.BaseUrl + path, aula, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    // infos.component

    saveAluno(form: any): Observable<any> {

        let path = `/alunos`

        let response = this.http
            .put(this.BaseUrl + path, form, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }


    getAlunobyId(id: any): Observable<any> {

        let path = `/alunos/cadastro/${id}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    saveResponsavel(form: any): Observable<any> {

        let path = `/pedag/aluno/responsavel`
        console.log(form)
        let response = this.http
            .put(this.BaseUrl + path, form, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    GetResponsavelById(id: any): Observable<any> {

        let path = `/pedag/aluno/responsavel-aluno/${id}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetCertificado(matriculaId: any): Observable<any> {

        let path = `/pedag/aluno/certificado/${matriculaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    // Matricula Modal

    GetBolsa(senha: any): Observable<any> {

        let path = `/bolsa/senha-validar/${senha}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    GetAlunosIndicacao(): Observable<any> {

        let path = `/pedag/matricula/aluno-indicacao`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }


    // DOWNLOAD

    GetDocumento(matriculaId: any): Observable<any> {

        let path = `/pedag/doc/getpendencia/${matriculaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderDownload())
            .pipe(
                map(this.extractDataDownload),
                catchError(this.serviceError));

        return response;
    }


    // ACESSO ALUNO

    getAlunosAcesso(pageSize?: number, currentPage?: number, jsonParam?: any): Observable<any> {

        var formJson = JSON.stringify(jsonParam)

        let path = `/alunos/matriculados/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    editAcesso(email: any, acesso: any): Observable<any> {

        let path = `/usuario/aluno-acesso/${email}/${acesso}`

        let response = this.http
            .put(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    envioAcesso(email: any): Observable<any> {

        let path = `/usuario/envio-acesso/${email}`

        let response = this.http
            .put(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    // Requerimentos

    public GetRequerimentos(pageSize?: number, currentPage?: number, jsonParam?: any): Observable<any> {

        var formJson = JSON.stringify(jsonParam)

        let path = `/requerimento/pesquisar/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }


    //requerimento:
    public GetCategorias(): Observable<any> {

        let path = `/pedag/requerimento/categorias`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetCategoriaById(categoriaId: any): Observable<any> {

        let path = `/pedag/requerimento/categorias/${categoriaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetTipoByCategoriaId(categoriaId: any): Observable<any> {

        let path = `/pedag/requerimento/tipos/${categoriaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetTipoById(tipoId: any): Observable<any> {

        let path = `/pedag/requerimento/tipos/busca/${tipoId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public SaveCategoria(categoria: any): Observable<any> {

        let path = `/pedag/requerimento/categorias`
        
        let response = this.http
            .post(this.BaseUrl + path, categoria, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public SaveTipo(tipo: any): Observable<any> {

        let path = `/pedag/requerimento/tipos`
        
        let response = this.http
            .post(this.BaseUrl + path, tipo, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditCategoria(categoria: any): Observable<any> {

        let path = `/pedag/requerimento/categorias`
        
        let response = this.http
            .put(this.BaseUrl + path, categoria, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditTipo(tipo: any): Observable<any> {

        let path = `/pedag/requerimento/tipos`
        
        let response = this.http
            .put(this.BaseUrl + path, tipo, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }
    /*
    [HttpGet]
        [Route("categorias")]

[HttpGet]
        [Route("categorias/{id}")]

[HttpGet]
        [Route("tipos/{categoriaId}")]

[HttpGet]
        [Route("tipos/busca/{tipoId}")]


        [HttpPost]
        [Route("categorias")]

[HttpPost]
        [Route("tipos")]



[HttpPut]
        [Route("categorias")]

[HttpPut]
        [Route("tipos")]



 

    
    */





    /*
        getColaboradores(pageSize?: number, currentPage?: number, jsonParam?: any) : Observable<any> {       
            
            var formJson = JSON.stringify(jsonParam)
    
            let path = `/colaboradores/pesquisar/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`
            
            let response = this.http
                .get(this.BaseUrl + path, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
        }
    
        getTypePacotes() : Observable<any> {  
    
            let path = `/typepacote`
            
            let response = this.http
                .get(this.BaseUrl + path, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
        }
    
        getMateriasByTypeId(typePacoteId: any) : Observable<any>{
            let path = `/materia-template/filtro/${typePacoteId}`
            
            let response = this.http
                .get(this.BaseUrl + path, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
        }
    
        saveProfessorMateria(profId: any,materiaId: any ) : Observable<any>{
            let path = `/professor/materia/${profId}/${materiaId}`
            
            let response = this.http
                .post(this.BaseUrl + path, {}, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
        }
    
        editDisponibilidade(dispo: any) : Observable<any>{
            let path = `/professor/disponibilidade`
            
            let response = this.http
                .put(this.BaseUrl + path, dispo, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
        }
    
        CepConsulta(CEP?: any) : Observable<any> {       
            
            let url = `https://viacep.com.br/ws/${CEP}/json/`
            
            let response = this.http
                .get(url)
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
        }
    
        pesquisarPacote(typePacoteId:any, unidadeId:any): Observable<any>{
    
            let path = `/pacote/${typePacoteId}/${unidadeId}`
            
            let response = this.http
                .get(this.BaseUrl + path, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
    
        }
    
        GetCreateModuleViewModel(): Observable<any>{
    
            let path = `/pacote/create`
            
            let response = this.http
                .get(this.BaseUrl + path, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
    
        }
    
        GetEditModuleViewModel(pacoteId): Observable<any>{
    
            let path = `/pacote/edit/${pacoteId}`
            
            let response = this.http
                .get(this.BaseUrl + path, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
    
        }
    
        savePacote(newPacote): Observable<any>{
    
            let path = `/pacote`
            
            let response = this.http
                .post(this.BaseUrl + path, newPacote, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
        }
    
        editPacote(editedPacote): Observable<any>{
    
            let path = `/pacote`
            
            let response = this.http
                .put(this.BaseUrl + path, editedPacote, this.ObterHeaderJson())
                .pipe(
                    map(this.extractData),
                    catchError(this.serviceError));
                
                return response;
        }
    */

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