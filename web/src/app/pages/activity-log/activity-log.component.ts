import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ActivityLogService } from 'src/app/services/activity-log.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {
  breadCrumbItems: Array<{}>;
  logs: any[] = [];
  logNames: string[] = [];
  isProcessing: boolean = false;
  isSearchForm: boolean = false;
  isSearching: boolean = false;
  searchForm!: FormGroup;
  p: number = 1;

  private readonly entityMap: Record<string, string> = {
    'App\\Models\\School'                 : 'École',
    'App\\Models\\User'                   : 'Utilisateur',
    'App\\Models\\Payment'                : 'Paiement',
    'App\\Models\\Student'                : 'Apprenant',
    'App\\Models\\Classe'                 : 'Classe',
    'App\\Models\\Role'                   : 'Rôle',
    'Spatie\\Permission\\Models\\Role'    : 'Rôle',
    'App\\Models\\SchoolClasseFees'       : 'Frais scolaires',
    'App\\Models\\Groupe'                 : 'Groupe',
    'App\\Models\\Parameter'             : 'Paramètre',
  };

  constructor(
    private fb: FormBuilder,
    private activityLogService: ActivityLogService,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService
  ) {}

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Administration' },
      { label: 'Journal d\'activité', active: true }
    ];

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    this.searchForm = this.fb.group({
      search      : [''],
      log_name    : [''],
      causer_name : [''],
      date_from   : [this.toDateStr(thirtyDaysAgo)],
      date_to     : [this.toDateStr(today)],
    });

    this.getLogs();
    this.getLogNames();
  }

  private toDateStr(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  getLogs() {
    this.isProcessing = true;
    this.ngxLoader.startLoader('loader-spin');
    this.activityLogService.getLogs(this.searchForm.value).subscribe({
      next: (v: any) => {
        if (v.status === 200) {
          this.logs = v.data;
        }
        this.isProcessing = false;
        this.isSearching = false;
        this.ngxLoader.stopLoader('loader-spin');
      },
      error: () => {
        this.isProcessing = false;
        this.isSearching = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.toastr.error('Erreur lors du chargement du journal', 'Erreur');
      }
    });
  }

  getLogNames() {
    this.activityLogService.getLogNames().subscribe({
      next: (v: any) => { if (v.status === 200) this.logNames = v.data; },
      error: () => {}
    });
  }

  search() {
    this.isSearching = true;
    this.p = 1;
    this.getLogs();
  }

  displaySearchForm(show: boolean) {
    this.isSearchForm = show;
    if (!show) {
      this.searchForm.patchValue({ search: '', log_name: '', causer_name: '' });
      this.getLogs();
    }
  }

  // ── Helpers pour le template ──────────────────────────
  getEntityLabel(subjectType: string): string {
    if (!subjectType) return '—';
    if (this.entityMap[subjectType]) return this.entityMap[subjectType];
    const parts = subjectType.split('\\');
    return parts[parts.length - 1];
  }

  getEventClass(event: string): string {
    const map: Record<string, string> = {
      created : 'al-event--created',
      updated : 'al-event--updated',
      deleted : 'al-event--deleted',
      login   : 'al-event--created',
      logout  : 'al-event--other',
      failed  : 'al-event--deleted',
    };
    return map[event] ?? 'al-event--other';
  }

  getEventLabel(event: string): string {
    const map: Record<string, string> = {
      created : 'Création',
      updated : 'Modification',
      deleted : 'Suppression',
      login   : 'Connexion',
      logout  : 'Déconnexion',
      failed  : 'Échec',
    };
    return map[event] ?? (event || '—');
  }

  getCauserDisplay(log: any): { name: string; email: string } {
    if (!log.causer) return { name: 'Système', email: '' };
    const name = `${log.causer.last_name ?? ''} ${log.causer.first_name ?? ''}`.trim();
    return { name: name || log.causer.email, email: log.causer.email ?? '' };
  }

  getCauserInitial(log: any): string {
    if (!log.causer) return 'S';
    return ((log.causer.last_name ?? log.causer.email ?? 'S').charAt(0)).toUpperCase();
  }

  getCategoryLabel(logName: string): string {
    const map: Record<string, string> = {
      inscription       : 'Inscription',
      utilisateur       : 'Utilisateur',
      'rôle'            : 'Rôle',
      paiement          : 'Paiement',
      école             : 'École',
      apprenant         : 'Apprenant',
      classe            : 'Classe',
      groupe            : 'Groupe',
      'frais-scolaires' : 'Frais scolaires',
      parametre         : 'Paramètre',
      authentification  : 'Authentification',
      default           : 'Système',
    };
    return map[logName] ?? (logName ? logName.charAt(0).toUpperCase() + logName.slice(1) : '—');
  }
}
