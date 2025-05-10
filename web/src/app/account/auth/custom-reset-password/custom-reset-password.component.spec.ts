import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomResetPasswordComponent } from './custom-reset-password.component';

describe('CustomResetPasswordComponent', () => {
  let component: CustomResetPasswordComponent;
  let fixture: ComponentFixture<CustomResetPasswordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomResetPasswordComponent]
    });
    fixture = TestBed.createComponent(CustomResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
