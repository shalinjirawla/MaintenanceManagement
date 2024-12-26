import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryitemsComponent } from './inventoryitems.component';

describe('InventoryitemsComponent', () => {
  let component: InventoryitemsComponent;
  let fixture: ComponentFixture<InventoryitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventoryitemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventoryitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
