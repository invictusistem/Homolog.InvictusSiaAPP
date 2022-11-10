import { HttpClient } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";
import { environment } from "src/environments/environment";

@Component({
    selector: 'createsalamodal',
    templateUrl: './sala-create.component.html',
    styleUrls: ['./sala-create.component.scss'],
    animations: [HighlightTrigger]
})

export class CreateSalaComponent implements OnInit {

    // pageSize: number = 5;
    // genericTasks: GenericTask[] = new Array<GenericTask>();
    // length: number;
    // pageEvent: PageEvent;
    private _baseUrl = environment.baseUrl
    public spinnerSave = 'hidden'

    public salaForm: FormGroup;
    constructor(
        //private service: AdmService,
        private _http: HttpClient,
        private _helpers: HelpersService,
        private _fb: FormBuilder,
        public dialogRef: MatDialogRef<CreateSalaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.salaForm = this._fb.group({
            descricao: ['',[Validators.required]],
            capacidade:[,[Validators.required, Validators.min(1)]],
            comentarios: ['',[Validators.required, Validators.maxLength(200)]],
            ativo: [true],
            unidadeId: [this.data["unidade"].id],
        })
    }


    ngOnInit() {


    }

    get disabledButton(){

        if(this.salaForm.valid){
            return this.spinnerSave != 'hidden'
        }else{
            return true
        }
    }

    onSubmit(form: any){
       // console.log(this.data["unidade"].id)

        if(this.salaForm.valid){

            this.spinnerSave = 'visible'
            this._http.post(`${this._baseUrl}/unidade/sala-create`, this.salaForm.value,{})
                .subscribe(resp => { },
                    (error) => { 
                        
                       // console.log(error)
                    },
                    () => { 
                        this._helpers.openSnackBarSucesso("Sala criada com sucesso")
                        this.dialogRef.close({clicked: "Ok"})})

        }
    }
}