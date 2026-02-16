import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopulerCategoriesComponent } from './populer-categories.component';

describe('PopulerCategoriesComponent', () => {
  let component: PopulerCategoriesComponent;
  let fixture: ComponentFixture<PopulerCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopulerCategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopulerCategoriesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
