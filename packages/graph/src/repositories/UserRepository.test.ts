// import { userRepository } from './UserRepository';

// async function testUserRepository(): Promise<void> {
//   const newUser = {
//     username: 'johndoe',
//     name: 'John Doe',
//     // Add other necessary properties here
//   };

//   // Test create method
//   // console.log(userRepository)
//   const createdUser = await userRepository.create(newUser);
//   console.log(createdUser);

//   // Test read method
//   const fetchedUser = await userRepository.read(createdUser._key);
//   console.log(fetchedUser);

//   // Test update method
//   const updatedUser = await userRepository.update({
//     ...fetchedUser,
//     name: 'Jane Doe',
//   });
//   console.log(updatedUser);

//   // Test delete method
//   const deletedUserId = await userRepository.delete(updatedUser._key);
//   console.log(deletedUserId);
//   console.log(userRepository.name)
// }

// // Call the test function
// testUserRepository().catch(console.error);
