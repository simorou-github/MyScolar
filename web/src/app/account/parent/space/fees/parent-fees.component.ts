import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParentSpaceService } from 'src/app/services/parent-space.service';
import { PaiementScolaireService } from 'src/app/services/paiement-scolaire.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-parent-fees',
  templateUrl: './parent-fees.component.html',
  styleUrls: ['./parent-fees.component.scss']
})
export class ParentFeesComponent implements OnInit {

  studentId: string = '';
  student: any = null;
  operators: any[] = [];
  balanceFees: any[] = [];
  academicYears: string[] = [];
  selectedAcademicYear: string = '';

  selectedBalancesRows: Array<{ id: string, balance: number, montant: number, type_fees_id: string }> = [];
  totalFees = 0;
  totalBalances = 0;
  curr_fees: any;

  modalRef?: BsModalRef;
  paymentForm!: FormGroup;
  batchPaymentForm!: FormGroup;
  isProcessing = false;
  p = 1;
  path_part = environment.domainUrl + '/storage/app/public/';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private modalService: BsModalService,
    private parentSpaceService: ParentSpaceService,
    private paiementScolaireService: PaiementScolaireService,
  ) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.params['studentId'];

    this.paymentForm = this.fb.group({
      operator: ['', [Validators.required]],
      fees_amount: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      details: [],
    });

    this.batchPaymentForm = this.fb.group({
      operator: ['', [Validators.required]],
      fees_amount: ['', [Validators.required]],
      balance: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      email: ['', [Validators.required, Validators.email]],
      details: [],
    });

    this.loadAcademicYears();
    this.loadBalance();
  }

  loadAcademicYears() {
    this.parentSpaceService.getStudentAcademicYears({ student_id: this.studentId }).subscribe({
      next: (v: any) => { this.academicYears = v.data; }
    });
  }

  loadBalance() {
    this.ngxLoader.startLoader('loader-spin');
    const body: any = { student_id: this.studentId };
    if (this.selectedAcademicYear) { body.academic_year = this.selectedAcademicYear; }

    this.parentSpaceService.getStudentBalance(body).subscribe({
      next: (v: any) => {
        this.student = v.student;
        this.operators = v.operators;
        this.balanceFees = v.data;
        this.selectedBalancesRows = [];
        this.totalBalances = 0;
        this.totalFees = 0;
        this.ngxLoader.stopLoader('loader-spin');
      },
      error: (e) => {
        this.ngxLoader.stopLoader('loader-spin');
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }

  onYearChange(year: string) {
    this.selectedAcademicYear = year;
    this.loadBalance();
  }

  onPhoneInput(event: any, form: FormGroup) {
    const input = event.target as HTMLInputElement;
    const digitsOnly = input.value.replace(/\D/g, '');
    if (digitsOnly !== input.value) { input.value = digitsOnly; }
    form.controls['phone'].setValue(digitsOnly, { emitEvent: false });
  }

  openPayementModal(fees: any, content: any) {
    this.curr_fees = fees;
    this.paymentForm.reset();
    this.paymentForm.controls.phone.setValue(this.student.phone ?? '');
    this.paymentForm.controls.email.setValue(this.student.email ?? '');
    this.paymentForm.controls.fees_amount.patchValue(fees.fees_amount);
    this.paymentForm.controls.balance.patchValue(fees.balance);
    this.paymentForm.controls.amount.patchValue(fees.balance);
    this.modalRef = this.modalService.show(content, { class: 'modal-lg' });
  }

  openPayementMultipleRowModal(content: any) {
    this.batchPaymentForm.reset();
    this.batchPaymentForm.controls.phone.setValue(this.student.phone ?? '');
    this.batchPaymentForm.controls.email.setValue(this.student.email ?? '');
    this.batchPaymentForm.controls.fees_amount.patchValue(this.totalFees);
    this.batchPaymentForm.controls.balance.patchValue(this.totalBalances);
    this.batchPaymentForm.controls.amount.patchValue(this.totalBalances);
    this.modalRef = this.modalService.show(content, { class: 'modal-lg' });
  }

  selectBalanceRow(e: any, data: any) {
    if (e.target.checked) {
      this.selectedBalancesRows.push({ id: data.id, balance: data.balance, montant: data.fees_amount, type_fees_id: data.type_fees_id });
    } else {
      this.selectedBalancesRows = this.selectedBalancesRows.filter(r => r.id !== data.id);
    }
    this.totalFees = this.selectedBalancesRows.reduce((s, r) => s + r.montant, 0);
    this.totalBalances = this.selectedBalancesRows.reduce((s, r) => s + r.balance, 0);
  }

  processUniquePayment(data: any) {
    this.isProcessing = true;
    this.paiementScolaireService.processUniquePayment({
      amount: data.amount,
      phone: data.phone,
      email: data.email,
      operator: data.operator,
      details: data.details,
      student_id: this.curr_fees.student_id,
      classe_id: this.curr_fees.classe_id,
      school_id: this.curr_fees.school_id,
      type_fees_id: this.curr_fees.type_fees_id,
      academic_year: this.curr_fees.academic_year,
      balance_id: this.curr_fees.id,
    }).subscribe({
      next: (v: any) => {
        this.isProcessing = false;
        if (v.status == 200) {
          this.toastr.success(v.message, 'Succès');
          this.modalService.hide();
          this.loadBalance();
        } else {
          this.toastr.error(v.message, 'Erreur');
        }
      },
      error: (e) => {
        this.isProcessing = false;
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }

  processBatchPayment(data: any) {
    this.isProcessing = true;
    const firstRow = this.balanceFees.find(b => b.id === this.selectedBalancesRows[0]?.id);
    this.paiementScolaireService.processBatchPayment({
      data: data,
      balance_rows: this.selectedBalancesRows,
      additional_fields: {
        student_id: this.studentId,
        school_id: this.student?.school_id,
        classe_id: firstRow?.classe_id,
        academic_year: this.selectedAcademicYear || firstRow?.academic_year,
      }
    }).subscribe({
      next: (v: any) => {
        this.isProcessing = false;
        if (v.status == 200) {
          this.toastr.success(v.message, 'Succès');
          this.modalService.hide();
          this.loadBalance();
        } else {
          this.toastr.error(v.message, 'Erreur');
        }
      },
      error: (e) => {
        this.isProcessing = false;
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }

  closeModal() {
    this.modalService.hide();
  }

  backToDashboard() {
    this.router.navigate(['/parent/space/dashboard']);
  }
}
