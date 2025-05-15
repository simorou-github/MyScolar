import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AuthenticationService } from '../../../core/services/auth.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ActivatedRoute, Router } from '@angular/router';

import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { InscriptionService } from '../../../services/inscription.service';
import { PasswordValidator } from '../../../validators/password.validator';
import { SchoolInscriptionService } from 'src/app/services/school-inscription.service';
import { SchoolService } from 'src/app/services/school.service';
import { School } from 'src/app/interfaces/school';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.scss']
})
export class InscriptionComponent {
  isEmailSent: boolean = false; countries: any[] = []; cities: any[] = []; cities_filtered: any[] = [];

  num_code: string = ''; mask_template: string = '00 00 00 00'; schoolId: string = ''; isTwiceSubmission: boolean = false;

  file: File = null; filedata: any;

  constructor(private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router, private authenticationService: AuthenticationService,
    private inscriptionService: InscriptionService, private toastr: ToastrService,
    private school_inscription_service: SchoolInscriptionService, private school_service: SchoolService) { }
  registerForm!: FormGroup; codeLenght: number = 0; loading: boolean = false; isProcessing: boolean = false;
  submitted: any = false; error: any = ''; returnUrl: string; school: School;
  // bread crumb items
  breadCrumbItems: Array<{}>;
  files: File[] = []; isEmailValid: boolean = false; message: string = '';

  // set the currenr year
  year: number = new Date().getFullYear();


