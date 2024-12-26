import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventiveviewmodelComponent } from './preventiveviewmodel.component';

describe('PreventiveviewmodelComponent', () => {
  let component: PreventiveviewmodelComponent;
  let fixture: ComponentFixture<PreventiveviewmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreventiveviewmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreventiveviewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
