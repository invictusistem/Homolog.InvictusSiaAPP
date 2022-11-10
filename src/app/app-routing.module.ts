import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdmComponent } from './administrativo/administrativo.component';
import { BolsasComponent } from './administrativo/bolsas/bolsas.component';
import { ColaboradoresComponent } from './administrativo/colaboradores/colaboradores.component';
import { ConfiguracoesComponent } from './administrativo/configuracoes/configuracoes.component';
import { ContratoComponent } from './administrativo/contratos/contrato.component';
import { ModuloComponent } from './administrativo/modulos/modulo.component';
import { PlanoPgmComponent } from './administrativo/planos/plano.component';
import { ProdutosComponent } from './administrativo/produtos/produtos.component';
import { ProfessoresComponent } from './administrativo/professores/professores.component';
import { AdmTurmasComponent } from './administrativo/turmas/administrativo-turma.component';
import { UnidadesComponent } from './administrativo/unidades/unidades.component';
import { UsuarioComponent } from './administrativo/usuarios/usuario.component';
import { AlunoSiaComponent } from './aluno/aluno.component';
import { EstagioSiaComponent } from './aluno/estagio/estagio-sia.component';
import { AlunoReqsComponent } from './aluno/requerimento/aluno-reqs.component';
import { ComercialComponent } from './comercial/comercial.component';
import { LeadExportarComponent } from './comercial/exportar/lead-exportar.component';
import { ComercialFiltrosComponent } from './comercial/filtros/comercial-filtros.component';
import { LeadPesquisaComponent } from './comercial/pesquisar/lead-pesquisa.component';
//import { LeadUsuarioComponent } from './comercial/usuarios/lead-usuario.component';
import { AlunoFinancComponent } from './financeiro/alunos/alunos-financeiro.component';
import { CaixaEscolaComponent } from './financeiro/caixa-escola/caixa-escola.component';
import { FinCaixaComponent } from './financeiro/caixa/fincaixa.component';
import { ConferenciaCaixaComponent } from './financeiro/conferencia/conferencia-caixa.component';
import { FinancConfigsComponent } from './financeiro/configuracoes/financ-configs.component';
import { ContasPagarComponent } from './financeiro/contaspagar/contas-pagar.component';
import { ContasReceberComponent } from './financeiro/contasreceber/contas-receber.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { FornecedoresComponent } from './financeiro/fornecedores/fornecedores.component';
import { FinRelatorioComponent } from './financeiro/relatorios/fin-relatorio.component';
import { MatriculaCadastroComponent } from './matricula/cadastro/matricula-cadastro.component';
import { MatriculaComponent } from './matricula/matricula.component';
import { AlunoAcessoComponent } from './pedagogico/alunos-acesso/aluno-acesso.component';
import { AlunoComponent } from './pedagogico/alunos/aluno.component';
import { TurmasComponent } from './pedagogico/diario-classe/diario-classe.component';
import { DocsAnaliseComponent } from './pedagogico/docs-analise/docs-analise.component';
import { EstagioControleComponent } from './pedagogico/estagios-controle/estagio-controle.component';
import { EstagioComponent } from './pedagogico/estagios/estagio.component';
import { PedagogicoComponent } from './pedagogico/pedagogico.component';
import { PegadRelatorioComponent } from './pedagogico/relatorios/pegad-relatorio.component';
import { PedagReqsComponent } from './pedagogico/requerimentos/pedag-reqs.component';
import { TransferenciaComponent } from './pedagogico/transferencia/transferencia.component';
import { PedagogicoturmaComponent } from './pedagogico/turmas/pedagogico-turmas.component';
import { HomeComponent } from './_shared/home/home.component';
import { AuthGuard } from './_shared/_auth/auth.guard';
import { LoginComponent } from './_shared/_auth/user/login/login.component';
import { UserComponent } from './_shared/_auth/user/user.component';

