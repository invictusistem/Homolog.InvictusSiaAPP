import { NgModule } from '@angular/core';
import { GetNgxMaskModuleConfig, SharedModule } from '../_shared/shared.module';
import { AlunoSiaComponent } from './aluno.component';
import { EstagioSiaComponent } from './estagio/estagio-sia.component';
import { EstagiosiaDocumentacaoComponent } from './estagio/documentos/estagiosia-documentacao.component';
import { AlunoSiaService } from './services/aluno-sia.service';
import { EstagioSelecionarComponent } from './estagio/selecionar/estagio-selecionar.component';
import { AlunoReqsComponent } from './requerimento/aluno-reqs.component';
import { ReqsCriarComponent } from './requerimento/criar/reqs-criar.component';
import { ReqViewComponent } from './requerimento/view/req-view.component';
import { AlunoFinanceiroComponent } from './financeiro/aluno-financeiro.component';
import { AlunoFinViewComponent } from './financeiro/view/aluno-fin-view.component';
import { AlunoBoletoComponent } from './financeiro/view/boleto/aluno-boleto.component';

@NgModule({
    declarations: [
        AlunoSiaComponent,
        // Estagio
        EstagioSiaComponent,
        EstagiosiaDocumentacaoComponent,
        EstagioSelecionarComponent,
        // Requerimento
        AlunoReqsComponent,
        ReqsCriarComponent,
        ReqViewComponent,
        AlunoFinanceiroComponent,
        AlunoFinViewComponent,
        AlunoBoletoComponent

        // AlunoEstagioComponent,
        // InscricaoEstComponent,
        // AlunoDocsComponent
           ],
    imports: [
        SharedModule,
        GetNgxMaskModuleConfig()
    ],
    providers: [
        AlunoSiaService
    ],
    exports: [
        AlunoSiaComponent,
        // Estágio
        EstagioSiaComponent,
        // Requerimento
        AlunoReqsComponent,
        AlunoFinanceiroComponent
        //AlunoEstagioComponent
    ],
    entryComponents: [
        EstagiosiaDocumentacaoComponent,
        EstagioSelecionarComponent,
        // Requerimento
        ReqsCriarComponent
        // InscricaoEstComponent,
        // AlunoDocsComponent
    ]
})
export class AlunoModule { }

