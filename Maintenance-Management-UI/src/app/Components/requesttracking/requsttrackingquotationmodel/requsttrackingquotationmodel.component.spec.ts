import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequsttrackingquotationmodelComponent } from './requsttrackingquotationmodel.component';

describe('RequsttrackingquotationmodelComponent', () => {
  let component: RequsttrackingquotationmodelComponent;
  let fixture: ComponentFixture<RequsttrackingquotationmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequsttrackingquotationmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequsttrackingquotationmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
