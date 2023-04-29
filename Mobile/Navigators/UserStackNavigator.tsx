import React, {useContext} from 'react';

import {UserStack} from '../../App';
import {MILK} from '../../assets/styles';
import {headerOptions} from '../../screens/styles';
import {UserHome} from '../Screens/User';
import {UserInquiredArtwork} from '../Screens/User/UserInquiredArtwork';
import {UserSavedArtwork} from '../Screens/User/UserSavedArtwork';
import {UserSettings} from '../Screens/User/UserSettings';
import {StoreContext} from '../State/Store';
import {SavedArtworkNavigatorModal} from './Modals/SavedArtworkNavigatorModal';
import {createOpeningTransition} from './NavigationStyling/openingTransition';
import {UserRoutesEnum} from './Routes/userRoutes.d';

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
          component={SavedArtworkNavigatorModal}
          options={{...headerOptions, headerTitle: state.tombstoneTitle}}
        />
      </UserStack.Group>
    </UserStack.Navigator>
  );
}
