import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreventivemaintenanceComponent } from './preventivemaintenance.component';

describe('PreventivemaintenanceComponent', () => {
  let component: PreventivemaintenanceComponent;
  let fixture: ComponentFixture<PreventivemaintenanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreventivemaintenanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PreventivemaintenanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
