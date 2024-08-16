import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionInstanceListComponent } from './detection-instance-list.component';

describe('DetectionInstanceListComponent', () => {
  let component: DetectionInstanceListComponent;
  let fixture: ComponentFixture<DetectionInstanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetectionInstanceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetectionInstanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
