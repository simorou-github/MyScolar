import { Component, OnInit, HostListener, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
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

  values = [
    {
      icon: '💡',
      title: 'Innovation',
      desc: 'Veille technologique continue avec une équipe d\'ingénieurs pointus pour apporter des solutions adaptées à l\'écosystème éducatif africain.'
    },
    {
      icon: '🤝',
      title: 'Engagement',
      desc: 'En tant que premier partenaire numérique scolaire, Scolar Plus renouvelle un engagement fort pour assurer un service qualifié à toutes les parties prenantes.'
    },
    {
      icon: '⭐',
      title: 'Satisfaction',
      desc: 'Toutes les solutions fournies par Scolar Plus sont conçues dans le seul intérêt de satisfaire le système éducatif africain.'
    }
  ];

  steps = [
    { icon: '🏫', title: 'Inscrivez votre école', desc: 'Créez votre espace école en quelques minutes, renseignez vos informations et obtenez votre accès.' },
    { icon: '📋', title: 'Configurez vos classes', desc: 'Déclarez vos classes, ajoutez vos élèves et définissez les frais à collecter par niveau.' },
    { icon: '📲', title: 'Recevez vos paiements', desc: 'Les parents paient directement par Mobile Money. Les fonds arrivent sur votre compte en temps réel.' },
    { icon: '📊', title: 'Suivez vos finances', desc: 'Consultez vos tableaux de bord, exportez vos rapports et pilotez votre trésorerie sereinement.' }
  ];

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
