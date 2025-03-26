import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { ParameterService } from 'src/app/services/parameter.service';
import { SchoolService } from 'src/app/services/school.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { environment } from 'src/environments/environment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { NgxUiLoaderService } from 'ngx-ui-loader';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-payment-history',
  templateUrl: './payment-history.component.html',
  styleUrls: ['./payment-history.component.scss']
})
export class PaymentHistoryComponent implements OnInit {

  isProcessing: boolean = false; breadCrumbItems: Array<{}>; totalAmount: number = 0;
  payments: any; p2: number = 1; p: number = 1; isSearchForm: boolean = false; modalRef?: BsModalRef;
  academicYear: string; schoolId: number; schoolName: string; message: string = ''; curr_payment: any;
  formatedCurrTransactionDate: any; schoolTypeFees: any; schoolClasses: any; schoolStudents: any;
  listAcademicYear: any; operatorsList: any; searchForm!: FormGroup;
  payment_detials: any;
  detials_amount: any;

  constructor(private fb: FormBuilder, private modalService: BsModalService, private ngxLoader: NgxUiLoaderService, private toastr: ToastrService,
    private tokenService: TokenService, private schoolService: SchoolService, public datePipe: DatePipe,
    private parameterService: ParameterService) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = +this.tokenService.getSchoolId;
    this.schoolName = this.tokenService.getSocialReasonSchool;
  }

  ngOnInit() {
    this.breadCrumbItems = [{ label: 'HISTORIQUE DES PAIEMENTS' }, { label: 'Détails', active: true }];
    this.searchForm = this.fb.group({
      type_fees_id: [''],
      classe_id: [''],
      student_id: [''],
      academic_year: [''],
      operator: [''],
      school_id: [this.tokenService.getSchoolId, [Validators.required]],
    });
    this.getHistoryOfPayment();
    this.typeFeesList();
    this.studentList();
    this.academicYearList();
    this.classeList();
    this.operatorList();

  }

  getHistoryOfPayment() {
    this.ngxLoader.startLoader('loader-spin');
    this.schoolService.getHistoryOfPayment(this.searchForm.value).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.payments = v.data;
           // console.log(this.payments)
            this.totalAmount = v.amount;
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

  displaySearchForm(status: boolean) {
    this.isSearchForm = status;
  }

  displayDetailsModal(DetailDetailModal: any, payment: any) {
    this.formatedCurrTransactionDate
    this.getPaymentDetails(payment.id);
    this.modalRef = this.modalService.show(DetailDetailModal, { class: 'modal-lg' });
    this.curr_payment = payment;
  }

  typeFeesList() {
    this.parameterService.listTypeFees({ school_id: this.tokenService.getSchoolId }).subscribe({
      next: (v: any) => {
        this.schoolTypeFees = v.data;
      }
    });
  }
  
  studentList() {
    this.schoolService.getStudentsWithParam({ school_id: this.tokenService.getSchoolId }).subscribe({
      next: (v: any) => {
        this.schoolStudents = v.data;
      }
    });
  }

  getPaymentDetails(param: any) {
    this.isProcessing = true;
    this.schoolService.getPaymentDetails({ payment_id: param }).subscribe({
      next: (v: any) => {
        this.payment_detials = v.data;
        this.isProcessing = false;
      }
    });
  }

  academicYearList() {
    this.parameterService.listAccademicYear({ school_id: this.tokenService.getSchoolId }).subscribe({
      next: (v: any) => {
        this.listAcademicYear = v.data;
      }
    });
  }

  classeList() {
    this.schoolService.listSchoolClasse({ school_id: this.tokenService.getSchoolId }).subscribe({
      next: (v: any) => {
        this.schoolClasses = v.data;
      }
    });
  }

  operatorList() {
    this.parameterService.listOperator({ school_id: this.tokenService.getSchoolId }).subscribe({
      next: (v: any) => {
        this.operatorsList = v.data;
      }
    });
  }

  getRightDate(nb: number) {
    return (nb < 10) ? '0' + nb : nb;
  }

  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('HistoriqueTransactions');

    //Add Image
    let myLogoImage = workbook.addImage({
      base64: environment.imgBase64,
      extension: 'png',
    });
    worksheet.mergeCells('A1:A3');
    worksheet.addImage(myLogoImage, 'A1:A3');

    //Add Row and formatting
    worksheet.mergeCells('B1', 'E3');
    let titleRow = worksheet.getCell('C1');
    let d = new Date();
    titleRow.value = "HISTORIQUE DES TRANSACTIONS AU " + this.getRightDate(d.getDate()) + '/' + this.getRightDate((d.getMonth() + 1)) + '/' + d.getFullYear();
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '000000' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Add total amount of transactions
    let totalAmountCell = worksheet.getCell('F2');
    totalAmountCell.value = 'Total payé : ' + this.totalAmount + ' F CFA';
    totalAmountCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true,
      color: { argb: '000000' },
    };

    //Blank Row
    worksheet.addRow([]);

    worksheet.columns = [
      { key: 'operator', width: 15, },
      { key: 'date', width: 30 },
      { key: 'student', width: 35 },
      { key: 'classe', width: 20 },
      { key: 'academic_year', width: 16 },
      { key: 'amount', width: 22 },
      { key: 'phone', width: 18 },
    ];

    let _header = ['Opérateur', 'Date', 'Apprenant', 'Classe', 'Année académique', 'Montant', 'Téléphone']

    let headerRow = worksheet.addRow(_header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12,
      };
    });

    this.payments.forEach(payment => {
      worksheet.addRow({
        operator: payment['operator']?.name, date: this.datePipe.transform(payment['created_at'], 'dd/MM/yyyy hh:mm:ss'), student: payment['student']?.last_name +
        ' ' + payment['student']?.first_name, classe: payment['classe']['classe']?.code == null ? payment['classe']['classe']?.code : payment['classe']['classe']?.code + '- ' + payment['classe']['groupe']?.code, 
        academic_year: payment.academic_year, amount: payment.amount, phone: payment.phone
      }, "n");
    });

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'HistoriqueTransactions_' + d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear() + '.xlsx');
    })
  }


  generatePdf() {
    const documentDefinition = this.getDocumentDefinition();
    
    pdfMake.createPdf(documentDefinition).open();
  }

  getDocumentDefinition() {
    let d = new Date();
    return {
      pageOrientation: 'landscape',
      pageMargins: [20, 20, 10, 25],
      footer: function(currentPage, pageCount) { return [{ text: currentPage.toString() + ' sur ' + pageCount, alignment: 'right',  margin: [0, 0, 20, 0] },
        ]; },
      content: [
        {
          image: environment.imgBase64,
          width: 50,
          height: 50,
        },
        { text: "LISTE DES TRANSACTIONS AU " + this.getRightDate(d.getDate()) + '/' + this.getRightDate((d.getMonth() + 1)) + '/' + d.getFullYear(), style: "header", alignment: 'center' },
        { text: "Total payé : " + this.totalAmount + " F CFA" ,alignment: 'center', margin: [0, 3, 0, 20], fontSize: 15 },
        {
          table: {
            widths: [30, 80, 80, 170, 80, 80, 100, 90],

            body: [
              [{
                text: '#',
                style: 'tableHeader'
              },
              {
                text: 'Opérateur',
                style: 'tableHeader'
              },
              {
                text: 'Date',
                style: 'tableHeader'
              },
              {
                text: 'Apprenant',
                style: 'tableHeader'
              },
              {
                text: 'Classe',
                style: 'tableHeader'
              },
              {
                text: 'Année académique',
                style: 'tableHeader'
              },
              {
                text: 'Montant',
                style: 'tableHeader'
              },
              {
                text: 'Téléphone',
                style: 'tableHeader'
              }
              ],
              ...this.payments.map((payment, index) => {
                return [ index + 1,
                payment['operator']?.name,
                this.datePipe.transform(payment['created_at'], 'dd/MM/yyyy hh:mm:ss'), payment['student']?.last_name +
                ' ' + payment['student']?.first_name, payment['classe']['classe']?.code == null ? payment['classe']['classe']?.code : payment['classe']['classe']?.code + '- ' + payment['classe']['groupe']?.code,
                payment.academic_year, payment.amount, payment.phone,

                ];
              })
            ]

          },
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          float: 'right'
        },

        tableHeader: {
          bold: true,
          fontSize: 13
        }
      }
    };
  }


}
