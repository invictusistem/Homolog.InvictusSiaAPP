import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { JwtHelperService } from "@auth0/angular-jwt";
import { Observable } from "rxjs";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { TokenInfos } from "src/app/_shared/models/token.model";
import { PedagogicoService } from "../../services/pedagogico.service";
import { OpenCertificadoComponentModal } from "../../services/pedag-modal";
import { InfoFinanceiras } from "src/app/_shared/models/InfoFinanceiras.model";
import { DocumentoAlunoDto } from "src/app/_shared/models/documentoaluno.model";
import { AddAnotacaoComponent } from "./anotacoes/add-anotacao.component";
import { ConfirmModalComponent } from "src/app/_shared/components/modal-confirmar-v2/confirm-modal.component";
import { CertificadoComponent } from "./certificado/certificado.component";

@Component({
    selector: 'infosmodal',
    templateUrl: './infos.component.html',
    styleUrls: ['./infos.component.scss'],
    animations: [HighlightTrigger]
})

export class InfosComponent implements OnInit {

    baseUrl = environment.baseUrl;


    public initProgressBar = 'visible'
    public downloadTabProgressBar = 'hidden'
    public showtablePrinciple = false
    public showAluno: boolean = false
    public showRespFinanc: boolean = false
    public showRespMenor: boolean = false
    public nome: string = ''
    public aluno: any;
    public debitos: InfoFinanceiras = new InfoFinanceiras();
    private jwtHelper = new JwtHelperService();
    tokenInfo: TokenInfos = new TokenInfos();
    public documentoAluno: DocumentoAlunoDto[] = new Array<DocumentoAlunoDto>();

    public originalAluno: any
    public originalRespFin: any
    public originalRespMenor: any
    public turma: any
    public documentos: any

    public documentoForm: FormGroup
    public anotacaoForm: FormGroup
    private respFinId: number = 0;
    private respMenorId: number = 0;

    public alunoForm: FormGroup;
    public endereco: FormGroup;
    public respFinancForm: FormGroup;
    public respMenorForm: FormGroup;

    constructor(
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _service: PedagogicoService,
        private _modal: MatDialog,
        public dialogRef: MatDialogRef<InfosComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {

        this.documentoForm = _fb.group({
            descricao: ['', [Validators.required]],
            comentario: ['', [Validators.required]],
        })

        this.anotacaoForm = _fb.group({
            comentario: ['', [Validators.required]],
            matriculaId: ['']
        })

        this.alunoForm = _fb.group({
            id: [''],
            nomeSocial: [''],
            nome: ['', [Validators.required]],
            cpf: [''],
            rg: [''],
            nomePai: [''],
            nomeMae: [''],
            nascimento: ['', [Validators.required]],
            naturalidade: [''],
            naturalidadeUF: [''],
            email: [''],
            telefoneContato: ['', [Validators.required]],
            nomeContato: ['', [Validators.required]],
            celular: [''],
            telWhatsapp: [''],
            telResidencial: [''],
            tipoPessoa:[''],
            pessoaRespCadastroId:[''],
            ativo: [''],
            dataCadastro: [''],
            unidadeId: [''],

            endereco: this.endereco = _fb.group({
                id: [''],
                cep: ['', [Validators.required, Validators.minLength(8)]],
                logradouro: ['', [Validators.required]],
                numero: ['', [Validators.required]],
                complemento: [''],
                cidade: ['', [Validators.required, Validators.minLength(1)]],
                uf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
                bairro: ['', [Validators.required, Validators.minLength(1)]],
                pessoaId:['']
            })
        })

        this.respFinancForm = _fb.group({
            id: [''],
            tipo: [''],
            nome: [''],
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
            cep: ['', [Validators.required, Validators.minLength(8)]],
            logradouro: ['', [Validators.required, Validators.minLength(1)]],
            numero: ['', [Validators.required]],
            complemento: [''],
            cidade: ['', [Validators.required, Validators.minLength(1)]],
            uf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
            bairro: ['', [Validators.required, Validators.minLength(1)]],
            matriculaId: ['']
        })

        this.respMenorForm = _fb.group({
            id: [''],
            nome: [''],
            tipo: [''],
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
            cep: ['', [Validators.required, Validators.minLength(8)]],
            logradouro: ['', [Validators.required, Validators.minLength(1)]],
            numero: ['', [Validators.required]],
            complemento: [''],
            cidade: ['', [Validators.required, Validators.minLength(1)]],
            uf: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]],
            bairro: ['', [Validators.required, Validators.minLength(1)]],
            matriculaId: ['']
        })


