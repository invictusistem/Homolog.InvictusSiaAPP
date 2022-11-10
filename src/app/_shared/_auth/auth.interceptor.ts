import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthInterceptor implements HttpInterceptor {

    private baseUrl = environment.baseUrl
    constructor(private router: Router) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        if (req.url.includes(this.baseUrl)) {
            if (localStorage.getItem('jwt') !== null) {
                const cloneReq = req.clone({
                    headers: req.headers.set('Authorization', `Bearer ${localStorage.getItem('jwt')}`)
                    
                });
                return next.handle(cloneReq).pipe(
                    tap(
                        succ => { },
                        err => {
                            if (err.status === 401) {
                                this.router.navigateByUrl('user/login');
                            }
                        }
                    )
                );
            } else {
                return next.handle(req.clone());
            }
        }else{
            const cloneReq = req.clone()
            return next.handle(cloneReq).pipe(
                tap(
                    succ => { },
                    err => {
                        if (err.status === 401) {
                            this.router.navigateByUrl('user/login');
                        }
                    }
                )
            );
        }
    }
}
