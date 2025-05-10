import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SchoolService } from 'src/app/services/school.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-groupe-management',
  templateUrl: './groupe-management.component.html',
  styleUrls: ['./groupe-management.component.scss']
})
export class GroupeManagementComponent implements OnInit{

  breadCrumbItems: Array<{}>; groupes: any; isProcessing: boolean = false; searchForm!: FormGroup;

  p: number = 1; academicYear: string; schoolId: string; schoolName: string; isSearchForm: boolean = false;
  
  modalRef?: BsModalRef; groupeForm!: FormGroup; message: any; is_modified: boolean = false;

  constructor(private fb: FormBuilder, private ngxLoader: NgxUiLoaderService, private schoolService: SchoolService, private tokenService: TokenService,
    private modalService: BsModalService, private toastr: ToastrService) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = this.tokenService.getSchoolId;
    this.schoolName = this.tokenService.getSocialReasonSchool;
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'LISTE DES GROUPES' }, { label: 'Détails', active: true }];
    this.searchForm = this.fb.group({
      code: [''],
      status: ['']
    });
    
    this.groupeList();
 
    this.groupeForm = this.fb.group({
      id: [''],
      code: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(8)]],
      description: ['', [Validators.minLength(4), Validators.maxLength(50)]],
    });

  }

  // Fonction pour afficher ou cacher le formulaire de recherche avancée
  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
    if(status === false){
      this.searchForm.reset();
      this.groupeList();
    }
  }

  // Fonction pour afficher ou cacher le modal
  displayModalGroupe(modalGroupe: any) {
    this.modalRef = this.modalService.show(modalGroupe, { class: 'modal-md' });
  }

  // Fonction pour ajouter un groupe
  addGroupe() {
    this.isProcessing = true;
    this.schoolService.createGroupe({ groupe: this.groupeForm.value, school_id: this.schoolId }).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.showSuccess(this.message);
            this.groupeList();
            this.isProcessing = false;
            // Cacher le modal
            this.modalService.hide();
            // Réinitialiser le formulaire
            this.groupeForm.reset();
          } else {
            this.showError(this.message);
            this.isProcessing = false;
          }
        },

        error: (e) => {
          console.error(e);
          this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
          this.showError(this.message);
          this.isProcessing = false;
        },

        complete: () => {

        }
      }
    )

  }

  // Fonction de confirmation avant d'activer ou de désactiver un groupe
  confirm(groupe: any) {
    let testResponse = '';
    let new_status = !groupe?.status;
    if(!groupe?.status){
      testResponse = 'Voulez-vous activer ce groupe ?';
    }else{
      testResponse = 'Voulez-vous désactiver ce groupe ?';
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
        this.schoolService.changeGroupeStatus({status: new_status, id: groupe?.id}).subscribe(
          {
            next: (v: any) => {
              if (v.status == 200) {
                this.showSuccess(v.message);
                this.groupeList();
              } else {
                this.showError(v.message);
              }
            },

            error: (e) => {
              console.error(e);
            },

            complete: () => {

            }
          }
        )
      }
    });
  }

  // Fonction de récupération des groupes 
  groupeList() {
    this.ngxLoader.startLoader('loader-spin');
    this.schoolService.listGroupe({ school_id: this.schoolId, searchForm: this.searchForm.value }).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.groupes = v.data;
          this.message = v.message;
          this.ngxLoader.stopLoader('loader-spin');
        } else {
          this.showError(this.message);
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
    });
  }

  // Fonction pour fermer le modal
  closeModalGroupe() {
    this.modalService.hide();
    this.groupeForm.reset();
  }

  // Fonction pour modifier un groupe
  update(modalGroupe: any, groupe: any) {
    this.is_modified = true;
    this.modalRef = this.modalService.show(modalGroupe, { class: 'modal-md' });
    this.groupeForm.patchValue({
      id: groupe?.id,
      code: groupe?.code,
      description: groupe?.description
    });
  }

  closeModalDeleting(){
    this.modalService.hide();
  }

  /**
   * Static modal
   * @param DeleteModalGroupe modal content
   */

  ConfirmGroupeDelete(deleteModalGroupe: any, groupe: any) {
    this.modalRef = this.modalService.show(deleteModalGroupe, { class: 'modal-md' });
  }
  
  confirmDeletingGroupe(groupe: any) {
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
        this.ngxLoader.startLoader('loader-spin');
        this.schoolService.deleteGroupe({id: groupe?.id}).subscribe(
          {
            next: (v: any) => {
              if (v.status == 200) {
                this.showSuccess(v.message);
                this.groupeList();
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

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

  showInfo(msg: string) {
    this.toastr.info(msg, 'Information');
  }

}
