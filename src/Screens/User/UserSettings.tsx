import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {UserSettingsSignedIn} from '../../Components/User/UserSettings/SignedInUserSettings';

export const SSUserSettings = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginBottom: hp('5%'),
  },
});

export function UserSettings() {
  return (
    <View style={SSUserSettings.container}>
      <View>
        <UserSettingsSignedIn />
      </View>
    </View>
  );
}
