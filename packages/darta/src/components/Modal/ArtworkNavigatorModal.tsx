import React, {useContext} from 'react';
import {Alert, View} from 'react-native';

import {StoreContext} from '../../state/Store';
import {TombstonePortrait} from '../Tombstone/_index';

export function ArtworkNavigatorModal({route}: {route: any}) {
  let artOnDisplay: any = null;
  if (route.params){
    ({artOnDisplay} = route.params);
  }

  const {state} = useContext(StoreContext);

  const inquireAlert = () =>
    Alert.alert("We'll reach out", 'How would you like to get in contact?', [
      {
        text: `Email: ${state.userSettings.email}`,
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('OK Pressed'),
        style: 'destructive',
      },
    ]);

  return (
    <View>
      <TombstonePortrait 
        artwork={artOnDisplay}
        inquireAlert={inquireAlert}
      />
    </View>
  );
}
