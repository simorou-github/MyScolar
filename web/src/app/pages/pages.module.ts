import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';

import { NgApexchartsModule } from 'ng-apexcharts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { SimplebarAngularModule } from 'simplebar-angular';
import { LightboxModule } from 'ngx-lightbox';

import { WidgetModule } from '../shared/widget/widget.module';
import { UIModule } from '../shared/ui/ui.module';

// Emoji Picker
import { PickerModule } from '@ctrl/ngx-emoji-mart';

import { PagesRoutingModule } from './pages-routing.module';

import { DashboardsModule } from './dashboards/dashboards.module';
import { EcommerceModule } from './ecommerce/ecommerce.module';
import { CryptoModule } from './crypto/crypto.module';
import { EmailModule } from './email/email.module';
import { InvoicesModule } from './invoices/invoices.module';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { ContactsModule } from './contacts/contacts.module';
import { BlogModule } from "./blog/blog.module";
import { UtilityModule } from './utility/utility.module';
import { UiModule } from './ui/ui.module';
import { FormModule } from './form/form.module';
import { TablesModule } from './tables/tables.module';
import { IconsModule } from './icons/icons.module';
import { ChartModule } from './chart/chart.module';
import { CalendarComponent } from './calendar/calendar.component';
import { MapsModule } from './maps/maps.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChatComponent } from './chat/chat.component';

import { FilemanagerComponent } from './filemanager/filemanager.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { UrlPipe } from '../pipes/url.pipe';
import { InscriptionPendingComponent } from './inscription-pending/inscription-pending.component';
import { ClasseComponent } from './classe/classe.component';
import { SharedModule } from '../shared/shared.module';
import { InscriptionValidatedComponent } from './inscription-validated/inscription-validated.component';
import { AddClasseSchoolComponent } from './add-classe-school/add-classe-school.component';
import { FeesManagementComponent } from './fees-management/fees-management.component';
import { ClasseManagementComponent } from './classe-management/classe-management.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { SchoolStatisticsComponent } from './school-statistics/school-statistics.component';
import { StudentManagementComponent } from './student-management/student-management.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AssignFeesToClasseComponent } from './fees-management/assign-fees-to-classe/assign-fees-to-classe.component';
import { StudentListByClasseComponent } from './student-management/student-list-by-classe/student-list-by-classe.component';
import { OperatorComponent } from './parameters/operator/operator.component';
import { GroupeManagementComponent } from './groupe-management/groupe-management.component';
import { SystemParameterComponent } from './system-parameter/system-parameter.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManagePermissionComponent } from './manage-permission/manage-permission.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SchoolUserManagementComponent } from './school-user-management/school-user-management.component';
<<<<<<< HEAD
import { FeesBalanceFollowupComponent } from './statistics/fees-balance-followup/fees-balance-followup.component';
import { NgxCaptureService } from 'ngx-capture';
=======
import { NgxCaptureModule } from 'ngx-capture';
import { FeesBalanceFollowupComponent } from './statistics/fees-balance-followup/fees-balance-followup.component';
>>>>>>> 4bc17fd19b064b462d55d6d26d599ee7079a64bb

@NgModule({
  declarations: [CalendarComponent, ChatComponent, FilemanagerComponent, 
    StatisticsComponent, UrlPipe, InscriptionPendingComponent, ClasseComponent, InscriptionValidatedComponent, AddClasseSchoolComponent, FeesManagementComponent, ClasseManagementComponent, PaymentHistoryComponent, SchoolStatisticsComponent, StudentManagementComponent, AssignFeesToClasseComponent, StudentListByClasseComponent, OperatorComponent, GroupeManagementComponent, SystemParameterComponent, ManageUserComponent, ManagePermissionComponent, SchoolUserManagementComponent, FeesBalanceFollowupComponent],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    PagesRoutingModule,
    NgApexchartsModule,
    ReactiveFormsModule,
    DashboardsModule,
    CryptoModule,
    EcommerceModule,
    EmailModule,
    InvoicesModule,
    HttpClientModule,
    ProjectsModule,
    UIModule,
    TasksModule,
    ContactsModule,
    BlogModule,
    UtilityModule,
    UiModule,
    FormModule,
    TablesModule,
    IconsModule,
    ChartModule,
    WidgetModule,
    MapsModule,
    FullCalendarModule,
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    CollapseModule.forRoot(),
    SimplebarAngularModule,
    LightboxModule,
    PickerModule,
    PaginationModule.forRoot(),
    CKEditorModule,
    AccordionModule.forRoot(),
    SharedModule,
    NgxPaginationModule,
    NgxUiLoaderModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),
<<<<<<< HEAD
    NgxCaptureService
=======
    NgxCaptureModule
>>>>>>> 4bc17fd19b064b462d55d6d26d599ee7079a64bb
  ],
  providers: [DatePipe]
})
export class PagesModule { }
