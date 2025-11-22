import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { randomInt } from 'crypto';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/services/auth.service';
import { ClasseService } from 'src/app/services/classe.service';
import { ManageFeesService } from 'src/app/services/manage-fees.service';
import { PaiementScolaireService } from 'src/app/services/paiement-scolaire.service';
import { SchoolService } from 'src/app/services/school.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cash-payment',
  templateUrl: './cash-payment.component.html',
  styleUrls: ['./cash-payment.component.scss']
})
export class CashPaymentComponent {
  isProcessing: boolean = false; modalRef?: BsModalRef; message: any; data: any; curr_student: any;
  curr_fees: any; academic_years: any; currentAcademicYaer: any; academic_year = ''; balanceFees: any; student: any; student_classe: any;
  operators: any; selectedBalancesRows: Array<{ id: string, balance: number, montant: number, type_fees_id: string }> = [];
  totalFees: number; student_param: any; selected_fees: any[]; totalBalances: number; paymentForm!: FormGroup; batchPaymentForm!: FormGroup;
  p: number = 1; path_part = environment.domainUrl + '/storage/';

  apprenants: any; school_classes: any; private school_id: string = ''; userEmail: any;

  constructor(private authService: AuthService, private modalService: BsModalService, private paiementScolaireService: PaiementScolaireService,
    private toastr: ToastrService, private managerFeesService: ManageFeesService, private fb: FormBuilder, private classeService: ClasseService,
    private tokenService: TokenService, private schoolService: SchoolService, private ngxLoader: NgxUiLoaderService) {
    this.school_id = this.tokenService?.getSchoolId; this.userEmail = tokenService.getUserEmail
  }

