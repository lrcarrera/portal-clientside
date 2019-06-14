import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {map} from 'rxjs/operators/map';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  private token: string;
  endPoint : string = 'https://enigmatic-mountain-27495.herokuapp.com';
  //endPoint : string = 'http://localhost:5000';

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
    return this.http.get(this.endPoint + '/profile');
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
  private request(type: 'login' | 'register', user?: TokenPayload): Observable<any> {
    let base;
    base = this.http.post(this.endPoint + '/' + type, user);
    return base.pipe(
      map((data: TokenResponse) => {
        console.log(data);
        if (data.token) {
          if (type === 'login') {
            this.saveToken(data.token);
          }
        }
        return data;
      })
    );
  }
}

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
