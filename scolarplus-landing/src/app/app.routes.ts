import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CguComponent } from './pages/cgu/cgu.component';
import { ConfidentialiteComponent } from './pages/confidentialite/confidentialite.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'cgu', component: CguComponent },
  { path: 'confidentialite', component: ConfidentialiteComponent },
  { path: '**', redirectTo: '' }
];
