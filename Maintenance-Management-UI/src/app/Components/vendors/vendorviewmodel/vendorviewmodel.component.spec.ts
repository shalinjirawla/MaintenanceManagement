import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorviewmodelComponent } from './vendorviewmodel.component';

describe('VendorviewmodelComponent', () => {
  let component: VendorviewmodelComponent;
  let fixture: ComponentFixture<VendorviewmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorviewmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorviewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
