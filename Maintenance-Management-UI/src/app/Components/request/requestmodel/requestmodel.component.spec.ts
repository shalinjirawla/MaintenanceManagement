import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestmodelComponent } from './requestmodel.component';

describe('RequestmodelComponent', () => {
  let component: RequestmodelComponent;
  let fixture: ComponentFixture<RequestmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
