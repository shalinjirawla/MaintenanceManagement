import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseordersviewmodelComponent } from './purchaseordersviewmodel.component';

describe('PurchaseordersviewmodelComponent', () => {
  let component: PurchaseordersviewmodelComponent;
  let fixture: ComponentFixture<PurchaseordersviewmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchaseordersviewmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseordersviewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
