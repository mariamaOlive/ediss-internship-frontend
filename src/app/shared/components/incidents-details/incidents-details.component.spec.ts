import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncidentsDetailsComponent } from './incidents-details.component';

describe('IncidentsDetailsComponent', () => {
  let component: IncidentsDetailsComponent;
  let fixture: ComponentFixture<IncidentsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncidentsDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncidentsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
