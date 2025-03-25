import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOwnLoaderComponent } from './my-own-loader.component';

describe('MyOwnLoaderComponent', () => {
  let component: MyOwnLoaderComponent;
  let fixture: ComponentFixture<MyOwnLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyOwnLoaderComponent]
    });
    fixture = TestBed.createComponent(MyOwnLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
