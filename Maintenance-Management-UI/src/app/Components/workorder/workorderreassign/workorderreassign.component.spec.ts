import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkorderreassignComponent } from './workorderreassign.component';

describe('WorkorderreassignComponent', () => {
  let component: WorkorderreassignComponent;
  let fixture: ComponentFixture<WorkorderreassignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkorderreassignComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkorderreassignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
