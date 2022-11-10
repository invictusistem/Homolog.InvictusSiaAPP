import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-acao-confirmar-dinamico',
  templateUrl: './acao-confirmar-dinamico.component.html',
  styleUrls: ['./acao-confirmar-dinamico.component.scss']
})
export class AcaoConfirmarDinamicoComponent implements OnInit {

  public mensagem:string = 'Deseja confirmar a ação?'
  constructor(
    public dialogRef: MatDialogRef<AcaoConfirmarDinamicoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

  }

  ngOnInit() {

    if(this.data['msg'] != null || this.data['msg'] != ''){
      this.mensagem = this.data['msg']
    }
  }

  confirmar() {

    this.dialogRef.close({ clicked: true });

  }

  cancelar() {
    this.dialogRef.close({ clicked: false });
  }
}
