import { Component, OnInit } from '@angular/core';

import { revenueBarChart, statData } from './data';

import { ChartType } from './profile.model';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { ManageUserService } from 'src/app/services/manage-user.service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormGroup } from '@angular/forms';

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
  breadCrumbItems: Array<{}>;

  revenueBarChart: ChartType;
  statData:any;
  user: any; userForm!: FormGroup;
  constructor(private tokenService: TokenService, private userService: ManageUserService, private toastr: ToastrService,
    private fb: FormBuilder,
  ) {  }

  ngOnInit() {
    this.getUser();
    this.userForm = this.fb.group({
      id: [],
      last_name: [''],
      first_name: [''],
      email: [''],
      tel: [''],
    });
    this.breadCrumbItems = [{ label: 'Utilisateur' }, { label: 'Profile', active: true }];
  }

  editUser(){
    console.log(this.userForm.value);
    this.userForm.setValue({
      id: this.user.id,
      first_name: this.user.first_name,
      last_naeme: this.user.last_naeme,
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

  
  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }
}
