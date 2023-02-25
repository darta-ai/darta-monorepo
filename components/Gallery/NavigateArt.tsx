import React, { useState, useRef } from 'react';
import {
  Animated,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { navigationArtStyles } from './styles';
import { icons, duration } from './globals';

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

  const fadeAnimNav = useRef(new Animated.Value(1)).current;

  const fadeIn = () => {
    setOpenNav(!openNav);
    Animated.timing(fadeAnimNav, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = async () => {
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

  const navigateContainer = isPortrait
    ? navigationArtStyles.navigateContainerPortrait
    : navigationArtStyles.navigateContainerLandscape;

  return (
    <View style={navigateContainer}>
      <IconButton
        icon={icons.navigateRight}
        mode="outlined"
        size={40}
        style={navigationArtStyles.navigateRight}
        accessibilityLabel="Navigate Left"
        testID="leftScrollButton"
        onPress={() => toggleArtForward()}
        onLongPress={() => openClose()}
      />
      {openNav && (
      <Animated.View
        style={[navigationArtStyles.animatedNavigationContainer, {
          opacity: fadeAnimNav,
        }]}
      >

        <IconButton
          icon={icons.navigateLeft}
          mode="outlined"
          size={30}
          style={navigationArtStyles.navigateLeft}
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
