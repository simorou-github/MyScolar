import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { SchoolService } from 'src/app/services/school.service';
import * as XLSX from "xlsx";
import { environment } from 'src/environments/environment';
import { ClasseService } from 'src/app/services/classe.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';


@Component({
  selector: 'app-classe-management',
  templateUrl: './classe-management.component.html',
  styleUrls: ['./classe-management.component.scss']
})
export class ClasseManagementComponent {
  // bread crumb items
  breadCrumbItems: Array<{}>; classes: any; isProcessing: boolean = false; distinctClasses: any; searchForm!: FormGroup;

  p: number = 1; schoolClasses: any; academicYear: string; schoolId: string; schoolName: string; uploadForm!: FormGroup;

  isSearchForm: boolean = false; modalRef?: BsModalRef; schoolClasseForm!: FormGroup; dataFromExcelFile: any; groupes: any;

  message: any; domain_url: string = environment.domainUrl; currentClasseCode: any; currentClasseId: any; fileUrl: any;

  existed_students: any; selectedFile: File | null = null;

  @ViewChild('modalExistedStudent') private modalExistedStudent;
  constructor(private fb: FormBuilder, private schoolService: SchoolService, private tokenService: TokenService,
    private modalService: BsModalService, private toastr: ToastrService, private ngxLoader: NgxUiLoaderService, private classeService: ClasseService) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = this.tokenService.getSchoolId;
    this.schoolName = this.tokenService.getSocialReasonSchool;

  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'LISTE DES CLASSES' }, { label: 'Détails', active: true }];
    this.classeList();
    this.allClasse();
    this.actifGoupeList();
    this.schoolClasseForm = this.fb.group({
      classe_id: ['', [Validators.required]],
      groupe_id: ['']
    });


    this.searchForm = this.fb.group({
      code: [''],
      label: ['']
    });

    this.initUploadListForm();

  }

  initUploadListForm() {
    this.uploadForm = this.fb.group({
      classe_id: [null],
      school_id: [null],
      file_upload: ['', [Validators.required]],
      academic_year: [''],
    });
  }


  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
  }

  displayAddClasseModal(addModal: any) {
    this.modalRef = this.modalService.show(addModal, { class: 'modal-md' });
  }

  displayExistedStudentModal(students: any) {
    this.existed_students = students;
    this.modalRef = this.modalService.show(this.modalExistedStudent, { class: 'modal-md' });
  }


  addSchoolClasse() {
    this.isProcessing = true;
    this.schoolService.createSchoolClasse({ school_classe: this.schoolClasseForm.value, school_id: this.schoolId }).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.showSuccess(this.message);
            this.modalService.hide();
            this.schoolClasseForm.reset();
            this.classeList();
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

  allClasse() {
    this.classeService.list().subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.classes = v.data;
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

  classeList() {
    this.ngxLoader.startLoader('loader-class');
    this.schoolService.listSchoolClasse({ school_id: this.schoolId }).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.schoolClasses = v.data;
          this.ngxLoader.stopLoader('loader-class');
        } else {
          this.showError(this.message);
          this.ngxLoader.stopLoader('loader-class');
        }
      },
      error: (e) => {
        console.error(e);
        this.message = 'Une erreur interne est survenue. Veuillez contacter le Groupe Scolar Plus.';
        this.showError(this.message);
        this.ngxLoader.stopLoader('loader-class');
      },

      complete: () => {

      }
    });
  }

  onFileChange(event: any) {
  this.selectedFile = event.target.files[0];
}

  // onFileChange(evt: any) {
  //   const target: DataTransfer = <DataTransfer>(evt.target);
  //   if (target.files.length > 1) {
  //     alert('Vous ne pouvez pas importer plusieurs fichiers');
  //     return;
  //   }
  //   else {
  //     const formData = new FormData();
  //     formData.append('file_upload', file);
  //     // this.dataFromExcelFile = [];
  //     // const reader: FileReader = new FileReader();
  //     // reader.onload = (e: any) => {
  //     //   const bstr: string = e.target.result;
  //     //   const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
  //     //   const wsname = wb.SheetNames[0];
  //     //   const ws: XLSX.WorkSheet = wb.Sheets[wsname];
  //     //   let data = (XLSX.utils.sheet_to_json(ws, { header: 1 }));
  //     //   // Print the Excel Data
  //     //   for (let i = 0; i <= 6; i++) {
  //     //     data.shift();
  //     //   }
  //     //   this.dataFromExcelFile = data;
  //     // }
  //     // reader.readAsBinaryString(target.files[0]);
  //   }
  // }

  openViewUploadModal(schoolClasseData: any, modalUploadStudent: any) {
    let space = (schoolClasseData?.groupe) ? "-" : "";
    let groupe = (schoolClasseData?.groupe) ? schoolClasseData?.groupe?.code : "";
    this.currentClasseCode = schoolClasseData?.classe?.code + space + groupe;
    this.currentClasseId = schoolClasseData?.id;
    this.modalRef = this.modalService.show(modalUploadStudent, { class: 'modal-md' });

  }

  closeUploadModal() {
    this.modalService.hide();
    this.uploadForm.reset();
  }

  closeExistedStudentModal() {
    this.modalService.hide();
  }

  closeAddClasseModal() {
    this.modalService.hide();
    this.schoolClasseForm.reset();
  }


  addStudentListToClasse() {
    this.isProcessing = true;
    const formData = new FormData();
  formData.append('file', this.selectedFile);
    formData.append('classe_id', this.currentClasseId);
    formData.append('academic_year', this.academicYear);
    formData.append('school_id', this.schoolId);

    this.schoolService.addStudentListToClasse(formData).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.uploadForm.reset();
            this.showSuccess(this.message);
            this.isProcessing = false;
            this.initUploadListForm();

            if (v.data?.length > 0) {
              this.displayExistedStudentModal(v.data);
            }
          } else {
            this.showError(this.message);
            this.isProcessing = false;
          }
        },

        error: (e) => {
          console.error(e);
          this.showError(e.message);
          this.isProcessing = false;
        },

        complete: () => {

        }
      }
    )
  }

  closeModalDeleting() {
    this.modalService.hide();
  }

  /**
   * Static modal
   * @param DeleteModalSchoolClasse modal content
   */

  ConfirmClasseDelete(DeleteModalSchoolClasse: any, classe: any) {
    this.currentClasseId = classe?.id;
    this.currentClasseCode = classe?.code;
    this.modalRef = this.modalService.show(DeleteModalSchoolClasse, { class: 'modal-md' });
  }

  actifGoupeList() {
    this.schoolService.listActifGroupe({ school_id: this.schoolId }).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.groupes = v.data;
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

  downloadTemplate(): void {
    this.schoolService.downloadTemplate().subscribe({
      next: (blob: any) => {
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'ModelListeEleve.xlsx';
        link.click();
      },
      error: (e: any) => {
        console.log(e)
      }

    });
  }

  retireClasse() {

  }


  /**
  * Open center modal
  * @param infoOnModelUpload center modal data
  */
  centerModal(infoOnModelUpload: any) {
    this.modalRef = this.modalService.show(infoOnModelUpload);
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
