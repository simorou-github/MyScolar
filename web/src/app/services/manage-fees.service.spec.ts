import { TestBed } from '@angular/core/testing';

import { ManageFeesService } from './manage-fees.service';

describe('ManageFeesService', () => {
  let service: ManageFeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageFeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
