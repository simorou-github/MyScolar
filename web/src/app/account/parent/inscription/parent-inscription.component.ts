import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ParentInscriptionService } from 'src/app/services/parent-inscription.service';
import { SchoolInscriptionService } from 'src/app/services/school-inscription.service';
import {
  PHONE_COUNTRIES,
  PhoneCountry,
  getFlagEmoji,
  applyPhoneMask,
} from 'src/app/shared/data/phone-countries';

@Component({
  selector: 'app-parent-inscription',
  templateUrl: './parent-inscription.component.html',
  styleUrls: ['./parent-inscription.component.scss']
})
export class ParentInscriptionComponent implements OnInit {

  form!: FormGroup;
  countries: any[] = [];
  year: number = new Date().getFullYear();

  isProcessing = false;
  isEmailSent = false;
  isEmailValid = false;
  isPhoneSent = false;
  isPhoneValid = false;
  isDone = false;

  // Contrôle anti-robot (challenge arithmétique simple, sans dépendance externe)
  captchaA = Math.floor(Math.random() * 8) + 1;
  captchaB = Math.floor(Math.random() * 8) + 1;
  captchaAnswer: number | null = null;

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

  getFlagEmoji(code: string): string { return getFlagEmoji(code); }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const digits = input.value.replace(/\D/g, '');
    this.localPhone = applyPhoneMask(digits, this.selectedPhoneCountry.mask);
    input.value = this.localPhone;
    this.form.patchValue({ phone: this.fullPhone });
  }

  selectPhoneCountry(c: PhoneCountry) {
    this.selectedPhoneCountry = c;
    this.localPhone = '';
    this.countrySearch = '';
    this.showCountryDropdown = false;
    this.form.patchValue({ phone: '' });
    this.matchPhoneCountryToApiList();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.reg-phone-wrap')) {
      this.showCountryDropdown = false;
    }
  }

  closeDropdown() {
    this.showCountryDropdown = false;
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private ngxLoader: NgxUiLoaderService,
    private parentInscriptionService: ParentInscriptionService,
    private schoolInscriptionService: SchoolInscriptionService,
  ) { }

  ngOnInit(): void {
    this.listCountries();
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      email_code: [''],
      phone: ['', [Validators.required]],
      phone_code: [''],
      last_name: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
    });
  }

  get f() { return this.form.controls; }

  get captchaValid(): boolean {
    return this.captchaAnswer === (this.captchaA + this.captchaB);
  }

  listCountries() {
    this.schoolInscriptionService.countries().subscribe({
      next: (v: any) => {
        this.countries = v.data;
        this.matchPhoneCountryToApiList();
      },
      error: () => { }
    });
  }

  private normalizeStr(s: string): string {
    return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  }

  matchPhoneCountryToApiList() {
    if (!this.countries.length || !this.selectedPhoneCountry) { return; }
    const needle = this.normalizeStr(this.selectedPhoneCountry.name);
    const found = this.countries.find((c: any) =>
      this.normalizeStr(c.name ?? '') === needle
    );
    if (found) {
      this.form.patchValue({ country_id: found.id });
    }
  }

  get selectedCountryName(): string {
    const id = this.form.get('country_id')?.value;
    if (!id) { return this.selectedPhoneCountry.name; }
    const c = this.countries.find((x: any) => x.id == id);
    return c ? c.name : this.selectedPhoneCountry.name;
  }

  // ====== Étape 1 : email ======
  sendEmailOtp() {
    this.isProcessing = true;
    this.ngxLoader.startLoader('loader-spin');
    this.parentInscriptionService.sendEmailOtp({ email: this.f.email.value }).subscribe({
      next: (v: any) => {
        this.isEmailSent = true;
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

  resendEmailOtp() {
    this.parentInscriptionService.resendEmailOtp({ email: this.f.email.value }).subscribe({
      next: (v: any) => this.toastr.success(v.message, 'Succès'),
      error: (e) => this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur')
    });
  }

  verifyEmailOtp() {
    const code = this.f.email_code.value;
    if (!code || code.length < 6) { return; }
    this.isProcessing = true;
    this.ngxLoader.startLoader('loader-spin');
    this.parentInscriptionService.verifyEmailOtp({ email: this.f.email.value, code }).subscribe({
      next: (v: any) => {
        this.isEmailValid = true;
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.toastr.success(v.message, 'Succès');
      },
      error: (e) => {
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.f.email_code.setValue('');
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }

  get isPhoneReady(): boolean {
    return this.localPhone.replace(/\D/g, '').length >= 6;
  }

  // ====== Étape 2 : téléphone ======
  sendPhoneOtp() {
    if (!this.isPhoneReady) { return; }
    this.form.patchValue({ phone: this.fullPhone });
    this.isProcessing = true;
    this.ngxLoader.startLoader('loader-spin');
    this.parentInscriptionService.sendPhoneOtp({ email: this.f.email.value, phone: this.fullPhone }).subscribe({
      next: (v: any) => {
        this.isPhoneSent = true;
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

  verifyPhoneOtp() {
    const code = this.f.phone_code.value;
    if (!code || code.length < 6) { return; }
    this.isProcessing = true;
    this.ngxLoader.startLoader('loader-spin');
    this.parentInscriptionService.verifyPhoneOtp({ phone: this.fullPhone, code }).subscribe({
      next: (v: any) => {
        this.isPhoneValid = true;
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.toastr.success(v.message, 'Succès');
      },
      error: (e) => {
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.f.phone_code.setValue('');
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }

  // ====== Étape 3 : informations + anti-robot ======
  onSubmit() {
    if (!this.captchaValid) {
      this.toastr.error("Merci de résoudre correctement le contrôle anti-robot.", 'Erreur');
      return;
    }
    this.isProcessing = true;
    this.ngxLoader.startLoader('loader-spin');
    this.parentInscriptionService.createInscription({
      last_name: this.f.last_name.value,
      first_name: this.f.first_name.value,
      email: this.f.email.value,
      phone: this.fullPhone,
      country_id: this.f.country_id.value,
      // Jeton transmis au backend : si une clé reCAPTCHA Google est configurée côté serveur,
      // remplacer ce champ par le token retourné par le widget Google reCAPTCHA.
      recaptcha_token: 'self-hosted-check:' + this.captchaA + '+' + this.captchaB + '=' + this.captchaAnswer,
    }).subscribe({
      next: (v: any) => {
        this.isDone = true;
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.toastr.success(v.message, 'Inscription envoyée');
      },
      error: (e) => {
        this.isProcessing = false;
        this.ngxLoader.stopLoader('loader-spin');
        this.toastr.error(e.error?.error ?? e.error?.message, 'Erreur');
      }
    });
  }

  resetProcess() {
    this.isEmailSent   = false;
    this.isEmailValid  = false;
    this.isPhoneSent   = false;
    this.isPhoneValid  = false;
    this.localPhone    = '';
    this.countrySearch = '';
    this.showCountryDropdown = false;
    this.captchaA      = Math.floor(Math.random() * 8) + 1;
    this.captchaB      = Math.floor(Math.random() * 8) + 1;
    this.captchaAnswer = null;
    this.form.reset();
  }

  backToEmailStep() {
    this.isEmailSent  = false;
    this.isEmailValid = false;
    this.isPhoneSent  = false;
    this.isPhoneValid = false;
    this.localPhone   = '';
    this.form.patchValue({ email_code: '', phone_code: '', phone: '' });
  }

  backToPhoneStep() {
    this.isPhoneSent  = false;
    this.isPhoneValid = false;
    this.localPhone   = '';
    this.form.patchValue({ phone_code: '', phone: '' });
  }

  goToLogin() {
    this.router.navigate(['/parent/login']);
  }
}
