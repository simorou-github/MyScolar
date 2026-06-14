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
  term: string = '';
  rolePermissions: any;
  permissions: any; isRoleForm: boolean = false;
  isEditing: boolean = false;
  currentRoleId: number | null = null;
  permissionsGrouped: { name: string; permissions: any[]; expanded: boolean }[] = [];

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
    this.isProcessing = true;
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
        this.isProcessing = false;
      },
      error: (e) => {
        console.log(e);
        this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
        this.showError(this.message);
        this.ngxLoader.stopLoader('loader-spin');
        this.isProcessing = false;
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
          this.buildGroups();
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

  // ── Groupement des permissions ───────────────────────────
  private buildGroups() {
    if (!this.permissions) return;
    const map = new Map<string, any[]>();
    for (const perm of this.permissions) {
      const words = (perm.label as string).trim().split(/\s+/);
      const last = words[words.length - 1];
      const key = last.charAt(0).toUpperCase() + last.slice(1);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(perm);
    }
    this.permissionsGrouped = Array.from(map.entries()).map(([name, perms]) => ({
      name,
      permissions: perms,
      expanded: true
    }));
  }

  trackByGroup(_: number, g: any) { return g.name; }
  trackByPerm(_: number, p: any) { return p.name; }

  toggleGroup(group: any) {
    group.expanded = !group.expanded;
  }

  getGroupSelectedCount(group: any): number {
    return group.permissions.filter((p: any) => this.permissionsTab.includes(p.name)).length;
  }

  isGroupFullySelected(group: any): boolean {
    return group.permissions.length > 0 &&
           group.permissions.every((p: any) => this.permissionsTab.includes(p.name));
  }

  toggleGroupPermissions(group: any) {
    if (this.isGroupFullySelected(group)) {
      this.permissionsTab = this.permissionsTab.filter(
        n => !group.permissions.some((p: any) => p.name === n)
      );
    } else {
      const toAdd = group.permissions
        .filter((p: any) => !this.permissionsTab.includes(p.name))
        .map((p: any) => p.name);
      this.permissionsTab = [...this.permissionsTab, ...toAdd];
    }
  }

  togglePermission(name: string) {
    if (this.permissionsTab.includes(name)) {
      this.permissionsTab = this.permissionsTab.filter(n => n !== name);
    } else {
      this.permissionsTab = [...this.permissionsTab, name];
    }
  }

  selectAll() {
    this.permissionsTab = this.permissions.map((p: any) => p.name);
  }

  deselectAll() {
    this.permissionsTab = [];
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
      this.permissionsTab = [...this.permissionsTab, perm];
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

  searchData(): void {
    if (this.term) {
      this.roles = this.roles.filter((role: any) =>
        role.label.toLowerCase().includes(this.term.toLowerCase())
      );
    } else {
      this.getRoles({});
    }
  }

}