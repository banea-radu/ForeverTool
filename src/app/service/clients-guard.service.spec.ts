import { TestBed } from '@angular/core/testing';

import { ClientsGuardService } from './clients-guard.service';

describe('ClientsGuardService', () => {
  let service: ClientsGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ClientsGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
