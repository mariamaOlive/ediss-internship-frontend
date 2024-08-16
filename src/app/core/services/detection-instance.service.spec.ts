import { TestBed } from '@angular/core/testing';

import { DetectionInstanceService } from './detection-instance.service';

describe('DetectionInstanceService', () => {
  let service: DetectionInstanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetectionInstanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
