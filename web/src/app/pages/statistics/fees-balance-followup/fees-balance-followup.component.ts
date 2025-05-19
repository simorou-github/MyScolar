import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ClasseService } from 'src/app/services/classe.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { SchoolService } from 'src/app/services/school.service';
import { StatisticsService } from 'src/app/services/scolar/statistics.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { FeesBalanceSearchModel } from './fees-balance-search.model';
import { NgxCaptureService } from 'ngx-capture';
import { tap } from 'rxjs';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-fees-balance-followup',
  templateUrl: './fees-balance-followup.component.html',
  styleUrls: ['./fees-balance-followup.component.scss']
})
export class FeesBalanceFollowupComponent {
    breadCrumbItems: Array<{}>; classes: []; academicyears: []; isFilter: boolean; isProcessing: boolean = false;
  types_frais: []; schools: [any]; academicYear: string; schoolId: string; p: number = 1; feesBalanceDatas: [];
  searchFeesBalanceParam: FeesBalanceSearchModel = {}; sum_fees: number; sum_balance: number;
  isSchoolsList: boolean; img = ''; body = document.body;


  @ViewChild('screen', { static: true }) screen: any;

  constructor(private schoolService: SchoolService, private toastr: ToastrService, private tokenService: TokenService,
    private captureService: NgxCaptureService, private classeService: ClasseService, private parameterService: ParameterService,
    private scolarService: StatisticsService, private ngxLoader: NgxUiLoaderService,) {

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
    this.ngxLoader.startLoader('loader-spin');
    this.scolarService.getFeesBalanceFollowupData(data).subscribe(
      {
        next: (v: any) => {
          this.feesBalanceDatas = v.data;
          this.sum_balance = v.sum_balance;
          this.sum_fees = v.sum_fees;
          this.ngxLoader.stopLoader('loader-spin');
          this.showSuccess(v.message);
        },
        error: (error) => {
          this.ngxLoader.stopLoader('loader-spin');
          this.showError(error);
          console.log(error)
        }
      }
    );
  }

  displayFilter() {
    this.isFilter = !this.isFilter;
  }

  resetForm() {
    this.searchFeesBalanceParam = {};
    this.searchFeesBalanceParam.academic_year = this.tokenService.getAcademicYear;
    this.searchFeesBalanceParam.school_id = this.tokenService.getSchoolId;
  }

  getAllClasses(): void {
    this.isProcessing = true;
    this.classeService.listClasseOfSchool({ school_id: this.tokenService.getSchoolId }).subscribe(
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

  listAccademicYear() {
    this.parameterService.listAccademicYear({}).subscribe({
      next: (v: any) => {
        this.academicyears = v.data;
      }
    });
  }

  getAllTypesFrais(): void {
    this.ngxLoader.startLoader('loader-spin');
    this.parameterService.listTypeFees({ school_id: this.tokenService.getSchoolId }).subscribe(
      {
        next: (v: any) => {
          this.types_frais = v.data;
          this.isProcessing = false;
          this.ngxLoader.stopLoader('loader-spin');
        },
        error: (e) => {
          console.error(e);
          this.ngxLoader.stopLoader('loader-spin');
        },
        complete: () => {
        }
      }
    );
  }

  getAllSchools(): void {

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
        complete: () => {
        }
      }
    );
  }


  //Exporter to xls
  exportJournal() {
    this.searchFeesBalanceParam.file_type = 'xls';
    this.ngxLoader.startLoader('loader-spin');
    this.scolarService.exportJournal(this.searchFeesBalanceParam).subscribe((response: any) => {
      let blob = new Blob([response], { type: 'application/xls' });
      let downloadURL = window.URL.createObjectURL(response);
      let link = document.createElement('a');
      link.href = downloadURL;
      link.download = "Solde_Paiement.xls";
      link.click();
      this.showError("Exportation terminée avec succès.");
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

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }
}