import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionInstanceComponent } from './detection-instance.component';

xdescribe('DetectionInstanceComponent', () => {
  let component: DetectionInstanceComponent;
  let fixture: ComponentFixture<DetectionInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetectionInstanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetectionInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
