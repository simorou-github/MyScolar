import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
// import { AuthfakeauthenticationService } from '../../../core/services/authfake.service';

import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { AuthStateService } from 'src/app/shared/authentication/auth-state.service';
import { TokenService } from 'src/app/shared/authentication/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

/**
 * Login component
 */
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  submitted: any = false;
  error: any = '';
  email: string = '';
  // set the currenr year
  year: number = new Date().getFullYear();
  message: any; isProcessing: boolean = false;

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private authService: AuthService, private toastr: ToastrService, private authState: AuthStateService, private tokenService: TokenService) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required]],
    });

  }

  get f() { return this.loginForm.controls; }


  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.showError("Veillez rafraichir la page et réessayer.");
    } else {
      this.isProcessing = true;
      this.email = this.loginForm.get('email')?.value;
      this.authService.login(this.loginForm.value).subscribe({
        next: (v: any) => {
          if (v.status == 200) {
            this.message = v.message;
            this.showSuccess(this.message);
            this.tokenService.handleToken(v.access_token);
            this.authState.changeAuthStatus(true);
            this.isProcessing = false;
            this.loginForm.reset();

            if (v.is_true_password == 0 || v.is_true_password == false) {
              // Rediriger vers la page de changement de mot de passe
              this.router.navigate(['/activation-account'], { queryParams: { email: this.email } });
            } else {
              // Rediriger vers le tableau de bord normal
              this.router.navigate(['/dashboard']);
            }

          } else {
            this.message = v.message;
            this.loginForm.patchValue({
              password: ''
            });
            this.showError(this.message);
            this.isProcessing = false;
          }

        },
        error: (error: any) => {
          this.error = 'Impossible de valider vos identifiants. Veuillez réessayer.';
          this.isProcessing = false;
        },
        complete: () => {
        },
      })
    }
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

}
