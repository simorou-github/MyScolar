import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParentAuthService } from 'src/app/services/parent-auth.service';
import { ParentInscriptionService } from 'src/app/services/parent-inscription.service';
import { ParentTokenService } from 'src/app/shared/authentication/parent-token.service';
import {
  PHONE_COUNTRIES,
  PhoneCountry,
  getFlagEmoji,
  applyPhoneMask,
} from 'src/app/shared/data/phone-countries';

@Component({
  selector: 'app-parent-login',
  templateUrl: './parent-login.component.html',
  styleUrls: ['./parent-login.component.scss']
})
export class ParentLoginComponent implements OnInit {

  form!: FormGroup;
  year: number = new Date().getFullYear();
  isProcessing = false;
  otpSent = false;
  isActivating = false;

  // Sélecteur de pays / indicatif téléphonique
  phoneCountries: PhoneCountry[] = PHONE_COUNTRIES;
  selectedPhoneCountry: PhoneCountry = PHONE_COUNTRIES.find(c => c.code === 'BJ') ?? PHONE_COUNTRIES[0];
  localPhone = '';
  countrySearch = '';
  showCountryDropdown = false;

  get filteredPhoneCountries(): PhoneCountry[] {
    if (!this.countrySearch) { return this.phoneCountries; }
    const q = this.countrySearch.toLowerCase();
    return this.phoneCountries.filter(c =>
      c.name.toLowerCase().includes(q) || c.dialCode.includes(q)
    );
  }

  get fullPhone(): string {
    const digits = this.localPhone.replace(/\D/g, '');
    return this.selectedPhoneCountry.dialCode + digits;
  }

  get phonePlaceholder(): string {
    return this.selectedPhoneCountry.mask.replace(/#/g, '0');
  }

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private parentAuthService: ParentAuthService,
    private parentInscriptionService: ParentInscriptionService,
    private parentTokenService: ParentTokenService,
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      code: [''],
    });

    this.route.queryParams.subscribe(params => {
      if (params['activation_token']) {
        this.isActivating = true;
        this.ngxLoader.startLoader('loader-spin');
        this.parentInscriptionService.activateAccount({ token: params['activation_token'] }).subscribe({
          next: (v: any) => {
            this.isActivating = false;
            this.ngxLoader.stopLoader('loader-spin');
            this.toastr.success(v.message, 'Compte activé');
          },
          error: (e) => {
            this.isActivating = false;
            this.ngxLoader.stopLoader('loader-spin');
            this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
          }
        });
      }
    });
  }

  get f() { return this.form.controls; }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.lp-phone-wrap')) {
      this.showCountryDropdown = false;
    }
  }

  getFlagEmoji(code: string): string { return getFlagEmoji(code); }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    this.localPhone = applyPhoneMask(digits, this.selectedPhoneCountry.mask);
    input.value = this.localPhone;
  }

  selectPhoneCountry(c: PhoneCountry) {
    this.selectedPhoneCountry = c;
    this.localPhone = '';
    this.countrySearch = '';
    this.showCountryDropdown = false;
  }

  closeDropdown() {
    setTimeout(() => { this.showCountryDropdown = false; }, 150);
  }

  get isPhoneReady(): boolean {
    const digits = this.localPhone.replace(/\D/g, '');
    return digits.length >= 6;
  }

  requestOtp() {
    if (!this.isPhoneReady) { return; }
    this.isProcessing = true;
    this.ngxLoader.startLoader('loader-spin');
    this.parentAuthService.requestLoginOtp({ phone: this.fullPhone }).subscribe({
      next: (v: any) => {
        this.otpSent = true;
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.toastr.success(v.message, 'Succès');
      },
      error: (e) => {
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }

  verifyOtp() {
    const code = this.f.code.value;
    if (!code || code.length < 6) { return; }
    this.isProcessing = true;
    this.ngxLoader.startLoader('loader-spin');
    this.parentAuthService.verifyLoginOtp({ phone: this.fullPhone, code }).subscribe({
      next: (v: any) => {
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.parentTokenService.setToken(v.access_token);
        this.toastr.success(v.message, 'Connexion réussie');
        this.router.navigate(['/parent/space/dashboard']);
      },
      error: (e) => {
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.f.code.setValue('');
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }

  changePhone() {
    this.otpSent = false;
    this.f.code.setValue('');
  }
}
