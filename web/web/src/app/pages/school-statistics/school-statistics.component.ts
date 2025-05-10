import { Component, OnInit } from '@angular/core';

import { SchoolService } from 'src/app/services/school.service';
import { ParameterService } from 'src/app/services/parameter.service';
import { ClasseService } from 'src/app/services/classe.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TokenService } from 'src/app/shared/authentication/token.service';
import { ChartType } from '../chart/apex/apex.model';

@Component({
  selector: 'app-school-statistics',
  templateUrl: './school-statistics.component.html',
  styleUrls: ['./school-statistics.component.scss']
})

export class SchoolStatisticsComponent implements OnInit {

  statForm!: FormGroup; display_stat: boolean = false; isProcessing: boolean = false; option_graphic: any;
  
  message: any; amounts: any; displayPaymentByTypeFees: boolean = false; displayYearPaymentPerMonth: boolean = false;
  
  academicYear: string; schoolId: string; schoolName: string; stats: any; typeFees: any; classes: any;  distinctYears: any; 
  
  isFilter: boolean = false; paymentAggregationByTypeFeesData: any; p1: number = 1; totalOfPaymentAggregationByTypeFeesData = 0; 
  
  linewithDataChart: ChartType; simplePieChart: ChartType; paymentByYearData: any;

  constructor(private fb: FormBuilder, private tokenService: TokenService, private schoolService: SchoolService, private parameterService: ParameterService,
    private classeService: ClasseService) {
    this.academicYear = this.tokenService.getAcademicYear;
    this.schoolId = this.tokenService.getSchoolId;
    this.schoolName = this.tokenService.getSocialReasonSchool;

    this.pieChartStructure();
    this.linewithDataChartStructure();

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

  ngOnInit() {
    this.getPaymentAggregationByTypeFees();
    this.typeFeesList();
    this.distinctAcademicYears();
    this.getYearPaymentPerMonth();
  }


  typeFeesList() {
    this.parameterService.listTypeFees({ school_id: this.schoolId }).subscribe({
      next: (v: any) => {
        this.typeFees = v.data;
        //console.log(this.typeFees)
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

  //Get Data for Graphique des Paiements reçus
  getPaymentAggregationByTypeFees() {
    this.isProcessing = true;
    this.schoolService.getPaymentAggregationByTypeFees({'school_id': this.schoolId}).subscribe(
      {
        next: (v: any) => {
          this.paymentAggregationByTypeFeesData = v.data;
          console.log(this.paymentAggregationByTypeFeesData)
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
    this.schoolService.getYearPaymentPerMonth({'school_id': this.schoolId}).subscribe(
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
      series: [
        {
          name: 'High - 2018',
          data: [26000, 24000, 3200, 36000, 3300, 310, 33]
      }
      ],
      title: {
        text: 'Evolution des transactions par type de frais',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        },
        borderColor: '#1C2833'
      },
      markers: {
        style: 'inverted',
        size: 6
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

}
