import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryitemsmodelComponent } from './inventoryitemsmodel.component';

describe('InventoryitemsmodelComponent', () => {
  let component: InventoryitemsmodelComponent;
  let fixture: ComponentFixture<InventoryitemsmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryitemsmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryitemsmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
