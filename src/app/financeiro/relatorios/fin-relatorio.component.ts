import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BaseComponent } from 'src/app/_shared/services/basecomponent.component';

@Component({
  selector: 'app-fin-relatorio',
  templateUrl: './fin-relatorio.component.html',
  styleUrls: ['./fin-relatorio.component.scss']
})
export class FinRelatorioComponent extends BaseComponent implements OnInit {

  public displayedColumns: string[] = new Array<string>()
  public columnsToDisplay: string[] = new Array<string>()
  public data: any[] = new Array<any>()
  constructor(
    override _snackBar: MatSnackBar,
  ) {
    super(_snackBar);
   }

  ngOnInit(): void {
    this.displayedColumns = ['name', 'weight', 'symbol', 'position'];
    this.columnsToDisplay = this.displayedColumns.slice();
    this.data = ELEMENT_DATA;
  }

}


const ELEMENT_DATA = [
  {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
  {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
  {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
  {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
  {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
  {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
  {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
  {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
  {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
];