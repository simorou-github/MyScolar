<<<<<<< HEAD
import { Component } from '@angular/core';
=======
import { Component, ViewChild } from '@angular/core';
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
import { ToastrService } from 'ngx-toastr';
import { ClasseService } from 'src/app/services/classe.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { SchoolService } from 'src/app/services/school.service';
import { StatisticsService } from 'src/app/services/scolar/statistics.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { FeesBalanceSearchModel } from './fees-balance-search.model';
<<<<<<< HEAD
=======
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09

@Component({
  selector: 'app-fees-balance-followup',
  templateUrl: './fees-balance-followup.component.html',
  styleUrls: ['./fees-balance-followup.component.scss']
})
export class FeesBalanceFollowupComponent {
<<<<<<< HEAD
  breadCrumbItems: Array<{}>;  classes: []; academicyears: []; isFilter: boolean; isProcessing: boolean = false;
  types_frais: []; schools: [any]; academicYear: string; schoolId: string;  p: number = 1;  feesBalanceDatas: [];
  searchFeesBalanceParam: FeesBalanceSearchModel = {};  sum_fees: number;  sum_balance: number;

  constructor(private schoolService: SchoolService, private toastr: ToastrService, private tokenService: TokenService,
    private classeService: ClasseService, private parameterService: ParameterService, private scolarService: StatisticsService,) {
=======
    breadCrumbItems: Array<{}>; classes: []; academicyears: []; isFilter: boolean; isProcessing: boolean = false;
  types_frais: []; schools: [any]; academicYear: string; schoolId: string; p: number = 1; feesBalanceDatas: [];
  searchFeesBalanceParam: FeesBalanceSearchModel = {}; sum_fees: number; sum_balance: number;
  isSchoolsList: boolean; img = ''; body = document.body;


  @ViewChild('screen', { static: true }) screen: any;

  constructor(private schoolService: SchoolService, private toastr: ToastrService, private tokenService: TokenService,
    private captureService: NgxCaptureService, private classeService: ClasseService, private parameterService: ParameterService,
    private scolarService: StatisticsService, private ngxLoader: NgxUiLoaderService,) {
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09

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
<<<<<<< HEAD
  getFeesBalanceFollowupData(data) {    
    this.isProcessing = true;
=======
  getFeesBalanceFollowupData(data) {
    this.ngxLoader.startLoader('loader-spin');
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
    this.scolarService.getFeesBalanceFollowupData(data).subscribe(
      {
        next: (v: any) => {
          this.feesBalanceDatas = v.data;
          this.sum_balance = v.sum_balance;
          this.sum_fees = v.sum_fees;
<<<<<<< HEAD
          this.isProcessing = false
          this.showSuccess(v.message);
        },
        error: (error) => {
          this.isProcessing = false;
=======
          this.ngxLoader.stopLoader('loader-spin');
          this.showSuccess(v.message);
        },
        error: (error) => {
          this.ngxLoader.stopLoader('loader-spin');
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
          this.showError(error);
          console.log(error)
        }
      }
    );
  }

  displayFilter() {
    this.isFilter = !this.isFilter;
  }

<<<<<<< HEAD
  resetForm(){
    this.searchFeesBalanceParam = {};    
=======
  resetForm() {
    this.searchFeesBalanceParam = {};
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
    this.searchFeesBalanceParam.academic_year = this.tokenService.getAcademicYear;
    this.searchFeesBalanceParam.school_id = this.tokenService.getSchoolId;
  }

  getAllClasses(): void {
    this.isProcessing = true;
<<<<<<< HEAD
    this.classeService.listClasseOfSchool({school_id: this.tokenService.getSchoolId}).subscribe(
=======
    this.classeService.listClasseOfSchool({ school_id: this.tokenService.getSchoolId }).subscribe(
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
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

<<<<<<< HEAD
=======
  getCapture() {
    this.captureService
      .getImage(this.screen.nativeElement, true)
      .pipe(
        tap((img: string) => {
          this.img = img;
          console.log(img);
        }),
        tap((img) => this.captureService.downloadImage(img))
      )
      .subscribe();
  }
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09

  listAccademicYear() {
    this.parameterService.listAccademicYear({}).subscribe({
      next: (v: any) => {
        this.academicyears = v.data;
      }
    });
  }

<<<<<<< HEAD

  getAllTypesFrais(): void {
    this.isProcessing = true;
=======
  getAllTypesFrais(): void {
    this.ngxLoader.startLoader('loader-spin');
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
    this.parameterService.listTypeFees({ school_id: this.tokenService.getSchoolId }).subscribe(
      {
        next: (v: any) => {
          this.types_frais = v.data;
          this.isProcessing = false;
<<<<<<< HEAD
        },
        error: (e) => {
          console.error(e);
          this.isProcessing = false;
=======
          this.ngxLoader.stopLoader('loader-spin');
        },
        error: (e) => {
          console.error(e);
          this.ngxLoader.stopLoader('loader-spin');
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
        },
        complete: () => {
        }
      }
    );
  }

  getAllSchools(): void {
<<<<<<< HEAD
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
=======

    this.ngxLoader.startLoader('loader-spin');
    this.schoolService.getAllSchool({ id: this.tokenService.getSchoolId }).subscribe(
      {
        next: (v: any) => {
          this.schools = v.data;
          this.ngxLoader.stopLoader('loader-spin');
          this.isSchoolsList = Array.isArray(this.schools);
        },
        error: (e) => {
          console.error(e);
          this.ngxLoader.stopLoader('loader-spin');        },
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
        complete: () => {
        }
      }
    );
  }

<<<<<<< HEAD
=======

  //Exporter to xls
  exportJournal() {
    this.searchFeesBalanceParam.file_type = 'xls';
    this.ngxLoader.startLoader('loader-spin');
    this.scolarService.exportJournal(this.searchFeesBalanceParam).subscribe((response: any) => {
      let blob = new Blob([response], { type: 'application/xls' });
      let downloadURL = window.URL.createObjectURL(response);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = "Solde_Paiement.xlsx";
      link.click();
      this.showSuccess("Exportation terminée avec succès.");
      this.ngxLoader.stopLoader('loader-spin');
    },
      error => {
        this.ngxLoader.stopLoader('loader-spin');
        this.showError("Impossible de joindre le serveur, contacter l'administrateur.");
      })
  }

  //Download in PDF
  downloadJournal() {
    this.ngxLoader.startLoader('loader-spin');
    this.searchFeesBalanceParam.file_type = 'pdf';
    this.scolarService.exportJournal(this.searchFeesBalanceParam).subscribe(
      (data: any) => {
        let blob = new Blob([data], { type: 'application/pdf' });
        let downloadURL = window.URL.createObjectURL(data);
        let link = document.createElement('a');
        link.href = downloadURL;
        link.download = "Solde_Paiement.pdf";
        link.click();
        this.ngxLoader.stopLoader('loader-spin');
      },
      (err: any) => {
        console.log(err);
        this.ngxLoader.stopLoader('loader-spin');
        this.showError("Impossible de joindre le serveur, contacter l'administrateur.");
      },
      () => {
      }
    )
  }

>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }
<<<<<<< HEAD
}
=======
}
>>>>>>> ef9072aedbdbefca4b8b1603a39d91b197849f09
