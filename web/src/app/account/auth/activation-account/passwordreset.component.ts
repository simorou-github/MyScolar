import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { PasswordValidator } from 'src/app/validators/password.validator';
import { AuthService } from 'src/app/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})

/**
 * Reset-password component
 */
export class PasswordresetComponent implements OnInit, AfterViewInit {

  activationAndResetForm!: FormGroup; email: string = ''; 
  isProcessing: boolean = false; message: string = ''; titleOfOperation: string = ''; btnLabel: string = '';

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: UntypedFormBuilder, private route: ActivatedRoute,
    private router: Router, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });

    this.activationAndResetForm = this.formBuilder.group({
      email: [this.email, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'),
      Validators.minLength(8)]],
      confirm_password: ['', [Validators.required]]
    },
      {
        validator: [PasswordValidator('password', 'confirm_password')]
      });
  }

  ngAfterViewInit() {
  }


  /**
   * On submit form
   */
  onSubmit() {
    this.isProcessing = true;

    this.authService.changePassword(this.activationAndResetForm.value).subscribe(
      {
        next: (v: any) => {
          if (v.status != 200) {
            this.isProcessing = false;
            this.message = v.message;
            this.showError(this.message);
            this.isProcessing = false;
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 500);
          } else {
            this.showSuccess(v.message);
            this.isProcessing = false;
            setTimeout(() => {
              this.router.navigate(['/auth/login']);
            }, 1000);
          }
        },

        error: (e) => {
          console.error(e);
        },

        complete: () => {
        }
      }
    );
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }
}
