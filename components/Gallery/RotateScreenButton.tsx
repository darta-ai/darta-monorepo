import React from 'react';
import { IconButton } from 'react-native-paper';
import {
  StyleSheet,
  View,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { galleryStyles } from './galleryStyles';

function RotateScreenButton({
  isPortrait,
}: {
    isPortrait: boolean
}) {
  const rotateButtonStyles = StyleSheet.create({
    rotateScreenContainerPortrait: {
      position: 'absolute',
      top: hp('0%'),
      left: wp('80%'),
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

    <View style={rotateScreenContainerStyle}>
      <IconButton
        icon="settings-helper"
        size={20}
        mode="outlined"
        style={galleryStyles.interactionButton}
        testID="rightScrollButton"
      />
    </View>

  );
}

export default RotateScreenButton;
