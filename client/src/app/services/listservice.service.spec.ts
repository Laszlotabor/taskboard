import { TestBed } from '@angular/core/testing';

import { ListserviceService } from './listservice.service';

describe('ListserviceService', () => {
  let service: ListserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ListserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
