import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesttrackingComponent } from './requesttracking.component';

describe('RequesttrackingComponent', () => {
  let component: RequesttrackingComponent;
  let fixture: ComponentFixture<RequesttrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequesttrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequesttrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
