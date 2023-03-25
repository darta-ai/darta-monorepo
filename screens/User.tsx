// import React from 'react';
// // import Orientation from 'react-native-orientation-locker';
// import {FlatList, ImageBackground, TouchableOpacity, View} from 'react-native';

// import DEMO from '../assets/data/demo';
// import { UserStack } from '../App';
// import { GalleryNavigatorEnum } from '../components/Gallery/galleryRoutes.d';

// function User() {
//   return (
//     <UserStack.Navigator screenOptions={{headerTintColor: 'white'}}>
//       <UserStack.Group>
//         <UserStack.Screen
//           name={GalleryNavigatorEnum.galleryHome}
//           component={GalleryHome}
//           options={{...headerOptions}}
//           initialParams={{galleryInfo}}
//         />
//         <UserStack.Screen
//           name={GalleryNavigatorEnum.gallery}
//           component={GalleryRoute}
//           options={{
//             ...headerOptions,
//             ...openingTransition,
//             headerTitle: state.galleryTitle,
//           }}
//         />
//       </UserStack.Group>
//       <UserStack.Group screenOptions={{presentation: 'modal'}}>
//         <UserStack.Screen
//           name={GalleryNavigatorEnum.tombstone}
//           component={TombstoneRoute}
//           options={{...headerOptions, headerTitle: state.tombstoneTitle}}
//         />
//       </UserStack.Group>
//     </UserStack.Navigator>
//   );
// }

// export default User;
