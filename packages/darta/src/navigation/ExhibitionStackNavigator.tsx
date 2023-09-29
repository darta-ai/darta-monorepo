import {PRIMARY_800} from '@darta-styles';
import React, {useContext} from 'react';

import {ExhibitionStack} from '../../App';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ExhibitionsHomeScreen} from '../screens/_index';
import {UserInquiredArtwork} from '../components/User/UserInquiredArtwork';
import {UserSavedArtwork} from '../components/User/UserSavedArtwork';
import {UserSettings} from '../components/User/UserSettings';
import {StoreContext} from '../state/Store';
import {headerOptions} from '../styles/styles';
import {UserRoutesEnum} from '../typing/routes';
import {createOpeningTransition} from '../utils/openingTransition';
import {ExhibitionRootEnum} from '../typing/routes';
import {ExhibitionTopTabNavigator} from './ExhibitionTopTabNavigator'
import {ArtworkNavigatorModal} from '../components/Modal/ArtworkNavigatorModal';

export const ExhibitionStackTopTab = createMaterialTopTabNavigator();


export function ExhibitionStackNavigator() {
  const {state} = useContext(StoreContext);
  const openingTransition = createOpeningTransition();
  return (
    <ExhibitionStack.Navigator screenOptions={{headerTintColor: PRIMARY_800}}>
        <ExhibitionStack.Screen
          name={ExhibitionRootEnum.exhibitionHome}
          component={ExhibitionsHomeScreen}
          options={{...headerOptions, headerTitle: 'exhibitions'}}
        />
      <ExhibitionStack.Screen
          name={ExhibitionRootEnum.TopTab}
          component={ExhibitionTopTabNavigator}
          options={{...headerOptions, headerTitle: state.currentExhibition?.exhibitionTitle?.value!}}
        />
        <ExhibitionStack.Screen
          name={ExhibitionRootEnum.individualArtwork}
          component={ArtworkNavigatorModal}
          options={{...headerOptions, presentation: 'modal', headerTitle: state.tombstoneTitle}}
        />
    </ExhibitionStack.Navigator>
  );
}
