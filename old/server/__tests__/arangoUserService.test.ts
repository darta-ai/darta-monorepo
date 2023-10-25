// // __tests__/ArangoUserRepository.test.ts
// import {Database} from 'arangojs';

// import {ArangoUserRepository} from '../src/services';

// // Simple mock implementation for the ArangoDB Database class
// class MockDatabase extends Database {
//   query() {
//     return {
//       all: async () => [],
//     };
//   }
// }

// describe('ArangoUserRepository', () => {
//   let IUserRepository: ArangoUserRepository;

//   beforeEach(() => {
//     IUserRepository = new ArangoUserRepository(
//       new MockDatabase() as unknown as Database,
//     );
//   });

//   it('should create an instance of ArangoUserRepository', () => {
//     expect(IUserRepository).toBeInstanceOf(ArangoUserRepository);
//   });

//   it('should return null when user is not found', async () => {
//     const user = await IUserRepository.getUser('non-existent-key');
//     expect(user).toBeNull();
//   });

//   // Add more tests for other methods and scenarios
// });
