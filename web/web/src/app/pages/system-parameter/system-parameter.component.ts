import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParameterService } from 'src/app/services/parameter.service';

@Component({
  selector: 'app-system-parameter',
  templateUrl: './system-parameter.component.html',
  styleUrls: ['./system-parameter.component.scss']
})
export class SystemParameterComponent implements OnInit {

  countries: any; breadCrumbItems: Array<{}>; params: any; isProcessing: boolean = false; distinctClasses: any;

  p: number = 1; schoolClasses: any; paramsForm!: FormGroup; modalRef?: BsModalRef; searchForm!: FormGroup;
  message: any; labelFormTitle: string; btnFormTitle: string; operatorId: any;
  operatorName: any; isSearchForm: boolean = false;

  constructor(private fb: FormBuilder, private ngxLoader: NgxUiLoaderService, private parameterService: ParameterService, private toastr: ToastrService, private modalService: BsModalService){
  
  }
  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Paramètre' }, { label: 'Système', active: true }];
    this.paramsForm = this.fb.group({
      id: [],
      label: ['', [Validators.required, Validators.maxLength(80)]],
      value: ['', [Validators.required, Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.maxLength(180)]],
      action: ['create', [Validators.required]],
    });
    this.searchForm = this.fb.group({
      label: ['', [Validators.required, Validators.maxLength(80)]],
      value: ['', [Validators.required, Validators.maxLength(60)]],
      description: ['', [Validators.required, Validators.maxLength(180)]],
    });
    this.paramsList(this.searchForm.value);
  }

  // Get countries list
  paramsList(param: any) {
    this.ngxLoader.startLoader('loader-spin');
    this.parameterService.paramsList(param).subscribe(
      {
        next: (v: any) => {
          this.params = v.data;
          this.ngxLoader.stopLoader('loader-spin');
        },
        error: (e) => {
          console.error(e);
          this.ngxLoader.stopLoader('loader-spin');
        }
      }

    );
  }

  

  create() {
    this.isProcessing = true;
    this.parameterService.crudParam(this.paramsForm.value).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.showSuccess(this.message);
            this.paramsForm.reset();
            this.paramsList(this.searchForm.value);
            this.modalService.hide();
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
  * @param paramsModal modal content
  */
  openViewModal(paramsModal: any) {
    this.labelFormTitle = 'Ajout d\'un opérateur';
    this.btnFormTitle = 'Ajouter';
    this.modalRef = this.modalService.show(paramsModal, { class: 'modal-md' });
    
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

  getAllOperators() {
    this.isProcessing = true;
    this.parameterService.listOperator(this.searchForm.value).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.params = v.data;
          this.message = v.message;
          this.isProcessing = false;
        } else {
          this.isProcessing = false
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
    });
  }

  update(paramsModal: any, param: any) {
    this.labelFormTitle = 'Modification d\'un paramètre';
    this.btnFormTitle = 'Modifier';
    this.modalRef = this.modalService.show(paramsModal, { class: 'modal-md' });
    this.paramsForm.patchValue({
      id: param?.id,
      label: param?.label,
      value: param?.value,
      description: param?.description,
      action: 'update'
    });
  }


  delete() {
    this.paramsForm.patchValue({
      action: 'delete'
    });
    this.parameterService.deleteOperator(this.paramsForm.value).subscribe(
      {
        next: (v: any) => {
          if (v.status == 200) {
            this.showSuccess(v.message);            
            this.paramsList(this.searchForm.value);
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
    this.paramsForm.reset();
  }

  closeModalDeleting(){
    this.modalService.hide();
  }

}
