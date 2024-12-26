import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackmodelComponent } from './feedbackmodel.component';

describe('FeedbackmodelComponent', () => {
  let component: FeedbackmodelComponent;
  let fixture: ComponentFixture<FeedbackmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeedbackmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
