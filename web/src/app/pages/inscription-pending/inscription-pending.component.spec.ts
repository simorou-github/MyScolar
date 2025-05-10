import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionPendingComponent } from './inscription-pending.component';

describe('InscriptionPendingComponent', () => {
  let component: InscriptionPendingComponent;
  let fixture: ComponentFixture<InscriptionPendingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionPendingComponent]
    });
    fixture = TestBed.createComponent(InscriptionPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
