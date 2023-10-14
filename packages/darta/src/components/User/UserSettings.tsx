import React from 'react';
import {StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

// import {deviceInformation} from '../../../App';
import {EditUserProfile} from './EditUserProfile';

export const SSUserSettings = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    alignSelf: 'center',
    width: wp('100%'),
    marginBottom: hp('5%'),
  },
});

export function UserSettings({navigation} : {navigation: any}) {

  return (
    <View style={SSUserSettings.container}>
      <View>
        <EditUserProfile 
          navigation={navigation}
        />
      </View>
    </View>
  );
}
