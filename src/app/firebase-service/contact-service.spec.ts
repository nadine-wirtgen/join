import { TestBed } from '@angular/core/testing';

import { ContactService } from './contact-service';

/**
 * Test suite for ContactService.
 */
describe('ContactService', () => {
  let service: ContactService;

  /**
   * Sets up the testing module and injects the service before each test.
   */
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ContactService);
  });

  /**
   * Checks if the ContactService is created successfully.
   */
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
