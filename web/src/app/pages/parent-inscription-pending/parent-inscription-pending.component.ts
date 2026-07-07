import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParentAdminService } from 'src/app/services/parent-admin.service';

@Component({
  selector: 'app-parent-inscription-pending',
  templateUrl: './parent-inscription-pending.component.html',
  styleUrls: ['./parent-inscription-pending.component.scss']
})
export class ParentInscriptionPendingComponent implements OnInit {

  breadCrumbItems: Array<{}>;
  inscriptionsPending: any[] = [];
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
    this.breadCrumbItems = [{ label: 'Espace Parent' }, { label: 'Inscriptions en attente', active: true }];
    this.rejectForm = this.fb.group({
      id: ['', [Validators.required]],
      reject_reason: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(700)]],
    });
    this.loadList();
  }

  loadList() {
    this.ngxLoader.startLoader('loader-spin');
    this.parentAdminService.listInscriptionsPending().subscribe({
      next: (v: any) => {
        this.inscriptionsPending = v.data;
        this.ngxLoader.stopLoader('loader-spin');
      },
      error: () => this.ngxLoader.stopLoader('loader-spin')
    });
  }

  validate(parent: any) {
    Swal.fire({
      title: 'Confirmation !',
      text: `Valider l'inscription de ${parent.first_name} ${parent.last_name} ? Un email avec un lien d'activation lui sera envoyé.`,
      icon: 'warning',
      showCancelButton: true,
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#34c38f',
      cancelButtonColor: '#f46a6a',
      confirmButtonText: 'Oui, valider'
    }).then(result => {
      if (result.value) {
        this.processingId = parent.id;
        this.parentAdminService.changeInscriptionStatus({ id: parent.id, status: 'VALIDE' }).subscribe({
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

  openRejectModal(parent: any, content: any) {
    this.rejectForm.patchValue({ id: parent.id, reject_reason: '' });
    this.modalRef = this.modalService.show(content);
  }

  reject() {
    if (this.rejectForm.invalid) { return; }
    this.processingId = this.rejectForm.value.id;
    this.parentAdminService.changeInscriptionStatus(this.rejectForm.value).subscribe({
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
