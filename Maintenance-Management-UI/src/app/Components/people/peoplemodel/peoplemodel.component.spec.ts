import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeoplemodelComponent } from './peoplemodel.component';

describe('PeoplemodelComponent', () => {
  let component: PeoplemodelComponent;
  let fixture: ComponentFixture<PeoplemodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PeoplemodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PeoplemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
