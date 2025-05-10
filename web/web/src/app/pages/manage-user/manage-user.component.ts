import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ManageRolePermissionService } from 'src/app/services/manage-role-permission.service';
import { ManageUserService } from 'src/app/services/manage-user.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent implements OnInit {
  isProcessing: boolean; breadCrumbItems: Array<{}>; users: any; academicYear: string; schoolId: string;
  message: any; userForm!: FormGroup; userSearchForm!: FormGroup; modalRef?: BsModalRef;
  isSearchForm: boolean; p: number = 1; btnFormTitle: string; rolesTab: any[] = [];
  roles: any; isUserForm: boolean = false;

  constructor(private fb: FormBuilder, private manageUserService: ManageUserService, private tokenService: TokenService,
    private modalService: BsModalService, private toastr: ToastrService, private ngxLoader: NgxUiLoaderService,
    private manageRolePermission: ManageRolePermissionService,) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = this.tokenService.getSchoolId;
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'GESTION DES UTILISATEURS' }, { label: 'Liste', active: true }];
    this.userList();
    this.getRoles();
    this.userForm = this.fb.group({
      id: [''],
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      last_name: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      status: [0],
    });

    this.userSearchForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      last_name: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      school_id: [''],
    });
  }


  getRoles() {
    this.ngxLoader.startLoader('loader-spin');
    this.manageRolePermission.roles({}).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.roles = v.data;
          this.message = v.message;
          this.ngxLoader.stopLoader('loader-spin');
        } else {
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

  userList() {
    this.ngxLoader.startLoader('loader-spin');
    this.manageUserService.userList({ }).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.users = v.data;
          console.log(this.users)
          this.message = v.message;
          this.ngxLoader.stopLoader('loader-spin');
          this.isUserForm = false;
        } else {
          this.ngxLoader.stopLoader('loader-spin')
          this.isUserForm = true;
        }
      },
      error: (e) => {
        console.error(e);
        this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
        this.showError(this.message);
        this.ngxLoader.stopLoader('loader-spin');
      },

      complete: () => {

      }
    });
  }

  checkBox(event, role) {
    if (event.target.checked) {
      this.rolesTab.push(role);
    }

    if (!event.target.checked) {
      this.rolesTab.forEach((element, index) => {
        if (element === role) {
          this.rolesTab.splice(index, 1);
        }
      });
    }
  }

  addUserByAdmin() {
    this.ngxLoader.startLoader('loader-spin');
    this.manageUserService.addUserByAdmin({ user: this.userForm.value, roles: this.rolesTab }).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.message = v.message;
          this.showSuccess(this.message)
          this.userList();
          this.ngxLoader.stopLoader('loader-spin');
          this.isUserForm = false;
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

  closeModalUser() {
    this.modalService.hide();
    this.userForm.reset();
    this.isUserForm = false;
  }

  displayModalUser(modalUser: any) {
    this.isUserForm = true;
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

  showInfo(msg: string) {
    this.toastr.info(msg, 'Information');
  }

  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
  }

  closeModalDeleting() {
    this.modalService.hide();
  }

  confirmDeletingUser(user: any) {
    let testResponse = '';
    testResponse = 'Voulez-vous supprimer cet utilisateur ?';

    Swal.fire({
      title: 'Confirmation !',
      text: `${testResponse}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui'
    }).then(result => {
      if (result.value) {
        this.isProcessing = true;
        this.manageUserService.userList({ id: user?.id }).subscribe(
          {
            next: (v: any) => {
              if (v.status == 200) {
                this.showSuccess(v.message);
                this.userList();
              } else {
                this.showError(v.message);
                this.isProcessing = false;
              }
            },

            error: (e) => {
              console.error(e);
              this.isProcessing = false;
            },

            complete: () => {

            }
          }
        )
      }
    });
  }

  confirm(user) {
    console.log(user)
    let testResponse = '';
    if (user.status) {
      testResponse = 'Voulez-vous désactiver l\'utilisateur ' + user.last_name + ' ' + user.first_name + ' ?';
    }
    if (!user.status) {
      testResponse = 'Voulez-vous activier l\'utilisateur ' + user.last_name + ' ' + user.first_name + ' ?';
    }

    Swal.fire({
      title: 'Confirmation !',
      text: `${testResponse}`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui'
    }).then(result => {
      if (result.value) {
        this.ngxLoader.startLoader('loader-spin');
        this.manageUserService.changeStatusOfUser({ 'id_user': user.id }).subscribe(
          {
            next: (v: any) => {
              if (v.status == 200) {
                this.showSuccess(v.message);
                this.userList();
              } else {
                this.showError(v.message);
                this.ngxLoader.stopLoader('loader-spin');
              }
            },

            error: (e) => {
              console.error(e);
              this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
              this.showError(this.message);
              this.ngxLoader.stopLoader('loader-spin');
            },

            complete: () => {

            }
          }
        )
      }
    });
  }


}
