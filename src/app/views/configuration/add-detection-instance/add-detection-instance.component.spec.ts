import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDetectionInstanceComponent } from './add-detection-instance.component';

xdescribe('AddZoneComponent', () => {
  let component: AddDetectionInstanceComponent;
  let fixture: ComponentFixture<AddDetectionInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddDetectionInstanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddDetectionInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
