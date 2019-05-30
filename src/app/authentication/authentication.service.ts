import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators/map';
import {Router} from '@angular/router';

export interface UserDetails {
  _id: string;
  email: string;
  name: string;
  exp: number;
  iat: number;
  role: string;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
  role: string;
}


@Injectable({
  providedIn: 'root'
})

//AuthenticationService does operations with token received from serverside.
export class AuthenticationService {

  private token: string;

  constructor(private http: HttpClient,private router: Router) {
  }

  public register(user: TokenPayload): Observable<any> {
    return this.request('register',user);
  }

  public login(user: TokenPayload): Observable<any> {
    return this.request('login',user);
  }

  public logout(): void {
    this.token = '';
    window.localStorage.removeItem('mean-token');
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigateByUrl('/login');
  }

  public profile(): Observable<any> {
    return this.http.get('http://localhost:5000/profile');
  }

  private saveToken(token: string): void {
    localStorage.setItem('mean-token',token);
    this.token = token;
  }

  getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }

  //Check if user is logged and the token does not expired yet
  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  public isAdmin(): boolean {
    const user = this.getUserDetails();
    if (user) {
      if (user.exp > Date.now() / 1000) {
        return user.role === 'Admin';
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  //Manage our requests to endpoint authentication routes
  private request(type: 'login' | 'register',user?: TokenPayload): Observable<any> {
    let base;

    //  if (method === 'post') {
    //base = this.http.post(`/api/${type}`, user);
    base = this.http.post(`https://enigmatic-mountain-27495.herokuapp.com/${type}`,user);
    //base = this.http.post(`/api/${type}`, user);

    /*if(type === 'register'){
      return new Observable(observer => {
        observer.next({
          result: 'OK'
        });
        observer.complete();
      });
    }else{*/
    return base.pipe(
      map((data: TokenResponse) => {
        console.log(data);
        if (data.token) {
          if (type === 'login'){
            this.saveToken(data.token);
          }
        }
        return data;
      })
    );

   // }
    /*  } else {
        base = this.http.get(`https://enigmatic-mountain-27495.herokuapp.com/${type}`, { headers: { Authorization: `Bearer ${this.getToken()}`}});
    }*/


  }
}
