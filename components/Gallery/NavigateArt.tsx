import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const icons = {
  navigateLeft: 'pan-left',
  navigateRight: 'pan-right',
};

function NavigateArt({
  isPortrait,
  toggleArtForward,
  toggleArtBackward,
} : {
  isPortrait: boolean
  toggleArtForward: any
  toggleArtBackward: any
}) {
  const [openNav, setOpenNav] = useState<boolean>(false);

  const fadeAnimNav = useRef(new Animated.Value(0)).current;

  const duration = 250;

  const fadeIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    setOpenNav(!openNav);
    Animated.timing(fadeAnimNav, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = async () => {
    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnimNav, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(() => setOpenNav(!openNav));
  };

  const openClose = (): void => {
    if (openNav) {
      fadeOut();
    } else {
      fadeIn();
    }
  };

  const interactionButtonStyles = StyleSheet.create({
    navigateContainerPortrait: {
      position: 'absolute',
      bottom: '0%',
      height: '100%',
      width: '80%',
    },
    navigateContainerLandscape: {
      position: 'absolute',
      bottom: '0%',
      height: '100%',
      width: '80%',
      borderColor: 'red',
      borderWidth: 5,
    },
    navigateRightPortrait: {
      position: 'absolute',
      bottom: '5%',
      left: '0%',
      borderRadius: 30,
      opacity: 0.8,
      backgroundColor: '#FFF',
    },
    navigateRightLandscape: {
      position: 'absolute',
      top: '50%',
      left: wp('40%'),
      borderRadius: 30,
      transform: [{ rotate: '90deg' }],
      opacity: 0.85,
    },
    navigateLeftPortrait: {
      backgroundColor: '#FFF',
      opacity: 0.9,
    },
    navigateLeftLandscape: {
      top: hp('50%'),
      left: wp('40%'),
      borderRadius: 30,
      transform: [{ rotate: '90deg' }],
      opacity: 0.85,
    },
  });

  const navigateRightStyle = isPortrait
    ? interactionButtonStyles.navigateRightPortrait
    : interactionButtonStyles.navigateRightLandscape;

  const navigateLeftStyle = isPortrait
    ? interactionButtonStyles.navigateLeftPortrait
    : interactionButtonStyles.navigateLeftLandscape;

  const navigateContainer = isPortrait
    ? interactionButtonStyles.navigateContainerPortrait
    : interactionButtonStyles.navigateContainerLandscape;

  return (
    <View style={navigateContainer}>
      <IconButton
        icon={icons.navigateRight}
        mode="outlined"
        size={40}
        style={navigateRightStyle}
        accessibilityLabel="Navigate Left"
        testID="leftScrollButton"
        onPress={() => toggleArtForward()}
        onLongPress={() => openClose()}
      />
      {openNav && (
      <Animated.View
        style={{
          position: 'absolute',
          opacity: fadeAnimNav,
          top: '50%',
          width: '100%',
          height: '35%',
          flex: 1,
          paddingBottom: '5%',
          justifyContent: 'flex-end',
          alignItems: 'flex-start',
          flexDirection: 'column',
        }}
      >

        <IconButton
          icon={icons.navigateLeft}
          mode="outlined"
          size={30}
          style={navigateLeftStyle}
          accessibilityLabel="Navigate Right"
          testID="rightScrollButton"
          onPress={() => toggleArtBackward()}
        />
      </Animated.View>
      )}
    </View>
  );
}

export default NavigateArt;
