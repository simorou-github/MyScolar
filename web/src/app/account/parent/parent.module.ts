import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

import { UIModule } from 'src/app/shared/ui/ui.module';
import { SharedModule } from 'src/app/shared/shared.module';

import { ParentRoutingModule } from './parent-routing';
import { ParentInscriptionComponent } from './inscription/parent-inscription.component';
import { ParentLoginComponent } from './login/parent-login.component';
import { ParentActivationComponent } from './activation/parent-activation.component';
import { ParentSpaceLayoutComponent } from './space/layout/parent-space-layout.component';
import { ParentDashboardComponent } from './space/dashboard/parent-dashboard.component';
import { ParentFeesComponent } from './space/fees/parent-fees.component';

@NgModule({
  declarations: [
    ParentInscriptionComponent,
    ParentLoginComponent,
    ParentActivationComponent,
    ParentSpaceLayoutComponent,
    ParentDashboardComponent,
    ParentFeesComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    UIModule,
    SharedModule,
    ParentRoutingModule,
    PaginationModule.forRoot(),
    NgxPaginationModule,
    NgxUiLoaderModule,
  ],
})
export class ParentModule { }
