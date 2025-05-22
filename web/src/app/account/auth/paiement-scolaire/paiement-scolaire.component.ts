import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ManageFeesService } from 'src/app/services/manage-fees.service';
import { PaiementScolaireService } from 'src/app/services/paiement-scolaire.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-paiement-scolaire',
  templateUrl: './paiement-scolaire.component.html',
  styleUrls: ['./paiement-scolaire.component.scss']
})
export class PaiementScolaireComponent {
  isProcessing: boolean = false; modalRef?: BsModalRef; message: any; data: any; curr_student: any;
  curr_fees: any; academic_years: any; currentAcademicYaer: any; academic_year = ''; balanceFees: any; student: any; student_classe: any;
  operators: any; selectedBalancesRows: Array<{ id: string, balance: number, montant: number, type_fees_id: string }> = [];
  totalFees: number; student_param: any; selected_fees: any[]; totalBalances: number; paymentForm!: FormGroup; batchPaymentForm!: FormGroup;
  p: number = 1; path_part = environment.domainUrl+'/storage/';
  constructor(private authService: AuthService, private modalService: BsModalService, private paiementScolaireService: PaiementScolaireService,
    private toastr: ToastrService, private managerFeesService: ManageFeesService, private fb: FormBuilder,) {

  }

  ngOnInit(): void {
    this.getAllAcademicYear();
    this.paymentForm = this.fb.group({
      id: [],
      operator: ['', [Validators.required]],
      fees_amount: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), Validators.required]],
      details: [],
    });

    this.batchPaymentForm = this.fb.group({
      operator: ['', [Validators.required]],
      fees_amount: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$"), Validators.required]],
      details: [],
    });
  }

  openPayementModal(student: any, fees: any, content: any) {
    this.curr_student = student;
    this.curr_fees = fees;
    this.paymentForm.controls.phone.setValue(this.curr_student.phone);
    this.paymentForm.controls.email.setValue(this.curr_student.email);
    this.paymentForm.controls.fees_amount.patchValue(this.curr_fees.fees_amount);
    this.paymentForm.controls.balance.patchValue(this.curr_fees.balance);
    this.paymentForm.controls.amount.patchValue(this.curr_fees.balance);
    this.modalRef = this.modalService.show(content, { class: 'modal-lg' });
  }

  openPayementMultipleRowModal(content: any) {
    this.curr_student = this.student;
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
    this.isProcessing = true;
    this.selectedBalancesRows = [];
    this.totalBalances = 0;
    this.managerFeesService.searchStudentFeesBalanceForParentPayment(data.value).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.balanceFees = v.balanceFees;
          this.student = v.student;
          this.student_classe = v.student_classe;
          // console.log(this.student_classe);
          this.operators = v.operators;
          this.isProcessing = false;
          this.showSuccess(this.message);
          this.paymentForm = this.fb.group({
            id: [],
            operator: ['', [Validators.required]],
            fees_amount: ['', [Validators.required]],
            balance: ['', [Validators.required]],
            amount: ['', [Validators.required]],
            phone: ['', [Validators.required]],
            email: ['', [Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
            details: [],
          });
        } else {
          this.isProcessing = false;
          this.showError(this.message);
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
      },

      complete: () => {

      }
    });
  }

  //Get all Academic Year
  getAllAcademicYear(data: any = {}) {
    this.isProcessing = true;
    this.authService.listAccademicYear(data).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.academic_years = v.data;
          this.academic_year = this.currentAcademicYaer;
          this.isProcessing = false;
        } else {
          this.isProcessing = false;
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
      },

      complete: () => {

      }
    });
  }

  resetTotalBalances(){
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
    this.isProcessing = true;
    this.paiementScolaireService.processUniquePayment({
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
    }).subscribe({
      next: (v: any) => {
        this.message = v.message;
        if (v.status == 200) {
          this.data = v.data;
          this.isProcessing = false;
          this.showSuccess(this.message);
          this.getDataForPayment(this.student_param);
          this.modalService.hide();
        } else {
          this.isProcessing = false;
          this.showError(this.message);
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
      },

      complete: () => {

      }
    });
  }

  //Process Batch Payment
  processBatchPayment(data) {
    this.isProcessing = true;
    this.paiementScolaireService.processBatchPayment({
      'data': data,
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
          this.isProcessing = false;
          this.showSuccess(this.message);
          this.getDataForPayment(this.student_param);
          this.selectedBalancesRows = []; this.totalBalances = 0;
          this.modalService.hide();
        } else {
          this.isProcessing = false;
          this.showError(this.message);
        }
      },

      error: (e) => {
        console.error(e);
        this.showError(this.message);
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
