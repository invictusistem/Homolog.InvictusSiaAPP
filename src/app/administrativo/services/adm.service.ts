import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from 'src/app/_shared/services/base.service';

@Injectable()
export class AdmService extends BaseService {

    constructor(private http: HttpClient) { super(); }

    // REFACTOR

    // Geral

    public GetTypePacotes(): Observable<any> {

        let path = `/typepacote`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public CepConsulta(CEP?: any): Observable<any> {

        let url = `https://viacep.com.br/ws/${CEP}/json/`

        let response = this.http
            .get(url)
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetMateriasByTypeId(typePacoteId: any): Observable<any> {

        let path = `/materia-template/filtro/${typePacoteId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetMateriasLiberadas(typePacoteId: any, profId: any): Observable<any> {

        let path = `/materia-template/materia-liberada/${typePacoteId}/${profId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    // Bolsas materia-liberada/{typePacoteId}/{professorId}

    public GetBolsas(typePacoteId:any): Observable<any> {

        let path = `/bolsa/${typePacoteId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public GetBolsaSenha(senhaId:any): Observable<any> {

        let path = `/bolsa/senha/${senhaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }


    public SaveBolsa(bolsa:any): Observable<any> {

        let path = `/bolsa`

        let response = this.http
            .post(this.BaseUrl + path, bolsa, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetBolsa(bolsaId:any): Observable<any> {

        let path = `/bolsa/GetById/${bolsaId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public EditBolsa(bolsa:any): Observable<any> {

        let path = `/bolsa`

        let response = this.http
            .put(this.BaseUrl + path, bolsa, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    // Colaboradores

    public GetColaboradores(pageSize?: number, currentPage?: number, jsonParam?: any): Observable<any> {

        var formJson = JSON.stringify(jsonParam)

        let path = `/colaboradores/pesquisar/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetColaborador(colaboradorId:any): Observable<any> {


        let path = `/colaboradores/Cargo/${colaboradorId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public SaveColaborador(colaborador:any): Observable<any> {

        let path = `/colaboradores`

        let response = this.http
            .post(this.BaseUrl + path, colaborador, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditColaborador(colaborador:any): Observable<any> {

        let path = `/colaboradores`

        let response = this.http
            .put(this.BaseUrl + path, colaborador, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public DeleteColaborador(colaboradorId:any): Observable<any> {

        let path = `/colaboradores/${colaboradorId}`

        let response = this.http
            .delete(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    // Configurações

    public GetMaterias(pageSize?: number, currentPage?: number): Observable<any> {

        let path = `/materia-template/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson={}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetValue(valueId?: any): Observable<any> {

        let path = `/parametro/get-value/${valueId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetConfig(config?: any): Observable<any> {

        let path = ''

        if (config == 'CARGOS') path = `/parametro/value/cargo`

        if (config == 'DOCUMENTOS') path = `/documentacao`

        if (config == 'MATERIAS') path = `/materia-template/materias`

        if (config == 'TIPOS') path = `/typepacote`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetDocById(dociId?: any): Observable<any> {

        let path = `/documentacao/${dociId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetTypePacoteById(id:any): Observable<any> {

      let path = `/typepacote/${id}`

      let response = this.http
          .get(this.BaseUrl + path,this.ObterHeaderJson())
          .pipe(
              map(this.extractData),
              catchError(this.serviceError));

      return response;
  }

    public SaveTypePacotes(tipo:any): Observable<any> {

      let path = `/typepacote`

      let response = this.http
          .post(this.BaseUrl + path, tipo, this.ObterHeaderJson())
          .pipe(
              map(this.extractData),
              catchError(this.serviceError));

      return response;
  }


  public EditTypePacotes(tipo:any): Observable<any> {

    let path = `/typepacote`

    let response = this.http
        .post(this.BaseUrl + path, tipo, this.ObterHeaderJson())
        .pipe(
            map(this.extractData),
            catchError(this.serviceError));

    return response;
}


    public SaveCargo(cargo:any): Observable<any> {

        let path = `/parametro/value/Cargo`

        let response = this.http
            .post(this.BaseUrl + path, cargo, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetMateriaById(matId?: any): Observable<any> {

        let path = `/materia-template/${matId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public SaveMateria(materia:any): Observable<any> {

        let path = `/materia-template`

        let response = this.http
            .post(this.BaseUrl + path, materia, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditMateria(materia:any): Observable<any> {

        let path = `/materia-template`

        let response = this.http
            .put(this.BaseUrl + path, materia, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public SaveDocumento(doc:any): Observable<any> {

        let path = `/documentacao`

        let response = this.http
            .post(this.BaseUrl + path, doc, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditDocumento(doc:any): Observable<any> {

        let path = `/documentacao`

        let response = this.http
            .put(this.BaseUrl + path, doc, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditValue(value:any): Observable<any> {

        let path = `/parametro/value`

        let response = this.http
            .put(this.BaseUrl + path, value, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }



    // Contratos

    public GetContratosByTypePacote(typePacoteId: any, ativo: any): Observable<any> {

        let path = `/contrato/type-pacote/${typePacoteId}/?ativo=${ativo}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public GetContrato(contratoId: any): Observable<any> {

        let path = `/contrato/${contratoId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public GetContratoExemplo(contratoId: any): Observable<any> {

        let path = `/contrato/exemplo/${contratoId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderDownload())
            .pipe(
                map(this.extractDataDownload),
                catchError(this.serviceError));

        return response;

        // let path = `/contrato/exemplo/${contratoId}`

        // let response = this.http
        //     .get(this.BaseUrl + path, this.ObterHeaderJson())
        //     .pipe(
        //         map(this.extractData),
        //         catchError(this.serviceError));

        // return response;

    }

    public SaveContrato(contrato:any): Observable<any> {

        let path = `/contrato`

        let response = this.http
            .post(this.BaseUrl + path, contrato, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditContrato(contrato:any): Observable<any> {

        let path = `/contrato`

        let response = this.http
            .put(this.BaseUrl + path, contrato, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }



    // Modulos

    public PesquisarPacote(typePacoteId: any, unidadeId: any): Observable<any> {

        let path = `/pacote/${typePacoteId}/${unidadeId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public GetEditModuleViewModel(pacoteId:any): Observable<any> {

        let path = `/pacote/edit/${pacoteId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public GetCreateModuleViewModel(): Observable<any> {

        let path = `/pacote/create`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public SavePacote(newPacote:any): Observable<any> {

        let path = `/pacote`

        let response = this.http
            .post(this.BaseUrl + path, newPacote, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }


    public EditPacote(editedPacote:any): Observable<any> {

        let path = `/pacote`

        let response = this.http
            .put(this.BaseUrl + path, editedPacote, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    // Planos

    public GetPlanos(): Observable<any> {

        let path = `/plano-pagamento`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public GetPlanoById(planoId: any): Observable<any> {

        let path = `/plano-pagamento/${planoId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public GetPlanoPacoteById(typePacoteId: any): Observable<any> {

        let path = `/plano-pagamento/pacote/${typePacoteId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public SavePlano(plano: any): Observable<any> {

        let path = `/plano-pagamento`

        let response = this.http
            .post(this.BaseUrl + path, plano, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditPlano(plano: any): Observable<any> {

        let path = `/plano-pagamento`

        let response = this.http
            .put(this.BaseUrl + path, plano, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public DeletePlano(planoId: any): Observable<any> {

      let path = `/plano-pagamento/${planoId}`

      let response = this.http
          .delete(this.BaseUrl + path, this.ObterHeaderJson())
          .pipe(
              map(this.extractData),
              catchError(this.serviceError));

      return response;
  }


    // Produtos


    // Professores

    public GetProfessores(pageSize?: number, currentPage?: number, jsonParam?: any): Observable<any> {

        var formJson = JSON.stringify(jsonParam)

        let path = `/professor/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public SaveProfessorMateria(profId: any, materiaId: any): Observable<any> {

        let path = `/professor/materia/${profId}/${materiaId}`

        let response = this.http
            .post(this.BaseUrl + path, {}, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public SaveProfessorMateriaLote(profId: any, typePacoteId: any): Observable<any> {

      let path = `/professor/materia-lote/${profId}/${typePacoteId}`

      let response = this.http
          .post(this.BaseUrl + path, {}, this.ObterHeaderJson())
          .pipe(
              map(this.extractData),
              catchError(this.serviceError));

      return response;
  }

    public EditDisponibilidade(dispo: any): Observable<any> {

        let path = `/professor/disponibilidade`

        let response = this.http
            .put(this.BaseUrl + path, dispo, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetRelatorioProfessor(rangeIni: Date, rangeFinal: Date, professorId:any): Observable<any> {
        var ini = rangeIni
        ini.setHours(0, 0, 0, 0)
        let path = `/professor/${rangeIni.toUTCString()}/${rangeFinal.toUTCString()}/${professorId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    // Turmas

    public AddProfNaTurma(addProfCommand:any): Observable<any> {

        let path = `/pedag/turma/professores`

        let response = this.http
            .post(this.BaseUrl + path, addProfCommand, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }


    public GetTodasTurmasDaUnidade(): Observable<any> {

        let path = `/turma`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    // Unidades


    public GetModulosUnidade(): Observable<any> {

        let path = `/unidade/modulos`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }


    public GetUnidadesFilteredBySigla(unidadeSigla:any): Observable<any> {

        let path = `/unidade/sigla/${unidadeSigla}}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }


    public GetUnidadeById(id:any): Observable<any> {

        let path = `/unidade/${id}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public EditUnidade(unidade:any): Observable<any> {

        let path = `/unidade`

        let response = this.http
            .put(this.BaseUrl + path, unidade, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }


    // Usuários

    public DeleteUsuario(userEmail:any): Observable<any> {

        let path = `/usuario/${userEmail}`

        let response = this.http
            .delete(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetUsuarioAcessos(userId:any): Observable<any> {

        let path = `/usuario/acessos/${userId}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;

    }

    public EnvioAcesso(email:any): Observable<any> {

        let path = `/usuario/envio-acesso-colaborador/${email}`

        let response = this.http
            .put(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditAcessos(acessos:any, colabId:any): Observable<any> {

        let path = `/usuario/acessos/${colabId}`

        let response = this.http
            .put(this.BaseUrl + path, acessos, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetSystemRoles(): Observable<any> {

        let path = `/usuario/roles`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public EditUsuario(usuario: any): Observable<any> {

        let path = `/usuario`

        let response = this.http
            .put(this.BaseUrl + path, usuario, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

    public GetUsuarios(pageSize?: number, currentPage?: number, jsonParam?: any): Observable<any> {

        var formJson = JSON.stringify(jsonParam)

        let path = `/usuario/?itemsPerPage=` + pageSize + `&currentPage=${currentPage}&paramsJson=${formJson}`

        let response = this.http
            .get(this.BaseUrl + path, this.ObterHeaderJson())
            .pipe(
                map(this.extractData),
                catchError(this.serviceError));

        return response;
    }

}
