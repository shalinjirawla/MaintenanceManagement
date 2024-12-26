import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorycategoriesComponent } from './inventorycategories.component';

describe('InventorycategoriesComponent', () => {
  let component: InventorycategoriesComponent;
  let fixture: ComponentFixture<InventorycategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorycategoriesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorycategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
