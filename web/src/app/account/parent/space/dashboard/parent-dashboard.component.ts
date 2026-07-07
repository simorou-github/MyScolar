import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParentSpaceService } from 'src/app/services/parent-space.service';
import { ParentInscriptionService } from 'src/app/services/parent-inscription.service';

@Component({
  selector: 'app-parent-dashboard',
  templateUrl: './parent-dashboard.component.html',
  styleUrls: ['./parent-dashboard.component.scss']
})
export class ParentDashboardComponent implements OnInit {

  links: any[] = [];
  validatedLinks: any[] = [];
  pendingLinks: any[] = [];
  rejectedLinks: any[] = [];

  // Dashboard résumé frais
  showDashboard = false;
  dashboardLoading = false;
  dashboardData: { [studentId: string]: { sum_fees: number; sum_balance: number; student: any } } = {};

  get globalSumFees(): number {
    return Object.values(this.dashboardData).reduce((acc, d) => acc + (d.sum_fees ?? 0), 0);
  }
  get globalPaid(): number {
    return Object.values(this.dashboardData).reduce((acc, d) => acc + ((d.sum_fees ?? 0) - (d.sum_balance ?? 0)), 0);
  }
  get globalBalance(): number {
    return Object.values(this.dashboardData).reduce((acc, d) => acc + (d.sum_balance ?? 0), 0);
  }

  searchForm!: FormGroup;
  isSearching = false;
  foundStudent: any = null;
  searchError: string = '';
  showSearchPanel = false;
  isRequesting = false;
  schools: any[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private parentSpaceService: ParentSpaceService,
    private parentInscriptionService: ParentInscriptionService,
  ) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      code_scolar: ['', [Validators.required]],
      birth_day:   ['', [Validators.required]],
      school_id:   ['', [Validators.required]],
    });

    this.loadLinks();
  }

  loadLinks() {
    this.ngxLoader.startLoader('loader-spin');
    this.parentSpaceService.myLinks().subscribe({
      next: (v: any) => {
        this.links = v.data;
        this.validatedLinks = this.links.filter(l => l.status === 'VALIDE');
        this.pendingLinks = this.links.filter(l => l.status === 'PENDING');
        this.rejectedLinks = this.links.filter(l => l.status === 'REJETE');
        this.ngxLoader.stopLoader('loader-spin');
        this.loadDashboard();
      },
      error: () => this.ngxLoader.stopLoader('loader-spin')
    });
  }

  toggleDashboard() {
    this.showDashboard = !this.showDashboard;
    if (this.showDashboard && !Object.keys(this.dashboardData).length) {
      this.loadDashboard();
    }
  }

  loadDashboard() {
    if (!this.validatedLinks.length) { return; }
    this.dashboardLoading = true;
    this.dashboardData = {};
    let done = 0;
    for (const link of this.validatedLinks) {
      this.parentSpaceService.getStudentBalance({ student_id: link.student?.id }).subscribe({
        next: (v: any) => {
          this.dashboardData[link.student?.id] = {
            sum_fees:    v.sum_fees   ?? 0,
            sum_balance: v.sum_balance ?? 0,
            student:     v.student    ?? link.student,
          };
          if (++done === this.validatedLinks.length) { this.dashboardLoading = false; }
        },
        error: () => { if (++done === this.validatedLinks.length) { this.dashboardLoading = false; } }
      });
    }
  }

  selectedSchoolLabel: string = '';

  searchSchools(term: string) {
    if (!term || term.length < 2) { this.schools = []; return; }
    this.parentInscriptionService.searchSchools({ social_reason: term }).subscribe({
      next: (v: any) => { this.schools = v.data; },
      error: () => { this.schools = []; }
    });
  }

  pickSchool(school: any) {
    this.searchForm.patchValue({ school_id: school.id });
    this.selectedSchoolLabel = school.social_reason + (school.location ? ' · ' + school.location : '');
    this.schools = [];
  }

  toggleSearchPanel() {
    this.showSearchPanel = !this.showSearchPanel;
    this.foundStudent = null;
    this.searchError = '';
  }

  searchStudent() {
    if (this.searchForm.invalid) { return; }
    this.isSearching = true;
    this.foundStudent = null;
    this.searchError = '';
    this.parentSpaceService.searchStudent(this.searchForm.value).subscribe({
      next: (v: any) => {
        this.foundStudent = v.data;
        this.isSearching = false;
      },
      error: (e) => {
        this.isSearching = false;
        this.searchError = e.error?.error ?? e.error?.message ?? "Aucun apprenant trouvé.";
      }
    });
  }

  requestLink() {
    this.isRequesting = true;
    this.parentSpaceService.requestLink(this.searchForm.value).subscribe({
      next: (v: any) => {
        this.isRequesting = false;
        this.toastr.success(v.message, 'Demande envoyée');
        this.foundStudent = null;
        this.showSearchPanel = false;
        this.searchForm.reset();
        this.loadLinks();
      },
      error: (e) => {
        this.isRequesting = false;
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }

  goToFees(studentId: string) {
    this.router.navigate(['/parent/space/fees', studentId]);
  }
}
