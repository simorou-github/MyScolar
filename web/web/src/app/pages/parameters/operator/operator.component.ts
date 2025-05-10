import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParameterService } from 'src/app/services/parameter.service';
import { SchoolInscriptionService } from 'src/app/services/school-inscription.service';

@Component({
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss']
})

export class OperatorComponent implements OnInit {
  countries: any; breadCrumbItems: Array<{}>; operators: any; isProcessing: boolean = false; distinctClasses: any; classe_id!: string;

  p: number = 1; schoolClasses: any; operatorForm!: FormGroup; modalRef?: BsModalRef; searchForm!: FormGroup;
  message: any; labelFormTitle: string; btnFormTitle: string; operatorId: any;
  operatorName: any; isSearchForm: boolean = false;

  constructor(private fb: FormBuilder, private schoolInscriptionService: SchoolInscriptionService, private ngxLoader: NgxUiLoaderService, 
    private parameterService: ParameterService, private toastr: ToastrService, private modalService: BsModalService){
  
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Paramètre' }, { label: 'Operateurs', active: true }];
    this.operatorForm = this.fb.group({
      id: [],
      country_id: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
    });
    this.searchForm = this.fb.group({
      name: [''],
      country_id: [''],
      status: [''],
    });
    this.listCountries();
    this.getAllOperators();
  }

  // Fonction pour afficher ou cacher le formulaire de recherche avancée
  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
    if(status === false){
      this.searchForm.reset();
      this.getAllOperators();
    }
  }

  // Get countries list
  listCountries() {
    this.schoolInscriptionService.countries().subscribe(
      {
        next: (v: any) => {
          this.countries = v.data;
        },

        error: (e) => {
          console.error(e);
        },

        complete: () => {
        }
      }

    );
  }

  

  create() {
    this.isProcessing = true;
    this.parameterService.createOperator(this.operatorForm.value).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.modalService.hide();
            this.showSuccess(this.message);
            this.operatorForm.reset();
            this.getAllOperators();
            this.isProcessing = false;
            
          } else {
            this.showError(this.message);
            this.isProcessing = false;
          }
        },

        error: (e) => {
          console.error(e);
          this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
          this.showError(this.message);
        },

        complete: () => {

        }
      }
    )

  }

  /**
  * Open modal
  * @param modelOperator modal content
  */
  openViewModal(modelOperator: any) {
    this.labelFormTitle = 'Ajout d\'un opérateur';
    this.btnFormTitle = 'Ajouter';
    this.modalRef = this.modalService.show(modelOperator, { class: 'modal-md' });
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

  getAllOperators() {
    this.ngxLoader.startLoader('loader-spin');
    this.parameterService.listOperator(this.searchForm.value).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.operators = v.data;
          this.message = v.message;
          this.ngxLoader.stopLoader('loader-spin');
        } else {
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

  update(modelOperator: any, operator: any) {
    this.labelFormTitle = 'Modification d\'un opérateur';
    this.btnFormTitle = 'Modifier';
    this.modalRef = this.modalService.show(modelOperator, { class: 'modal-md' });
    this.operatorForm.patchValue({
      id: operator?.id,
      country_id: operator?.country_id,
      name: operator?.name
    });
  }


  delete() {
    this.parameterService.deleteOperator({ 'id': this.classe_id }).subscribe(
      {
        next: (v: any) => {
          if (v.status == 200) {
            this.showSuccess(v.message);            
            this.getAllOperators();
            this.modalService.hide();
          } else {
            this.showError(v.message);
            this.modalService.hide();
          }
        },

        error: (e) => {
          console.error(e);
          this.modalService.hide();
        },

        complete: () => {

        }
      }
    )
  }

  ConfirmDeleteModal(StaticDeleteModal: any, operator: any) {
    this.operatorId = operator?.id;
    this.operatorName = operator?.name;
    this.modalRef = this.modalService.show(StaticDeleteModal);
  }

  closeModal() {
    this.modalService.hide();
    this.operatorForm.reset();
  }

  closeModalDeleting(){
    this.modalService.hide();
  }

}
