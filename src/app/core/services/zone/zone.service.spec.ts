import { TestBed } from '@angular/core/testing';

import { ZoneService } from './zone.service';

xdescribe('ZoneService', () => {
  let service: ZoneService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ZoneService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
