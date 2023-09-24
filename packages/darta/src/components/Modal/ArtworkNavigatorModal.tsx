import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useContext} from 'react';
import {Alert, View} from 'react-native';

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {MILK} from '@darta/styles';
import {SavedArtworkDisplay} from '../Artwork/SavedArtworkDisplay';
import {TombstonePortrait} from '../Tombstone/_index';
import {StoreContext} from '../../state/Store';


export function ArtworkNavigatorModal({route}: {route: any}) {
  const {artOnDisplay} = route.params;


  const {state} = useContext(StoreContext);

  const inquireAlert = () =>
    Alert.alert("We'll reach out", 'How would you like to get in contact?', [
      {
        text: `Email: ${state.userSettings.email}`,
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: `Text: ${state.userSettings.phone}`,
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('OK Pressed'),
        style: 'destructive',
      },
    ]);

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
            component={TombstonePortrait}
            initialParams={{artOnDisplay, inquireAlert}}
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
