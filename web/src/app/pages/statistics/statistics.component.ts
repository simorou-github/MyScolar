import { Component, } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ClasseService } from 'src/app/services/classe.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { SchoolService } from 'src/app/services/school.service';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { ChartType } from '../chart/apex/apex.model';
import { StatisticsService } from 'src/app/services/scolar/statistics.service';


@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss']
})
export class StatisticsComponent {
  loading: boolean = false;  isProcessing: boolean = false;  message: any;  payments: any;
  classes: any; schools: any; types_frais: any; breadCrumbItems: Array<{}>;
  statForm!: FormGroup; display_stat: boolean = false; option_graphic: any;
  amounts: any; displayPaymentByTypeFees: boolean = false; displayYearPaymentPerMonth: boolean = false;
  
  academicYear: string; schoolId: string; schoolName: string; stats: any; typeFees: any; distinctYears: any; 
  
  isFilter: boolean = false; paymentAggregationByTypeFeesData: any; p1: number = 1; totalOfPaymentAggregationByTypeFeesData = 0; 
  
  linewithDataChart: ChartType; simplePieChart: ChartType; paymentByYearData: any;
  operators: any;
  academicyears: any;

  
  constructor(private schoolService: SchoolService, private scolarService: StatisticsService, private toastr: ToastrService, private tokenService: TokenService,
    private classeService: ClasseService, private parameterService: ParameterService){
      this.academicYear = this.tokenService.getAcademicYear;
      this.schoolId = this.tokenService.getSchoolId;
      this.schoolName = this.tokenService.getSocialReasonSchool;
  
      this.pieChartStructure();
      this.linewithDataChartStructure();
  }
  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'STATISTIQUES' }, { label: '', active: true }];
    //this.getAllTypesFrais(); 
    this.getAllSchools();
    this.getHistoryOfPayment()
    this.operatorList();
    this.listAccademicYear();

  }
  
  getHistoryOfPayment(data: any = {}) {
    this.getPaymentAggregationByTypeFees();
    this.getYearPaymentPerMonth();
  }
  

  displayFilter(){
    this.isFilter = !this.isFilter;
  }

  listAccademicYear() {
    this.parameterService.listAccademicYear({}).subscribe({
      next: (v: any) => {
        this.academicyears = v.data;
        console.log(v.data);
      }
    });
  }

  operatorList() {
    this.parameterService.listOperator({}).subscribe({
      next: (v: any) => {
        this.operators = v.data;
      }
    });
  }
  
  distinctAcademicYears(): void {
    this.parameterService.distinctAcademicYear().subscribe(
      {
        next: (v: any) => {
          this.distinctYears = v.data;
        },
      }
    );
  }

  displayFilterScrean() {
    this.isFilter = !this.isFilter;
  }

  pieChartStructure(fees_label: any = [], fees_amounts: any = []) {
    this.simplePieChart = {
      chart: {
        height: 320,
        type: 'pie',
      },
      series: fees_amounts,
      labels: fees_label,
      colors: ['#34c38f', '#556ee6', '#f46a6a', '#50a5f1', '#f1b44c', '#f1b452'],
      legend: {
        show: true,
        position: 'bottom',
        horizontalAlign: 'center',
        verticalAlign: 'middle',
        floating: false,
        fontSize: '14px',
        offsetX: 0,
        offsetY: -10
      },
      responsive: [{
        breakpoint: 600,
        options: {
          chart: {
            height: 240
          },
          legend: {
            show: false
          },
        }
      }]
    };
  }

  
  //Get Data for Graphique des Paiements reçus
  getPaymentAggregationByTypeFees() {
    this.isProcessing = true;
    this.scolarService.getPaymentAggregationByTypeFees({'school_id': this.schoolId}).subscribe(
      {
        next: (v: any) => {
          this.paymentAggregationByTypeFeesData = v.data;
          this.totalOfPaymentAggregationByTypeFeesData = v.total;
          this.amounts = v.amounts;
          this.pieChartStructure(this.amounts?.type_fees, this.amounts?.amount);
          this.isProcessing = false
        },
      }
    );
  }

  //Total des Paiement Reçus dans l'année mois par mois
  getYearPaymentPerMonth() {
    this.isProcessing = true;
    this.scolarService.getYearPaymentPerMonth({'school_id': this.schoolId}).subscribe(
      {
        next: (v: any) => {
          this.paymentByYearData = v.data;  
          this.linewithDataChartStructure(this.paymentByYearData, v.max_amount);
          this.isProcessing = false
        },
      }
    );
  }

  linewithDataChartStructure(data: any = [], max_amount = 0) {

    this.linewithDataChart = {
      chart: {
        height: 480,
        type: 'line',
        
        zoom: {
          enabled: false
        },
        toolbar: {
          show: false
        }
      },
      colors: ['#2874A6', '#145A32','#784212', '#545454', '#DC7633', '#AF7AC5', '#F1C40F'],
      dataLabels: {
        enabled: true,
      },
      
      stroke: {
        width: [3, 3],
        curve: 'straight'
      },
      series: data,
      title: {
        text: 'Evolution des transactions par type de frais',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent', 'transparent', 'transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
        borderColor: '#1C2833'
      },
      markers: {
        style: 'inverted',
        size: 6,
      },
      xaxis: {
        categories: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Dec'],
        title: {
          text: 'Mois'
        }
      },
      yaxis: {
        title: {
          text: 'Montants'
        },
        min: 1000,
        max: max_amount
      },
      legend: {
        position: 'top',
        horizontalAlign: 'right',
        floating: true,
        offsetY: -25,
        offsetX: -5
      },
      responsive: [{
        breakpoint: 600,
        options: {
          chart: {
            toolbar: {
              show: false
            }
          },
          legend: {
            show: false
          },
        }
      }]
    };
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
  
  getAllTypesFrais(): void {
    this.parameterService.listTypeFees({school_id: this.tokenService.getSchoolId}).subscribe(
      {
        next: (v: any) => {
          this.types_frais = v.data;
        },
        error: (e) => {
          console.error(e);
        },
        complete: () => {
        }
      }
    );
  }
  
  getAllSchools(): void {
    this.schoolService.getAllSchool({}).subscribe(
      {
        next: (v: any) => {
          this.schools = v.data;
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


}
