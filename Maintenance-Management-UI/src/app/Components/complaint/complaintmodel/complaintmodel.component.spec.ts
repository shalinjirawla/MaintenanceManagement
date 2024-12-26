import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintmodelComponent } from './complaintmodel.component';

describe('ComplaintmodelComponent', () => {
  let component: ComplaintmodelComponent;
  let fixture: ComponentFixture<ComplaintmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComplaintmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ComplaintmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
