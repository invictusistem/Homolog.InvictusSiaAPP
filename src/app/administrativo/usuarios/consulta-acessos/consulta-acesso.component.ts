import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-consulta-acesso',
  templateUrl: './consulta-acesso.component.html',
  styleUrls: ['./consulta-acesso.component.scss']
})
export class ConsultaAcessoComponent extends BaseComponent implements OnInit {

  public rangeForm: FormGroup 
  public acessos: any[] = new Array<any>()
  public nenhumDadoLocalizado = false
  public showContent = false

  constructor(
    override _snackBar: MatSnackBar,
    private _fb: FormBuilder,
    private _http: HttpClient,
    //private _modal: MatDialog,
    public _dialogRef: MatDialogRef<ConsultaAcessoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    super(_snackBar);

    this.rangeForm = _fb.group({
      rangeIni: ['',[Validators.required]],
      rangeFinal: ['',[Validators.required]]
  })
  }

  ngOnInit(): void {
    this.initProgressBar = 'hidden'
  }

  public Pesquisar(){

    if(this.rangeForm.valid){
        this.nenhumDadoLocalizado = false
        this.initProgressBar = 'visible'
        //console.log(this.rangeForm.value)
        let dateIni = new Date(this.rangeForm.get('rangeIni')?.value).toUTCString()
        let dateFim = new Date(this.rangeForm.get('rangeFinal')?.value).toUTCString()
        this._http.get(`${this.baseUrl}/usuario/acessos/${dateIni}/${dateFim}`)       
            .subscribe({
             next: (resp:any) => { this.PesquisarSucesso(resp) },
             error: (falha:any) => { this.PesquisarError(falha) }})
    }
}

private PesquisarSucesso(resp: any){
    this.initProgressBar = 'hidden'
    this.acessos = resp['result']
    this._dialogRef.addPanelClass('profrelatorio-class')
    this.showContent = true
}

private PesquisarError(error: any){
    this.initProgressBar = 'hidden'

    if(error['status'] == 404){
        this.nenhumDadoLocalizado = true
    }else{
        this.OpenSnackBarErrorDefault()
    }
}

}
