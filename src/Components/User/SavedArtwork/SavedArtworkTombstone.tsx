import React, {useContext} from 'react';
import {Alert, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {MILK} from '../../../../assets/styles';
import {TombstonePortrait} from '../../../Screens/Gallery/Tombstone/index';
import {StoreContext} from '../../../State/Store';

export function SavedArtworkTombstone({route}: {route: any}) {
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

  return (
    <View style={{backgroundColor: MILK, height: hp('100%')}}>
      <TombstonePortrait
        artOnDisplay={artOnDisplay}
        inquireAlert={inquireAlert}
      />
    </View>
  );
}
