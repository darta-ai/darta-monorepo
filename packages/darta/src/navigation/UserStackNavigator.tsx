import {MILK} from '@darta-styles';
import React, {useContext} from 'react';

import {UserStack} from '../../App';
import {ArtworkNavigatorModal} from '../components/Modal/ArtworkNavigatorModal';
import {UserHome} from '../screens/UserHome';
import {UserInquiredArtwork} from '../components/User/UserInquiredArtwork';
import {UserSavedArtwork} from '../components/User/UserSavedArtwork';
import {UserSettings} from '../components/User/UserSettings';
import {StoreContext} from '../state/Store';
import {headerOptions} from '../styles/styles';
import {UserRoutesEnum} from '../typing/routes';
import {createOpeningTransition} from '../utils/openingTransition';

export function UserStackNavigator() {
  const {state} = useContext(StoreContext);
  const openingTransition = createOpeningTransition();
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
            ...openingTransition,
          }}
        />
        <UserStack.Screen
          name={UserRoutesEnum.userInquiredArtwork}
          component={UserInquiredArtwork}
          options={{
            ...headerOptions,
            headerTitle: 'i n q u i r e d',
          }}
        />
      </UserStack.Group>

      <UserStack.Group screenOptions={{presentation: 'modal'}}>
        <UserStack.Screen
          name={UserRoutesEnum.SavedArtworkModal}
          component={ArtworkNavigatorModal}
          options={{...headerOptions, headerTitle: state.tombstoneTitle}}
        />
      </UserStack.Group>
    </UserStack.Navigator>
  );
}
