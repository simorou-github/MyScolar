import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClasseService } from 'src/app/services/classe.service';
import { ManageFeesService } from 'src/app/services/manage-fees.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { SchoolService } from 'src/app/services/school.service';
import { TokenService } from 'src/app/shared/authentication/token.service';

@Component({
  selector: 'app-assign-fees-to-classe',
  templateUrl: './assign-fees-to-classe.component.html',
  styleUrls: ['./assign-fees-to-classe.component.scss']
})
export class AssignFeesToClasseComponent implements OnInit {
  typeFeesId: string = ""; breadCrumbItems: Array<{}>; schoolClasseForm!: FormGroup; typeFees: any; academic_year: string = '';
  typeFeesToSelect: any;  typePayments: any;  typePaymentToSelect: any;  classes: any;
  isProcessing: boolean;  message: string; toDay: Date;
  scName: string;
  constructor(private fb: FormBuilder, private tokenService: TokenService, private manageFeesService: ManageFeesService, private route: ActivatedRoute, private parameterService: ParameterService,
    private classeService: ClasseService, private toastr: ToastrService, private router: Router){

  }

  ngOnInit(): void {
    this.typeFeesId = this.route.snapshot.params['id'];
    this.breadCrumbItems = [{ label: 'ESPACE ECOLE' }, { label: 'AFFECTAION FRAIS', active: true }];
    this.scName = this.tokenService.getSocialReasonSchool;
    this.academic_year = this.tokenService.getAcademicYear;
    this.toDay = new Date();
    this.typeFeesList();
    this.typePaymentList();
    this.getAllClasses();
    this.schoolClasseForm = this.fb.group({
      id: [],
      school_classe_id: ['', [Validators.required]],
      academic_year: [this.academic_year, [Validators.required]],
      type_payment: ['', [Validators.required]],
      type_fees_id: [this.typeFeesId, [Validators.required]],
      amount_fees: [null, [Validators.required]],
      fees: this.fb.array([]),
    });
  }

  assigneFeesToSchoolClasse() {
    this.isProcessing = true;
    this.manageFeesService.assigneFeesToSchoolClasse(this.schoolClasseForm.value).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.schoolClasseForm.reset();
            this.showSuccess(this.message);
            this.router.navigate(['espace/gestion-frais']);
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

  //due_date_number = Nomnre d'échéance correspondant au type paiement
  public addFees() {
    if(this.schoolClasseForm.value.type_fees_id && this.schoolClasseForm.value.amount_fees > 0){
      const arr = <FormArray>this.schoolClasseForm.controls.fees;
      arr.controls = [];
      let due_date_number = this.schoolClasseForm.value.type_payment.due_date_number;
      for (let i = 0; i < due_date_number; i++) {
        if(this.schoolClasseForm.value.type_payment.label == 'Unique'){
          this.feesList.push(this.createFeesGroup(this.schoolClasseForm.value.type_payment.label, this.schoolClasseForm.value.amount_fees / due_date_number));
        }else{
          this.feesList.push(this.createFeesGroup(this.schoolClasseForm.value.type_payment.label +' ' + (i+1), this.schoolClasseForm.value.amount_fees / due_date_number));
        }
      }
    } else {
      this.schoolClasseForm.get('type_payment').patchValue("");
      this.showWarning('Veuillez sélectionner un fais et saisir le montant correspondant en premier.');
    }
  }

  public get feesList(): FormArray {
    return <FormArray>this.schoolClasseForm.get('fees');
  }

  public deleteFee(index: number): void {
    this.feesList.removeAt(index);
    this.feesList.markAsDirty();
  }

  createFeesGroup(label: any = "Paiement unique", due_amount: number = 0) {
    return this.fb.group({
      //type_fees_id: ['', [Validators.required]],
      label: [label, [Validators.required]],
      due_amount: [due_amount, [Validators.required]],
      due_date: ['', [Validators.required]],
    });
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
    this.classeService.listClasseOfSchool({school_id: this.tokenService.getSchoolId}).subscribe(
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
  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }

  showWarning(msg: string) {
    this.toastr.warning(msg, 'Attention');
  }

  closeAssignForm(){
    this.router.navigate(['espace/gestion-frais']);
  }

}
