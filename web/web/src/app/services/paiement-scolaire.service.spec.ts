import { TestBed } from '@angular/core/testing';

import { PaiementScolaireService } from './paiement-scolaire.service';

describe('PaiementScolaireService', () => {
  let service: PaiementScolaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaiementScolaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
