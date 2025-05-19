import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './dashboards/default/default.component';
import { InscriptionPendingComponent } from './inscription-pending/inscription-pending.component';
import { ClasseComponent } from './classe/classe.component';
import { InscriptionValidatedComponent } from './inscription-validated/inscription-validated.component';
import { AddClasseSchoolComponent } from './add-classe-school/add-classe-school.component';
import { FeesManagementComponent } from './fees-management/fees-management.component';
import { ClasseManagementComponent } from './classe-management/classe-management.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { SchoolStatisticsComponent } from './school-statistics/school-statistics.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { AssignFeesToClasseComponent } from './fees-management/assign-fees-to-classe/assign-fees-to-classe.component';
import { StudentListByClasseComponent } from './student-management/student-list-by-classe/student-list-by-classe.component';
import { OperatorComponent } from './parameters/operator/operator.component';
import { GroupeManagementComponent } from './groupe-management/groupe-management.component';
import { SystemParameterComponent } from './system-parameter/system-parameter.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManagePermissionComponent } from './manage-permission/manage-permission.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { SchoolUserManagementComponent } from './school-user-management/school-user-management.component';
import { FeesBalanceFollowupComponent } from './statistics/fees-balance-followup/fees-balance-followup.component';

const routes: Routes = [
  // { path: '', redirectTo: 'dashboard' },
  {
    path: "",
    component: DefaultComponent
  },
  { path: 'dashboard', component: DefaultComponent },
  { path: 'inscription-en-attente', component: InscriptionPendingComponent },
  { path: 'inscription-validee', component: InscriptionValidatedComponent },
  { path: 'classes', component: ClasseComponent },
  { path: 'ajout-classe-ecole', component: AddClasseSchoolComponent },

  { path: 'espace/gestion-groupe', component: GroupeManagementComponent },
  { path: 'espace/gestion-frais', component: FeesManagementComponent },
  { path: 'espace/gestion-classe', component: ClasseManagementComponent },
  { path: 'espace/gestion-apprenant', component: StudentManagementComponent },
  { path: 'espace/historiques-paiements', component: PaymentHistoryComponent },
  { path: 'espace/statistiques', component: SchoolStatisticsComponent },
  { path: 'espace/user-management', component: SchoolUserManagementComponent },

  { path: 'espace/assign-fees-to-classe/:id', component: AssignFeesToClasseComponent },
  { path: 'espace/gestion-classe/list-apprenant/:id', component:  StudentListByClasseComponent},

  { path: 'scolar/operators', component: OperatorComponent },
  { path: 'scolar/system-parameter', component: SystemParameterComponent },
  { path: 'scolar/manage-user', component: ManageUserComponent },
  { path: 'scolar/manage-permission', component: ManagePermissionComponent },
  { path: 'scolar/statistics', component: StatisticsComponent },
  { path: 'scolar/fees-balance-followup', component: FeesBalanceFollowupComponent },


  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
