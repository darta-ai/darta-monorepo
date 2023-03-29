import React from 'react';

import {UserStack} from '../App';
// import {UserRoutesEnum} from '../components/User/userRoutes';
import {UserRoutesEnum} from '../components/User/userRoutes.d';
import {UserHome} from '../components/User';
import {headerOptions} from './styles';

function User() {
  return (
    <UserStack.Navigator screenOptions={{headerTintColor: 'white'}}>
      <UserStack.Group>
        <UserStack.Screen
          name={UserRoutesEnum.home}
          component={UserHome}
          options={{...headerOptions, headerTitle: 'Home'}}
        />
        {/* <UserStack.Screen
          name={GalleryNavigatorEnum.gallery}
          component={GalleryRoute}
          options={{
            ...headerOptions,
            ...openingTransition,
            headerTitle: state.galleryTitle,
          }}
        /> */}
      </UserStack.Group>
      <UserStack.Group screenOptions={{presentation: 'modal'}}>
        {/* <UserStack.Screen
          name={GalleryNavigatorEnum.tombstone}
          component={TombstoneRoute}
          options={{...headerOptions, headerTitle: state.tombstoneTitle}}
        /> */}
      </UserStack.Group>
    </UserStack.Navigator>
  );
}

export default User;
