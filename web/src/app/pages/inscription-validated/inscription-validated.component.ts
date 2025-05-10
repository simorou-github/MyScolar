import { Component, OnInit } from '@angular/core';
import { SchoolInscriptionService } from 'src/app/services/school-inscription.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup } from '@angular/forms';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { right } from '@popperjs/core';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-inscription-validated',
  templateUrl: './inscription-validated.component.html',
  styleUrls: ['./inscription-validated.component.scss']
})
export class InscriptionValidatedComponent implements OnInit {
  breadCrumbItems: Array<{}>; message: any; inscriptionsValidated: any; isProcessing: boolean = false; p: number = 1;
  academicYear: string; schoolId: string; schoolName: string; isSearchForm: boolean = false; searchForm!: FormGroup;
  countries: any;

  constructor(private fb: FormBuilder, private ngxLoader: NgxUiLoaderService, public toastr: ToastrService, private school_inscription_service: SchoolInscriptionService,
    private tokenService: TokenService, private inscriptionService: SchoolInscriptionService) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = this.tokenService.getSchoolId;
    this.schoolName = this.tokenService.getSocialReasonSchool;
  }

  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Inscriptions validées' }, { label: 'Liste', active: true }];
    this.searchForm = this.fb.group({
      social_reason: [''],
      country_id: [''],
      owner: [''],
      tel: [''],
      status: [''],
    });
    this.getListInscriptionValidated();

    this.listCountries();
  }

  // Get countries list
  listCountries() {
    this.school_inscription_service.countries().subscribe(
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

  confirm(school_id: number, status: string) {
    let testResponse = '';
    if (status === 'INACTIF') {
      testResponse = 'Voulez-vous désactiver cette inscription !';
    }
    if (status === 'VALIDE') {
      testResponse = 'Voulez-vous activer cette inscription !';
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
        this.inscriptionService.changeStatusOfInscription({ 'id': school_id, 'status': status }).subscribe(
          {
            next: (v: any) => {
              if (v.status == 200) {
                this.showSuccess(v.message);
                this.ngxLoader.stopLoader('loader-spin');
                this.getListInscriptionValidated();
              } else {
                this.showError(v.message);
                this.ngxLoader.stopLoader('loader-spin');
              }
              this.isProcessing = false;
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


  getListInscriptionValidated() {
    this.ngxLoader.startLoader('loader-spin');
    this.inscriptionService.listInscriptionsValidated(this.searchForm.value).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.inscriptionsValidated = v.data;
            this.ngxLoader.stopLoader('loader-spin');
          } else {
            this.ngxLoader.stopLoader('loader-spin');
          }
        },

        error: (e) => {
          console.error(e);
          this.message = 'Une erreur interne est survenue. Veuillez contacter le Service Support de ScolarPlus.';
        },

        complete: () => {

        }
      }
    )
  }

  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
    if (!status) {
      this.searchForm.reset();
    }
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
            widths: [30, '*', '*', '*', '*', '*','*'],
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
              ...this.inscriptionsValidated.map((inscription, index) => {
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
