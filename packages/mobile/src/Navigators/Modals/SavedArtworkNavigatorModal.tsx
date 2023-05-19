import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React from 'react';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {MILK} from '../../../assets/styles';
import {SavedArtworkDisplay} from '../../Components/User/SavedArtwork/SavedArtworkDisplay';
import {SavedArtworkTombstone} from '../../Components/User/SavedArtwork/SavedArtworkTombstone';

export function SavedArtworkNavigatorModal({route}: {route: any}) {
  const {artOnDisplay} = route.params;

  const Tab = createMaterialTopTabNavigator();
  return (
    <Tab.Navigator
      style={{backgroundColor: MILK, height: hp('80%')}}
      screenOptions={{
        tabBarLabelStyle: {fontSize: 11, fontFamily: 'Avenir Next'},
        tabBarItemStyle: {width: wp('50%')},
        tabBarStyle: {backgroundColor: MILK},
      }}>
      {artOnDisplay && (
        <>
          <Tab.Screen
            name="Tombstone"
            component={SavedArtworkTombstone}
            initialParams={{artOnDisplay}}
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
