import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {

  private fb          = inject( FormBuilder );
  private authService = inject( AuthService );
  private router      = inject( Router );

  public myForm: FormGroup = this.fb.group({
    email:    ['cazz111@email.com',[ Validators.required, Validators.email ]],
    password: ['amigo123',[ Validators.required, Validators.minLength(6) ]]
  });

  login(){
    const { email, password } = this.myForm.value;

    this.authService.login( email, password )
      // Como es un observable me debo suscribir
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'), // this is called when i have the value with no errors
        error: (message) => {
          Swal.fire( 'Error', message, 'error' )
        }
      });
  }

}
