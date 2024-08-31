import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantsListComponent } from './plants-list.component';

xdescribe('PlantsListComponent', () => {
  let component: PlantsListComponent;
  let fixture: ComponentFixture<PlantsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
