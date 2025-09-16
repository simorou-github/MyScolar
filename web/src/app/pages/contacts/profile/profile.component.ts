import { Component, OnInit } from '@angular/core';

import { revenueBarChart, statData } from './data';

import { ChartType } from './profile.model';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { ManageUserService } from 'src/app/services/manage-user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PasswordValidator } from 'src/app/validators/password.validator';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

/**
 * Contacts-profile component
 */
export class ProfileComponent implements OnInit {
  // bread crumb items
  breadCrumbItems: Array<{}>; isProcessing: boolean = false;

  revenueBarChart: ChartType;
  statData: any; message: string = '';
  user: any; userForm!: FormGroup;
  passwordType1: string = 'password';
  passwordType2: string = 'password';
  constructor(private tokenService: TokenService, private userService: ManageUserService, private toastr: ToastrService,
    private fb: FormBuilder, private ngxLoader: NgxUiLoaderService, private manageUserService: ManageUserService,
  ) { }

  ngOnInit() {
    this.getUser();
    this.userForm = this.fb.group({
      id: [],
      last_name: [''],
      first_name: [''],
      email: [''],
      tel: [''],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'), Validators.minLength(8)]],
      password_confirmation: [''],
    },
      {
        validator: [PasswordValidator('password', 'password_confirmation'),],
      });
    this.breadCrumbItems = [{ label: 'Utilisateur' }, { label: 'Profil', active: true }];
  }

  editUser() {
    this.userForm.patchValue({
      id: this.user.id,
      first_name: this.user.first_name,
      last_name: this.user.last_name,
      email: this.user.email,
      tel: this.user.school?.tel,
    });
  }


  getUser(): void {
    this.userService.userList({ id: this.tokenService.getUserID }).subscribe(
      {
        next: (v: any) => {
          this.user = v.data[0];
        },
        error: (e) => {
          console.error(e);
        },
        complete: () => {
        }
      }
    );
  }

  togglePassword(): void {
    this.passwordType1 = this.passwordType1 === 'password' ? 'text' : 'password';
  }

  togglePasswordConfirmation(): void {
    this.passwordType2 = this.passwordType2 === 'password' ? 'text' : 'password';
  }


  updateUser() {
    this.ngxLoader.startLoader('loader-spin');
    this.manageUserService.updateUserProfile(this.userForm.value).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.message = v.message;
          this.showSuccess(this.message)
          this.getUser();
          this.userForm.reset();
          this.ngxLoader.stopLoader('loader-spin');
        } else {
          this.message = v.message;
          this.showError(this.message)
          this.ngxLoader.stopLoader('loader-spin')
        }
      },
      error: (e) => {
        console.log(e);
        this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
        this.showError(this.message);
        this.ngxLoader.stopLoader('loader-spin');
      },

      complete: () => {

      }
    });
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }
}
