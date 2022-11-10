import { NgModule } from "@angular/core";
import { GetNgxMaskModuleConfig, SharedModule } from "../_shared/shared.module";
import { AdmComponent } from "./administrativo.component";
import { BolsasComponent } from "./bolsas/bolsas.component";
import { CreateBolsaComponent } from "./bolsas/create/create-bolsa.component";
import { EditBolsaComponent } from "./bolsas/edit/edit-bolsa.component";
import { ShowSenhaComponent } from "./bolsas/show/show-senha.component";
import { ColaboradoresComponent } from "./colaboradores/colaboradores.component";
import { CreateColaboradoresComponent } from "./colaboradores/create/colaborador-create.component";
import { EditColaboradoresComponent } from "./colaboradores/edit/colaborador-edit.component";
import { CargoCreateComponent } from "./configuracoes/cargo-create/cargo-create.component";
import { CargoEditComponent } from "./configuracoes/cargo-edit/cargo-edit.component";
import { ConfiguracoesComponent } from "./configuracoes/configuracoes.component";
import { DocTemplateComponent } from "./configuracoes/doc-create/doc-create.component";
import { MateriaTemplateComponent } from "./configuracoes/materia-create/mat-create.component";
import { ContratoComponent } from "./contratos/contrato.component";
import { CreateContratoComponent } from "./contratos/create/contrato-create.component";
import { EditarContratoComponent } from "./contratos/edit/contrato-edit.component";
import { MessageModalComponent } from "./mensagens/messagemodal.component";
import { ModuloCreateComponent } from "./modulos/create/modulo-create.component";
import { ModuloEditComponent } from "./modulos/edit/modulo-edit.component";
import { ModuloComponent } from "./modulos/modulo.component";
import { ModuloViewComponent } from "./modulos/view/modulo-view.component";
import { PlanoPgmCreateComponent } from "./planos/create/create-plano.component";
import { PlanoPgmEditComponent } from "./planos/edit/edit-plano.component";
import { PlanoPgmComponent } from "./planos/plano.component";
import { ProdutoCreateComponent } from "./produtos/create/produto-create.component";
import { ProdutoDoacaoComponent } from "./produtos/doacao/produto-doacao.component";
import { ProdutoEditComponent } from "./produtos/edit/produto-edit.component";
import { ProdutosComponent } from "./produtos/produtos.component";
import { ProfCalendarioComponent } from "./professores/calendario/professor-calend.component";
import { CreateProfessorComponent } from "./professores/create/professor-create.component";
import { EditProfessorComponent } from "./professores/edit/professor-edit.component";
import { AddMatComponent } from "./professores/materias/create/materia-create.component";
import { AddDispoComponent } from "./professores/materias/disponibilidade-create/disponibilidade-create.component";
import { EditDispoComponent } from "./professores/materias/disponibilidade-edit/disponibilidade-edit.component";
import { ProfMateriasComponent } from "./professores/materias/professor-materia.component";
import { ProfessoresComponent } from "./professores/professores.component";
import { ProfRelatorioComponent } from "./professores/relatorio/professor-rel.component";
import { AdmService } from "./services/adm.service";
import { AdmTurmasComponent } from "./turmas/administrativo-turma.component";
import { CreateCursoComponent } from "./turmas/create/turma-create.component";
import { AddPMateriaModalComponent } from "./turmas/edit/add-materia/addmateria.component";
import { AddProfessorModalComponent } from "./turmas/edit/add-professor/addprof.component";
import { EditCursoComponent } from "./turmas/edit/turma-edit.component";
import { ConfirmarIniciarTurmaModal } from "./turmas/iniciar/confirmariniciar.component";
import { CreateUnidadeComponent } from "./unidades/create/unidade-create.component";
import { EditUnidadeComponent } from "./unidades/edit/unidade-edit.component";
import { CreateSalaComponent } from "./unidades/salas/create/sala-create.component";
import { SalaEditarComponent } from "./unidades/salas/edit/sala-edit.component";
import { UnidadesComponent } from "./unidades/unidades.component";
import { EditAcessoComponent } from "./usuarios/acesso-edit/editacesso.component";
import { CreateUserComponent } from "./usuarios/create/createuser.component";
import { EditUserComponent } from "./usuarios/edit/edituser.component";
import { UsuarioComponent } from "./usuarios/usuario.component";
import { MatEditComponent } from './configuracoes/materia-edit/mat-edit.component';
import { DocEditComponent } from './configuracoes/doc-edit/doc-edit.component';
import { ModuloNovoComponent } from './modulos/create-novo/modulo-novo.component';
import { ConsultaAcessoComponent } from './usuarios/consulta-acessos/consulta-acesso.component';
import { TipoPacoteCreateComponent } from './configuracoes/tipo-pacote-create/tipo-pacote-create.component';
import { TipoPacoteEditComponent } from './configuracoes/tipo-pacote-edit/tipo-pacote-edit.component';
import { MateriaLoteCreateComponent } from './professores/materias/create-lote/materia-lote-create.component';


