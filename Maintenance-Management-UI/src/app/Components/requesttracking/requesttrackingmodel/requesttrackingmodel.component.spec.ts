import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequesttrackingmodelComponent } from './requesttrackingmodel.component';

describe('RequesttrackingmodelComponent', () => {
  let component: RequesttrackingmodelComponent;
  let fixture: ComponentFixture<RequesttrackingmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequesttrackingmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequesttrackingmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
