import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderviewmodelComponent } from './workorderviewmodel.component';

describe('WorkorderviewmodelComponent', () => {
  let component: WorkorderviewmodelComponent;
  let fixture: ComponentFixture<WorkorderviewmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkorderviewmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkorderviewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
