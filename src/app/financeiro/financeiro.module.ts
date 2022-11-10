import { NgModule } from '@angular/core';
import { GetNgxMaskModuleConfig, SharedModule } from '../_shared/shared.module';
import { AlunoFinancComponent } from './alunos/alunos-financeiro.component';
import { InfoFinancComponent } from './alunos/infos/aluno-informacoes.component';
import { EditFinancComponent } from './alunos/infos/edit/financeiro-edit.component';
import { ReceberComponent } from './alunos/infos/receber/receber.component';
import { ConfirmarParcelamento } from './alunos/reparcelamento/confirmar/reparcelamento-confirmar.component';
import { ReparcelamentoComponent } from './alunos/reparcelamento/reparcelamento.component';
import { FinCaixaComponent } from './caixa/fincaixa.component';
import { FinanceiroComponent } from './financeiro.component';
import { CreateFornecedorComponent } from './fornecedores/create/fornecedor-create.component';
import { EditFornecedorComponent } from './fornecedores/edit/fornecedor-edit.component';
import { FornecedoresComponent } from './fornecedores/fornecedores.component';
import { FinanceiroService } from './services/financ.service';
import { FinancConfigsComponent } from './configuracoes/financ-configs.component';
import { BancosConfigComponent } from './configuracoes/bancos/bancos-config.component';
import { CentrocustoConfigComponent } from './configuracoes/centro-custos/centrocusto-config.component';
import { FormarecebimentoConfigComponent } from './configuracoes/forma-recebimento/formarecebimento-config.component';
import { MeiopagamentoConfigComponent } from './configuracoes/meio-pagamento/meiopagamento-config.component';
import { PlanocontasConfigComponent } from './configuracoes/plano-contas/planocontas-config.component';
import { BancocreateConfigComponent } from './configuracoes/bancos/create/bancocreate-config.component';
import { CaixaEscolaComponent } from './caixa-escola/caixa-escola.component';
import { BancoeditConfigComponent } from './configuracoes/bancos/edit/bancoedit-config.component';
import { MeiopgmcreateConfigComponent } from './configuracoes/meio-pagamento/create/meiopgmcreate-config.component';
import { MeiopgmeditConfigComponent } from './configuracoes/meio-pagamento/edit/meiopgmedit-config.component';
import { CentrocreateConfigComponent } from './configuracoes/centro-custos/create/centrocreate-config.component';
import { CentroeditConfigComponent } from './configuracoes/centro-custos/edit/centroedit-config.component';
import { FormacreateConfigComponent } from './configuracoes/forma-recebimento/create/formacreate-config.component';
import { PlanocreateConfigComponent } from './configuracoes/plano-contas/create/planocreate-config.component';
import { PlanoeditConfigComponent } from './configuracoes/plano-contas/edit/planoedit-config.component';
import { SubcontacreateConfigComponent } from './configuracoes/plano-contas/subconta/create/subcontacreate-config.component';
import { SubcontaeditConfigComponent } from './configuracoes/plano-contas/subconta/edit/subcontaedit-config.component';
import { FormaeditConfigComponent } from './configuracoes/forma-recebimento/edit/formaedit-config.component';
import { ContasReceberComponent } from './contasreceber/contas-receber.component';
import { ContasPagarComponent } from './contaspagar/contas-pagar.component';
import { ContaspagarNovaComponent } from './contaspagar/nova/contaspagar-nova.component';
import { ContasreceberNovaComponent } from './contasreceber/nova/contasreceber-nova.component';
import { ContasreceberEditComponent } from './contasreceber/editar/contasreceber-edit.component';
import { RecebercontasComponent } from './contasreceber/receber/recebercontas.component';
import { ContaspagarEditComponent } from './contaspagar/editar/contaspagar-edit.component';
import { PagarcontaComponent } from './contaspagar/pagar/pagarconta.component';
import { VendaCaixaComponent } from './caixa/caixa-venda/venda-caixa.component';
import { VendaPesquisaComponent } from './caixa/caixa-venda/pesquisa/venda-pesquisa.component';
import { VendaCaixaPagarComponent } from './caixa/caixa-venda/pagar/venda-caixa-pagar.component';
import { FinRelatorioComponent } from './relatorios/fin-relatorio.component';
import { ConferenciaCaixaComponent } from './conferencia/conferencia-caixa.component';
import { ConferenciaConfirmarComponent } from './conferencia/confirmar/conferencia-confirmar.component';
import { SaldoBancarioComponent } from './conferencia/saldo/saldo-bancario.component';
import { ConferenciaExtornarComponent } from './conferencia/extornar/conferencia-extornar.component';

