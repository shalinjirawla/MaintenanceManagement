import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsmodelComponent } from './assetsmodel.component';

describe('AssetsmodelComponent', () => {
  let component: AssetsmodelComponent;
  let fixture: ComponentFixture<AssetsmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
