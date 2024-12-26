import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseordersmodelComponent } from './purchaseordersmodel.component';

describe('PurchaseordersmodelComponent', () => {
  let component: PurchaseordersmodelComponent;
  let fixture: ComponentFixture<PurchaseordersmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseordersmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseordersmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
