import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorycategoriesmodelComponent } from './inventorycategoriesmodel.component';

describe('InventorycategoriesmodelComponent', () => {
  let component: InventorycategoriesmodelComponent;
  let fixture: ComponentFixture<InventorycategoriesmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorycategoriesmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorycategoriesmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
