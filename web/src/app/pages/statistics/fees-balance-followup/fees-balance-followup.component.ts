import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClasseService } from 'src/app/services/classe.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { SchoolService } from 'src/app/services/school.service';
import { StatisticsService } from 'src/app/services/scolar/statistics.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { FeesBalanceSearchModel } from './fees-balance-search.model';

@Component({
  selector: 'app-fees-balance-followup',
  templateUrl: './fees-balance-followup.component.html',
  styleUrls: ['./fees-balance-followup.component.scss']
})
export class FeesBalanceFollowupComponent {
  breadCrumbItems: Array<{}>;  classes: []; academicyears: []; isFilter: boolean; isProcessing: boolean = false;
  types_frais: []; schools: [any]; academicYear: string; schoolId: string;  p: number = 1;  feesBalanceDatas: [];
  searchFeesBalanceParam: FeesBalanceSearchModel = {};  sum_fees: number;  sum_balance: number;

  constructor(private schoolService: SchoolService, private toastr: ToastrService, private tokenService: TokenService,
    private classeService: ClasseService, private parameterService: ParameterService, private scolarService: StatisticsService,) {

  }
  ngOnInit(): void {
    this.searchFeesBalanceParam.academic_year = this.tokenService.getAcademicYear;
    this.searchFeesBalanceParam.school_id = this.tokenService.getSchoolId;
    this.breadCrumbItems = [{ label: '' }, { label: '', active: true }];
    this.getAllTypesFrais();
    this.getAllSchools();
    this.getAllClasses();
    this.getFeesBalanceFollowupData(this.searchFeesBalanceParam);
    this.listAccademicYear();
  }


  //Get Data for Graphique des Paiements reçus
  getFeesBalanceFollowupData(data) {    
    this.isProcessing = true;
    this.scolarService.getFeesBalanceFollowupData(data).subscribe(
      {
        next: (v: any) => {
          this.feesBalanceDatas = v.data;
          this.sum_balance = v.sum_balance;
          this.sum_fees = v.sum_fees;
          this.isProcessing = false
          this.showSuccess(v.message);
        },
        error: (error) => {
          this.isProcessing = false;
          this.showError(error);
          console.log(error)
        }
      }
    );
  }

  displayFilter() {
    this.isFilter = !this.isFilter;
  }

  resetForm(){
    this.searchFeesBalanceParam = {};    
    this.searchFeesBalanceParam.academic_year = this.tokenService.getAcademicYear;
    this.searchFeesBalanceParam.school_id = this.tokenService.getSchoolId;
  }

  getAllClasses(): void {
    this.isProcessing = true;
    this.classeService.listClasseOfSchool({school_id: this.tokenService.getSchoolId}).subscribe(
      {
        next: (v: any) => {
          this.classes = v.data;
          this.isProcessing = false;
        },
        error: (e) => {
          console.log(e);
          this.isProcessing = false;
        },
        complete: () => {
        }
      }
    );
  }

  displayFilterScrean() {
    this.isFilter = !this.isFilter;

  }


  listAccademicYear() {
    this.parameterService.listAccademicYear({}).subscribe({
      next: (v: any) => {
        this.academicyears = v.data;
      }
    });
  }


  getAllTypesFrais(): void {
    this.isProcessing = true;
    this.parameterService.listTypeFees({ school_id: this.tokenService.getSchoolId }).subscribe(
      {
        next: (v: any) => {
          this.types_frais = v.data;
          this.isProcessing = false;
        },
        error: (e) => {
          console.error(e);
          this.isProcessing = false;
        },
        complete: () => {
        }
      }
    );
  }

  getAllSchools(): void {
    this.isProcessing = true;
    this.schoolService.getAllSchool({id: this.tokenService.getSchoolId}).subscribe(
      {
        next: (v: any) => {
          this.schools = v.data;
          this.isProcessing = false;
        },
        error: (e) => {
          console.error(e);
          this.isProcessing = false;
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
}
