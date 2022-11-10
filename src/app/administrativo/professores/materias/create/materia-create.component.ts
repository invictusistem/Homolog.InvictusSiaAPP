import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from "@angular/common/http";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HighlightTrigger } from "src/app/_shared/animation/animation";
import { environment } from "src/environments/environment";
import { AdmService } from "src/app/administrativo/services/adm.service";
import { HelpersService } from "src/app/_shared/components/helpers/helpers.component";


@Component({
    selector: 'add-matmodal',
    templateUrl: './materia-create.component.html',
    styleUrls: ['./materia-create.component.scss'],
    animations: [HighlightTrigger]
})

export class AddMatComponent implements OnInit {


    baseUrl = environment.baseUrl;
    materiasAtuais: any[] = new Array<any>()
    materias: any[] = new Array<any>()
    typePacotes: any[] = new Array<any>()
    materiasForm: FormGroup
    mostrarDivPrincipal = false
    showForm = false
    constructor(
        private _admService: AdmService,
        private _fb: FormBuilder,
        private _http: HttpClient,
        private _helper: HelpersService,
        public dialogRef: MatDialogRef<AddMatComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
        this.materiasForm = _fb.group({
            typePacoteId: ['', [Validators.required]],
            materiaId: ['', [Validators.required]],
        })

    }

    ngOnInit() {
        this.materiasAtuais = Object.assign([], this.data['materias'])
        this.GetTypePacotes()
    }

    GetTypePacotes() {

        this._admService.GetTypePacotes()
            .subscribe(
                sucesso => { this.processarSucesso(sucesso) },
                falha => { this.processarFalha(falha) }
            );
    }

    // GetMaterias(typePacoteId: any) {

    //     this._admService.GetMateriasByTypeId(typePacoteId)
    //         .subscribe(
    //             sucesso => { this.processarSucesso(sucesso) },
    //             falha => { this.processarFalha(falha) }
    //         );
    // }

    processarSucesso(response: any) {
        this.typePacotes = response['typePacotes']
        this.dialogRef.addPanelClass('addMat-class')
        this.mostrarDivPrincipal = true
        //this.showForm = true
    }

    processarFalha(falha: any) {

    }

    adicionar() {
        this.materias = new Array<any>()
        this.showMateriaMsg = false
        this.showMateriaMsg = false
        this.materiasForm.get('materiaId')?.setValue('')
        if (this.materiasForm.get('typePacoteId')?.valid) {

            this._admService.GetMateriasLiberadas(this.materiasForm.get('typePacoteId')?.value, this.data['profId'])
                .subscribe(
                    sucesso => { this.setMaterias(sucesso) },
                    falha => { this.procssMateriaFalha(falha) }
                );
        }
    }

    setMaterias(resposta: any) {
        this.materias = resposta['materias']

    }
    procssMateriaFalha(falha: any) {

    }
    showMateriaMsg = false
    save(){
        this.showMateriaMsg = false
        var mat = this.materiasAtuais.find(element => element.pacoteMateriaId == this.materiasForm.get('materiaId')?.value)
        //console.log(mat)
        if(mat != undefined){
            this.showMateriaMsg = true
            return;
        }

        this.disabledSaveButton = true

        if (this.materiasForm.valid) {
            this._admService.SaveProfessorMateria(this.data['profId'], this.materiasForm.get('materiaId')?.value)
            .subscribe(
                sucesso => {  
                    this._helper.openSnackBarSucesso("Matéria adicionada com sucesso.")
                    this.dialogRef.close({ clicked: true });
                },
                falha => {  
                    this._helper.openSnackBarError("Ocorreu um erro, entre em contato com o administrador do sistema.")
                },
            )
        }
    }

    disabledSaveButton = false
    get disabledButton() {
        if (this.materiasForm.valid) {
            return this.disabledSaveButton && !this.showMateriaMsg
        } else {
            return true
        }
    }





}