import React from 'react';

import {UserStack} from '../App';
import {UserRoutesEnum} from '../components/User/userRoutes.d';
import {UserHome} from '../components/User';
import {headerOptions} from './styles';
import {UserSettings} from '../components/User/Screens/UserSettings';
import {MILK} from '../assets/styles';

function User() {
  const leftToRightAnimation = {
    cardStyleInterpolator: ({current, layouts}) => {
      return {
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [-layouts.screen.width, 0],
              }),
            },
          ],
        },
      };
    },
  };
  return (
    <UserStack.Navigator screenOptions={{headerTintColor: MILK}}>
      <UserStack.Group>
        <UserStack.Screen
          name={UserRoutesEnum.home}
          component={UserHome}
          options={{...headerOptions, headerTitle: 'home'}}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userSettings}
          component={UserSettings}
          options={{
            ...headerOptions,
            headerTitle: 'settings',
            ...leftToRightAnimation,
          }}
        />
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