@NgModule({
    declarations: [
        FinanceiroComponent,
        // Alunos
        AlunoFinancComponent,
        ReparcelamentoComponent,
        ConfirmarParcelamento,
        // ConfirmarParcelamento,
        InfoFinancComponent,
        ReceberComponent,
        EditFinancComponent,
        // Caixa
        FinCaixaComponent,
        // Caixa Escola
        CaixaEscolaComponent,
        // Contas Receber
        ContasReceberComponent,
        // Contas Pagar
        ContasPagarComponent,
        // Fornecedores
        FornecedoresComponent,
        CreateFornecedorComponent,
        EditFornecedorComponent,
        // Configurações
        FinancConfigsComponent,
        BancosConfigComponent,
        BancocreateConfigComponent,
        BancoeditConfigComponent,
        CentrocustoConfigComponent,
        FormarecebimentoConfigComponent,
        PlanocontasConfigComponent,
        MeiopagamentoConfigComponent,
        MeiopgmcreateConfigComponent,
        MeiopgmeditConfigComponent,
        CentrocreateConfigComponent,
        CentroeditConfigComponent,
        FormacreateConfigComponent,
        PlanocreateConfigComponent,
        PlanoeditConfigComponent,
        SubcontacreateConfigComponent,
        SubcontaeditConfigComponent,
        FormaeditConfigComponent,
        ContaspagarNovaComponent,
        ContasreceberNovaComponent,
        ContasreceberEditComponent,
        RecebercontasComponent,
        ContaspagarEditComponent,
        PagarcontaComponent,
        VendaCaixaComponent,
        VendaPesquisaComponent,
        VendaCaixaPagarComponent,
        FinRelatorioComponent,
        ConferenciaCaixaComponent,
        ConferenciaConfirmarComponent,
        SaldoBancarioComponent,
        ConferenciaExtornarComponent,
        
    ],
    imports: [
        SharedModule,
        GetNgxMaskModuleConfig()
    ],
    providers: [
        FinanceiroService
    ],
    exports: [
        FinanceiroComponent,
        // Alunos
        AlunoFinancComponent,
        //Caixa
        FinCaixaComponent,
        // Contas Receber
        ContasReceberComponent,
        // Contas Pagar
        ContasPagarComponent,
        // Caixa Escola
        CaixaEscolaComponent,
        // Fornecedores
        FornecedoresComponent,
        // Configurações
        FinancConfigsComponent,
        // Relatórios
        FinRelatorioComponent
    ],
    entryComponents: [
        // Alunos
        ConfirmarParcelamento,
        ReparcelamentoComponent,
        InfoFinancComponent,
        ReceberComponent,
        EditFinancComponent,
        // Fornecedores
        CreateFornecedorComponent,
        EditFornecedorComponent,
        // Configurações
        BancosConfigComponent,
        BancoeditConfigComponent,
        BancocreateConfigComponent,
        CentrocustoConfigComponent,
        FormarecebimentoConfigComponent,
        MeiopagamentoConfigComponent,
        MeiopgmcreateConfigComponent,
        MeiopgmeditConfigComponent,
        PlanocontasConfigComponent
    ]
})

export class FinanceiroModule { }

