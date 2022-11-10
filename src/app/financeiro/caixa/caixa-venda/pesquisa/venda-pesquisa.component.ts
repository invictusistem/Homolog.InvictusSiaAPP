import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-venda-pesquisa',
  templateUrl: './venda-pesquisa.component.html',
  styleUrls: ['./venda-pesquisa.component.scss']
})
export class VendaPesquisaComponent extends BaseComponent implements OnInit {

  //private baseUrl = environment.baseUrl;
    public produtos: any[] = new Array<any>();

  constructor(
    override _snackBar: MatSnackBar,
    private http: HttpClient,
        public dialogRef: MatDialogRef<VendaPesquisaComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    super(_snackBar)
   }

  

  ngOnInit() {
        
    this.produtos = Object.assign([], this.data["produtos"])
    //console.log(this.produtos)
}   


onSubmit(form: FormGroup) {
    
}

fechar() {
    this.dialogRef.close({ added: false });
}

addProductToList(produto: any){
    this.dialogRef.close({ added: true, produto: produto});
}

}
