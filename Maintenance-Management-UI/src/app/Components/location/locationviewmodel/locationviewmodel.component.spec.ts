import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationviewmodelComponent } from './locationviewmodel.component';

describe('LocationviewmodelComponent', () => {
  let component: LocationviewmodelComponent;
  let fixture: ComponentFixture<LocationviewmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationviewmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationviewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
