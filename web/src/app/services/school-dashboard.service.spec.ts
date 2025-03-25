import { TestBed } from '@angular/core/testing';

import { SchoolDashboardService } from './school-dashboard.service';

describe('SchoolDashboardService', () => {
  let service: SchoolDashboardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchoolDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
