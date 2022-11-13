import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
// Components
import { LoginComponent } from './_shared/_auth/user/login/login.component';
import { UserComponent } from './_shared/_auth/user/user.component';
import { TrocaSenhaComponent } from './_shared/_auth/user/troca-senha/troca-senha.component';
//import { SelectUnidadeComponent } from './_shared/_auth/user/login/selecionar-unidade/select-unidade.component';
import { AppComponent } from './app.component';
import { SharedModule } from './_shared/shared.module';
//mport { AdmModule } from './administrativo/administrativo.module';
import { FinanceiroModule } from './financeiro/financeiro.module';

//import { PedagogicoModule } from './pedagogico/pedagogico.module';
import { ComercialModule } from './comercial/comercial.module';
import { AlunoModule } from './aluno/aluno.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    TrocaSenhaComponent
    //SelectUnidadeComponent
  ],
  imports: [
    AppRoutingModule,
    SharedModule,
    //AdmModule,
   // MatriculaModule,
    //PedagogicoModule,
    ComercialModule,
    FinanceiroModule,
    AlunoModule
  ],
  providers: [],
  entryComponents: [
    TrocaSenhaComponent
   // SelectUnidadeComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
