import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryitemsviewmodelComponent } from './inventoryitemsviewmodel.component';

describe('InventoryitemsviewmodelComponent', () => {
  let component: InventoryitemsviewmodelComponent;
  let fixture: ComponentFixture<InventoryitemsviewmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryitemsviewmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryitemsviewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
