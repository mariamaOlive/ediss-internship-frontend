import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantslistComponent } from './plantslist.component';

describe('PlantslistComponent', () => {
  let component: PlantslistComponent;
  let fixture: ComponentFixture<PlantslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantslistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
