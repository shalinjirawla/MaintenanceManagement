import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkordercomplationComponent } from './workordercomplation.component';

describe('WorkordercomplationComponent', () => {
  let component: WorkordercomplationComponent;
  let fixture: ComponentFixture<WorkordercomplationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkordercomplationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkordercomplationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