        //this.alunoForm.get('logradouro').disable()
        //this.alunoForm.get('cidade').disable()
        //this.alunoForm.get('uf').disable()

    }

    ngOnInit() {

        this.anotacaoForm.get('matriculaId')?.setValue(this.data['aluno'].matriculaId)

        this.GetInformacoesMatricula(this.data['aluno'].matriculaId)
    }

    // alunoInfo: any;
    respFin: any;
    respMenor: any;
    anotacoes: any[] = new Array<any>()
    private alunoOriginal: any;
    private respFinOriginal: any;
    private respMenorOriginal: any;

    GetInformacoesMatricula(matriculaId: any) {

        this._http.get(`${this.baseUrl}/pedag/aluno/${matriculaId}`)
            .subscribe(
                (resp: any) => {
                    //console.log(resp)
                    this.turma = resp['turma'];
                    //this.respFin = resp['respFin'];
                    //this.respMenor = resp['respMenor'];
                    this.anotacoes = resp['anotacoes'];
                    this.documentoAluno = resp['docs'];

                    this.alunoForm.patchValue(resp['aluno']);
                    this.alunoOriginal = JSON.parse(JSON.stringify(this.alunoForm.value))
                    // RespFin
                    this.respFin = resp['respFin']
                    this.respFinancForm.patchValue(resp['respFin'])
                    this.respFinOriginal = JSON.parse(JSON.stringify(this.respFinancForm.value))
                    // respMenor
                    this.respMenorForm.patchValue(resp['respMenor'])
                    this.respMenor = resp['respMenor']
                    this.respMenorOriginal = JSON.parse(JSON.stringify(this.respMenorForm.value))
                },
                (error) => {
                    // console.log(error) 
                },
                () => {
                    this.dialogRef.addPanelClass('infoscomponent-class')
                    this.showAluno = true
                    this.showtablePrinciple = true
                    this.initProgressBar = 'hidden'
                    //  console.log(this.turma)
                })

    }

    //#region Saves

    // ALUNO SAVE
    saveAluno(form: any) {

        if (this.alunoForm.valid) {
            this.saveAlunoProgressBar = 'visible'

            this._service.saveAluno(this.alunoForm.value)
                .subscribe(
                    sucesso => { this.saveAlunoSucesso(sucesso) },
                    falha => { this.saveAlunoFalha(falha) }
                )
        }
    }

    getListaPendenciaDocs() {
        this.downloadTabProgressBar = 'visible'
        var file = "lista_penencia";

        this.downloadListPendencia(this.data['aluno'].matriculaId)
            .subscribe(
                (data: any) => {

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
                    this.downloadTabProgressBar = 'hidden'
                },
                () => {
                    this.downloadTabProgressBar = 'hidden'
                }
            );

    }

    public downloadListPendencia(matriculaId: any): Observable<HttpEvent<Blob>> {
        return this._http.request(new HttpRequest(
            'GET', `${this.baseUrl}/pedag/doc/getpendencia/${matriculaId}`, null, {
            reportProgress: true,
            responseType: 'blob'
        }));
    }

    saveAlunoSucesso(resposta: any) {
        //this.saveAlunoProgressBar = 'hidden'
        this.GetAluno(this.alunoForm.get('id')?.value);
    }

    saveAlunoFalha(erro: any) {
        console.log(erro)
        this.saveAlunoProgressBar = 'hidden'
    }

    GetAluno(alunoId: any) {

        this._service.getAlunobyId(alunoId)
            .subscribe(
                sucesso => { this.getAlunoSucesso(sucesso) },
                falha => { this.getAlunoFalha(falha) }
            )
    }

    getAlunoSucesso(resposta: any) {
        this.alunoForm.patchValue(resposta['aluno']);
        this.alunoOriginal = JSON.parse(JSON.stringify(this.alunoForm.value))
        this.saveAlunoProgressBar = 'hidden'
    }

    getAlunoFalha(erro: any) {
        this.saveAlunoProgressBar = 'hidden'
    }

    // RESP FIN SAVE

    saveRespFin(form: any) {

        if (this.respFinancForm.valid) {
            this.saveRespFinProgressBar = 'visible'

            this._service.saveResponsavel(this.respFinancForm.value)
                .subscribe(
                    sucesso => { this.saveRespFinSucesso(sucesso) },
                    falha => { this.saveRespFinFalha(falha) }
                )
        }
    }

    saveRespFinSucesso(resposta: any) {
        this.GetResponsavel(this.respFinancForm.get('id')?.value);
    }

    saveRespFinFalha(erro: any) {
        console.log(erro)
        this.saveRespFinProgressBar = 'hidden'
    }

    GetResponsavel(respId: any) {

        this._service.GetResponsavelById(respId)
            .subscribe(
                sucesso => { this.GetResponsavelSucesso(sucesso) },
                falha => { this.GetResponsavelFalha(falha) }
            )
    }

    GetResponsavelSucesso(resposta: any) {
        this.respFinancForm.patchValue(resposta['resp']);
        this.respFinOriginal = JSON.parse(JSON.stringify(this.respFinancForm.value))
        this.saveRespFinProgressBar = 'hidden'
    }

    GetResponsavelFalha(erro: any) {
        this.saveRespFinProgressBar = 'hidden'
    }

    // RESP MENOR SAVE

    saveRespMenor(form: any) {

        if (this.respMenorForm.valid) {
            this.saveRespMenorProgressBar = 'visible'

            this._service.saveResponsavel(this.respMenorForm.value)
                .subscribe(
                    sucesso => { this.saveRespMenorSucesso(sucesso) },
                    falha => { this.saveRespMenorFalha(falha) }
                )
        }
    }

    saveRespMenorSucesso(resposta: any) {
        this.GetResponsavelMenor(this.respMenorForm.get('id')?.value);
    }

    saveRespMenorFalha(erro: any) {
        console.log(erro)
        this.saveRespMenorProgressBar = 'hidden'
    }

    GetResponsavelMenor(respId: any) {

        this._service.GetResponsavelById(respId)
            .subscribe(
                sucesso => { this.GetResponsavelMenorSucesso(sucesso) },
                falha => { this.GetResponsavelMenorlFalha(falha) }
            )
    }

    GetResponsavelMenorSucesso(resposta: any) {
        this.respMenorForm.patchValue(resposta['resp']);
        this.respMenorOriginal = JSON.parse(JSON.stringify(this.respMenorForm.value))
        this.saveRespMenorProgressBar = 'hidden'
    }

    GetResponsavelMenorlFalha(erro: any) {
        this.saveRespMenorProgressBar = 'hidden'
    }


    //#endregion

    //#region SAVE BUTTONS
    saveAlunoProgressBar = 'hidden'
    get saveAlunoButton() {

        console.log(this.alunoForm.valid)

        if (this.alunoForm.valid &&
            JSON.stringify(this.alunoOriginal) !=
            JSON.stringify(this.alunoForm.value)) {

            return this.saveAlunoProgressBar != 'hidden'
        } else {
            return true
        }
    }

    saveRespFinProgressBar = 'hidden'
    get saveRespFinButton() {

        if (this.respFinancForm.valid &&
            JSON.stringify(this.respFinOriginal) !=
            JSON.stringify(this.respFinancForm.value)) {

            return this.saveRespFinProgressBar != 'hidden'
        } else {
            return true
        }
    }

    saveRespMenorProgressBar = 'hidden'
    get saveRespMenorButton() {

        if (this.respMenorForm.valid &&
            JSON.stringify(this.respMenorOriginal) !=
            JSON.stringify(this.respMenorForm.value)) {

            return this.saveRespMenorProgressBar != 'hidden'
        } else {
            return true
        }
    }

    //#endregion



    consultaCEP(CEP: string, form: any) {

        this._http.get(`https://viacep.com.br/ws/${CEP}/json/`, {})
            .subscribe(
                (response: any) => {

                    form.get('logradouro').setValue(response["logradouro"].toUpperCase());
                    form.get('bairro').setValue(response["bairro"].toUpperCase());
                    form.get('cidade').setValue(response["localidade"].toUpperCase());
                    form.get('uf').setValue(response["uf"].toUpperCase());

                }, err => { console.log(err) },
                () => { });


    }

    submitAnotacao() {

        console.log(this.anotacaoForm.valid)
        console.log(this.anotacaoForm.value)
        if (this.anotacaoForm.valid) {

            this._http.post(`${this.baseUrl}/pedag/matricula/anotacao`, this.anotacaoForm.value, {})
                .subscribe(response => {

                }, err => { console.log(err) },
                    () => {
                        this.GetAnotacoes();

                    });



        }
    }

    ShowAnotSpinner = 'hidden'
    openAddComentarioModal(): void {
        const dialogRef = this._modal
            .open(AddAnotacaoComponent, {
                height: '310px',
                width: '500px',
                autoFocus: false,


                data: {},
                hasBackdrop: true,
                disableClose: true
            });

        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "OK") {
                console.log('afte close ok')
                this.anotacaoForm.get('comentario')?.setValue(data.comentario)
                this.ShowAnotSpinner = 'visible'
                this.submitAnotacao();

            } else if (data.clicked === "Cancel") {

            }
        });
    }

    GetAnotacoes() {

        this._http.get(`${this.baseUrl}/pedag/matricula/anotacao/${this.data['aluno'].matriculaId}`)
            .subscribe(
                (resp: any) => {
                    console.log(resp)

                    this.anotacoes = resp['anotacoes'];

                    console.log(this.respMenor)

                },
                (error) => {
                    console.log(error)
                    this.ShowAnotSpinner = 'hidden'
                },
                () => {
                    this.ShowAnotSpinner = 'hidden'
                })

    }

    excluirArquivo(doc: any) {
        const dialogRef = this._modal
            .open(ConfirmModalComponent, {
                minHeight: '150px',
                width: '400px',

                hasBackdrop: true,
                disableClose: true
            });

        dialogRef.afterClosed().subscribe((data) => {
            if (data.clicked === "sim") {
                doc.salvando = true
                this.remover(doc)
            } else {
                console.log('nao deletar')
            }
        });

    }

    remover(doc: any) {
        doc.salvando = true
        this._http.put(`${this.baseUrl}/pedag/doc/excluir/${doc.id}`, {},)
            .subscribe(resp => {

            },
                (error) => {
                    console.log(error)
                    doc.salvando = false
                },
                () => {

                    this.getInfoDocs(doc);
                })
    }

    public GetCertificado(): void {
        const dialogRef = this._modal
            .open(CertificadoComponent, OpenCertificadoComponentModal(this.data['aluno']));
        dialogRef.afterClosed().subscribe((data) => {

        });
    }
































    getInfoFinancAlunos(alunoId: number) {

        this._http.get(`${this.baseUrl}/financeiro/aluno-debitos/${alunoId}`)
            .subscribe(resp => {
                this.debitos = Object.assign({}, resp);
            },
                (error) => { console.log(error) },
                () => {
                    console.log(this.debitos);
                })
    }

    addDocumentos(form: any) {  // pendencia-criar/{alunoId}
        console.log(form.value)

        if (form.valid) {
            this._http.post(`${this.baseUrl}/document/pendencia-criar/${this.data['aluno'].id}`, form.value, {

            })
                .subscribe(resp => {
                    // this.debitos = Object.assign({}, resp);
                },
                    (error) => { console.log(error) },
                    () => {
                        //console.log(this.debitos);
                        this.documentoForm.reset()
                    })
        }
    }


    isMatriculado = true
    getInfoDocs(doc: any) {

        this._http.get(`${this.baseUrl}/pedag/doc/lista/${this.data['aluno'].matriculaId}`)
            .subscribe((resp: any) => {
                //this.debitos = Object.assign({}, resp);
                this.documentoAluno = Object.assign([], resp['docs'])
                //this.isMatriculado = resp['matriculado']
            },
                (error) => {
                    console.log(error)
                    doc.salvando = false
                },
                () => {
                    doc.salvando = false
                    console.log(this.documentoAluno);
                })
    }



    get Equals() {
        return JSON.stringify(this.alunoForm.value) === JSON.stringify(this.originalAluno)
    }

    get EqualsFin() {
        return JSON.stringify(this.respFinancForm.value) === JSON.stringify(this.originalRespFin)
    }

    get EqualsMenor() {
        return JSON.stringify(this.respMenorForm.value) === JSON.stringify(this.originalRespMenor)
    }

    //public cepReturn: CepReturn = new CepReturn();
    //public logradouro = ''
    //public bairro = ''
    public localidade = ''
    public uf = ''



    saveEditAluno() {

        console.log(this.aluno)

        //this.alunoForm.value



    }

    onSubmit(form: FormGroup) {
        let alunoUpdate = JSON.stringify(this.alunoForm.value)
        console.log(alunoUpdate)
        this._http.put(`${this.baseUrl}/adm/aluno/1`, alunoUpdate, {
            headers: new HttpHeaders({
                "Content-Type": "application/json",
                "Authorization": "Bear "
            })

        }).subscribe(resp => {

        },
            (error) => { console.log(error) },
            () => {
                this.originalAluno = this.alunoForm.value
            })
    }

    onSubmitMenor(form: FormGroup) {

    }



    clicou() {
        console.log('clicou')


    }

    /*                           DOCS                   */



    formDatas = new FormData();

    fileAP: File[] = []
    fileAPName: string = ''
    fileAPViewName!: string

    fileCartaoVac: File[] = []
    fileCartaoVacName!: string
    fileCartaoVacViewName!: string

    fileTipoSang: File[] = []
    fileTipoSangName!: string
    fileTipoSangViewName!: string

    fileHCG: File[] = []
    fileHCGName!: string
    fileHCGViewName!: string
    public progress!: number;
    public message!: string;
    @Output() public onUploadFinished = new EventEmitter();

    apendFileAP(file: any) {
        this.fileAP = new Array<File>()
        let fileToUpload = <File>file[0];
        this.fileAPName = `AP${fileToUpload.name}`
        this.fileAPViewName = `${fileToUpload.name}`
        this.fileAP.push(fileToUpload)
    }

    apendFileCartaoVac(file: any) {
        this.fileCartaoVac = new Array<File>()
        let fileToUpload = <File>file[0];
        this.fileCartaoVacName = `CV${fileToUpload.name}`
        this.fileCartaoVacViewName = `${fileToUpload.name}`
        this.fileCartaoVac.push(fileToUpload)
    }

    apendFileTipoSang(file: any) {
        this.fileTipoSang = new Array<File>()
        let fileToUpload = <File>file[0];
        this.fileTipoSangName = `TP${fileToUpload.name}`
        this.fileTipoSangViewName = `${fileToUpload.name}`
        this.fileTipoSang.push(fileToUpload)
    }

    apendFileHCG(file: any) {
        this.fileHCG = new Array<File>()
        let fileToUpload = <File>file[0];
        this.fileHCGName = `HC${fileToUpload.name}`
        this.fileHCGViewName = `${fileToUpload.name}`
        this.fileHCG.push(fileToUpload)
    }


    verificar() {

        console.log(this.fileAP)
        console.log(this.fileCartaoVac)

        console.log(this.fileTipoSang)
        console.log(this.fileHCG)

    }


    uploadFile() {

        this.formDatas.append('file', this.fileAP[0], this.fileAPName);
        this.formDatas.append('file', this.fileCartaoVac[0], this.fileCartaoVacName);
        this.formDatas.append('file', this.fileTipoSang[0], this.fileTipoSangName);
        this.formDatas.append('file', this.fileHCG[0], this.fileHCGName);

        const token = localStorage.getItem('jwt')
        const Bearer = `Bearer ${token}`;
        this._http.post(`${this.baseUrl}/estagios/arquivos`, this.formDatas, {
            reportProgress: true, observe: 'events',
            headers: new HttpHeaders({

                "Authorization": Bearer
            })
        })
            .subscribe(
                (event: any) => {
                    if (event.type === HttpEventType.UploadProgress)
                        this.progress = Math.round(100 * event.loaded / event.total);
                    else if (event.type === HttpEventType.Response) {
                        this.message = 'Upload success.';
                        this.onUploadFinished.emit(event.body);
                    }
                },
                (error) => { console.log(error) },
                () => {
                    console.log('finally')
                    this.dialogRef.close({ clicked: "Ok" });
                    // this.refresh()
                    //this.onUploadFinished.unsubscribe;
                    //files = null
                });
    }


    aprovar(doc: DocumentoAlunoDto) {

        // var param = { alunoId: aluno.id, docId: doc.docId, validado: true }

        // this._http.put(`${this.baseUrl}/estagios`, param, {

        // }).subscribe(resp => { },
        //     (error) => { console.log(error) },
        //     () => {

        //         var index1 = this.docsViewModel.findIndex(a => a.id == aluno.id)
        //         var index2 = this.docsViewModel[index1].documentos.findIndex(a => a.docId == doc.docId)
        //         this.docsViewModel[index1].documentos[index2].analisado = true
        //         this.docsViewModel[index1].documentos[index2].validado = true


        //     })


    }

    reprovar(doc: DocumentoAlunoDto) {


        // var param = { alunoId: aluno.id, docId: doc.docId, validado: false }
        // this._http.put(`${this.baseUrl}/estagios`, param, {

        // }).subscribe(resp => { },
        //     (error) => { console.log(error) },
        //     () => {

        //         var index1 = this.docsViewModel.findIndex(a => a.id == aluno.id)
        //         var index2 = this.docsViewModel[index1].documentos.findIndex(a => a.docId == doc.docId)
        //         this.docsViewModel[index1].documentos[index2].analisado = true
        //         this.docsViewModel[index1].documentos[index2].validado = false

        //     })
    }

    disabled() {

    }

    fileName = '';
    exportar(event: any, doc: any) {



        const file: File = event.target.files[0];

        if (file) {

            this.fileName = file.name;

            const formData = new FormData();



            formData.append("file", file);
            console.log(formData);

            doc.salvando = true
            const upload$ = this._http.put(`${this.baseUrl}/pedag/doc/${doc.id}`, formData, {
                reportProgress: true, observe: 'events',

            })
                .subscribe((event: any) => {
                    if (event.type === HttpEventType.UploadProgress)
                        this.progress = Math.round(100 * event.loaded / event.total);
                    else if (event.type === HttpEventType.Response) {
                        this.message = 'Upload success.';
                        this.onUploadFinished.emit(event.body);
                    }
                },
                    (error) => { console.log(error) },
                    () => {
                        console.log('finally')
                        // this.dialogRef.close({ clicked: "Ok" });
                        // this.refresh()
                        //this.onUploadFinished.unsubscribe;
                        //files = null
                        this.getInfoDocs(doc);
                    });

        }
    }

    baixar(doc: any) {


        var file = doc.nome;// "Modelo LEAD.xlsx";// this.createFileName("EXCEL");


        this.download(doc.id).subscribe(
            (data: any) => {

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

            },
            () => {

            }
        );

    }

    public download(docId: any): Observable<HttpEvent<Blob>> {
        return this._http.request(new HttpRequest(
            'GET', `${this.baseUrl}/pedag/doc/${docId}`, null, {
            reportProgress: true,
            responseType: 'blob'
        }));
    }

    exportarCert() {

        //..console.log(doc:Document)
        var file = "Certificado conclusão.pdf";// this.createFileName("EXCEL");
        // this.showSpinner = true;
        // this.testehabilitar = false

        this.downloadCert().subscribe(
            (data: any) => {
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
                //this.showSpinner = false;
                // this.testehabilitar = true;
            }
        );
    }



    public downloadCert(): Observable<HttpEvent<Blob>> {
        return this._http.request(new HttpRequest(
            'GET', `${this.baseUrl}/document/documentacao-aluno-certconclusao`, null, {
            reportProgress: true,
            responseType: 'blob'
        }));
    }


}