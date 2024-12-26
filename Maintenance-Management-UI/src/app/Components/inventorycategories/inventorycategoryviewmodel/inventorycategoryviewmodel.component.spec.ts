import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InventorycategoryviewmodelComponent } from './inventorycategoryviewmodel.component';

describe('InventorycategoryviewmodelComponent', () => {
  let component: InventorycategoryviewmodelComponent;
  let fixture: ComponentFixture<InventorycategoryviewmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InventorycategoryviewmodelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InventorycategoryviewmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
