import { Component, OnInit, HostListener, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.6s ease', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(40px)' }),
          stagger(120, [animate('0.5s ease', style({ opacity: 1, transform: 'translateY(0)' }))])
        ], { optional: true })
      ])
    ])
  ]
})
export class HomeComponent implements OnInit {

  constructor(private sanitizer: DomSanitizer) {}
  scrolled = signal(false);
  mobileOpen = signal(false);
  consentVisible = signal(true);
  activeStep = signal(0);
  countSchools = signal(0);
  countStudents = signal(0);
  countPayments = signal(0);
  countersStarted = false;

  @ViewChild('statsSection') statsSection!: ElementRef;

  services = [
    {
      number: '01',
      icon: 'school',
      color: '#4A90D9',
      title: 'Espace École',
      desc: "En tant que promoteur d'école, université ou centre de formation, obtenez un espace numérique personnalisé pour administrer vos opérations.",
      tags: ['Tableau de bord', 'Multi-classes', 'Rapports']
    },
    {
      number: '02',
      icon: 'payments',
      color: '#10B981',
      title: 'Collecte de Frais',
      desc: "Avec Scolar Pay, les recouvrements de frais scolaires, universitaires et de formations sont rapides, sécurisés et traçables.",
      tags: ['Mobile Money', 'Instantané', 'Sécurisé']
    },
    {
      number: '03',
      icon: 'schedule',
      color: '#F47920',
      title: 'Paiements Progressifs',
      desc: "Parents et étudiants payez vos frais en plusieurs tranches selon le calendrier fixé par votre établissement, sans stress.",
      tags: ['Tranche', 'Flexible', 'Rappels']
    }
  ];

  values: { icon: SafeHtml; title: string; desc: string }[] = [];

  steps: { icon: SafeHtml; title: string; desc: string }[] = [];

  partners = [
    { name: 'Saint Pierre et Paul', subtitle: 'Complexe Scolaire, Galle' },
    { name: 'Notre-Dame des Apôtres', subtitle: 'Établissement Partenaire' },
    { name: 'Abbé F. NASCIMENTO', subtitle: 'Référent Académique' },
    { name: 'Le LAUREAT', subtitle: 'Partenaire Technologique' }
  ];

  solutions = [
    { name: 'Scolar Pay', desc: 'Paiements scolaires', color: '#4A90D9', active: true },
    { name: 'Scolar Educ', desc: 'Gestion pédagogique', color: '#F47920', active: false },
    { name: 'Scolar Link', desc: 'Communication école', color: '#10B981', active: false }
  ];

  ngOnInit() {
    const s = (svg: string): SafeHtml => this.sanitizer.bypassSecurityTrustHtml(svg);
    this.steps = [
      {
        icon: s(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`),
        title: 'Inscrivez votre école',
        desc: 'Créez votre espace école en quelques minutes, renseignez vos informations et obtenez votre accès.'
      },
      {
        icon: s(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="13" y2="16"/></svg>`),
        title: 'Configurez vos classes',
        desc: 'Déclarez vos classes, ajoutez vos élèves et définissez les frais à collecter par niveau.'
      },
      {
        icon: s(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/><path d="M9 7h6M9 11h4"/></svg>`),
        title: 'Recevez vos paiements',
        desc: 'Les parents paient directement par Mobile Money. Les fonds arrivent sur votre compte en temps réel.'
      },
      {
        icon: s(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`),
        title: 'Suivez vos finances',
        desc: 'Consultez vos tableaux de bord, exportez vos rapports et pilotez votre trésorerie sereinement.'
      }
    ];

    this.values = [
      {
        icon: s(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 2.63-1.44 4.92-3.57 6.16L15 18H9l-.43-2.84A7 7 0 0 1 12 2z"/><path d="M9 21h6"/><path d="M9.5 18h5"/></svg>`),
        title: 'Innovation',
        desc: `Veille technologique continue avec une équipe d'ingénieurs pointus pour apporter des solutions adaptées à l'écosystème éducatif africain.`
      },
      {
        icon: s(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`),
        title: 'Engagement',
        desc: `En tant que premier partenaire numérique scolaire, Scolar Plus renouvelle un engagement fort pour assurer un service qualifié à toutes les parties prenantes.`
      },
      {
        icon: s(`<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`),
        title: 'Satisfaction',
        desc: `Toutes les solutions fournies par Scolar Plus sont conçues dans le seul intérêt de satisfaire le système éducatif africain.`
      }
    ];

    const consent = localStorage.getItem('scolarplus_consent');
    if (consent === 'accepted') this.consentVisible.set(false);
    setInterval(() => {
      this.activeStep.set((this.activeStep() + 1) % this.steps.length);
    }, 3000);
  }

  @HostListener('window:scroll', [])
  onScroll() {
    this.scrolled.set(window.scrollY > 60);
    if (!this.countersStarted && window.scrollY > 400) {
      this.countersStarted = true;
      this.animateCounter('countSchools', 120, 2000);
      this.animateCounter('countStudents', 15000, 2500);
      this.animateCounter('countPayments', 98, 1800);
    }
  }

  animateCounter(key: 'countSchools' | 'countStudents' | 'countPayments', target: number, duration: number) {
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + increment, target);
      this[key].set(Math.floor(current));
      if (current >= target) clearInterval(interval);
    }, duration / steps);
  }

  acceptConsent() {
    localStorage.setItem('scolarplus_consent', 'accepted');
    this.consentVisible.set(false);
  }

  toggleMenu() {
    this.mobileOpen.update(v => !v);
  }

  setStep(i: number) {
    this.activeStep.set(i);
  }
}
