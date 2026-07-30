import { TestBed } from '@angular/core/testing';

import { StmService } from './stm.service';

describe('StmService', () => {
  let service: StmService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StmService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
