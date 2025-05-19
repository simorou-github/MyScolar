import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeesBalanceFollowupComponent } from './fees-balance-followup.component';

describe('FeesBalanceFollowupComponent', () => {
  let component: FeesBalanceFollowupComponent;
  let fixture: ComponentFixture<FeesBalanceFollowupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeesBalanceFollowupComponent]
    });
    fixture = TestBed.createComponent(FeesBalanceFollowupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
