import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddClasseSchoolComponent } from './add-classe-school.component';

describe('AddClasseSchoolComponent', () => {
  let component: AddClasseSchoolComponent;
  let fixture: ComponentFixture<AddClasseSchoolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddClasseSchoolComponent]
    });
    fixture = TestBed.createComponent(AddClasseSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
