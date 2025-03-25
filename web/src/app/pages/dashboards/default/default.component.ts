import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { ParameterService } from 'src/app/services/parameter.service';
import { SchoolDashboardService } from 'src/app/services/school-dashboard.service';
import { SchoolService } from 'src/app/services/school.service';
import { TokenService } from 'src/app/shared/authentication/token.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss']
})
export class DefaultComponent implements OnInit {
  modalRef?: BsModalRef; academicYear: string = ''; schoolId: string = ''; isProcessing: boolean = false; info_fees: any;
  typeFees: any; page: any = 1; p: number = 1; schoolClasses: any; students: any; payments: any;

  isActive: string;
  message: string;
  feesNotAssigned: any;
  scNotAssigned: any;

  constructor(private modalService: BsModalService, private parameterService: ParameterService, private tokenService: TokenService,
    private schoolService: SchoolService, private schoolDashboard: SchoolDashboardService) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = this.tokenService.getSchoolId;
  }

  ngOnInit() {
    this.getListStudents();
    this.typeFeesList();
    this.classeList();
    this.getHistoryOfPayment();
    this.verifyFeesAsignement();
  }

  getHistoryOfPayment() {
    this.isProcessing = true;
    this.schoolService.getHistoryOfPayment({'school_id': this.schoolId}).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          if (v.status == 200) {
            this.payments = v.data;
          }
        },

        error: (e) => {
          console.error(e);
          this.message = 'Une erreur interne est survenue. Veuillez contacter le Service Support de ScolarPlus.';
        },
        complete: () => {
        }
      }
    )
  }
  
  typeFeesList() {
    this.parameterService.listTypeFees({ school_id: this.schoolId }).subscribe({
      next: (v: any) => {
        this.typeFees = v.data;
      }
    });
  }

  classeList() {
    this.isProcessing = true;
    this.schoolService.listSchoolClasse({ school_id: this.schoolId }).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          this.schoolClasses = v.data;
          this.isProcessing = false;
        }
      }
    });
  }
  config = {
    backdrop: true,
    ignoreBackdropClick: true
  };
  @ViewChild('notifDashboardModal') private notifDashboardModal;
  verifyFeesAsignement() {
    this.schoolDashboard.verifyFeesAssignement({ school_id: this.schoolId }).subscribe({
      next: (v: any) => {
        if (v.status == 200) {
          if (v.scNotAssigned.length > 0 || v.feesNotAssigned.length > 0){
            this.scNotAssigned = v.scNotAssigned;
            this.feesNotAssigned = v.feesNotAssigned;
            this.modalService.show(this.notifDashboardModal, { class: 'modal-lg'});
          }
        }
      }
    });
  }


  getListStudents() {
    this.isProcessing = true;
    this.schoolService.listStudents({ school_id: this.schoolId, academic_year: this.academicYear }).subscribe(
      {
        next: (v: any) => {
          if (v.status == 200) {
            this.students = v.data;
          } 
        },

        error: (e) => {
          console.error(e);
          this.message = 'Une erreur interne est survenue. Veuillez contacter le Service Support de ScolarPlus.';
        },

        complete: () => {

        }
      }
    )
  }


  closeModal() {
    this.modalService.hide();
  }
}
