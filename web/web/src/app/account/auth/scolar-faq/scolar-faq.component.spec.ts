import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScolarFaqComponent } from './scolar-faq.component';

describe('ScolarFaqComponent', () => {
  let component: ScolarFaqComponent;
  let fixture: ComponentFixture<ScolarFaqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScolarFaqComponent]
    });
    fixture = TestBed.createComponent(ScolarFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
