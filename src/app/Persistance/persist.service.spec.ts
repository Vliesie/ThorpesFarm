import { TestBed } from '@angular/core/testing';

import { PersistService } from './persist.service';

describe('PersistService', () => {
  let service: PersistService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