const routes: Routes = [
  {
    path: 'user', component: UserComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  {
    path: 'adm', component: AdmComponent, canActivate: [AuthGuard],
    children: [
      { path: 'admcursos', component: AdmTurmasComponent, canActivate: [AuthGuard] },
      { path: 'usuarios', component: UsuarioComponent, canActivate: [AuthGuard] },
      { path: 'unidades', component: UnidadesComponent, canActivate: [AuthGuard] },
      { path: 'professores', component: ProfessoresComponent, canActivate: [AuthGuard] },
      { path: 'produtos', component: ProdutosComponent, canActivate: [AuthGuard] },
      { path: 'contrato', component: ContratoComponent, canActivate: [AuthGuard] },
      { path: 'bolsas', component: BolsasComponent, canActivate: [AuthGuard] },
      { path: 'colaboradores', component: ColaboradoresComponent, canActivate: [AuthGuard] },
      { path: 'modulo', component: ModuloComponent, canActivate: [AuthGuard] },
      { path: 'config', component: ConfiguracoesComponent, canActivate: [AuthGuard] },
      { path: 'planopgm', component: PlanoPgmComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'mat', component: MatriculaComponent, canActivate: [AuthGuard],
    children: [
      { path: 'matricula', component: MatriculaCadastroComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'pedag', component: PedagogicoComponent, canActivate: [AuthGuard],
    children: [
      { path: 'aluno', component: AlunoComponent, canActivate: [AuthGuard] },
      // { path: 'pedagalunos', component: PedagAlunosComponent, canActivate: [AuthGuard] },
      { path: 'transf', component: TransferenciaComponent, canActivate: [AuthGuard] },
      { path: 'turmas', component: TurmasComponent, canActivate: [AuthGuard] },
      // { path: 'pedagrel', component: PedagRelatorioComponent, canActivate: [AuthGuard] },
      { path: 'estagio', component: EstagioComponent, canActivate: [AuthGuard] },
      { path: 'turmasinfo', component: PedagogicoturmaComponent, canActivate: [AuthGuard] },
      { path: 'requerimentos', component:  PedagReqsComponent, canActivate: [AuthGuard] },
      { path: 'analisedocs', component: DocsAnaliseComponent, canActivate: [AuthGuard] },
      { path: 'estagiosdoc', component: EstagioControleComponent, canActivate: [AuthGuard] },
      { path: 'alunoacesso', component: AlunoAcessoComponent, canActivate: [AuthGuard] },
      { path: 'relatorios', component: PegadRelatorioComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'comercial', component: ComercialComponent, canActivate: [AuthGuard],
    children: [
      { path: 'exportar', component: LeadExportarComponent, canActivate: [AuthGuard] },
      { path: 'pesquisa', component: LeadPesquisaComponent, canActivate: [AuthGuard] },
      { path: 'filtros', component: ComercialFiltrosComponent, canActivate: [AuthGuard] },
    ]
  },
  {
    path: 'financeiro', component: FinanceiroComponent, canActivate: [AuthGuard],
    children: [
      { path: 'alunofin', component: AlunoFinancComponent, canActivate: [AuthGuard] },
      { path: 'caixa-escola', component: CaixaEscolaComponent, canActivate: [AuthGuard] },
      { path: 'contas-receber', component: ContasReceberComponent, canActivate: [AuthGuard] },
      { path: 'contas-pagar', component: ContasPagarComponent, canActivate: [AuthGuard] },
      { path: 'conferencia', component: ConferenciaCaixaComponent, canActivate: [AuthGuard] },
      // { path: 'unidadebalanco', component: UnidadeBalancoComponent, canActivate: [AuthGuard] },
      { path: 'fincaixa', component: FinCaixaComponent, canActivate: [AuthGuard] },
      { path: 'fornecedor', component: FornecedoresComponent, canActivate: [AuthGuard] },
      { path: 'configuracoes', component: FinancConfigsComponent, canActivate: [AuthGuard] },
      { path: 'relatorios', component: FinRelatorioComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'aluno-sia', component: AlunoSiaComponent, canActivate: [AuthGuard],
    children: [
      { path: 'estagio-sia', component: EstagioSiaComponent, canActivate: [AuthGuard] },
      { path: 'requerimentos', component: AlunoReqsComponent, canActivate: [AuthGuard] }
      // { path: 'alunodocs', component: AlunoDocsComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
    ]
  },
  { path: '', redirectTo: 'adm', pathMatch: 'full' },
  { path: '**', redirectTo: 'adm', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
