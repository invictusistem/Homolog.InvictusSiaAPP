import { NgModule } from "@angular/core";
import { GetNgxMaskModuleConfig, SharedModule } from "../_shared/shared.module";
import { AlunoAcessoComponent } from "./alunos-acesso/aluno-acesso.component";
import { DetalheComponent } from "./alunos-acesso/edit/detalhe.component";
import { AlunoComponent } from "./alunos/aluno.component";
import { BoletimAlunoComponent } from "./alunos/boletim/boletim.component";
import { AlunoEditComponent } from "./alunos/edit/aluno-edit.component";
import { InfoFinancPedagComponent } from "./alunos/financeiro-informacoes/infofinanc.component";
import { AddAnotacaoComponent } from "./alunos/informacoes-matricula/anotacoes/add-anotacao.component";
import { CertificadoComponent } from "./alunos/informacoes-matricula/certificado/certificado.component";
import { InfosComponent } from "./alunos/informacoes-matricula/infos.component";
import { AlunoMatriculaComponent } from "./alunos/matricular/aluno-matricula.component";
import { ConfirmMatriculaComponent } from "./alunos/matricular/confirmar/confirmamat.component";
import { ConfirmarIniciarAulaModal, TurmasComponent } from "./diario-classe/diario-classe.component";
import { NotasComponent } from "./diario-classe/notas/notas.component";
import { PresencaComponent } from "./diario-classe/presenca/presenca.component";
import { EstagioCadastroComponent } from "./estagios/create/estagiocadastro.component";
import { EstagioEditComponent } from "./estagios/edit/estagio-edit.component";
import { EstagioAlunosComponent } from "./estagios/estagio-alunos/estagio-alunos.component";
import { EstagioComponent } from "./estagios/estagio.component";
import { PedagogicoComponent } from "./pedagogico.component";
import { PedagogicoService } from "./services/pedagogico.service";
import { TransferenciaComponent } from "./transferencia/transferencia.component";
import { TurmasInfoAlunosPedagComponent } from "./turmas/alunos/turmasinfoalunos.component";
import { TurmaNotasComponent } from "./turmas/notas/notas.component";
import { PedagogicoturmaComponent } from "./turmas/pedagogico-turmas.component";
import { AulaDetalheModal } from "./turmas/turma-calendario/aula-detalhe/aula-detalhe.component";
import { AulaEditarModal } from "./turmas/turma-calendario/aula-edit/aulaeditar.component";
import { TurmaPresencaEditComponent } from "./turmas/turma-calendario/aula-presenca/turma-presenca.component";
import { CalendarioTurmaComponent } from "./turmas/turma-calendario/calendarioturma.component";
import { CalendPresencaComponent } from "./turmas/turma-calendario/presenca/cal-presenca.component";
import { TurmaDetalheModal } from "./turmas/turma-calendario/turma-detalhe/turma-detalhe.component";
import { DocsAnaliseComponent } from './docs-analise/docs-analise.component';
import { EstagioControleComponent } from './estagios-controle/estagio-controle.component';
import { EstagioTipoComponent } from './estagios/tipos/estagio-tipo.component';
import { TipoCreateComponent } from "./estagios/tipos/create/tipo-create.component";
import { EstagioMatriculaComponent } from './estagios-controle/matricula/estagio-matricula.component';
import { MatriculaLiberarComponent } from './estagios-controle/matricula/liberar/matricula-liberar.component';
import { EstagioDocumentacaoComponent } from './estagios-controle/documentacao/estagio-documentacao.component';
import { PedagReqsComponent } from './requerimentos/pedag-reqs.component';
import { TransfInternaComponent } from './transferencia/transf-interna/transf-interna.component';
import { TransfTurmasComponent } from './transferencia/transf-turmas/transf-turmas.component';
import { RequerimentoNovoComponent } from './requerimentos/novo/requerimento-novo.component';
import { ReqCriarComponent } from './requerimentos/novo/nova-tipo/req-criar.component';
import { CategoriaCreateComponent } from './requerimentos/novo/nova-categoria/categoria-create.component';
import { CategoriaEditarComponent } from './requerimentos/novo/editar-categoria/categoria-editar.component';
import { TipoEditarComponent } from './requerimentos/novo/editar-tipo/tipo-editar.component';
import { ConcluirAulaModalComponent } from './diario-classe/presenca/concluir/concluir-aula-modal.component';
import { PegadRelatorioComponent } from './relatorios/pegad-relatorio.component';
import { AlunoCalendarioComponent } from './alunos/calendario/aluno-calendario.component';
import { AlunoReposicaoComponent } from './alunos/calendario/reposicao/aluno-reposicao.component';
import { PedagTurmaMensagemComponent } from './turmas/mensagem/pedag-turma-mensagem.component';
import { AlunosMensagemComponent } from './alunos/mensagem/alunos-mensagem.component';
import { PedagReqEditComponent } from './requerimentos/edit-requerimento/pedag-req-edit.component';

