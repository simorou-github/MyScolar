import { FormGroup } from '@angular/forms';
    
export function PhoneValidator(primary_field: string, secondary_field: string){
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[primary_field];
        const matchingControl = formGroup.controls[secondary_field];
        if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
            return;
        }
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ confirmedValidator: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
}