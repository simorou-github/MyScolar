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

    // reset login status
    // this.authenticationService.logout();
    // get return url from route parameters or default to '/'
    // tslint:disable-next-line: no-string-literal
    //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }


  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  /**
   * Form submit
   */
  /*onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {
      if (environment.defaultauth === 'firebase') {
        this.authenticationService.login(this.f.username.value, this.f.password.value).then((res: any) => {
          this.router.navigate(['/dashboard']);
        })
          .catch(error => {
            this.error = error ? error : '';
          });
      } else {
        this.authFackservice.login(this.f.username.value, this.f.password.value)
          .pipe(first())
          .subscribe(
            data => {
              this.router.navigate(['/dashboard']);
            },
            error => {
              this.error = error ? error : '';
            });
      }
    }
  }*/

  onSubmit(): void {
    if (this.loginForm.invalid) {      
      this.showError("Veillez rafraichir la page et réessayer.");
    } else {
      this.isProcessing = true;
      this.authService.login(this.loginForm.value).subscribe({
        next: (v: any) => {
          if (v.status == 200) {
            this.message = v.message;
            this.showSuccess(this.message);
            this.tokenService.handleToken(v.access_token);
            this.authState.changeAuthStatus(true);  
            this.isProcessing = false;
            this.router.navigate(['dashboard']);          
            this.loginForm.reset();

          }else{
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
