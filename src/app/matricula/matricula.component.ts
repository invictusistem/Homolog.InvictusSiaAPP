import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { RouteInfo } from '../_shared/models/route-info.model';
import { TokenInfos } from '../_shared/models/token.model';

export const ROUTES: RouteInfo[] = [
     { path: '/mat/matricula', title: 'Matrícula', class: '', typeIcon: 'manage_accounts' }   
]

@Component({
    selector: 'matricula-app',
    templateUrl: './matricula.component.html',
    styleUrls: ['./matricula.component.scss']
})

export class MatriculaComponent implements OnInit {
    menu: any;
    data: string = "";
    private baseUrl = environment.baseUrl;
    mensagem: any;
    public htmlContent: any;
    private jwtHelper = new JwtHelperService();
    public tokenInfo: TokenInfos = new TokenInfos();
    
    constructor(
        //private jwtHelper: JwtHelperService, 
        private _router: Router,
        private _modal: MatDialog,
        private _http: HttpClient) {
        const navigation: any = this._router.getCurrentNavigation();
       // console.log(navigation.extras['state'])
        if (navigation.extras['state'] != undefined) {
            const state = navigation.extras.state as { data: string };
            this.data = state.data;
        }

    }
    ngOnInit() {
        // this.isUserAuthenticated();
        const token: any = localStorage.getItem('jwt')
        this.tokenInfo = this.jwtHelper.decodeToken(token)
        //console.log(this.data != "")        
        this.menu = ROUTES.filter(menu => menu);
    }

    

    openMessageModal(): void {
        // const dialogRef = this._modal
        //     .open(MessageModalComponent, {
        //         height: 'auto',
        //         width: '800px',

        //         data: { message: this.htmlContent },
        //         hasBackdrop: true,
        //         disableClose: true
        //     });


        // dialogRef.afterClosed().subscribe((data) => {
        //     if (data.clicked === "Ok") {
        //         // Reset form here
        //         console.log('afte close ok')
        //         //this.getColaboradores(1, this.pageSize);
        //     } else if (data.clicked === "Cancel") {
        //         // Do nothing. Cancel any events that navigate away from the
        //         // component.
        //     }
        // });
    }
   

    logOut() {
        localStorage.removeItem("jwt");
        this._router.navigate(["/login"]);

    }

}