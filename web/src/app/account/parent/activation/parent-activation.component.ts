import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ParentInscriptionService } from 'src/app/services/parent-inscription.service';

@Component({
  selector: 'app-parent-activation',
  templateUrl: './parent-activation.component.html',
  styleUrls: ['./parent-activation.component.scss']
})
export class ParentActivationComponent implements OnInit {

  status: 'loading' | 'success' | 'error' = 'loading';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parentInscriptionService: ParentInscriptionService,
  ) { }

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.status = 'error';
      this.errorMessage = "Lien d'activation invalide.";
      return;
    }

    this.parentInscriptionService.activateAccount({ token }).subscribe({
      next: () => {
        this.status = 'success';
        setTimeout(() => this.router.navigate(['/account/parent/login']), 3500);
      },
      error: (e) => {
        this.status = 'error';
        this.errorMessage = e.error?.error ?? e.error?.message ?? "Ce lien est invalide ou a déjà été utilisé.";
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/account/parent/login']);
  }
}
