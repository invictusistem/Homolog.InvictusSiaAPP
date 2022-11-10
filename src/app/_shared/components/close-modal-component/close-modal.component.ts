import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'close-modal',
    templateUrl: './close-modal.component.html',
    styleUrls: ['./close-modal.component.scss']
})

export class CloseModalComponent implements OnInit {    

    @Input() disable!: boolean;
    constructor(
        //override _snackBar: MatSnackBar,        
       // public dialogRef: MatDialogRef<CloseModalComponent>,
        //@Inject(MAT_DIALOG_DATA) public data: any
        ) { }


    ngOnInit() {        
        
    }   

    
}