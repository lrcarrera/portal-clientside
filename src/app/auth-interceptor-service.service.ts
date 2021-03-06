import {Injectable} from '@angular/core';
import {HttpErrorResponse,HttpEvent,HttpHandler,HttpInterceptor,HttpRequest} from '@angular/common/http';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';
import 'rxjs-compat/add/operator/do';
import {AuthenticationService} from './authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorServiceService implements HttpInterceptor {

  constructor(private router: Router,public auth: AuthenticationService) {
  }

  intercept(req: HttpRequest<any>,next: HttpHandler): Observable<HttpEvent<any>> {

    let token = `Bearer ${this.auth.getToken()}`;

    let newreq = req;
    if (token) {
      newreq = req.clone({
        headers: req
          .headers
          .set('Authorization',token)
      });
    }

    return next.handle(newreq).do((event: HttpEvent<any>) => {
    },(err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          this.router.navigate(['login']);
        }
      }
    });
  }
}
