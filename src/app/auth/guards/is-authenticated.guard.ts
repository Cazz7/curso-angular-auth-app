import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthStatus } from '../interfaces';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {

  //const url = state.url;
  //localStorage.setItem( 'url', url );
  const authService = inject( AuthService );
  const router = inject( Router );

  if( authService.authStatus() === AuthStatus.authenticated ){
    return true;
  }

  // En el caso en el que aún no conozca el estado de la autenticación,
  // no debo forzar la navegación, solo retornar false
  //if( authService.authStatus() === AuthStatus.checking ){
  //  return false;
  //}

  router.navigateByUrl('/auth/login')

  return false;

};
