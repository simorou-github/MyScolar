import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ParentInscriptionComponent } from './inscription/parent-inscription.component';
import { ParentLoginComponent } from './login/parent-login.component';
import { ParentActivationComponent } from './activation/parent-activation.component';
import { ParentSpaceLayoutComponent } from './space/layout/parent-space-layout.component';
import { ParentDashboardComponent } from './space/dashboard/parent-dashboard.component';
import { ParentFeesComponent } from './space/fees/parent-fees.component';
import { ParentAuthGuard } from 'src/app/shared/authentication/parent-auth.guard';

const routes: Routes = [
  { path: '', component: ParentLoginComponent },
  { path: 'inscription', component: ParentInscriptionComponent },
  { path: 'login', component: ParentLoginComponent },
  { path: 'activation/:token', component: ParentActivationComponent },
  {
    path: 'space',
    component: ParentSpaceLayoutComponent,
    canActivate: [ParentAuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: ParentDashboardComponent },
      { path: 'fees/:studentId', component: ParentFeesComponent },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParentRoutingModule { }
