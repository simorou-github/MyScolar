import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClasseService } from 'src/app/services/classe.service';
import { ToastrService } from 'ngx-toastr';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { right } from '@popperjs/core';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {

  // bread crumb items
  breadCrumbItems: Array<{}>; classes: any; isProcessing: boolean = false; distinctClasses: any; classe_id!: string;

  p: number = 1; schoolClasses: any; academicYear: string; schoolId: string; schoolName: string; uploadForm!: FormGroup;

  isSearchForm: boolean = false; modalRef?: BsModalRef; classeForm!: FormGroup; dataFromExcelFile: any;
  message: any; searchForm!: FormGroup;
  currentClasseCode: any;
  currentClasseId: any;
  labelFormTitle: string;
  btnFormTitle: string;
  classe_code: any;

  constructor(private fb: FormBuilder, private classeService: ClasseService,
    private modalService: BsModalService, private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,) {
    // this.academicYear = this.tokenService.getAcademicYear;
    // this.schoolName = this.tokenService.getSocialReasonSchool;
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'CLASSES' }, { label: 'Détails', active: true }];

    this.searchForm = this.fb.group({
      code: [''],
      label: [''],
      status: ['']
    });


    this.classeForm = this.fb.group({
      id: [],
      code: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      label: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
    });
    
   this.getAllClasses();
  }



  create() {
    this.isProcessing = true;
    this.classeService.create(this.classeForm.value).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.showSuccess(this.message);
            this.classeForm.reset();
            if (this.classeForm.value.id !== null || this.classeForm.value.id !== '') {
              this.modalService.hide();
            }
            this.getAllClasses();
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
  * @param modalClasse modal content
  */
  openViewModal(modalClasse: any) {
    this.labelFormTitle = 'Ajout d\'une classe';
    this.btnFormTitle = 'Ajouter';
    this.modalRef = this.modalService.show(modalClasse, { class: 'modal-md' });
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

  getAllClasses() {
    this.ngxLoader.startLoader('loader-spin');
    this.classeService.list().subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.classes = v.data;
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
        this.isProcessing = false;
      },

      complete: () => {

      }
    });
  }

  // Fonction pour afficher ou cacher le formulaire de recherche avancée
  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
    if(status === false){
      this.searchForm.reset();
      this.getAllClasses();
    }
  }

  research() {
    this.ngxLoader.startLoader('loader-spin');
    this.classeService.searchClasse(this.searchForm.value).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.classes = v.data;
          this.ngxLoader.stopLoader('loader-spin');
        } else {
          this.ngxLoader.stopLoader('loader-spin');
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

  update(modalClasse: any, classe: any) {
    this.labelFormTitle = 'Modification d\'une classe';
    this.btnFormTitle = 'Modifier';
    this.modalRef = this.modalService.show(modalClasse, { class: 'modal-md' });
    this.classeForm.patchValue({
      id: classe?.id,
      code: classe?.code,
      label: classe?.label
    });
  }


  delete() {
    this.classeService.delete({ 'id': this.classe_id }).subscribe(
      {
        next: (v: any) => {
          if (v.status == 200) {
            this.showSuccess(v.message);            
            this.getAllClasses();
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

  ConfirmDeleteModal(StaticDeleteModal: any, classe: any) {
    this.classe_id = classe?.id;
    this.classe_code = classe?.code;
    this.modalRef = this.modalService.show(StaticDeleteModal);
  }

  closeModal() {
    this.modalService.hide();
    this.classeForm.reset();
  }

  closeModalDeleting(){
    this.modalService.hide();
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
      pageOrientation: 'portrait',
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

        { text: "LISTE DES CLASSES DE SCOLAR PLUS AU " + this.getRightDate(d.getDate()) + '/' + this.getRightDate((d.getMonth() + 1)) + '/' + d.getFullYear(), style: "header2", alignment: 'center' },
        {
          table: {
            widths: [30, '*', '*'],
            heights: 25,

            body: [
              [{
                text: 'N°',
                style: 'tableHeader'
              },
              {
                text: 'Code',
                style: 'tableHeader'
              },
              {
                text: 'Libellé',
                style: 'tableHeader'
              },
              ],
              ...this.classes.map((classe, index) => {
                return [index + 1, classe['code'],
                classe['label']]
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