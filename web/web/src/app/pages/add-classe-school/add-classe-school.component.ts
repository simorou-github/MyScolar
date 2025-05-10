import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ClasseService } from 'src/app/services/classe.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { Classe } from '../classe/classe.model';
import { SchoolService } from 'src/app/services/school.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { TokenService } from 'src/app/shared/authentication/token.service';

@Component({
  selector: 'app-add-classe-school',
  templateUrl: './add-classe-school.component.html',
  styleUrls: ['./add-classe-school.component.scss']
})
export class AddClasseSchoolComponent {
  // bread crumb items
  breadCrumbItems: Array<{}>; schoolClasseForm!: FormGroup; typeFees: any; academic_year: string = '';

  classes: Classe[] = []; isProcessing: boolean = false; message: string = '';

  typeFeesToSelect: any; typePayments; typePaymentToSelect;

  get member(): FormArray { return this.schoolClasseForm.get('member') as FormArray; }

  constructor(private fb: FormBuilder, private parameterService: ParameterService,
    private classeService: ClasseService, private tokenService: TokenService, private schoolService: SchoolService,
    private toastr: ToastrService, private router: Router) { }

  /**
   * Add the member field in form
   */
  addMember() {
    this.member.push(new FormControl());
  }

  /**
   * Onclick delete member from form
   */
  deleteMember(i: number) {
    this.member.removeAt(i);
  }


  ngOnInit() {
    this.breadCrumbItems = [{ label: 'ESPACE ECOLE/CLASSES' }, { label: 'AJOUT', active: true }];
    this.academic_year = this.tokenService.getAcademicYear;
    this.typeFeesList();
    this.typePaymentList();
    this.getAllClasses();
    this.schoolClasseForm = this.fb.group({
      id: [],
      classe_id: ['', [Validators.required]],
      school_id: [this.tokenService.getSchoolId, [Validators.required]],
      academic_year: [this.academic_year, [Validators.required]],
      type_payment: ['', [Validators.required]],
      type_fees_id: ['', [Validators.required]],
      amount_fees: [null, [Validators.required]],
      fees: this.fb.array([]),
    });
  }

  createFeesGroup(label: any = "Paiement unique", due_amount: number = 0) {
    return this.fb.group({
      //type_fees_id: ['', [Validators.required]],
      label: [label, [Validators.required]],
      due_amount: [due_amount, [Validators.required]],
      due_date: ['', [Validators.required]],
    });
  }
//due_date_number = Nomnre d'échéance correspondant au type paiement
  public addFees() {
    if(this.schoolClasseForm.value.type_fees_id && this.schoolClasseForm.value.amount_fees > 0){
      const arr = <FormArray>this.schoolClasseForm.controls.fees;
      arr.controls = [];
      let due_date_number = this.schoolClasseForm.value.type_payment.due_date_number;
      for (let i = 0; i < due_date_number; i++) {
        console.log(this.schoolClasseForm.value.amount_fees / due_date_number);
        if(this.schoolClasseForm.value.type_payment.label == 'Unique')
          this.feesList.push(this.createFeesGroup(this.schoolClasseForm.value.type_payment.label, this.schoolClasseForm.value.amount_fees / due_date_number));
        else
          this.feesList.push(this.createFeesGroup(this.schoolClasseForm.value.type_payment.label +' ' + (i+1), this.schoolClasseForm.value.amount_fees / due_date_number));
      }
    } else {
      this.schoolClasseForm.get('type_payment').patchValue("");
      this.showWarning('Veuillez sélectionner un fais et saisir le montant correspondant en premier.');
    }
  }

  public get feesList(): FormArray {
    return <FormArray>this.schoolClasseForm.get('fees');
  }

/*
  public addFee() {
    this.feesList.push(this.createFeesGroup());
  }
*/
  public deleteFee(index: number): void {
    this.feesList.removeAt(index);
    this.feesList.markAsDirty();
  }


  typeFeesList() {
    this.parameterService.listTypeFees({school_id: this.tokenService.getSchoolId}).subscribe({
      next: (v: any) => {
        this.typeFees = v.data;
        this.typeFeesToSelect = this.typeFees;
      }
    });
  }

  typePaymentList() {
    this.parameterService.listTypePayment().subscribe({
      next: (v: any) => {
        this.typePayments = v.data;
        this.typePaymentToSelect = this.typePayments;
      }
    });
  }


  getAllClasses(): void {
    this.classeService.list().subscribe(
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

  public get fees(): FormArray {
    return <FormArray>this.schoolClasseForm.get('fees');
  }

  addSchoolClasse() {
    this.isProcessing = true;
    this.schoolService.createSchoolClasse(this.schoolClasseForm.value).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.schoolClasseForm.reset();
            this.showSuccess(this.message);
            this.router.navigate(['espace-ecole']);
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

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

  showWarning(msg: string) {
    this.toastr.warning(msg, 'Attention');
  }


}
