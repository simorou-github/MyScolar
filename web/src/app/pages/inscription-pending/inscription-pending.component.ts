import { Component, OnInit } from '@angular/core';
import { SchoolInscriptionService } from 'src/app/services/school-inscription.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { right } from '@popperjs/core';
import { environment } from 'src/environments/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import * as $ from "jquery";
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-inscription-pending',
  templateUrl: './inscription-pending.component.html',
  styleUrls: ['./inscription-pending.component.scss']
})
export class InscriptionPendingComponent implements OnInit{
  breadCrumbItems: Array<{}>; message: any; searchForm!: FormGroup; rejectForm!: FormGroup; inscriptionsPending: any; isProcessing: boolean = false; p: number = 1;
  academicYear: string; schoolId: string; schoolName: string; isSearchForm: boolean = false; modalRef?: BsModalRef; rejectModalRef?: BsModalRef; fileUrl: any; currentSchoolName: string = "";
  
  constructor(private fb: FormBuilder, private ngxLoader: NgxUiLoaderService, public toastr: ToastrService, private router: Router, private inscriptionService: SchoolInscriptionService,
    private modalService: BsModalService) {
    //this.academicYear = this.tokenService.getAcademicYear;
    // this.schoolId = this.tokenService.getSchoolId;
    // this.schoolName = this.tokenService.getSocialReasonSchool;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Inscriptions en attente' }, { label: 'Liste', active: true }];
    this.searchForm = this.fb.group({
      social_reason: [''],
      country_id: [''],
      owner: [''],
      tel: [''],
      status: [''],
    });
    this.getListInscriptionPending();
    this.rejectForm = this.fb.group({
      school_id: ['', [Validators.required]],
      reject_reason: ['', [Validators.required, Validators.minLength(15), Validators.maxLength(700)]]
    });
   
  }

  /**
   * Open view modal
   * @param viewFileModal modal data
   */
  fileApercu(viewFileModal: any, school: any) {
    this.currentSchoolName = school?.social_reason;
    this.fileUrl = environment.apiUrl + '/school/get-file-path/' + school?.id;
    $('#pdfFrame').attr('src', this.fileUrl);
    this.modalRef = this.modalService.show(viewFileModal, { class: 'modal-lg' });
  }


  confirm(id: any, status: string) {
    let testResponse = '';
    let school_id: string = '';
    let reject_reason: string = '';
    if(status === 'VALIDE'){
      testResponse = 'Voulez-vous valider cette inscription ?';
      school_id = id;
    }
    if(status === 'REJETE'){
      testResponse = 'Voulez-vous rejeter cette inscription !';
      school_id = this.rejectForm.get('school_id').value;
      reject_reason = this.rejectForm.get('reject_reason').value;
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
        this.inscriptionService.changeStatusOfInscription({ 'id': school_id, 'status': status, 'reject_reason': reject_reason }).subscribe(
          {
            next: (v: any) => {
              if (v.status == 200) {
                this.ngxLoader.stopLoader('loader-spin');
                this.showSuccess(v.message);
                this.isProcessing = false;
                if(status === 'REJETE'){
                  this.rejectModalRef.hide();
                }
                this.getListInscriptionPending();
              } else {
                this.isProcessing = false;
                this.ngxLoader.stopLoader('loader-spin');
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

  /**
   * Open view modal
   * @param rejectInscriptionModal modal data
   */
  rejectInscription(rejectInscriptionModal: any, school: any) {
    this.currentSchoolName = school?.social_reason;
    this.rejectForm.patchValue({school_id: school?.id});
    this.rejectModalRef = this.modalService.show(rejectInscriptionModal, { class: 'modal-md' });
  }

  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
    if (!status) {
      this.searchForm.reset();
    }
  }

  getListInscriptionPending() {
    this.ngxLoader.startLoader('loader-spin');
    this.inscriptionService.listInscriptionsPending(this.searchForm.value).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.inscriptionsPending = v.data;
            this.ngxLoader.stopLoader('loader-spin');
          } else {
            this.ngxLoader.stopLoader('loader-spin');
          }
        },

        error: (e) => {
          console.error(e);
          this.message = 'Une erreur interne est survenue. Veuillez contacter le Service Support de ScolarPlus.';
          this.ngxLoader.stopLoader('loader-spin');
        },

        complete: () => {

        }
      }
    )
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

  generatePDF() {
    const documentDefinition = this.getDocumentDefinition();
    pdfMake.createPdf(documentDefinition).open();
  }

  getRightDate(nb: number) {
    return (nb < 10) ? '0' + nb : nb;
  }


  getDocumentDefinition() {
    let d = new Date();

    return {
      pageOrientation: 'landscape',
      footer: function (currentPage, pageCount) {
        return [{ text: currentPage.toString() + ' sur ' + pageCount, alignment: right, margin: [0, 0, 20, 0] },
        ];
      },
      content: [
        {
          image: environment.imgBase64,
          width: 50,
          height: 50,
        },

        { text: "LISTE DES INSCRIPTION VALIDEES AU " + this.getRightDate(d.getDate()) + '/' + this.getRightDate((d.getMonth() + 1)) + '/' + d.getFullYear(), style: "header2", alignment: 'center' },
        {
          table: {
            widths: [30, '*', '*', '*', '*', '*', '*'],
            heights: 25,

            body: [
              [{
                text: 'N°',
                style: 'tableHeader'
              },
              {
                text: 'Raison sociale',
                style: 'tableHeader'
              },
              {
                text: 'Pays',
                style: 'tableHeader'
              },
              {
                text: 'Propriétaire',
                style: 'tableHeader'
              },
              {
                text: 'Téléphone',
                style: 'tableHeader'
              },
              {
                text: 'Ifu',
                style: 'tableHeader'
              },
              {
                text: 'Statut',
                style: 'tableHeader'
              },
              ],
              ...this.inscriptionsPending.map((inscription, index) => {
                return [index + 1, inscription['social_reason'],
                inscription['country']?.name, inscription['owner'], inscription['tel'],
                inscription['ifu'] == null ? "-" : inscription['ifu'], inscription['status']];
              })
            ],

          },
        }
      ],
      styles: {
        header: {
          fontSize: 22,
          bold: true,
          margin: [0, 0, 0, 10],
          float: 'right'
        },

        header2: {
          fontSize: 16,
          bold: true,
          margin: [0, 0, 0, 10],
          float: 'right'
        },

        tableHeader: {
          bold: true,
          fontSize: 13,
          fillColor: '#E5E8E8'
        },

        tableInfos: {
          margin: [50, 10, 0, 10]
        },

        infoHeader: {
          bold: true,
        }
      }
    };
  }



}
