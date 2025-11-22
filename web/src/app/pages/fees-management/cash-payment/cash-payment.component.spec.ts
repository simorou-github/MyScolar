import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashPaymentComponent } from './cash-payment.component';

describe('CashPaymentComponent', () => {
  let component: CashPaymentComponent;
  let fixture: ComponentFixture<CashPaymentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CashPaymentComponent]
    });
    fixture = TestBed.createComponent(CashPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