@NgModule({
    declarations: [
        AdmComponent,
        // Bolsas
        BolsasComponent,
        CreateBolsaComponent,
        ShowSenhaComponent,
        EditBolsaComponent,
        // Colaboradores
        CreateColaboradoresComponent,
        EditColaboradoresComponent,
        ColaboradoresComponent,
        // Configurações
        ConfiguracoesComponent,
        MateriaTemplateComponent,
        MatEditComponent,
        DocTemplateComponent,
        CargoEditComponent,
        CargoCreateComponent,
        DocEditComponent,
        TipoPacoteCreateComponent,
        TipoPacoteEditComponent,
        // Contratos
        ContratoComponent,
        EditarContratoComponent,
        CreateContratoComponent,
        // Mensagens
        MessageModalComponent,
        // Modulos
        ModuloComponent,
        ModuloViewComponent,
        ModuloEditComponent,
        ModuloCreateComponent,
        // Planos
        PlanoPgmComponent,
        PlanoPgmEditComponent,
        PlanoPgmCreateComponent,
        // Produtos
        ProdutosComponent,
        ProdutoEditComponent,
        ProdutoDoacaoComponent,
        ProdutoCreateComponent,
        // Professores
        ProfessoresComponent,
        EditProfessorComponent,
        CreateProfessorComponent,
        ProfRelatorioComponent,
        ProfMateriasComponent,
        EditDispoComponent,
        AddDispoComponent,
        AddMatComponent,
        ProfCalendarioComponent,
        // Turmas
        AdmTurmasComponent,
        ConfirmarIniciarTurmaModal,
        CreateCursoComponent,
        EditCursoComponent,
        AddProfessorModalComponent,
        AddPMateriaModalComponent,
        // Unidades
        UnidadesComponent,
        EditUnidadeComponent,
        CreateUnidadeComponent,
        CreateSalaComponent,
        SalaEditarComponent,
        // Usuarios
        UsuarioComponent,
        EditUserComponent,
        CreateUserComponent,
        EditAcessoComponent,
        MatEditComponent,
        DocEditComponent,
        ModuloNovoComponent,
        ConsultaAcessoComponent,
        MateriaLoteCreateComponent
    ],
    imports: [
        SharedModule,
        GetNgxMaskModuleConfig()
    ],
    providers: [
        AdmService
    ],
    exports: [
        AdmComponent,
        // Bolsas
        BolsasComponent,
        // Colaboradores
        ColaboradoresComponent,
        // Configurações
        ConfiguracoesComponent,
        // Contratos
        ContratoComponent,
        // Modulos
        ModuloComponent,
        // planos
        PlanoPgmComponent,
        // Produtos
        ProdutosComponent,
        // Professores
        ProfessoresComponent,
        // turmas
        AdmTurmasComponent,
        // Unidades
        UnidadesComponent,
        // Usuarios
        UsuarioComponent
    ],
    entryComponents: [
        // Bolsas
        CreateBolsaComponent,
        ShowSenhaComponent,
        EditBolsaComponent,
        // Colaboradores
        CreateColaboradoresComponent,
        EditColaboradoresComponent,
        // Configurações
        MateriaTemplateComponent,
        MatEditComponent,
        DocTemplateComponent,
        CargoEditComponent,
        CargoCreateComponent,
        DocEditComponent,
        TipoPacoteCreateComponent,
        TipoPacoteEditComponent,
        // Contratos
        EditarContratoComponent,
        CreateContratoComponent,
        // Mensagens
        MessageModalComponent,
        // Modulos
        ModuloViewComponent,
        ModuloEditComponent,
        ModuloCreateComponent,
        // Planos
        PlanoPgmEditComponent,
        PlanoPgmCreateComponent,
        // Produtos
        ProdutoEditComponent,
        ProdutoDoacaoComponent,
        ProdutoCreateComponent,
        // Professores
        EditProfessorComponent,
        CreateProfessorComponent,
        ProfRelatorioComponent,
        ProfMateriasComponent,
        EditDispoComponent,
        AddDispoComponent,
        AddMatComponent,
        ProfCalendarioComponent,
        // Turmas
        ConfirmarIniciarTurmaModal,
        CreateCursoComponent,
        EditCursoComponent,
        AddProfessorModalComponent,
        AddPMateriaModalComponent,
        // Unidades
        EditUnidadeComponent,
        CreateUnidadeComponent,
        CreateSalaComponent,
        SalaEditarComponent,
        // Usuarios
        EditUserComponent,
        CreateUserComponent,
        EditAcessoComponent
    ]
})
export class AdmModule { }

