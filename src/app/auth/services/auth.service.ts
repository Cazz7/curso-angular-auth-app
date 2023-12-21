import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environments.prod';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { AuthStatus, CheckTokenResponse, LoginResponse, User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly baseUrl: string = environment.baseUrl;
  private http = inject( HttpClient );

  // Estas señales son privadas porque no se modificarán por fuera del servicio
  // para esto expongo una propiedad computada mas adelante
  private _currentUser = signal<User|null>( null ) // Default value null
  private _authStatus = signal<AuthStatus>( AuthStatus.checking );

  //! Al mundo exterior. Computada es de sólo lectura
  public currentUser = computed( () => this._currentUser() );
  public authStatus = computed( () => this._authStatus() );

  constructor() {
    this.checkAuthStatus().subscribe(); // Para que cuando necesite el servicio por primera vez se verifique el estado
  }

  private setAuthentication(user: User, token: string ): boolean{
    this._currentUser.set( user );
    this._authStatus.set( AuthStatus.authenticated );
    // token is stored in local storage
    localStorage.setItem('token',token);
    return true;
  }

  public login(email:string, password:string): Observable<boolean>{

    const url = `${ this.baseUrl }/auth/login`;
    const body = { email, password };

    return this.http.post<LoginResponse>( url, body )
      .pipe(
        map( ({ user, token }) => this.setAuthentication( user, token )),
        catchError( err => throwError( () => err.error.message ))
      );

  }

  checkAuthStatus(): Observable<boolean> {
    const url = `${ this.baseUrl }/auth/check-token`;
    const token = localStorage.getItem('token');

    if( !token ){
      this.logout(); //debimos adicionar esta línea cuando no hay token
      return of(false);
    }

    const headers = new HttpHeaders()
      //stablish authorization header
      .set('Authorization', `Bearer ${ token }`);

    return this.http.get<CheckTokenResponse>(url, { headers })
      .pipe(
        map(({ user, token }) => this.setAuthentication(user, token)),
        //Error
        //catchError(()=>of(false))
        catchError(() => {
          //this._currentUser.set( null );
          this._authStatus.set( AuthStatus.notAuthenticated );
          return of(false);
        })
      );

  }

  logout() {
    localStorage.removeItem('token');
    this._currentUser.set(null);
    this._authStatus.set( AuthStatus.notAuthenticated );

  }

}
