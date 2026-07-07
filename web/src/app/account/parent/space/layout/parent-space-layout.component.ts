import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ParentSpaceService } from 'src/app/services/parent-space.service';
import { ParentTokenService } from 'src/app/shared/authentication/parent-token.service';

@Component({
  selector: 'app-parent-space-layout',
  templateUrl: './parent-space-layout.component.html',
  styleUrls: ['./parent-space-layout.component.scss']
})
export class ParentSpaceLayoutComponent implements OnInit {

  firstName: string | null = null;
  lastName: string | null = null;

  constructor(
    private router: Router,
    private parentSpaceService: ParentSpaceService,
    private parentTokenService: ParentTokenService,
  ) { }

  ngOnInit(): void {
    this.firstName = this.parentTokenService.firstName;
    this.lastName = this.parentTokenService.lastName;
  }

  logout() {
    this.parentSpaceService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout() {
    this.parentTokenService.removeToken();
    this.router.navigate(['/parent/login']);
  }
}
