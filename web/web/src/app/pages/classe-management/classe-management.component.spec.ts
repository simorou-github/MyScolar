import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClasseManagementComponent } from './classe-management.component';

describe('ClasseManagementComponent', () => {
  let component: ClasseManagementComponent;
  let fixture: ComponentFixture<ClasseManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClasseManagementComponent]
    });
    fixture = TestBed.createComponent(ClasseManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
