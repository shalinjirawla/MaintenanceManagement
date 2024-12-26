import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfilemodelComponent } from './profilemodel.component';

describe('ProfilemodelComponent', () => {
  let component: ProfilemodelComponent;
  let fixture: ComponentFixture<ProfilemodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfilemodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfilemodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
