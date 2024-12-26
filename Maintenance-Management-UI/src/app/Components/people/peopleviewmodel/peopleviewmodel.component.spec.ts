import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeopleviewmodelComponent } from './peopleviewmodel.component';

describe('PeopleviewmodelComponent', () => {
  let component: PeopleviewmodelComponent;
  let fixture: ComponentFixture<PeopleviewmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeopleviewmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeopleviewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
