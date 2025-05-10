import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaiementScolaireComponent } from './paiement-scolaire.component';

describe('PaiementScolaireComponent', () => {
  let component: PaiementScolaireComponent;
  let fixture: ComponentFixture<PaiementScolaireComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PaiementScolaireComponent]
    });
    fixture = TestBed.createComponent(PaiementScolaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