  ngOnInit(): void {
    this.getAllAcademicYear();
    this.getAllClassesOfCurrentSchool();
    this.paymentForm = this.fb.group({
      id: [],
      operator: ['', [Validators.required]],
      fees_amount: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      payment_method: ['', [Validators.required]],
      reference: [''],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), Validators.required]],
      details: [],
    });

    this.batchPaymentForm = this.fb.group({
      operator: ['', [Validators.required]],
      fees_amount: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      payment_method: ['', [Validators.required]],
      reference: [''],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), Validators.required]],
      details: [],
    });
  }

  openPayementModal(fees: any, content: any) {
    this.curr_student = this.student_classe.student;
    this.curr_fees = fees;
    this.paymentForm.controls.phone.setValue(this.curr_student.phone);
    this.paymentForm.controls.email.setValue(this.curr_student.email);
    this.paymentForm.controls.fees_amount.patchValue(this.curr_fees.fees_amount);
    this.paymentForm.controls.balance.patchValue(this.curr_fees.balance);
    this.paymentForm.controls.amount.patchValue(this.curr_fees.balance);
    this.modalRef = this.modalService.show(content, { class: 'modal-lg' });
  }

  openPayementMultipleRowModal(content: any) {
    this.curr_student = this.student_classe.student;
    this.selected_fees = this.selectedBalancesRows;
    this.batchPaymentForm.controls.phone.setValue(this.curr_student.phone);
    this.batchPaymentForm.controls.email.setValue(this.curr_student.email);
    this.batchPaymentForm.controls.fees_amount.patchValue(this.totalFees);
    this.batchPaymentForm.controls.balance.patchValue(this.totalBalances);
    this.batchPaymentForm.controls.amount.patchValue(this.totalBalances);
    this.modalRef = this.modalService.show(content, { class: 'modal-lg' });
  }

  //Get Data for payment
  getDataForPayment(data: any) {
    this.student_param = data;
    this.ngxLoader.startLoader('loader-spin');
    this.selectedBalancesRows = [];
    this.totalBalances = 0;
    this.managerFeesService.searchStudentFeesBalanceForCaissePayment(data.value).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.balanceFees = v.balanceFees;
          this.student_classe = v.student_classe;
          this.operators = v.operators;
          this.ngxLoader.stopLoader('loader-spin');
          this.showSuccess(this.message);
          this.paymentForm = this.fb.group({
            id: [],
            operator: ['', [Validators.required]],
            fees_amount: ['', [Validators.required]],
            balance: ['', [Validators.required]],
            amount: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            payment_method: ['', [Validators.required]],
            email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            details: [],
          });
        } else {
          this.ngxLoader.stopLoader('loader-spin');
          this.showError(this.message);
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
        this.ngxLoader.stopLoader('loader-spin');
      },

      complete: () => {

      }
    });
  }

  //Générate Caisse Référence
  methodeSelected(){
    this.paymentForm.controls.phone.setValue(this.curr_student.phone);
 
    //this.paymentForm.get('reference')?.setValue('C-' + this.getRandomNumber(100000, 999999));
  }
  getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  //Get all Academic Year
  getAllAcademicYear(data: any = {}) {
    this.ngxLoader.startLoader('loader-spin');
    this.authService.listAccademicYear(data).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.academic_years = v.data;
          this.academic_year = this.currentAcademicYaer;
          this.ngxLoader.stopLoader('loader-spin');
        } else {
          this.ngxLoader.stopLoader('loader-spin');
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
        this.ngxLoader.stopLoader('loader-spin');
      },

      complete: () => {

      }
    });
  }

  //Get all Apprenant Of Selected School
  getAllApprenantOfSlectedClasse(data) {
    this.ngxLoader.startLoader('loader-spin');
    this.apprenants = [];
    this.schoolService.listStudents(data).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.ngxLoader.stopLoader('loader-spin');
          this.apprenants = v.data;
        } else {
          this.ngxLoader.stopLoader('loader-spin');
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
        this.ngxLoader.stopLoader('loader-spin');
      },

      complete: () => {

      }
    });
  }

  //Get all School's Classes
  getAllClassesOfCurrentSchool() {
    this.ngxLoader.startLoader('loader-spin');
    this.classeService.listClasseOfSchool({ school_id: this.school_id }).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.school_classes = v.data;
          this.ngxLoader.stopLoader('loader-spin');
        } else {
          this.ngxLoader.stopLoader('loader-spin');
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
        this.ngxLoader.stopLoader('loader-spin');
      },

      complete: () => {

      }
    });
  }

  resetTotalBalances() {
    this.totalBalances = 0;
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }


  //Process Unique Payment
  processUniquePayment(data: any) {
    this.ngxLoader.startLoader('loader-spin');
    this.isProcessing = true;
    this.paiementScolaireService.processUniqueCaissePayment({
      'amount': data.amount,
      'phone': data.phone,
      'email': data.email,
      'operator': data.operator,
      'details': data.details,
      'student_id': this.curr_fees.student_id,
      'classe_id': this.curr_fees.classe_id,
      'school_id': this.curr_fees.school_id,
      'type_fees_id': this.curr_fees.type_fees_id,
      'academic_year': this.curr_fees.academic_year,
      'balance_id': this.curr_fees.id,
      'user_email': this.userEmail
    }).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.data = v.data;
          this.ngxLoader.stopLoader('loader-spin');
          this.showSuccess(this.message);
          this.getDataForPayment(this.student_param);
          this.modalService.hide();
          this.isProcessing = false;
        } else {
          this.ngxLoader.stopLoader('loader-spin');
          this.showError(this.message);
          this.isProcessing = false;
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
        this.isProcessing = false;
      },

      complete: () => {

      }
    });
  }

  //Process Batch Payment
  processBatchPayment(data) {
    this.ngxLoader.startLoader('loader-spin');
    this.isProcessing = true;
    this.paiementScolaireService.processBatchCaissePayment({
      'data': data,
      'user_email': this.userEmail,
      'balance_rows': this.selectedBalancesRows,
      'additional_fields': {
        'student_id': this.curr_student.id,
        'school_id': this.curr_student.school_id,
        'classe_id': this.student_classe.classe_id,
        'academic_year': this.student_param.value.academic_year
      }
    }).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.data = v.data;
          this.ngxLoader.stopLoader('loader-spin');
          this.showSuccess(this.message);
          this.getDataForPayment(this.student_param);
          this.selectedBalancesRows = []; this.totalBalances = 0;
          this.modalService.hide();
          this.isProcessing = false;
        } else {
          this.ngxLoader.stopLoader('loader-spin');
          this.showError(this.message);
          this.isProcessing = false;
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
        this.ngxLoader.stopLoader('loader-spin');
        this.isProcessing = false;
      },

      complete: () => {

      }
    });
  }

  selectBalanceRow(e: any, data) {
    this.totalFees = 0; this.totalBalances = 0;
    if (e.target.checked) {
      this.selectedBalancesRows.push({ id: data.id, balance: data.balance, montant: data.fees_amount, type_fees_id: data.type_fees_id });
    } else {
      this.selectedBalancesRows.forEach(element => {
        if (element.id == data.id) {
          this.selectedBalancesRows.splice(this.selectedBalancesRows.indexOf(element), 1);
        }
      });
    }

    this.selectedBalancesRows.forEach(element => {
      this.totalBalances = this.totalBalances + element.balance;
      this.totalFees = this.totalFees + element.montant;
    });
  }

  closeModal() {
    this.paymentForm.reset();
    this.batchPaymentForm.reset();
    this.modalService.hide();
  }

}

