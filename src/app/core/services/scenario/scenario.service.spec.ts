import { TestBed } from '@angular/core/testing';

import { ScenarioService } from './scenario.service';

xdescribe('ScenarioService', () => {
  let service: ScenarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScenarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