@NgModule({
    declarations: [
        PedagogicoComponent,
        // Alunos
        AlunoComponent,
        AlunoEditComponent,
        AlunoMatriculaComponent,
        ConfirmMatriculaComponent,
        InfoFinancPedagComponent,
        InfosComponent,
        CertificadoComponent,
        AddAnotacaoComponent,
        BoletimAlunoComponent,
        // Alunos Acesso
        AlunoAcessoComponent,
        DetalheComponent,
        // Diario-Classe
        TurmasComponent,
        PresencaComponent,
        NotasComponent,
        ConfirmarIniciarAulaModal,
        // Docs-Analise
        DocsAnaliseComponent,
        // Estagios
        EstagioComponent,
        EstagioAlunosComponent,
        EstagioEditComponent,
        EstagioCadastroComponent,
        EstagioTipoComponent,
        TipoCreateComponent,  
        // Estagios Controle
        EstagioControleComponent,
        EstagioMatriculaComponent,
        MatriculaLiberarComponent,
        EstagioDocumentacaoComponent,
        // Transferencia
        TransferenciaComponent,
        // Turmas
        PedagogicoturmaComponent,
        CalendarioTurmaComponent,
        TurmaDetalheModal,
        CalendPresencaComponent,
        TurmaPresencaEditComponent,
        AulaEditarModal,
        AulaDetalheModal,
        TurmasInfoAlunosPedagComponent,
        TurmaNotasComponent,
        EstagioMatriculaComponent,
        MatriculaLiberarComponent,
        EstagioDocumentacaoComponent,
        PedagReqsComponent,
        TransfInternaComponent,
        TransfTurmasComponent,
        RequerimentoNovoComponent,
        ReqCriarComponent,
        CategoriaCreateComponent,
        CategoriaEditarComponent,
        TipoEditarComponent,
        ConcluirAulaModalComponent,
        PegadRelatorioComponent,
        AlunoCalendarioComponent,
        AlunoReposicaoComponent,
        PedagTurmaMensagemComponent,
        AlunosMensagemComponent,
        PedagReqEditComponent
             
    ],
    imports: [
        SharedModule,
        GetNgxMaskModuleConfig()
    ],
    providers: [
        PedagogicoService
    ],
    exports: [
        PedagogicoComponent,
        // Alunos
        AlunoComponent,
        // Alunos Acesso
        AlunoAcessoComponent,
        // Diario-Classe
        TurmasComponent,
        // Docs-Analise
        DocsAnaliseComponent,
        // Estagios
        EstagioComponent,
        // Estagios Controle
        EstagioControleComponent,
        // Transferencia
        TransferenciaComponent,
        // Turmas
        PedagogicoturmaComponent
    ],
    entryComponents: [
        // Alunos        
        AlunoEditComponent,
        AlunoMatriculaComponent,
        ConfirmMatriculaComponent,
        InfoFinancPedagComponent,
        InfosComponent,
        CertificadoComponent,
        AddAnotacaoComponent,
        BoletimAlunoComponent,
        // Alunos Acesso
        DetalheComponent,
        // Diario-Classe        
        PresencaComponent,
        NotasComponent,
        ConfirmarIniciarAulaModal,
        // Estagios
        EstagioAlunosComponent,
        EstagioEditComponent,
        EstagioCadastroComponent,
        EstagioTipoComponent,
        TipoCreateComponent,
        // Estagios Controle
        EstagioMatriculaComponent,
        MatriculaLiberarComponent,
        EstagioDocumentacaoComponent,
        // Turmas
        CalendarioTurmaComponent,
        TurmaDetalheModal,
        CalendPresencaComponent,
        TurmaPresencaEditComponent,
        AulaEditarModal,
        AulaDetalheModal,
        TurmasInfoAlunosPedagComponent,
        TurmaNotasComponent
    ]

})
export class PedagogicoModule { }

