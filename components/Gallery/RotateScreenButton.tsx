import React from 'react';
import { IconButton } from 'react-native-paper';
import {
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

function RotateScreenButton({
  isPortrait,
}: {
    isPortrait: boolean
}) {
  const rotateButtonStyles = StyleSheet.create({
    rotateScreenContainerPortrait: {
      position: 'absolute',
      backgroundColor: '#FFF',
      top: '0%',
      left: '85%',
      opacity: 1,
    },
    rotateScreenContainerLandscape: {
      position: 'absolute',
      bottom: hp('40%'),
      left: hp('35%'),
      height: wp('15%'),
    },
  });

  const rotateScreenContainerStyle = isPortrait
    ? rotateButtonStyles.rotateScreenContainerPortrait
    : rotateButtonStyles.rotateScreenContainerLandscape;

  return (
    <View style={{ zIndex: 2 }}>
      <IconButton
        icon="settings-helper"
        size={20}
        mode="outlined"
        style={rotateScreenContainerStyle}
        testID="rightScrollButton"
        onPress={() => Alert.alert('hi!')}
      />
    </View>
  );
}

export default RotateScreenButton;