  ngOnInit(): void {
    this.breadCrumbItems = [{ label: 'Forms' }, { label: 'Form File Upload', active: true }];
    this.listCountries();
    this.listCities();
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}'), Validators.minLength(8)]],
      first_name: ['', [Validators.required, Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(80)]],
      last_name: ['', [Validators.required, Validators.required, Validators.pattern('^[a-zA-Z]+$'), Validators.maxLength(40)]],
      location: ['', [Validators.required]],
      country_id: ['', [Validators.required]],
      city_id: ['', [Validators.required]],
      tel: ['', Validators.required],
      ifu: ['',],
      phone_code: [{ value: '', disabled: true }],
      type: ['', [Validators.required]],
      social_reason: [''],
      code_verification: ['', [Validators.required]],
      password_conf: [''],
      document: ['']
    },
      {
        validator: [PasswordValidator('password', 'password_conf'),],
      });

    this.route.queryParams.subscribe(params => {
      if (params['sci']) {
        this.schoolId = params['sci'];
        this.loading = true;
        this.school_service.getSchoolDetail({ id: this.schoolId }).subscribe({
          next: (v: any) => {
            this.message = v.message;
            // Variable pour tester si c'est une première soumission
            this.isTwiceSubmission = true;
            this.school = v.data;
            this.registerForm.patchValue(this.school);
            this.registerForm.patchValue({
              'last_name': this.school?.owner_lastname, 'first_name': this.school?.owner_firstname,
              type: "ecole", code_verification: "123456"
            });
            this.getCityByCountry(this.registerForm.get('country_id').value);
            this.loading = false;

          },
          error: (e) => {
            this.loading = false;
            this.showError(this.message);
          }
        });
      }
    }
    );

    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';


  }

  /* File onchange event */
  fileEvent(e) {
    this.filedata = e.target.files[0];
  }
  /*
    // On file Select 
    onChange(event) {
      const file = (event.target as HTMLInputElement).files[0]; // Here we use only the first file (single file)
      console.log(file);
      this.registerForm.patchValue({ image: file });
      // this.file = event.target.files[0]; 
    }*/

  sendEmailVerificationCode() {
    this.isProcessing = true;
    this.loading = true;
    this.inscriptionService.getConfirmationCode({ email: this.registerForm.value.email }).subscribe(
      {
        next: (v: any) => {
          this.message = v.message;
          this.isEmailSent = true;
          this.loading = false;
          this.isProcessing = false;
          this.showSuccess(this.message);
        },
        error: (e) => {
          //console.error(e);
          this.isEmailSent = false;
          this.loading = false;
          this.isProcessing = false;
          this.showError(e.error?.message);
        }
      });
  }

  verifyCode() {
    let code = this.registerForm.get('code_verification').value;
    if (code.length == 6) {
      this.registerForm.controls['code_verification'].disable();
      this.isProcessing = true;
      this.loading = true;
      this.inscriptionService.verificationCode({
        'email': this.registerForm.get('email').value,
        'code': code
      }).subscribe({
        next: (v: any) => {
          this.message = v.message;
          this.loading = false;
          this.isProcessing = false;
          this.showSuccess(this.message);
          this.isEmailValid = true;
        },

        error: (e) => {
          //console.error(e);
          this.loading = false;
          this.registerForm.patchValue({ code_verification: '' });
          this.registerForm.controls['code_verification'].enable();
          this.isProcessing = false;
          this.showError(e.error?.message)
        },

        complete: () => {

        }
      });
    }
  }

  resendEmailVerificationCode() {
    this.isProcessing = true;
    this.loading = true;
    this.inscriptionService.getNewConfirmationCode({ email: this.registerForm.get('email').value }).subscribe({
      next: (v: any) => {
        this.message = v.message;
        this.loading = false;
        this.isProcessing = false;
        this.showSuccess(this.message);
      },

      error: (e) => {
        this.loading = false;
        this.isProcessing = false;
        this.showError(e.error?.message);
      },

      complete: () => {

      }
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.registerForm.controls; }

  /**
   * Form submit
   */
  onSubmit() {
    // const formData = new FormData();
    // formData.append('document', this.file);
    this.isProcessing = true;
    this.loading = true;
    var myFormData = new FormData();
    myFormData.append('document', this.filedata);
    myFormData.append('email', this.registerForm.get('email').value);
    myFormData.append('password', this.registerForm.get('password').value);
    myFormData.append('first_name', this.registerForm.get('first_name').value);
    myFormData.append('last_name', this.registerForm.get('last_name').value);
    myFormData.append('location', this.registerForm.get('location').value);
    myFormData.append('country_id', this.registerForm.get('country_id').value);
    myFormData.append('city_id', this.registerForm.get('city_id').value);
    myFormData.append('tel', this.registerForm.get('tel').value);
    myFormData.append('ifu', this.registerForm.get('ifu').value);
    myFormData.append('phone_code', this.registerForm.get('phone_code').value);
    myFormData.append('type', this.registerForm.get('type').value);
    myFormData.append('social_reason', this.registerForm.get('social_reason').value);
    myFormData.append('code_verification', this.registerForm.get('code_verification').value);
    myFormData.append('password_conf', this.registerForm.get('password_conf').value);

    this.submitted = true;
    this.isProcessing = true;
    this.message = "";

    this.inscriptionService.createInscription(myFormData).subscribe({
      next: (v: any) => {
        this.message = v.message;
        this.loading = false;
        this.isProcessing = false;
        this.showSuccess(this.message);
        setTimeout(() => {
          document.location.href = environment.baseUrl;
        }, 1200)
      },

      error: (e) => {
        console.error(e);
        this.isProcessing = false;
        this.showError(e.error?.message);
      }
    });
  }

  showSuccess(msg: string) {
    this.toastr.success(msg, 'Succès');
  }

  showError(msg: string) {
    this.toastr.error(msg, 'Erreur');
  }




  // File Upload
  imageURL: any;
  onSelect(event: any) {
    this.files.push(...event.addedFiles);
    let file: File = event.addedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      setTimeout(() => {
        // this.profile.push(this.imageURL)
      }, 100);
    }
    reader.readAsDataURL(file)
  }


  carouselOption: OwlOptions = {
    items: 1,
    loop: false,
    margin: 0,
    nav: false,
    dots: true,
    responsive: {
      680: {
        items: 1
      },
    }
  }

  // Get countries list
  listCountries() {
    this.school_inscription_service.countries().subscribe(
      {
        next: (v: any) => {
          this.countries = v.data;
        },

        error: (e) => {
          console.error(e);
        },

        complete: () => {
        }
      }

    );
  }

  // Get cities list
  listCities() {
    this.school_inscription_service.cities().subscribe(
      {
        next: (v: any) => {
          this.cities = v.data;
        },

        error: (e) => {
          console.error(e);
        },

        complete: () => {
        }
      }

    );
  }

  // Get cities by id country
  changeCountry(cntry: any): any[] {
    this.cities_filtered = this.cities.filter((city: any) => city.country_id === cntry.value);
    return this.cities_filtered;
  }

  getCityByCountry(cntry: any) {
    this.mask_template = '';
    this.school_inscription_service.citiesByCountryId({ 'country_id': (this.isTwiceSubmission) ? cntry : cntry.target.value }).subscribe(
      {
        next: (v: any) => {
          this.cities_filtered = v.data.cities;
          this.num_code = v.data.country_infos.phone_code;
          this.registerForm.patchValue({ phone_code: this.num_code });
          this.mask_template = v.data.country_infos.masking;
        },

        error: (e) => {
          console.error(e);
        },

        complete: () => {
        }
      }

    );
  }

  DisableCut(event: any) {
    this.showError("Cette opération n'est pas autorisée. Veuillez coprier manuellement le code.");
    event.preventDefault();
  }
  DisableCopy(event: any) {
    this.showError("Cette opération n'est pas autorisée. Veuillez coprier manuellement le code.");
    event.preventDefault();
  }
  DisablePaste(event: any) {
    this.showError("Cette opération n'est pas autorisée. Veuillez saisir manuellement le code.");
    event.preventDefault();
  }

}
