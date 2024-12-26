import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendormodelComponent } from './vendormodel.component';

describe('VendormodelComponent', () => {
  let component: VendormodelComponent;
  let fixture: ComponentFixture<VendormodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendormodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendormodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
