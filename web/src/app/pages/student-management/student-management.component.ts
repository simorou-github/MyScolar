import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { SchoolService } from 'src/app/services/school.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ParameterService } from 'src/app/services/parameter.service';
import { ClasseService } from 'src/app/services/classe.service';
import { ManageFeesService } from 'src/app/services/manage-fees.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { right } from '@popperjs/core';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-student-management',
  templateUrl: './student-management.component.html',
  styleUrls: ['./student-management.component.scss']
})
export class StudentManagementComponent implements OnInit {
  isProcessing: boolean = false; breadCrumbItems: Array<{}>;
  students: any; p: number = 1; p2: number = 1; p3: number = 1; isSearchForm: boolean = false; modalRef?: BsModalRef; today!: Date; searchForm!: FormGroup;
  academicYear: string; schoolId!: string; schoolName!: string; message: string = '';
  curr_student!: any; studentForm!: FormGroup; formTitle!: string; btnFormTitle!: string; groupes!: any; classes!: any;
  studentBalances: any; modalDetails: BsModalRef<any>; modalDetailsTitle: any = ""; schoolClasses: any;
  details_transactions: any;

  constructor(private datePipe: DatePipe, private fb: FormBuilder, private ngxLoader: NgxUiLoaderService, private modalService: BsModalService, private toastr: ToastrService,
    private tokenService: TokenService, private schoolService: SchoolService, private classeService: ClasseService,
    private parameterService: ParameterService, private manageFees: ManageFeesService) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = this.tokenService.getSchoolId;
    this.schoolName = this.tokenService.getSocialReasonSchool;
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'Espace Ecole' }, { label: 'Gestion Apprenants', active: true }];

    this.today = new Date();
    this.studentForm = this.fb.group({
      id: [],
      last_name: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      matricule: [''],
      sex: ['', [Validators.required]],
      birthday: ['', [Validators.required]],
      email: [''],
      phone: [''],
      school_id: [this.schoolId, [Validators.required]],
      classe_id: ['', [Validators.required]],
      academic_year: [this.academicYear, [Validators.required]],
    });

    this.searchForm = this.fb.group({
      code_scolar: [''],
      last_name: [''],
      first_name: [''],
      classe_id: [''],
      sex: [''],
      birthday: [''],
    });

    this.getListStudents();
    this.getClasses();
    //this.schoolClasseList();
  }

  getListStudents() {
    this.ngxLoader.startLoader('loader-spin');
    this.schoolService.listStudents({ school_id: this.schoolId, academic_year: this.academicYear, search_form: this.searchForm.value }).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.students = v.data;
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

  schoolClasseList() {
    this.schoolService.listSchoolClasse({ school_id: this.schoolId }).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.schoolClasses = v.data;
        }
      },
      error: (e) => {
        console.error(e);
        this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
        this.showError(this.message);
      },

      complete: () => {

      }
    });
  }

  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
  }

  displayDetailsModal(detailsModal: any, student: any) {
    this.modalDetailsTitle = "Consultation des détails sur " + student.student.last_name + " " + student.student.first_name;
    this.curr_student = student;
    this.getStudendFeesBalance({ student_id: student.student_id, academic_year: student.academic_year,  classe_id: student.classe_id});
    this.modalRef = this.modalService.show(detailsModal, { class: 'modal-lg' });
  }

  /**
  * Open modal
  * @param modalStudent modal content
  */
  openViewModalStudent(modalStudent, title = "Création apprenant", btnFormTitle = "Enregistrer") {
    this.formTitle = title;
    this.btnFormTitle = btnFormTitle;
    this.modalRef = this.modalService.show(modalStudent, { class: 'modal-lg' });
  }


  addStudentForm() {
    this.isProcessing = true;
    this.schoolService.addStudentToClasse(this.studentForm.value).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.closeModalStudent();
            //this.studentForm.reset();
            this.showSuccess(this.message);
            console.log('ertyui')
            this.getListStudents();
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
          this.isProcessing = false;
        },

        complete: () => {

        }
      }
    )
  }

  //Notification  
  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

  closeModalStudent() {
    this.modalService.hide();
    this.studentForm.reset();
    this.studentForm.get('academic_year').patchValue(this.academicYear);
    this.studentForm.get('school_id').patchValue(this.schoolId);
    this.studentForm.get('classe_id').patchValue("");
    this.studentForm.get('sex').patchValue("");
  }

  getStudendFeesBalance(param = {}) {
    this.isProcessing = true;
    this.manageFees.getStudendFeesBalance(param).subscribe({
      next: (v: any) => {
        this.studentBalances = v.data;
        this.details_transactions = v.details_transactions;
        this.isProcessing = false;
      }
    });
  }


  getClasses(): void {
    this.classeService.listClasseOfSchool({ school_id: this.schoolId }).subscribe(
      {
        next: (v: any) => {
          this.classes = v.data;
        },
        error: (e) => {
          console.error(e);
        },
        complete: () => {
        }
      }
    );
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

        { text: "LISTE DES APPRENANTS DE " + this.schoolName + " AU " + this.getRightDate(d.getDate()) + '/' + this.getRightDate((d.getMonth() + 1)) + '/' + d.getFullYear(), style: "header2", alignment: 'center' },
        {
          table: {
            widths: [50, 110, '*', 60, 50, 30, 100],
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
                text: 'Classe',
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
                student['student']?.last_name + ' ' + student['student']?.first_name, student['classe']?.['classe']?.code + ' ' + student['classe']?.['groupe']?.code, student['student']['groupe']?.code == null ? "-" : student['student']['groupe']?.code,
                student['student']?.sex == null ? "-" : student['student']?.sex, student['student']?.birthday == null ? "-" : this.datePipe.transform(student['student']?.birthday, 'dd/MM/yyyy')];
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
