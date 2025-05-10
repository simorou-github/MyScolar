import { TestBed } from '@angular/core/testing';

import { ManageSchoolUserService } from './manage-school-user.service';

describe('ManageSchoolUserService', () => {
  let service: ManageSchoolUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageSchoolUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
