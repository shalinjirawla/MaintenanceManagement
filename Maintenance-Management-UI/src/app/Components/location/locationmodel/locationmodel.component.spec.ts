import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationmodelComponent } from './locationmodel.component';

describe('LocationmodelComponent', () => {
  let component: LocationmodelComponent;
  let fixture: ComponentFixture<LocationmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LocationmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LocationmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
