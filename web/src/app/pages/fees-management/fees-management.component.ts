import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ManageFeesService } from 'src/app/services/manage-fees.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { TokenService } from 'src/app/shared/authentication/token.service';

@Component({
    selector: 'app-fees-management',
    templateUrl: './fees-management.component.html',
    styleUrls: ['./fees-management.component.scss']
})
export class FeesManagementComponent {
    typeFees: any; modalRef?: BsModalRef; message: any; isProcessing: boolean = false;
    feesTypeForm!: FormGroup; breadCrumbItems: Array<{}>; projectData: any[] = [];
    page: any = 1; labelFormTitle: string; btnFormTitle: string; id: number; feesStatus: boolean;
    searchForm!: FormGroup; isSearchForm: boolean = false; p: number = 1; p2: number = 1;
    isAddAction: any;
    scName: string;
    feesDatails: any;
    curr_fees: any;

    constructor(private fb: FormBuilder, private parameterService: ParameterService, private manageFeesService: ManageFeesService, private ngxLoader: NgxUiLoaderService,
        private toastr: ToastrService, private modalService: BsModalService, private router: Router, private tokenService: TokenService) { }

    ngOnInit() {
        this.breadCrumbItems = [{ label: 'Espace Ecole' }, { label: 'Types Frais', active: true }];
        this.scName = this.tokenService.getSocialReasonSchool;
        this.searchForm = this.fb.group({
            label: ['',],
            school_id: [this.tokenService.getSchoolId, [Validators.required]],
        });

        this.feesTypeForm = this.fb.group({
            id: [],
            label: ['', [Validators.required]],
            school_id: [this.tokenService.getSchoolId, [Validators.required]],
            action: ['create'],
        });

        this.typeFeesList(this.feesTypeForm.value);

    }

    typeFeesList(param: any = this.feesTypeForm.value) {
        //this.isProcessing = true;
        this.ngxLoader.startLoader('loader-fees');
        this.feesTypeForm = this.fb.group({
            id: [],
            label: ['', [Validators.required]],
            school_id: [this.tokenService.getSchoolId, [Validators.required]],
            action: ['create'],
        });

        this.parameterService.listTypeFees(param).subscribe({
            next: (v: any) => {
                this.typeFees = v.data;
                //this.isProcessing = false;
                this.ngxLoader.stopLoader('loader-fees');

            }
        });
    }

    create() {
        this.isProcessing = true;
        this.parameterService.crudTypeFees(this.feesTypeForm.value).subscribe(
            {
                next: (v: any) => {
                    this.message = v.message;
                    if (v.status == 200) {
                        this.showSuccess(this.message);
                        this.isProcessing = false;
                        this.typeFeesList(this.searchForm.value);
                        this.closeModal();
                    } else {
                        this.isProcessing = false;
                        this.showError(this.message);
                    }
                    this.isProcessing = false;
                },
                error: (e) => {
                    console.error(e);
                    this.isProcessing = false;
                    this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
                    this.showError(this.message);
                },

                complete: () => {

                }
            }
        )

    }

    openCreateModal(feesTypeModal: any, modalTite = "Ajout de Frais", btnTitle = "Ajouter", data: any = {}) {
        this.btnFormTitle = btnTitle;
        this.labelFormTitle = modalTite;
        this.feesTypeForm.get('action').setValue('create');
        if (btnTitle == "Modifier") {
            this.feesTypeForm.get('id').patchValue(data.id);
            this.feesTypeForm.get('label').patchValue(data.label);
            this.feesTypeForm.get('school_id').patchValue(data.school_id);
            this.feesTypeForm.get('action').setValue('update');
        }
        this.modalRef = this.modalService.show(feesTypeModal, { class: 'modal-md' });
    }

    showSuccess(msg: string) {
        this.toastr.success(msg, 'Succès');
    }

    showError(msg: string) {
        this.toastr.error(msg, 'Erreur');
    }

    closeModal() {
        this.feesTypeForm.get('action').setValue('create');
        this.modalService.hide();
        this.feesTypeForm.get('label').setValue('');
    }

    magerFees(data: any) {
        this.router.navigate(['espace/assign-fees-to-classe', data.id]);
    }

    displayDetailsModal(StaticDetailModal: any, fees: any) {
        this.curr_fees = fees;
        this.getFeesDetailsData(fees);
        this.modalRef = this.modalService.show(StaticDetailModal, { class: 'modal-lg' });
    }


    getFeesDetailsData(param: any) {
        param = { 'school_id': param.school_id, 'type_fees_id': param.id };
        this.isProcessing = true;
        this.manageFeesService.getFeesDetailsData(param).subscribe({
            next: (v: any) => {
                this.feesDatails = v.school_fees;
                this.isProcessing = false;
            }
        });
    }


    displaySearchForm(status: boolean) {
        this.isSearchForm = status;
    }

    ConfirmDeleteModal(StaticDeleteModal: any, typfee: any) {
        this.id = typfee.id;
        this.feesStatus = typfee.status;
        this.modalRef = this.modalService.show(StaticDeleteModal);
    }

    closeModalDeleting() {
        this.modalService.hide();
    }

    crudTypeFees(action: any) {
        this.ngxLoader.startLoader('loader-fees');
        this.parameterService.crudTypeFees({ action: action, id: this.id }).subscribe(
            {
                next: (v: any) => {
                    if (v.status == 200) {
                        this.showSuccess(v.message);
                        this.modalService.hide();
                        this.ngxLoader.stopLoader('loader-fees');
                        this.typeFeesList(this.feesTypeForm.value);
                    } else {
                        this.ngxLoader.stopLoader('loader-fees');
                        this.showError(v.message);
                    }
                    this.ngxLoader.stopLoader('loader-fees');
                },

                error: (e) => {
                    console.error(e);
                    this.modalService.hide();
                    this.ngxLoader.stopLoader('loader-fees');
                },

                complete: () => {

                }
            }
        )
    }

}
