import { Component, Inject, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from "@angular/common/http";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { CienciaCurso, DiaVencimento, Parcelas } from "src/app/_shared/models/utils.model";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { JwtHelperService } from "@auth0/angular-jwt";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { PedagogicoService } from "../../services/pedagogico.service";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { Turma, TurmaViewModel } from "src/app/_shared/models/Turma.model";
import { ConfirmMatriculaModalConfig } from "../../services/pedag-modal";
import { ConfirmMatriculaComponent } from "./confirmar/confirmamat.component";
import { submitMatriculaForm } from "src/app/_shared/models/submit-command.model";


export const MeioPagamento = [
    { type: 'boleto', value: 'Boleto' },
    { type: 'debito', value: 'Cartão - Débito' },
    { type: 'credito', value: 'Cartão - Crédito' },
    { type: 'pix', value: 'Pix' },
    { type: 'dinheiro', value: 'dinheiro' },
]

@Component({
    selector: 'matriculamodal',
    templateUrl: './aluno-matricula.component.html',
    styleUrls: ['./aluno-matricula.component.scss'],
    animations: [HighlightTrigger]
})

export class AlunoMatriculaComponent implements OnInit {

    baseUrl = environment.baseUrl;
    public qntParcelas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
        21, 22, 23, 24, 25]
    cursosDisponiveis: TurmaViewModel[] = new Array<TurmaViewModel>();
    turmasParaMatricular: TurmaViewModel[] = new Array<TurmaViewModel>();
    turmaSelecionada: TurmaViewModel = new TurmaViewModel();
    previAtual?: string
    previTerminoAtual?: string
    cienciaCurso = CienciaCurso
    showTurmas: boolean = false
    showAlunosIndicacao = false
    public msgNoCursos = false
    //showTurmaSearch: boolean = true
    showTurmaForm: boolean = false
    message: string = ''
    meioPagamento = MeioPagamento
    diaVencimento = DiaVencimento
    parcelas = Parcelas
    private bolsa: any
    private jwtHelper = new JwtHelperService();
    public tokenInfo: TokenInfos = new TokenInfos();

    public matriculaTurmaForm!: FormGroup;
    public respMenor!: FormGroup;
    public respFinForm!: FormGroup;
    public temRespFinm!: FormGroup;
    public planoPgmAluno!: FormGroup
    public showSearchAlunoIndicacao = false
    constructor(
        private _fb: FormBuilder,
        private _helper: HelpersService,
        private http: HttpClient,
        private _pedagService: PedagogicoService,
        public _modal: MatDialog,
        public dialogRef: MatDialogRef<AlunoMatriculaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.planoPgmAluno = _fb.group({

            alunoId: ['', [Validators.required]],

            turmaId: ['', [Validators.required]],

            temRespFin: [false],

            menorIdade: [false],

            plano: _fb.group({
                valor: [0.00, [Validators.required]],
                taxaMatricula: [0.00, [Validators.required]],
                confirmacaoPagmMat: [false, [Validators.required]],
                bonusPontualidade: [0.00, [Validators.required]],
                parcelas: [22, [Validators.required]],
                planoId: ['', [Validators.required]],
                diaDefault: [''],
                codigoDesconto: [''],
                bolsaId: [''],
                ciencia: ['', [Validators.required]],
                cienciaAlunoId: [''],
                infoParcelas: _fb.array([])
            }),

            respMenor: _fb.group({
                nome: [''],
                tipo: ['Responsável menor'],
                cpf: [''],
                rg: [''],
                nascimento: [''],
                parentesco: [''],
                naturalidade: [''],
                naturalidadeUF: [''],
                email: [''],
                telCelular: [''],
                telWhatsapp: [''],
                telResidencial: [''],
                cep: [''],
                logradouro: [''],
                numero: [''],
                complemento: [''],
                cidade: [''],
                uf: [''],
                bairro: ['']
            }),

            respFin: _fb.group({
                nome: [''],
                tipo: ['Responsável financeiro'],
                cpf: [''],
                rg: [''],
                nascimento: [''],
                parentesco: [''],
                naturalidade: [''],
                naturalidadeUF: [''],
                email: [''],
                telCelular: [''],
                telWhatsapp: [''],
                telResidencial: [''],
                cep: [''],
                logradouro: [''],
                numero: [''],
                complemento: [''],
                cidade: [''],
                uf: [''],
                bairro: ['']
            })
        })

        this.planoPgmAluno.controls['plano'].valueChanges.subscribe(
            (form: any) => {
                if (this.planoPgmAluno.controls['plano'].get('ciencia')?.value == 'Indicação Aluno') {
                    this.planoPgmAluno.controls['plano'].get('cienciaAlunoId')?.setValidators([Validators.required])
                    this.planoPgmAluno.controls['plano'].get('cienciaAlunoId')?.updateValueAndValidity({ emitEvent: false })
                } else {
                    this.planoPgmAluno.controls['plano'].get('cienciaAlunoId')?.clearValidators()
                    this.planoPgmAluno.controls['plano'].get('cienciaAlunoId')?.updateValueAndValidity({ emitEvent: false })
                }
            }
        );

        this.planoPgmAluno.controls['plano'].get('diaDefault')?.valueChanges.subscribe(
            (form: any) => {
                this.CalcularParcelas()
            }
        );

        this.planoPgmAluno.controls['respFin'].valueChanges.subscribe(
            (form: any) => {

                if (this.planoPgmAluno.get('temRespFin')?.value == false) {
                    this.planoPgmAluno.controls['respFin'].get('telCelular')?.clearValidators()
                    this.planoPgmAluno.controls['respFin'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })

                    this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.clearValidators()
                    this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })

                    this.planoPgmAluno.controls['respFin'].get('telResidencial')?.clearValidators()
                    this.planoPgmAluno.controls['respFin'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })

                    return;
                }

                if (this.planoPgmAluno.controls['respFin'].get('telCelular')?.value == '' &&
                    this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.value == '' &&
                    this.planoPgmAluno.controls['respFin'].get('telResidencial')?.value == '') {

                    this.planoPgmAluno.controls['respFin'].get('telCelular')?.setValidators([Validators.required, Validators.minLength(11)])
                    this.planoPgmAluno.controls['respFin'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })
                    this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.setValidators([Validators.required, Validators.minLength(11)])
                    this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })
                    this.planoPgmAluno.controls['respFin'].get('telResidencial')?.setValidators([Validators.required, Validators.minLength(10)])
                    this.planoPgmAluno.controls['respFin'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })

                } else if (this.planoPgmAluno.controls['respFin'].get('telCelular')?.value.length < 11 ||
                    this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.value.length < 11 ||
                    this.planoPgmAluno.controls['respFin'].get('telResidencial')?.value.length < 10) {

                    if (this.planoPgmAluno.controls['respFin'].get('telCelular')?.value.length < 11 && this.planoPgmAluno.controls['respFin'].get('telCelular')?.value.length > 0) {
                        this.planoPgmAluno.controls['respFin'].get('telCelular')?.setValidators([Validators.required, Validators.minLength(11)])
                        this.planoPgmAluno.controls['respFin'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })
                    } else {
                        this.planoPgmAluno.controls['respFin'].get('telCelular')?.clearValidators()
                        this.planoPgmAluno.controls['respFin'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })
                    }
                    if (this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.value.length < 11 && this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.value.length > 0) {
                        this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.setValidators([Validators.required, Validators.minLength(11)])
                        this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })
                    } else {
                        this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.clearValidators()
                        this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })
                    }
                    if (this.planoPgmAluno.controls['respFin'].get('telResidencial')?.value.length < 10 && this.planoPgmAluno.controls['respFin'].get('telResidencial')?.value.length > 0) {
                        this.planoPgmAluno.controls['respFin'].get('telResidencial')?.setValidators([Validators.required, Validators.minLength(10)])
                        this.planoPgmAluno.controls['respFin'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })
                    } else {
                        this.planoPgmAluno.controls['respFin'].get('telResidencial')?.clearValidators()
                        this.planoPgmAluno.controls['respFin'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })
                    }
                } else {
                    this.planoPgmAluno.controls['respFin'].get('telCelular')?.clearValidators()
                    this.planoPgmAluno.controls['respFin'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })

                    this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.clearValidators()
                    this.planoPgmAluno.controls['respFin'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })

                    this.planoPgmAluno.controls['respFin'].get('telResidencial')?.clearValidators()
                    this.planoPgmAluno.controls['respFin'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })
                }

            }
        );


        this.planoPgmAluno.controls['respMenor'].valueChanges.subscribe(
            (form: any) => {

                if (this.planoPgmAluno.get('temRespFin')?.value == false) {
                    this.planoPgmAluno.controls['respMenor'].get('telCelular')?.clearValidators()
                    this.planoPgmAluno.controls['respMenor'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })

                    this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.clearValidators()
                    this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })

                    this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.clearValidators()
                    this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })

                    return;
                }

                if (this.planoPgmAluno.controls['respMenor'].get('telCelular')?.value == '' &&
                    this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.value == '' &&
                    this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.value == '') {

                    this.planoPgmAluno.controls['respMenor'].get('telCelular')?.setValidators([Validators.required, Validators.minLength(11)])
                    this.planoPgmAluno.controls['respMenor'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })
                    this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.setValidators([Validators.required, Validators.minLength(11)])
                    this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })
                    this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.setValidators([Validators.required, Validators.minLength(10)])
                    this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })

                } else if (this.planoPgmAluno.controls['respMenor'].get('telCelular')?.value.length < 11 ||
                    this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.value.length < 11 ||
                    this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.value.length < 10) {

                    if (this.planoPgmAluno.controls['respMenor'].get('telCelular')?.value.length < 11 && this.planoPgmAluno.controls['respMenor'].get('telCelular')?.value.length > 0) {
                        this.planoPgmAluno.controls['respMenor'].get('telCelular')?.setValidators([Validators.required, Validators.minLength(11)])
                        this.planoPgmAluno.controls['respMenor'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })
                    } else {
                        this.planoPgmAluno.controls['respMenor'].get('telCelular')?.clearValidators()
                        this.planoPgmAluno.controls['respMenor'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })
                    }
                    if (this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.value.length < 11 && this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.value.length > 0) {
                        this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.setValidators([Validators.required, Validators.minLength(11)])
                        this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })
                    } else {
                        this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.clearValidators()
                        this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })
                    }
                    if (this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.value.length < 10 && this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.value.length > 0) {
                        this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.setValidators([Validators.required, Validators.minLength(10)])
                        this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })
                    } else {
                        this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.clearValidators()
                        this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })
                    }
                } else {
                    this.planoPgmAluno.controls['respMenor'].get('telCelular')?.clearValidators()
                    this.planoPgmAluno.controls['respMenor'].get('telCelular')?.updateValueAndValidity({ emitEvent: false })

                    this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.clearValidators()
                    this.planoPgmAluno.controls['respMenor'].get('telWhatsapp')?.updateValueAndValidity({ emitEvent: false })

                    this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.clearValidators()
                    this.planoPgmAluno.controls['respMenor'].get('telResidencial')?.updateValueAndValidity({ emitEvent: false })
                }
            }
        );
    }


    async ngOnInit() {
        // await this.angelMowersPromise
        //     .then(() => this.myPaymentPromise.then(res => console.log(res)))
        //     .catch(error => console.log(error))

        //await this.meuAsync();
        //var numero = await this.delay(4000, 1)
        //console.log(numero)
        this.SetInitialValues()
        this.GetDefaultDay()
        this.ConsultarCursos()
        this.VerificarSeMenorDeIdade()
    }

    VerificarSeMenorDeIdade() {

            let idadeAluno: any
            var dataForm: Date = new Date(this.data['aluno'].nascimento)

            let timeDiff = Math.abs(Date.now() - dataForm.getTime());
            idadeAluno = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);

        if(idadeAluno < 18){
            this.HabilitarMenorForm()
        }
            //console.log(idadeAluno)
            //return idadeAluno
        
    }

    HabilitarMenorForm(){

        this.planoPgmAluno.controls['respMenor'].get('nome')?.setValidators([Validators.required, Validators.minLength(2)])
        this.planoPgmAluno.controls['respMenor'].get('nome')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('cpf')?.setValidators([Validators.required, Validators.minLength(11)])
        this.planoPgmAluno.controls['respMenor'].get('cpf')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('rg')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('rg')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('nascimento')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('nascimento')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('parentesco')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('parentesco')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('naturalidade')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('naturalidade')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('naturalidadeUF')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('naturalidadeUF')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('email')?.setValidators([Validators.required, Validators.minLength(5)])
        this.planoPgmAluno.controls['respMenor'].get('email')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('cep')?.setValidators([Validators.required, Validators.minLength(8)])
        this.planoPgmAluno.controls['respMenor'].get('cep')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('logradouro')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('logradouro')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('numero')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('numero')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('cidade')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('cidade')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('uf')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('uf')?.updateValueAndValidity({ emitEvent: false })
        this.planoPgmAluno.controls['respMenor'].get('bairro')?.setValidators([Validators.required])
        this.planoPgmAluno.controls['respMenor'].get('bairro')?.updateValueAndValidity({ emitEvent: false })
    }

    private SetInitialValues() {
        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        this.hidden = 'visible'
        this.planoPgmAluno.get('alunoId')?.setValue(this.data['aluno'].id)
    }

    public ConsultarCursos() {

        this.http.get(`${this.baseUrl}/pedag/matricula/${this.data['aluno'].id}`)
            .subscribe((response: any) => {
                this.typePacotes = Object.assign([], response)['types']

            }, err => {
                this._helper.openSnackBarErrorDefault()
            },
                () => {
                    //this.GetDefaultDay()
                    this.mostrarModalPrincipal = false
                    this.showSelectedTypes = true
                    this.hidden = 'hidden'
                });
    }

    private GetDefaultDay() {

        let dateNow = new Date();
        let initialDate = new Date()
        initialDate.setDate(10)

        if (dateNow.getDate() > 10) {
            initialDate.setMonth(initialDate.getMonth() + 1)
        } else {

        }
        this.planoPgmAluno.controls['plano'].get('diaDefault')?.setValue(initialDate)

    }

    // delay(milliseconds: number, count: number): Promise<any> {

    //     for (let index = 0; index < 10000; index++) {
    //         console.log(index)

    //     }
    //     return new Promise<number>(resolve => {
    //         resolve(5)
    //     });
    // }

    // myAsync = async (): Promise<Record<string, number | string>> => {
    //     await this.angelMowersPromise
    //     const response = await this.myPaymentPromise
    //     return response
    // }

    // angelMowersPromise = new Promise<string>((resolve, reject) => {
    //     // a resolved promise after certain hours
    //     setTimeout(() => {
    //         resolve('We finished mowing the lawn')
    //     }, 1000) // resolves after 100,000ms
    //     reject("We couldn't mow the lawn")
    // })

    // myPaymentPromise = new Promise<Record<string, number | string>>((resolve, reject) => {
    //     // a resolved promise with  an object of 1000 Euro payment
    //     // and a thank you message
    //     setTimeout(() => {
    //         resolve({
    //             amount: 5000,
    //             note: 'Thank You',
    //         })
    //     }, 100000)
    //     // reject with 0 Euro and an unstatisfatory note
    //     reject({
    //         amount: 0,
    //         note: 'Sorry Lawn was not properly Mowed',
    //     })
    // })

    pesquisarTurmas(typeId: any) {

        this.msgNoCursos = false
        this.hidden = 'visible'
        this.showTurmasEncontradas = false
        this.http.get(`${this.baseUrl}/turma/${typeId}`)
            .subscribe((response: any) => {
                this.turmas = Object.assign([], response['turmas'])

            }, err => {
                this.hidden = 'hidden'
                if (err['error'].status == 404) {
                    this.mensagemNoType = "Não há cursos disponíveis para este aluno.";
                    this.msgNoCursos = true
                }
                this.showMessageNoTypes = true
            },
                () => {
                    this.hidden = 'hidden'
                    this.showTurmasEncontradas = true

                });
    }

    buscar(turmaId: any) {
        this.hidden = 'visible'
        this.http.get(`${this.baseUrl}/turma/get/${turmaId}/${this.data['aluno'].id}`)
            .subscribe((response: any) => {

                this.turma = Object.assign({}, response['turma'])
                this.planosPgm = Object.assign([], response['planos'])
                this.planoPgmAluno.get('turmaId')?.setValue(this.turma.id)
                //console.log(response['menor'])
                this.planoPgmAluno.get('menorIdade')?.setValue(response['menor'])

                if (!response['menor']) {

                    Object.keys(this.planoPgmAluno.get('respMenor')?.value).forEach((controlName) => {
                        // console.log(controlName)
                        this.planoPgmAluno.controls['respMenor'].get(controlName)?.setValidators(null)
                        this.planoPgmAluno.controls['respMenor'].get(controlName)?.updateValueAndValidity()
                    });
                }

            }, err => {
                this.hidden = 'hidden'
                this.mensagemNoTrumas = err['error'].message
                this.showMessageNoTurmas = true
            },
                () => {
                    this.hidden = 'hidden'

                    this.dialogRef.addPanelClass('myalunomat-class')
                    this.showContent = true
                });

    }


    alunosIndicacao: any[] = new Array<any>()
    TrazerAlunos() {

        this._pedagService.GetAlunosIndicacao()
            .subscribe(
                sucesso => {
                    this.alunosIndicacao = sucesso['alunos']
                    this.showAlunosIndicacao = true

                },
                falha => { }
            )
    }

    chanceCiencia(ciencia: any) {

        if (this.planoPgmAluno.controls['plano'].get('ciencia')?.value == 'Indicação Aluno') {
            this.TrazerAlunos()
        } else {
            this.planoPgmAluno.controls['plano'].get('cienciaAlunoId')?.setValue('')
            //this.showAlunosIndicacao = false
        }
    }

    modelChanged(newObj: any) {
        //console.log(newObj)
        this.planoPgmAluno.get('temRespFin')?.setValue(newObj.checked);



        if (this.planoPgmAluno.get('temRespFin')?.value == true) {
            //console.log('tem resp fin')
            this.planoPgmAluno.controls['respFin'].get('nome')?.setValidators([Validators.required, Validators.minLength(2)])
            this.planoPgmAluno.controls['respFin'].get('nome')?.updateValueAndValidity({ emitEvent: false })

            // this.planoPgmAluno.controls['respFin'].get('tipo').setValidators([Validators.required])
            // this.planoPgmAluno.controls['respFin'].get('tipo').updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('cpf')?.setValidators([Validators.required, Validators.minLength(11)])
            this.planoPgmAluno.controls['respFin'].get('cpf')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('rg')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('rg')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('nascimento')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('nascimento')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('parentesco')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('parentesco')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('naturalidade')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('naturalidade')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('naturalidadeUF')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('naturalidadeUF')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('email')?.setValidators([Validators.required, Validators.minLength(5)])
            this.planoPgmAluno.controls['respFin'].get('email')?.updateValueAndValidity({ emitEvent: false })

            // this.planoPgmAluno.controls['respFin'].get('telCelular').setValidators([Validators.required])
            // this.planoPgmAluno.controls['respFin'].get('telCelular').updateValueAndValidity({ emitEvent: false })

            // this.planoPgmAluno.controls['respFin'].get('telWhatsapp').setValidators([Validators.required])
            // this.planoPgmAluno.controls['respFin'].get('telWhatsapp').updateValueAndValidity({ emitEvent: false })

            // this.planoPgmAluno.controls['respFin'].get('telResidencial').setValidators([Validators.required])
            // this.planoPgmAluno.controls['respFin'].get('telResidencial').updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('cep')?.setValidators([Validators.required, Validators.minLength(8)])
            this.planoPgmAluno.controls['respFin'].get('cep')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('logradouro')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('logradouro')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('numero')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('numero')?.updateValueAndValidity({ emitEvent: false })

            // this.planoPgmAluno.controls['respFin'].get('complemento').setValidators([Validators.required])
            // this.planoPgmAluno.controls['respFin'].get('complemento').updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('cidade')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('cidade')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('uf')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('uf')?.updateValueAndValidity({ emitEvent: false })

            this.planoPgmAluno.controls['respFin'].get('bairro')?.setValidators([Validators.required])
            this.planoPgmAluno.controls['respFin'].get('bairro')?.updateValueAndValidity({ emitEvent: false })


        } else {
            //console.log('nao tem resp fin')
            Object.keys(this.planoPgmAluno.get('respFin')?.value).forEach((controlName) => {
                // console.log(controlName)
                this.planoPgmAluno.controls['respFin'].get(controlName)?.setValidators(null)
                this.planoPgmAluno.controls['respFin'].get(controlName)?.updateValueAndValidity()
            });

        }

        //this.SetRespFinForm(newObj.checked)
        //this.temRespFinm.get('temRespFin').setValue(newObj.checked);
    }



    getCursos(actualPage: number, pageSize: number) {

        var itemsPerPage = 5;
        var currentPage = 1;

        this.http.get(`${this.baseUrl}/turmas/cursosUnidade`, {

            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": "Bear "
            })
        }).subscribe(response => {


            //   console.log(response)
            Object.assign(this.cursosDisponiveis, response)
            //console.log(this.cursosDisponiveis)
        }, err => {
            //console.log(err) 
        },
            () => {

                //  console.log('metodo getCursos')
                if (this.cursosDisponiveis.length == 0) {
                    //  this.showSelectCursoSearch = false
                    this.message = 'Não turmas com vagas ou disponíveis.'
                } else if (this.cursosDisponiveis.length > 0) {

                }

            });

    }

    setCienciaCurso(ciencia: any) {
        //  console.log(this.planoPgmAluno.get('ciencia').value)
    }

    // // consultarCursos(item: any){
    mensagemNoTrumas = "";
    showMessageNoTurmas = false;
    typePacotes: any[] = new Array<any>()
    showSelectedTypes = false
    showMessageNoTypes = false
    mensagemNoType = ""
    mostrarModalPrincipal = true

    searchBolsaIcon = false
    BuscarBolsa() {
        //console.log(this.planoPgmAluno.controls['plano'].get('codigoDesconto').value)
        if (this.planoPgmAluno.controls['plano'].get('codigoDesconto')?.value != '') {
            this.searchBolsaIcon = true
            if (this.planoPgmAluno.controls['plano'].get('codigoDesconto')?.value != null && this.planoPgmAluno.controls['plano'].get('codigoDesconto')?.value != '') {

                this._pedagService.GetBolsa(this.planoPgmAluno.controls['plano'].get('codigoDesconto')?.value)
                    .subscribe(
                        sucesso => { this.BuscaBolsaSucesso(sucesso) },
                        falha => { this.BuscaBolsaErro(falha) }
                    )
            }
        }
    }
    percentualDesconto = 0
    BuscaBolsaSucesso(resp: any) {
        this.searchBolsaIcon = false
        this.planoPgmAluno.controls['plano'].get('valor')?.setValue(this.valorPlanoOriginal)
        this.bolsa = resp['bolsa']
        this.percentualDesconto = this.bolsa.percentualDesconto
        let valorTotal = this.planoPgmAluno.controls['plano'].get('valor')?.value

        let per = (valorTotal / 100) * this.bolsa.percentualDesconto

        let valorComDesconto = valorTotal - per

        //console.log(valorComDesconto)

        this.planoPgmAluno.controls['plano'].get('valor')?.setValue(valorComDesconto)
        this.planoPgmAluno.controls['plano'].get('bolsaId')?.setValue(this.bolsa.id)
        this._helper.openSnackBarSucesso("Bolsa aplicada.")
        this.temBolsa = true
        this.CalcularParcelas();

    }

    BuscaBolsaErro(error: any) {
        this.searchBolsaIcon = false
        this._helper.openSnackBarError("Senha inválida.")

    }

    get valorParcela() {

        var preco = parseFloat('1000')
        // var precoFloat = preco.toFixed(2)
        //console.log(precoFloat)
        let precofinal = preco.toFixed(2)

        let parcelas = this.planoPgmAluno.controls['plano'].get('parcelas')?.value

        let valorTotal = this.planoPgmAluno.controls['plano'].get('valor')?.value

        let valorParcela = parseFloat(valorTotal) / parseFloat(parcelas)

        let parcela = valorParcela.toFixed(2)

        return parcela
    }

    RemoverBolsa() {
        this.planoPgmAluno.controls['plano'].get('bolsaId')?.setValue('')
        this.planoPgmAluno.controls['plano'].get('codigoDesconto')?.setValue('')
        this.planoPgmAluno.controls['plano'].get('valor')?.setValue(this.valorPlanoOriginal)
        // TODO recalcular parcelas        
        this.bolsa = {}
        this.temBolsa = false
        this.CalcularParcelas();
    }

    turmas: any[] = new Array<any>()
    showTurmasEncontradas = false
    hidden = 'hidden'


    turma: any
    showMatriculaContainer = false
    planos: any[] = new Array<any>()
    //menorIdade = false
    showContent = false


    voltar() {
        this.showSelectedTypes = true
        this.showMatriculaContainer = false
        this.respFinForm.reset()
        this.respFinForm.reset()
    }





    enderecoFin = 'hidden'
    consultaCEPFin(cep: any) {
        // console.log(CEP);

        if (this.planoPgmAluno.controls['respFin'].get('cep')?.valid) {
            this.http.get(`https://viacep.com.br/ws/${cep}/json/`, {})
                .subscribe((response: any) => {
                    //   console.log(response["logradouro"])

                    this.planoPgmAluno.controls['respFin'].get('logradouro')?.setValue(response["logradouro"].toUpperCase());
                    this.planoPgmAluno.controls['respFin'].get('bairro')?.setValue(response["bairro"].toUpperCase());
                    this.planoPgmAluno.controls['respFin'].get('cidade')?.setValue(response["localidade"].toUpperCase());
                    this.planoPgmAluno.controls['respFin'].get('uf')?.setValue(response["uf"].toUpperCase());
                    this.enderecoFin = 'visible'
                }, err => {
                    this._helper.openSnackBarError("Ocorreu um erro ao consultar o CPF.")
                    //  console.log(err)
                },
                    () => {
                        // console.log('finaly')
                        //this.showDivEndereco = true
                    });
        }
    }

    get respFinvalid() {
        // console.log(this.respFinForm.valid)
        return true
    }

    public enderecoMenor = 'hidden'
    consultaCEPRespMenor(cep: any) {
        // console.log(CEP);

        if (this.planoPgmAluno.controls['respMenor'].get('cep')?.valid) {
            this.http.get(`https://viacep.com.br/ws/${cep}/json/`, {})
                .subscribe((response: any) => {

                    this.planoPgmAluno.controls['respMenor'].get('logradouro')?.setValue(response["logradouro"].toUpperCase());
                    this.planoPgmAluno.controls['respMenor'].get('bairro')?.setValue(response["bairro"].toUpperCase());
                    this.planoPgmAluno.controls['respMenor'].get('cidade')?.setValue(response["localidade"].toUpperCase());
                    this.planoPgmAluno.controls['respMenor'].get('uf')?.setValue(response["uf"].toUpperCase());
                    this.enderecoMenor = 'visible'
                }, err => {
                    this._helper.openSnackBarError('Ocorreu um erro ao consultar o CEP.')
                    //console.log(err)
                },
                    () => {
                        // console.log('finaly')
                        //this.showDivEndereco = true
                    });
        }
    }

    get respmenorvalid() {
        // console.log(this.respMenor.valid)
        return true
    }

    planosPgm: any[] = new Array<any>();
    verPlano = false
    showPlano = false
    //todasparcelas: any[] = new Array<any>();



    get parcelasFormArray() {
        return this.planoPgmAluno.controls["plano"].get('infoParcelas') as FormArray;
    }

    todasparcelas = new Array<any>()

    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0)
        }
    }

    CalcularParcelas() {
        //console.log(this.planoPgmAluno.controls['plano'])
        if (this.planoPgmAluno.controls['plano'].get('planoId')?.value == '') return;
        this.todasparcelas = new Array<any>()
        let qntParcelas = this.planoPgmAluno.controls['plano'].get('parcelas')?.value
        //  let index = 0
        // console.log(this.parcelasFormArray.value.length)
        this.clearFormArray(this.parcelasFormArray)
        // this.parcelasFormArray.value.splice(0, this.parcelasFormArray.value.length);
        // clearFormArray = (formArray: FormArray) => {
        //     while (formArray.length !== 0) {
        //       formArray.removeAt(0)
        //     }
        //   }


        for (let index = 0; index < qntParcelas; index++) {

            // this.todasparcelas.push({
            //     parcelaNo: index + 1,
            //     vencimento: this.setData(index),
            //     valor: this.valorParcela
            // })

            const matForm = this._fb.group({

                parcelaNo: [index + 1],
                vencimento: [this.setData(index)],
                valor: [this.valorParcela]
            });

            // this.
            //this.parcelasFormArray.reset()

            this.parcelasFormArray.push(matForm);// get materias()


        }

        // console.log(this.parcelasFormArray.value)
    }


    // get todasparcelas() {

    //     //
    //     let parcelas = new Array<any>()
    //     let qntParcelas = this.planoPgmAluno.controls['plano'].get('parcelas').value
    //     for (let index = 0; index < qntParcelas; index++) {

    //         parcelas.push({
    //             parcelaNo: index + 1,
    //             vencimento: this.setData(index),
    //             valor: this.valorParcela
    //         })



    //         // const matForm = this._fb.group({

    //         //     parcelaNo: index + 1,
    //         //     vencimento:  this.setData(index),
    //         //     valor: this.valorParcela
    //         // });

    //         // this.parcelasFormArray.push(matForm);// get materias()


    //     }


    //     return parcelas

    // }

    setData(number: any) {

        // let dateNow = new Date();
        // let initialDate = new Date()
        // initialDate.setDate(10)

        // if (dateNow.getDate() > 10) {
        //     initialDate.setMonth(initialDate.getMonth() + 1)
        // } else {

        // }

        // console.log(initialDate)
        // this.planoPgmAluno.get('diaDefault').setValue(initialDate)
        let data = new Date(this.planoPgmAluno.controls['plano'].get('diaDefault')?.value)
        data.setMonth(data.getMonth() + number)
        data.setHours(0)
        data.setMinutes(0)
        data.setSeconds(0)
        return data

    }

    public valorPlanoOriginal: any
    public temBolsa = false

    public spinnerBuscarPlano = 'hidden'
    buscaPlanoPgm(planoId: any) {
        this.verPlano = false
        //console.log(planoId)

        this.spinnerBuscarPlano = 'visible'
        this.http.get(`${this.baseUrl}/plano-pagamento/${planoId}`)
            .subscribe((response: any) => {

                this.planoSelecionado = Object.assign([], response)['plano']

            }, err => {
                // console.log(err)
                this.spinnerBuscarPlano = 'hidden'
                //this.mensagemNoTrumas = err['error'].message
                //this.showMessageNoTurmas = true
            },
                () => {
                    this.verPlano = true
                    this.spinnerBuscarPlano = 'hidden'
                    //console.log(this.planoSelecion ado)   
                    // console.log(this.planoSelecionado)
                    this.valorPlanoOriginal = this.planoSelecionado.valor
                    this.planoPgmAluno.controls['plano'].get('valor')?.setValue(this.planoSelecionado.valor)
                    this.planoPgmAluno.controls['plano'].get('taxaMatricula')?.setValue(this.planoSelecionado.taxaMatricula)
                    this.planoPgmAluno.controls['plano'].get('bonusPontualidade')?.setValue(this.planoSelecionado.bonusPontualidade)
                    //  this.planoPgmAluno.get('parcelas').setValue(this.planoSelecionado.parcelas)
                    this.planoPgmAluno.controls['plano'].get('planoId')?.setValue(this.planoSelecionado.id)
                    this.planoPgmAluno.controls['plano'].get('planoId')?.setValue(planoId)
                    this.CalcularParcelas()
                    this.showPlano = true
                    /*
                                        valor
                    taxaMatricula
                    bonusPontualidade
                    parcelas
                    planoId
                    */

                });
    }

    visPrevia() {

    }

    get verValidPln() {
        // console.log(this.planoPgmAluno.valid)
        return true
    }

    submeter() {
        // console.log(this.respMenor.value)
    }

    // onFocusEvent(event){

    //     console.log(this.planoPgmAluno.get('parcelas').value)

    //     let parcelas = this.planoPgmAluno.get('parcelas').value

    //     let valorTotal = this.planoPgmAl uno.get('parcelas').value
    // }


    planoSelecionado: any
    // get verPlano() {
    //     console.log(this.planoSelecionado)

    //     if (this.planoSelecionado == undefined) {
    //         return false
    //     } else {
    //         return true
    //     }

    // }

    disabldSaveButton = 'hidden'
    get disabledButton() {
        if (this.planoPgmAluno.valid) {
            return this.disabldSaveButton != 'hidden'
        } else {
            return true
        }
    }

    salvarMat() {

        // this.planoPgmAluno.get('infoParcelas').setValue(this.todasparcelas)      
        // if (!this.planoPgmAluno.valid) return
        // if (this.menorIdade) {
        //     if (!this.respMenor.valid) return
        // }

        // if (this.temRespFinm.get('temRespFin').value) {
        //     if (!this.respFinForm.valid) return
        // }
        // this.disabldSaveButton = true

        // let form = {
        //     plano: this.planoPgmAluno.value,
        //     // menorIdade: this.menorIdade,
        //     respMenor: this.respMenor.value,
        //     temRespFin: this.temRespFinm.get('temRespFin').value,
        //     respFin: this.respFinForm.value,
        // }




        //this.formDisabled = !this.formDisabled;
        // const state = 'disable'

        // Object.keys(this.planoPgmAluno.get('respMenor').value).forEach((controlName) => {
        //    // console.log(controlName)
        //     this.planoPgmAluno.controls['respMenor'].get(controlName).setValidators(null)
        //     this.planoPgmAluno.controls['respMenor'].get(controlName).updateValueAndValidity()
        //     //this.planoPgmAluno.controls[controlName][state](); // disables/enables each form control based on 'this.formDisabled'
        // });


        //this.planoPgmAluno.get('respMenor').setValidators(null)
        //this.planoPgmAluno.controls['respMenor'].get('nome').clearValidators()
        //this.planoPgmAluno.controls['respMenor'].get('nome').updateValueAndValidity()
        //console.log(this.planoPgmAluno.controls['respMenor'].get('nome').value)
        //console.log(this.planoPgmAluno.controls['respMenor'].get('nome').valid)
        // console.log(this.planoPgmAluno)
        // console.log(this.planoPgmAluno.valid)
        // console.log(this.planoPgmAluno.get('respMenor').valid)
        this.disabldSaveButton = 'visible'
        this.http.post(`${this.baseUrl}/pedag/matricula/${this.turma.id}/${this.data['aluno'].id}`, this.planoPgmAluno.value, {})
            .subscribe((response: any) => {

                this.OpenModalSucesso(response['matriculaId'])
            }, err => {
                this._helper.openSnackBarErrorDefault()
                this.disabldSaveButton = 'hidden'
            },
                () => {
                    // msg aluno matriculado com sucesso! Deseja imprimir a ficha de matrícula 
                    // e o contrato ?
                });

    }

    OpenModalSucesso(matriculaId?: any): void {
        const dialogRef = this._modal
            .open(ConfirmMatriculaComponent, ConfirmMatriculaModalConfig(matriculaId));
        dialogRef.afterClosed().subscribe((data) => {
            this.dialogRef.close();
        });
    }




















    get shoNParcelar() {
        var value = this.matriculaTurmaForm.get('meioPagamento')?.value
        // console.log(this.matriculaTurmaForm.get('meioPagamento').value)
        // console.log(this.matriculaTurmaForm.get('parcelas').value)
        // console.log(this.matriculaTurmaForm.get('parcelas').valid)
        // console.log(this.parcelas[0])
        if (value == "cartaoDébito" ||
            value == "pix" ||
            value == "dinheiro" ||
            //value == "boleto" ||
            value == null) {
            return false
        } else {
            return true
        }


    }

    ValidateFormasPagamento() {
        if (this.matriculaTurmaForm.get('meioPagamento')?.valid) {

            var meioPag = this.matriculaTurmaForm.get('meioPagamento')?.value
            if (meioPag == "cartaoCredito" || meioPag == "boleto") {

                if (this.matriculaTurmaForm.get('parcelas')?.valid &&
                    this.matriculaTurmaForm.get('diaVencimento')?.valid) {

                    return true

                } else {
                    return false
                }
            } else {
                return true
            }

        } else {
            return false
        }

    }

    searchAluno(value: any) {

        if (value == "Indicação Aluno") {
            // TOdo search aluno
        }
    }

    submitMatricula(form: FormGroup) {
        // console.log(form)
        // console.log('sen matrícula')

        var ciencia = this.matriculaTurmaForm.get('cienciaCurso')?.value

        // console.log(this.matriculaTurmaForm.get('primeiraParcPaga').valid)

        if (!this.ValidateFormasPagamento()) {
            return
        }

        this.matriculaTurmaForm.get('primeiraParcPaga')?.valid
        //  console.log(this.matriculaTurmaForm.get('cienciaCurso').valid)


        if (!this.matriculaTurmaForm.get('cienciaCurso')?.valid) return


        var submitForm = new submitMatriculaForm()

        // TODO CONTRATOID
        submitForm.idAluno = this.data['alunoId']
        submitForm.idTurma = this.turmaSelecionada.id
        submitForm.ciencia = this.matriculaTurmaForm.get('cienciaCurso')?.value
        submitForm.meioPagamento = this.matriculaTurmaForm.get('meioPagamento')?.value
        submitForm.parcelas = this.matriculaTurmaForm.get('parcelas')?.value
        submitForm.primeiraParceJaPaga = this.matriculaTurmaForm.get('primeiraParcPaga')?.value
        submitForm.diaVencimento = this.matriculaTurmaForm.get('diaVencimento')?.value
        //console.log(submitForm)
        //console.log(this.matriculaTurmaForm.get('diaVencimento').value)


        //this.http.post(`${this.baseUrl}/turmas/turma/?idAluno=${this.data['alunoId']}&idTurma=${this.turmaSelecionada.id}&ciencia=${ciencia}`, {
        this.http.post(`${this.baseUrl}/turmas/turma`, submitForm, {
        }).subscribe(
            () => { },
            (error) => { },
            () => {

                this.confirmMatriculaModal()
                //this.dialogRef.close({ clicked: "OK" });
            }
        )
        // }
    }


    confirmMatriculaModal(): void {
        const dialogRef = this._modal
            .open(ConfirmMatriculaComponent, {
                height: 'auto',
                width: '400px',

                data: { Hello: "Hello World" },
                hasBackdrop: true,
                disableClose: true
            });
        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('The dialog was closed');
        //     // this.animal = result;
        // });

        dialogRef.afterClosed().subscribe((data) => {
            //console.log(data)
            if (data.clicked === "Sim") {
                //this.getCursos(0, 0);
                // console.log('clicou no sim')
                this.downloadContrato()
                //this.indexTab = 2

            } else if (data.clicked === "Cancel") {
                // console.log('clicou no cancel')
                this.dialogRef.close({ clicked: "cancel" });
            }
        });
    }

    downloadContrato() {
        var file = "Contrato.pdf";// this.createFileName("EXCEL");
        // this.showSpinner = true;
        // this.testehabilitar = false
        // console.log('download contrato')
        this.download().subscribe((data: any) => {
            //console.log(data)
            switch (data.type) {
                case HttpEventType.Response:
                    // this.showSpinner = false;
                    //this.downloadStatus.emit( {status: ProgressStatusEnum.COMPLETE});
                    const downloadedFile = new Blob([data.body], { type: data.body.type });
                    const a = document.createElement('a');
                    a.setAttribute('style', 'display:none;');
                    document.body.appendChild(a);
                    a.download = file;
                    a.href = URL.createObjectURL(downloadedFile);
                    a.target = '_blank';
                    a.click();
                    document.body.removeChild(a);
                    break;
            }
        },
            (err) => {
                //this.showSpinner = false;
                //this.testehabilitar = true;
            },
            () => {

                this.dialogRef.close({ clicked: "OK" });
                //this.showSpinner = false;
                // this.testehabilitar = true;
            }
        );
    }

    download(): Observable<HttpEvent<Blob>> {
        return this.http.request(new HttpRequest(
            'GET', `${this.baseUrl}/document/pdf`, null, {
            reportProgress: true,
            responseType: 'blob'
        }));
    }

    // selecionarTurma(turma: Turma) {

    //     //console.log(turma)
    //     Object.assign(this.turmaSelecionada, turma)
    //     //console.log(this.turmaSelecionada)
    //     // this.hideCursoSearchAndMessage = false
    //     //this.showSelectCursoSearch = false
    //     //this.showTableCursosAndamento = false
    //     //this.showFormFinal = true
    //     this.previAtual = `${new Date(this.turmaSelecionada.previsaoAtual).toLocaleDateString()}`
    //     this.previTerminoAtual = `${new Date(this.turmaSelecionada?.previsaoTerminoAtual).toLocaleDateString()}`
    //     this.showTurmas = false
    //     this.showTurmaForm = true
    // }



    fechar() {
        this.dialogRef.close({ clicked: "Ok" });
    }

}