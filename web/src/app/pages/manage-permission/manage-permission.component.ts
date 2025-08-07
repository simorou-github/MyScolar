import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ManageRolePermissionService } from 'src/app/services/manage-role-permission.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-manage-permission',
  templateUrl: './manage-permission.component.html',
  styleUrls: ['./manage-permission.component.scss']
})
export class ManagePermissionComponent {
  isProcessing: boolean; breadCrumbItems: Array<{}>; roles: any; academicYear: string; schoolId: string;
  message: any; roleForm!: FormGroup; roleSearchForm!: FormGroup; modalRef?: BsModalRef;
  isSearchForm: boolean; p: number = 1; permissionsTab: any[] = [];
  rolePermissions: any;
  permissions: any; isRoleForm: boolean = false;
  isEditing: boolean = false; // Nouvelle variable pour gérer l'état d'édition
  currentRoleId: number | null = null; // Nouvelle variable pour stocker l'ID du rôle en cours d'édition

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
      label: ['', [Validators.required]],
    });

    this.roleSearchForm = this.fb.group({
      id: [''],
      label: [''],
    });
  }

  getRoles(param: any) {
    this.ngxLoader.startLoader('loader-spin');
    this.manageRolePermission.getRoles().subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.roles = v.data;
          this.message = v.message;
          this.ngxLoader.stopLoader('loader-spin');
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

  getPermissions() {
    this.ngxLoader.startLoader('loader-spin');
    this.manageRolePermission.getPermissions().subscribe({
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


  editRole(role: any) {
    this.isRoleForm = true;
    this.isEditing = true;
    this.currentRoleId = role.id;
    this.permissionsTab = role.permissions.map((p: any) => p.name); // Récupère les noms des permissions
    this.roleForm.patchValue({
      id: role.id,
      label: role.label,
    });
  }

  checkBox(event: any, perm: any) {
    if (event.target.checked) {
      this.permissionsTab.push(perm);
    } else {
      this.permissionsTab = this.permissionsTab.filter(element => element !== perm);
    }
  }

  saveRoles() {
    this.ngxLoader.startLoader('loader-spin');
    const roleData = {
      label: this.roleForm.get('label')?.value,
      permissions: this.permissionsTab,
    };

    if (this.isEditing) {
      this.manageRolePermission.updateRole(this.currentRoleId, roleData).subscribe({
        next: (v: any) => {
          if (v.status === 200) {
            this.message = 'Rôle mis à jour avec succès.';
            this.showSuccess(this.message);
            this.getRoles({});
            this.ngxLoader.stopLoader('loader-spin');
            this.closeModalRole();
          } else {
            this.message = 'Une erreur est survenue lors de la mise à jour.';
            this.showError(this.message);
            this.ngxLoader.stopLoader('loader-spin');
          }
        },
        error: (e) => {
          console.log(e);
          this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
          this.showError(this.message);
          this.ngxLoader.stopLoader('loader-spin');
        },
        complete: () => { }
      });
    } else {
      this.manageRolePermission.createRole(roleData).subscribe({
        next: (v: any) => {
          if (v.status == 200) {
            this.message = 'Rôle créé avec succès.';
            this.showSuccess(this.message);
            this.getRoles({});
            this.ngxLoader.stopLoader('loader-spin');
            this.closeModalRole();
          } else {
            this.message = 'Une erreur est survenue lors de la création.';
            this.showError(this.message);
            this.ngxLoader.stopLoader('loader-spin');
          }
        },
        error: (e) => {
          console.log(e);
          this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
          this.showError(this.message);
          this.ngxLoader.stopLoader('loader-spin');
        },
        complete: () => { }
      });
    }
  }

  closeModalRole() {
    this.modalService.hide();
    this.roleForm.reset();
    this.isRoleForm = false;
    this.isEditing = false;
    this.permissionsTab = [];
    this.currentRoleId = null;
  }

  displayModalRole() {
    this.isRoleForm = true;
    this.isEditing = false;
    this.permissionsTab = [];
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

  confirmDeletingRole(role: any) {
    let testResponse = '';
    testResponse = 'Voulez-vous supprimer ce rôle ?';

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
        this.manageRolePermission.deleteRole(role.id).subscribe({
          next: (v: any) => {
            if (v.status === 200) {
              this.showSuccess(v.message);
              this.getRoles({}); 
            } else {
              this.message = v.message || 'Une erreur est survenue lors de la suppression.';
              this.showError(this.message);
            }
          },
          error: (e) => {
            console.error(e);
            this.message = 'Une erreur interne est survenue. Veuillez contacter le support.';
            this.showError(this.message);
          },
          complete: () => {
            this.isProcessing = false;
            this.ngxLoader.stopLoader('loader-spin');
          }
        });
      }
    });
  }

  isPermissionChecked(permissionName: string): boolean {
    return this.permissionsTab.includes(permissionName);
  }
}