import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionValidatedComponent } from './inscription-validated.component';

describe('InscriptionValidatedComponent', () => {
  let component: InscriptionValidatedComponent;
  let fixture: ComponentFixture<InscriptionValidatedComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InscriptionValidatedComponent]
    });
    fixture = TestBed.createComponent(InscriptionValidatedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
