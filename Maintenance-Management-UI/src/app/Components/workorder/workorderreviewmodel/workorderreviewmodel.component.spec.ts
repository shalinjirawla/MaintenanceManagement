import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderreviewmodelComponent } from './workorderreviewmodel.component';

describe('WorkorderreviewmodelComponent', () => {
  let component: WorkorderreviewmodelComponent;
  let fixture: ComponentFixture<WorkorderreviewmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkorderreviewmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkorderreviewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
