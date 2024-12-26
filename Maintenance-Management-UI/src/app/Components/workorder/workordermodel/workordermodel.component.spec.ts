import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkordermodelComponent } from './workordermodel.component';

describe('WorkordermodelComponent', () => {
  let component: WorkordermodelComponent;
  let fixture: ComponentFixture<WorkordermodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkordermodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkordermodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
