import React, {useContext} from 'react';
import {Alert, View} from 'react-native';

import {StoreContext} from '../../../State/Store';
import {TombstoneLandscape, TombstonePortrait} from '.';

export function TombstoneRoute({route}: {route: any}) {
  const {artOnDisplay} = route.params;

  const {state} = useContext(StoreContext);

  const inquireAlert = () =>
    Alert.alert("We'll reach out", 'How would you like to get in contact?', [
      {
        text: 'Email: fake.email@gmail.com',
        onPress: () => console.log('Ask me later pressed'),
      },
      {
        text: 'Text: (415)612-3214',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Cancel',
        onPress: () => console.log('OK Pressed'),
        style: 'destructive',
      },
    ]);

  return (
    <View>
      {state.isPortrait ? (
        <TombstonePortrait
          artOnDisplay={artOnDisplay}
          inquireAlert={inquireAlert}
        />
      ) : (
        <TombstoneLandscape
          artOnDisplay={artOnDisplay}
          inquireAlert={inquireAlert}
        />
      )}
    </View>
  );
}
