import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-concluir-aula-modal',
  templateUrl: './concluir-aula-modal.component.html',
  styleUrls: ['./concluir-aula-modal.component.scss']
})
export class ConcluirAulaModalComponent extends BaseComponent implements OnInit {

  public saveProgressBar = 'hidden'
  disabledButton = false
  public infoDia: any
  constructor(
    override _snackBar: MatSnackBar,
    private _http: HttpClient,
    public dialogRef: MatDialogRef<ConcluirAulaModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar);
   }

  ngOnInit(): void {

  }

  confirmar() {
    this.saveProgressBar = 'visible'
    this.disabledButton = true
      
     // this.saveCommand.listaPresencaDto = this.listaPresencaDto
     // this.saveCommand.calendarId = this.infoDia.id
     // this.saveCommand.observacoes = this.obsForm.get('observacoes').value
     this.infoDia = this.data['infoDia']
     this.infoDia.observacoes = this.data['obsForm'] //this.obsForm.get('observacoes')?.value
     
     console.log(this.infoDia)
    
     this._http.post(`${this.baseUrl}/pedag/turma/presenca-diario/${this.data['calendarioId']}`, 
     { aulaViewModel: this.infoDia, listaPresenca: this.data['listaPresencaDto'] }, {})
         .subscribe(resp => {          

         },
             (error) => { 
              this.saveProgressBar = 'hidden'
              this.disabledButton = false
              this.OpenSnackBarErrorDefault()
              console.log(error) },
             () => {
              this.OpenSnackBarSucesso('Aula editada com sucesso.')
                 this.dialogRef.close({ clicked: true })
             })
 
}


cancelar() {
    this.dialogRef.close({ clicked: false });
}

}
