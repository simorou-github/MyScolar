import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignFeesToClasseComponent } from './assign-fees-to-classe.component';

describe('AssignFeesToClasseComponent', () => {
  let component: AssignFeesToClasseComponent;
  let fixture: ComponentFixture<AssignFeesToClasseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignFeesToClasseComponent]
    });
    fixture = TestBed.createComponent(AssignFeesToClasseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
