import { TestBed } from '@angular/core/testing';

import { SchoolInscriptionService } from './school-inscription.service';

describe('SchoolInscriptionService', () => {
  let service: SchoolInscriptionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolInscriptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
