import { NgModule } from '@angular/core';
import { GetNgxMaskModuleConfig, SharedModule } from '../_shared/shared.module';
import { ComercialService } from './services/comercial.service';
import { ComercialComponent } from './comercial.component';
import { LeadExportarComponent } from './exportar/lead-exportar.component';
import { LeadIndividualComponent } from './exportar/individual/lead-individual.component';
import { LeadFormularioComponent } from './exportar/formulario/lead-formulario.component';
import { LeadPesquisaComponent } from './pesquisar/lead-pesquisa.component';
//import { LeadUsuarioComponent } from './usuarios/lead-usuario.component';
import { LeadUnidadeDetalhesComponent } from './pesquisar/detalhes/lead-unidade-detalhes.component';
import { ComercialFiltrosComponent } from './filtros/comercial-filtros.component';


@NgModule({
    declarations: [
        ComercialComponent,
        LeadExportarComponent,
        LeadIndividualComponent,
        LeadFormularioComponent,
        LeadPesquisaComponent,
        //LeadUsuarioComponent,
        LeadUnidadeDetalhesComponent,
        ComercialFiltrosComponent
    ],
    imports: [
        SharedModule,
        GetNgxMaskModuleConfig()
    ],
    providers:  [
        ComercialService
    ],
    exports: [
        ComercialComponent
    ],
    entryComponents: [
    ]
})
export class ComercialModule { }
