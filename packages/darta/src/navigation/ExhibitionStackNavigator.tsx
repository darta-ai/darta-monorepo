import {PRIMARY_800} from '@darta-styles';
import React, {useContext} from 'react';

import {ExhibitionStack} from '../../App';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ExhibitionsHomeScreen} from '../screens/_index';
import {UserInquiredArtwork} from '../components/User/UserInquiredArtwork';
import {UserSavedArtwork} from '../components/User/UserSavedArtwork';
import {UserSettings} from '../components/User/UserSettings';
import {StoreContext} from '../state/Store';
import {headerOptions, modalHeaderOptions} from '../styles/styles';
import {UserRoutesEnum} from '../typing/routes';
import {createOpeningTransition} from '../utils/openingTransition';
import {ExhibitionRootEnum, PreviousExhibitionRootEnum} from '../typing/routes';
import {ExhibitionTopTabNavigator} from './ExhibitionTopTabNavigator'
import {ArtworkNavigatorModal} from '../components/Modal/ArtworkNavigatorModal';
import { PastExhibitionTopTabNavigator } from './PastExhibitionTopTabNavigator';


export function ExhibitionStackNavigator({route} : {route: any}) {
  const {state} = useContext(StoreContext);

  return (
    <ExhibitionStack.Navigator screenOptions={{headerTintColor: PRIMARY_800}}>
        <ExhibitionStack.Screen
          name={ExhibitionRootEnum.exhibitionHome}
          component={ExhibitionsHomeScreen}
          options={{...headerOptions, headerTitle: 'feed'}}
        />
      <ExhibitionStack.Screen
          name={ExhibitionRootEnum.TopTab}
          component={ExhibitionTopTabNavigator}
          options={{...headerOptions, headerTitle: state.currentExhibitionHeader}}
        />
        <ExhibitionStack.Screen
          name={PreviousExhibitionRootEnum.navigatorScreen}
          component={PastExhibitionTopTabNavigator}
          options={{...headerOptions, headerTitle: state.previousExhibitionHeader}}
          />
        <ExhibitionStack.Screen
          name={ExhibitionRootEnum.individualArtwork}
          component={ArtworkNavigatorModal}
          options={{...modalHeaderOptions, presentation: 'modal', headerTitle: state.currentArtworkTombstoneHeader}}
        />
    </ExhibitionStack.Navigator>
  );
}
