import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { SchoolService } from 'src/app/services/school.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { right } from '@popperjs/core';
import { environment } from 'src/environments/environment';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-student-list-by-classe',
  templateUrl: './student-list-by-classe.component.html',
  styleUrls: ['./student-list-by-classe.component.scss']
})
export class StudentListByClasseComponent implements OnInit{

  isProcessing: boolean = false; breadCrumbItems: Array<{}>; classeId: string = ''; searchForm!: FormGroup;
  students: any; p: number = 1; isSearchForm: boolean = false; modalRef?: BsModalRef;
  academicYear: string; schoolId!: string; schoolName: string; message: string = '';
  curr_student: any; classe: string = '';

  constructor(private fb: FormBuilder, private tokenService: TokenService,  private ngxLoader: NgxUiLoaderService, private route: ActivatedRoute, private modalService: BsModalService, private toastr: ToastrService,
    private router: Router, private schoolService: SchoolService) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = this.tokenService.getSchoolId;
    this.schoolName = this.tokenService.getSocialReasonSchool;
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'ESPACE ECOLE' }, { label: 'Apprenants', active: true }];
    this.classeId = this.route.snapshot.params['id'];
    this.searchForm = this.fb.group({
      code_scolar: [''],
      last_name: [''],
      first_name: [''],
      classe_id: [''],
      sex: [''],
      birthday: [''],
    });
    this.getListStudents();
  }

  getListStudents() {
    this.ngxLoader.startLoader('loader-spin');
    this.schoolService.listStudents({'school_id': this.schoolId,  'academic_year': this.academicYear, 'classe_id': this.classeId, search_form: this.searchForm.value}).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.students = v.data;
            this.classe = v.classe;
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

  navigationToList(){
    this.router.navigate(['/espace/gestion-classe']);
  }

  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
  }

  displayDetailsModal(detailsModal: any, student: any) {
    this.modalRef = this.modalService.show(detailsModal, { class: 'modal-lg' });
    this.curr_student = student;
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

        {
          style: 'tableInfos',
          table: {
            heights: 20,
            body: [
              [{text: 'Informations Générales', colSpan: 2, alignment: 'center', fillColor: '#E5E8E8',style: 'tableHeader', }, {}],
              [{text: 'Ecole', style: 'infoHeader'}, this.schoolName],
              [{text: 'Classe', style: 'infoHeader'}, this.classe],
              [{text: 'Nombre d\'apprenants', style: 'infoHeader'}, this.students?.length],
            ]
          }
        },

        { text: "LISTE DES APPRENANTS AU " + this.getRightDate(d.getDate()) + '/' + this.getRightDate((d.getMonth() + 1)) + '/' + d.getFullYear(), style: "header2", alignment: 'center' },
        {
          table: {
            widths: [50, 110, '*', 50, 30, 100],
            heights: 25,

            body: [
              [{
                text: 'N°',
                style: 'tableHeader'
              },
              {
                text: 'Code Scolar',
                style: 'tableHeader'
              },
              {
                text: 'Nom et Prénom(s)',
                style: 'tableHeader'
              },
              {
                text: 'Groupe',
                style: 'tableHeader'
              },
              {
                text: 'Sexe',
                style: 'tableHeader'
              },
              {
                text: 'Année de Naissance',
                style: 'tableHeader'
              },

              ],
              ...this.students.map((student, index) => {
                return [index + 1, student['student']?.code_scolar,
                student['student']?.last_name + ' ' + student['student']?.first_name, student['student']['groupe']?.code == null ? "-" : student['student']['groupe']?.code,
                student['student']?.sex == null ? "-" : student['student']?.sex, student['student']?.birthday == null ? "-" : student['student']?.birthday];
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
