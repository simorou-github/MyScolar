import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';
import { CarouselModule } from 'ngx-owl-carousel-o';

import { UIModule } from '../../shared/ui/ui.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { Register2Component } from './register2/register2.component';
import { Recoverpwd2Component } from './recoverpwd2/recoverpwd2.component';

import { AuthRoutingModule } from './auth-routing';
import { PasswordresetComponent } from './activation-account/passwordreset.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaiementScolaireComponent } from './paiement-scolaire/paiement-scolaire.component';
import { NgxMaskDirective, NgxMaskPipe, provideNgxMask } from 'ngx-mask';
import { NgxPaginationModule } from 'ngx-pagination';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ScolarFaqComponent } from './scolar-faq/scolar-faq.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { CustomResetPasswordComponent } from './custom-reset-password/custom-reset-password.component';

@NgModule({
  declarations: [LoginComponent, SignupComponent, PasswordresetComponent, Register2Component, Recoverpwd2Component, InscriptionComponent, PaiementScolaireComponent, ScolarFaqComponent, CustomResetPasswordComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    NgxMaskPipe,
    AlertModule.forRoot(),
    UIModule,
    AuthRoutingModule,
    CarouselModule,
    BsDatepickerModule.forRoot(),
    NgxDropzoneModule,
    SharedModule,
    PaginationModule.forRoot(),    
    NgxPaginationModule,

    TabsModule.forRoot(),
  ],
  providers: [provideNgxMask()]
})
export class AuthModule { }
