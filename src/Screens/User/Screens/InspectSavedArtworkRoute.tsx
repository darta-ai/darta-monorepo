// eslint-disable-next-line import/no-extraneous-dependencies
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {MILK} from '../../../../assets/styles';
import {headerOptions} from '../../../../screens/styles';
import {SavedArtworkDisplay} from '../UserComponents/SavedArtwork/SavedArtworkDisplay';
import {SavedArtworkTombstone} from '../UserComponents/SavedArtwork/SavedArtworkTombstone';

export function InspectSavedArtworkRoute({route}: {route: any}) {
  const {artOnDisplay} = route.params;

  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      style={{backgroundColor: MILK, height: hp('80%')}}
      screenOptions={{
        tabBarLabelStyle: {fontSize: 12, fontFamily: 'Avenir Next'},
        tabBarItemStyle: {width: wp('50%')},
        tabBarStyle: {backgroundColor: MILK},
      }}>
      {artOnDisplay && (
        <>
          <Tab.Screen
            name="Tombstone"
            component={SavedArtworkTombstone}
            initialParams={{artOnDisplay}}
            options={{...headerOptions}}
          />
          <Tab.Screen
            name="Display"
            component={SavedArtworkDisplay}
            initialParams={{artOnDisplay}}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
