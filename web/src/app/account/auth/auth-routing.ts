import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { SignupComponent } from './signup/signup.component';
import { PasswordresetComponent } from './activation-account/passwordreset.component';
import { Register2Component } from './register2/register2.component';
import { Recoverpwd2Component } from './recoverpwd2/recoverpwd2.component';
import { InscriptionComponent } from './inscription/inscription.component';
import { PaiementScolaireComponent } from './paiement-scolaire/paiement-scolaire.component';
import { ScolarFaqComponent } from './scolar-faq/scolar-faq.component';
import { CustomResetPasswordComponent } from './custom-reset-password/custom-reset-password.component';

const routes: Routes = [
    {
        path: 'inscription',
        component: InscriptionComponent
    },
    {
        path: 'paiement-scolaire',
        component: PaiementScolaireComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: '',
        component: LoginComponent
    },
    {
        path: 'signup',
        component: SignupComponent
    },
    {
        path: 'signup-2',
        component: Register2Component
    },
    {
        path: 'activation-account',
        component: PasswordresetComponent
    },
    {
        path: 'recuperation-mot-de-passe',
        component: CustomResetPasswordComponent
    },
    {
        path: 'recoverpwd-2',
        component: Recoverpwd2Component
    },
    {
        path: 'scolar-faq',
        component: ScolarFaqComponent
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AuthRoutingModule { }
