import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ManageRolePermissionService } from 'src/app/services/manage-role-permission.service';
import { ManageUserService } from 'src/app/services/manage-user.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-permission',
  templateUrl: './manage-permission.component.html',
  styleUrls: ['./manage-permission.component.scss']
})
export class ManagePermissionComponent {
  isProcessing: boolean; breadCrumbItems: Array<{}>; roles: any;  academicYear: string;  schoolId: string;
  message: any; roleForm!: FormGroup; roleSearchForm!: FormGroup; modalRef?: BsModalRef;
  isSearchForm: boolean;  p: number = 1; permissionsTab: any[] = [];
  rolePermissions: any;
  permissions: any; isRoleForm: boolean = false;

  constructor(private fb: FormBuilder, private manageRolePermission: ManageRolePermissionService, private tokenService: TokenService,
    private modalService: BsModalService, private toastr: ToastrService, private ngxLoader: NgxUiLoaderService) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = this.tokenService.getSchoolId;
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'ROLES ET PERMISSIONS' }, { label: 'Liste et Création', active: true }];
    this.getRoles({});
    this.getPermissions(); 
    this.roleForm = this.fb.group({
      id: [''],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
    });

    this.roleSearchForm = this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      type: [''],
      status: [''],
      guard_name: [''],
    });
  }

  getRoles(param: any) {
    this.ngxLoader.startLoader('loader-spin');
    this.manageRolePermission.roles(param).subscribe({
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

  getPermissions() {
    this.ngxLoader.startLoader('loader-spin');
    this.manageRolePermission.permissions({}).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.permissions = v.data;
          this.ngxLoader.stopLoader('loader-spin');
          this.message = v.message;
        } else {
          this.ngxLoader.stopLoader('loader-spin');
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

  getPermissionsOfRole(role_id) {
    this.ngxLoader.startLoader('loader-spin');
    this.manageRolePermission.getPermissionsOfRoles({ role_id: role_id }).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.rolePermissions = v.data;
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

  checkBox(event, perm) {
    if(event.target.checked){
      this.permissionsTab.push(perm);
    }

    if(!event.target.checked){
      this.permissionsTab.forEach((element, index) => {
        if(element === perm){
          this.permissionsTab.splice(index, 1);
        }
      });
    }

  }

  saveRoles() {
    this.ngxLoader.startLoader('loader-spin');
    console.log(this.roleForm.value);
    this.manageRolePermission.saveRole({role: this.roleForm.value, perms: this.permissionsTab}).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.rolePermissions = v.data;
          this.message = v.message;
          this.showSuccess(this.message)
          this.getRoles({});
          this.ngxLoader.stopLoader('loader-spin');
          this.isRoleForm = false;
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

  closeModalRole() {
    this.modalService.hide();
    this.roleForm.reset();
    this.isRoleForm = false;
  }  

  displayModalRole(modalRole: any) {
    this.isRoleForm = true;
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
  
  closeModalDeleting(){
    this.modalService.hide();
  }

  confirmDeletingUser(user: any) {
    let testResponse = '';
    testResponse = 'Voulez-vous supprimer ce groupe ?';  
    
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
        this.manageRolePermission.roles({id: user?.id}).subscribe(
          {
            next: (v: any) => {
              if (v.status == 200) {
                this.showSuccess(v.message);
                this.getRoles({});
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
}
