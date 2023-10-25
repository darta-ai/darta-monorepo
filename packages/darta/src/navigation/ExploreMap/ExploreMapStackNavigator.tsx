import {PRIMARY_800, PRIMARY_900, PRIMARY_50} from '@darta-styles';
import React, {useContext} from 'react';

import {StoreContext} from '../../state/Store';
import {headerOptions} from '../../styles/styles';
import { ExploreMapRootEnum} from '../../typing/routes';
import { ExploreMapHomeScreen } from '../../screens/ExploreMap/ExploreMapHomeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import { ExhibitionTopTabNavigator } from '../Exhibition/ExhibitionTopTabNavigator';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition';

export const ExploreMapStack = createStackNavigator();

export function ExploreMapStackNavigator({route} : {route: any}) {
  const {state} = useContext(StoreContext);

  return (
    <ExploreMapStack.Navigator screenOptions={{headerTintColor: PRIMARY_800}}>
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.exploreMapHome}
          component={ExploreMapHomeScreen}
          options={{...headerOptions, headerTitle: 'visit'}}
        />
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.TopTabExhibition}
          component={ExhibitionTopTabNavigator}
          options={{...headerOptions, headerTitle: state.currentExhibitionHeader ?? ""}}
        />
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.exploreMapGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params?.galleryId, showPastExhibitions: true}}
          options={{...headerOptions, headerTitle: state.galleryHeader ?? ""}}
        />
    </ExploreMapStack.Navigator>
  );
}
