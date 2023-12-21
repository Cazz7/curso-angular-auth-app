import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/services/auth.service';
import { AuthStatus } from './auth/interfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // Reaccionamos a los cambios de autenticación aquí porque en este punto es donde pasamos
  // en todo momento
  private authService = inject( AuthService );
  private router = inject( Router );

  public finishedAuthCheck = computed<boolean>( () => {
    return this.authService.authStatus() === AuthStatus.checking ? false: true;
  } )

  //Este efecto se ejecuta cuando el status cambia
  public authStatusChangeEffect = effect( () => {

    switch( this.authService.authStatus() ){
      case AuthStatus.checking:
        return; // Do nothing
      case AuthStatus.authenticated:
        this.router.navigateByUrl('/dashboard'); // This route is stored in localstorage
        return;
      case AuthStatus.notAuthenticated:
        this.router.navigateByUrl('/auth/login');
        return;
    }

  } );

}
