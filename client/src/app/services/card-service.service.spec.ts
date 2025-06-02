import { TestBed } from '@angular/core/testing';

import { CardServiceService } from './cardservice';

describe('CardServiceService', () => {
  let service: CardServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
