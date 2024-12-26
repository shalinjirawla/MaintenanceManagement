import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestdeclinemodelComponent } from './requestdeclinemodel.component';

describe('RequestdeclinemodelComponent', () => {
  let component: RequestdeclinemodelComponent;
  let fixture: ComponentFixture<RequestdeclinemodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestdeclinemodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestdeclinemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
