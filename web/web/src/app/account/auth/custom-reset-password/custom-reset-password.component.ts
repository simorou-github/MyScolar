import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-custom-reset-password',
  templateUrl: './custom-reset-password.component.html',
  styleUrls: ['./custom-reset-password.component.scss']
})
export class CustomResetPasswordComponent {

  resetPasswordForm!: FormGroup; email: string = ''; isProcessing: boolean = false; message: string = '';
  submitted:any = false;
  error:any = '';
  success:any = '';
  loading:any = false;

  // set the currenr year
  year: number = new Date().getFullYear();

  // tslint:disable-next-line: max-line-length
  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, 
    private router: Router, private authService: AuthService, private toastr: ToastrService) { }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
    })
  }


  /**
   * On submit form
   */
  onSubmit() {
    this.isProcessing = true;
    console.log(this.resetPasswordForm.value);
    this.authService.passwordReset(this.resetPasswordForm.value).subscribe(
      {
        next: (v: any) => {
          if (v.status != 200) {
            this.isProcessing = false;
            this.message = v.message;
            this.showError(this.message);
            this.isProcessing = false;
          } else {
            this.showSuccess(v.message);  
            this.resetPasswordForm.reset();
            this.isProcessing = false;            
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
