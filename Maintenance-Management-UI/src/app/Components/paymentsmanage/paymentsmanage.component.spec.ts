import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentsmanageComponent } from './paymentsmanage.component';

describe('PaymentsmanageComponent', () => {
  let component: PaymentsmanageComponent;
  let fixture: ComponentFixture<PaymentsmanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsmanageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentsmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
