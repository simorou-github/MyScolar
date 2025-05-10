import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupeManagementComponent } from './groupe-management.component';

describe('GroupeManagementComponent', () => {
  let component: GroupeManagementComponent;
  let fixture: ComponentFixture<GroupeManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GroupeManagementComponent]
    });
    fixture = TestBed.createComponent(GroupeManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
