import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParentAdminService } from 'src/app/services/parent-admin.service';

@Component({
  selector: 'app-parent-link-requests',
  templateUrl: './parent-link-requests.component.html',
  styleUrls: ['./parent-link-requests.component.scss']
})
export class ParentLinkRequestsComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  pendingLinks: any[] = [];
  currentPage = 1;
  processingId: any = null;
  rejectForm!: FormGroup;
  modalRef?: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private modalService: BsModalService,
    private parentAdminService: ParentAdminService,
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Espace École' }, { label: "Demandes d'association Parents", active: true }];
    this.rejectForm = this.fb.group({
      id: ['', [Validators.required]],
      reject_reason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(700)]],
    });
    this.loadList();
  }

  loadList() {
    this.ngxLoader.startLoader('loader-spin');
    this.parentAdminService.listPendingLinksForSchool().subscribe({
      next: (v: any) => {
        this.pendingLinks = v.data;
        this.ngxLoader.stopLoader('loader-spin');
      },
      error: () => this.ngxLoader.stopLoader('loader-spin')
    });
  }

  validate(link: any) {
    Swal.fire({
      title: 'Confirmation !',
      text: `Valider l'association entre ${link.parent_user?.first_name} ${link.parent_user?.last_name} et ${link.student?.first_name} ${link.student?.last_name} ?`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, valider'
    }).then(result => {
      if (result.value) {
        this.processingId = link.id;
        this.parentAdminService.validateLink({ id: link.id, status: 'VALIDE' }).subscribe({
          next: (v: any) => {
            this.processingId = null;
            this.toastr.success(v.message, 'Succès');
            this.loadList();
          },
          error: (e) => {
            this.processingId = null;
            this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
          }
        });
      }
    });
  }

  openRejectModal(link: any, content: any) {
    this.rejectForm.patchValue({ id: link.id, reject_reason: '' });
    this.modalRef = this.modalService.show(content);
  }

  reject() {
    if (this.rejectForm.invalid) { return; }
    this.processingId = this.rejectForm.value.id;
    this.parentAdminService.validateLink({ ...this.rejectForm.value, status: 'REJETE' }).subscribe({
      next: (v: any) => {
        this.processingId = null;
        this.modalService.hide();
        this.toastr.success(v.message, 'Succès');
        this.loadList();
      },
      error: (e) => {
        this.processingId = null;
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }
}
