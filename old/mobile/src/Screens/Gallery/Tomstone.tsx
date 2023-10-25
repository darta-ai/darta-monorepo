import React, {useContext} from 'react';
import {Alert, View} from 'react-native';

import {StoreContext} from '../../State/Store';
import {TombstoneLandscape, TombstonePortrait} from './Tombstone';

export function TombstoneRoute({route}: {route: any}) {
  const {artOnDisplay} = route.params;

  const {state} = useContext(StoreContext);

  const inquireAlert = () =>
    Alert.alert("We'll reach out", 'How would you like to get in contact?', [
      {
        text: `Email: ${state.userSettings.email}`,
        onPress: () => {},
      },
      {
        text: `Text: ${state.userSettings.phone}`,
        onPress: () => {},
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
