import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolUserManagementComponent } from './school-user-management.component';

describe('SchoolUserManagementComponent', () => {
  let component: SchoolUserManagementComponent;
  let fixture: ComponentFixture<SchoolUserManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolUserManagementComponent]
    });
    fixture = TestBed.createComponent(SchoolUserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
