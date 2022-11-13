import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { AdmComponent } from './administrativo/administrativo.component';
// import { BolsasComponent } from './administrativo/bolsas/bolsas.component';
// import { ColaboradoresComponent } from './administrativo/colaboradores/colaboradores.component';
// import { ConfiguracoesComponent } from './administrativo/configuracoes/configuracoes.component';
// import { ContratoComponent } from './administrativo/contratos/contrato.component';
// import { ModuloComponent } from './administrativo/modulos/modulo.component';
// import { PlanoPgmComponent } from './administrativo/planos/plano.component';
// import { ProdutosComponent } from './administrativo/produtos/produtos.component';
// import { ProfessoresComponent } from './administrativo/professores/professores.component';
// import { AdmTurmasComponent } from './administrativo/turmas/administrativo-turma.component';
// import { UnidadesComponent } from './administrativo/unidades/unidades.component';
// import { UsuarioComponent } from './administrativo/usuarios/usuario.component';
import { AlunoSiaComponent } from './aluno/aluno.component';
import { EstagioSiaComponent } from './aluno/estagio/estagio-sia.component';
import { AlunoFinanceiroComponent } from './aluno/financeiro/aluno-financeiro.component';
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
    path: 'aluno-sia', component: AlunoSiaComponent, canActivate: [AuthGuard],
    children: [
      { path: 'estagio-sia', component: EstagioSiaComponent, canActivate: [AuthGuard] },
      { path: 'requerimentos', component: AlunoReqsComponent, canActivate: [AuthGuard] },
      { path: 'alunofin', component: AlunoFinanceiroComponent, canActivate: [AuthGuard] }
    ]
  },
  {
    path: 'home', component: HomeComponent, canActivate: [AuthGuard],
    children: [
    ]
  },
  { path: '', redirectTo: 'aluno-sia', pathMatch: 'full' },
  { path: '**', redirectTo: 'aluno-sia', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
