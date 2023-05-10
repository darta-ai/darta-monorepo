// __tests__/arangoUserService.test.ts
import {Database} from 'arangojs';

import {ArangoUserService} from '../src/services';

// Simple mock implementation for the ArangoDB Database class
class MockDatabase extends Database {
  query() {
    return {
      all: async () => [],
    };
  }
}

describe('ArangoUserService', () => {
  let userService: ArangoUserService;

  beforeEach(() => {
    userService = new ArangoUserService(
      new MockDatabase() as unknown as Database,
    );
  });

  it('should create an instance of ArangoUserService', () => {
    expect(userService).toBeInstanceOf(ArangoUserService);
  });

  it('should return null when user is not found', async () => {
    const user = await userService.getUser('non-existent-key');
    expect(user).toBeNull();
  });

  // Add more tests for other methods and scenarios
});
