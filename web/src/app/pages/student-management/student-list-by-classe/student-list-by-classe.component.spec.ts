import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentListByClasseComponent } from './student-list-by-classe.component';

describe('StudentListByClasseComponent', () => {
  let component: StudentListByClasseComponent;
  let fixture: ComponentFixture<StudentListByClasseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentListByClasseComponent]
    });
    fixture = TestBed.createComponent(StudentListByClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
