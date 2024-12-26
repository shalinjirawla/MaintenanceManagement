import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivemodelComponent } from './preventivemodel.component';

describe('PreventivemodelComponent', () => {
  let component: PreventivemodelComponent;
  let fixture: ComponentFixture<PreventivemodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreventivemodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreventivemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
