import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonesListComponent } from './zones-list.component';

xdescribe('ZonesListComponent', () => {
  let component: ZonesListComponent;
  let fixture: ComponentFixture<ZonesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonesListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZonesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
