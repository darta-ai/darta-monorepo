import {MILK} from '@darta-styles';
import React, {useContext} from 'react';

import {ExhibitionStack} from '../../App';
import {ArtworkNavigatorModal} from '../components/Modal/ArtworkNavigatorModal';
import {ExhibitionsHomeScreen} from '../screens/_index';
import {UserInquiredArtwork} from '../components/User/UserInquiredArtwork';
import {UserSavedArtwork} from '../components/User/UserSavedArtwork';
import {UserSettings} from '../components/User/UserSettings';
import {StoreContext} from '../state/Store';
import {headerOptions} from '../styles/styles';
import {UserRoutesEnum} from '../typing/routes';
import {createOpeningTransition} from '../utils/openingTransition';

export function ExhibitionStackNavigator() {
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
    <ExhibitionStack.Navigator screenOptions={{headerTintColor: MILK}}>
      <ExhibitionStack.Group>
        <ExhibitionStack.Screen
          name={UserRoutesEnum.home}
          component={ExhibitionsHomeScreen}
          options={{...headerOptions, headerTitle: 'exhibitions'}}
        />
      </ExhibitionStack.Group>
    </ExhibitionStack.Navigator>
  );
}
