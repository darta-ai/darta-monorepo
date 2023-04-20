import React, {useContext} from 'react';

import {UserStack} from '../App';
import {MILK} from '../assets/styles';
import {TombstoneRoute} from '../src/Screens/Gallery/Tombstone/TombstoneRoute';
import {UserHome} from '../src/Screens/User';
import {UserSavedArtwork} from '../src/Screens/User/Screens/UserSavedArtwork';
import {UserSettings} from '../src/Screens/User/Screens/UserSettings';
import {UserRoutesEnum} from '../src/Screens/User/userRoutes.d';
import {StoreContext} from '../src/State/Store';
import {headerOptions} from './styles';

function User() {
  const {state} = useContext(StoreContext);
  const leftToRightAnimation = {
    cardStyleInterpolator: ({
      current,
      layouts,
    }: {
      current: any;
      layouts: any;
    }) => {
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
        <UserStack.Screen
          name={UserRoutesEnum.userSavedArtwork}
          component={UserSavedArtwork}
          options={{
            ...headerOptions,
            headerTitle: 's a v e d',
          }}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userInquiredArtwork}
          component={UserSavedArtwork}
          options={{
            ...headerOptions,
            headerTitle: 's a v e d',
          }}
        />
      </UserStack.Group>

      <UserStack.Group screenOptions={{presentation: 'modal'}}>
        <UserStack.Screen
          name={UserRoutesEnum.tombstone}
          component={TombstoneRoute}
          options={{...headerOptions, headerTitle: state.tombstoneTitle}}
        />
      </UserStack.Group>
    </UserStack.Navigator>
  );
}

export default User;
