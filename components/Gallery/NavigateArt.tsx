import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { galleryStyles } from './galleryStyles';

function NavigateArt({
  isPortrait,
  toggleArtForward,
  toggleArtBackward,
} : {
  isPortrait: boolean
  toggleArtForward: any
  toggleArtBackward: any
}) {
  const navigationContainer = StyleSheet.create({
    navigateContainerPortrait: {
      position: 'absolute',
      flexDirection: 'row',
      bottom: hp('0%'),
      left: wp('0%'),
      width: wp('30%'),
      opacity: 0.9,
    },
    navigateContainerLandscape: {
      position: 'absolute',
      borderColor: 'red',
      borderWidth: 1,
      flexDirection: 'row',
      top: hp('40%'),
      right: wp('40%'),
      width: '40%',
      transform: [{ rotate: '90deg' }],
      opacity: 1,
    },
    fabStyle: {
      position: 'absolute',
      display: 'flex',
      opacity: 0.85,
      backgroundColor: '#FFF',
      borderRadius: 30,
    },
  });

  const navigateArtContainer = isPortrait
    ? navigationContainer.navigateContainerPortrait
    : navigationContainer.navigateContainerLandscape;

  return (
    <View style={navigateArtContainer}>
      <IconButton
        icon="pan-left"
        mode="outlined"
        size={40}
        style={galleryStyles.interactionButton}
        accessibilityLabel="Navigate Left"
        testID="leftScrollButton"
        onPress={() => toggleArtForward()}
      />
      <IconButton
        icon="pan-right"
        mode="outlined"
        size={40}
        style={galleryStyles.interactionButton}
        accessibilityLabel="Navigate Right"
        testID="rightScrollButton"
        onPress={() => toggleArtBackward()}
      />
    </View>
  );
}

export default NavigateArt;
