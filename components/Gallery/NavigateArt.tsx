import React, {
  useRef, Dispatch, SetStateAction,
} from 'react';
import {
  Animated,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { galleryInteractionStyles } from './styles';
import { icons, duration } from '../globalVariables';
import { GlobalText } from '../GlobalElements';
import { globalTextStyles } from '../styles';

export function NavigateArt({
  isPortrait,
  openNav,
  toggleArtForward,
  toggleArtBackward,
  toggleArtDetails,
  setOpenNav,
} : {
  isPortrait: boolean
  openNav: boolean
  toggleArtForward: ()=> void
  toggleArtBackward: ()=> void
  toggleArtDetails: ()=> void
  setOpenNav: Dispatch<SetStateAction<boolean>>
}) {
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
    ? galleryInteractionStyles.containerPortrait
    : galleryInteractionStyles.containerLandscape;

  const navigateRightStyles = isPortrait
    ? [galleryInteractionStyles.mainButtonPortrait]
    : galleryInteractionStyles.mainButtonLandscape;

  return (
    <View style={navigateContainer}>
      <View style={[galleryInteractionStyles.containerPortraitFlex]}>
        <View style={{ alignSelf: 'flex-start' }}>
          <IconButton
            icon={icons.navigateRight}
            mode="outlined"
            size={40}
            style={navigateRightStyles}
            accessibilityLabel="Navigate Left"
            testID="leftScrollButton"
            onPress={() => toggleArtForward()}
            onLongPress={() => openClose()}
          />
          <GlobalText
            style={[
              globalTextStyles.centeredText,
              galleryInteractionStyles.textLabelsStyle,
            ]}
          >
            move right
          </GlobalText>
        </View>
        {openNav && (
        <Animated.View
          style={[galleryInteractionStyles.animatedContainer, {
            opacity: fadeAnimNav,
            alignItems: 'center',
          }]}
        >
          <GlobalText
            style={[
              globalTextStyles.centeredText,
              galleryInteractionStyles.textLabelsStyle,
            ]}
          >
            move left
          </GlobalText>
          <IconButton
            icon={icons.navigateLeft}
            mode="outlined"
            size={30}
            style={galleryInteractionStyles.secondaryButton}
            accessibilityLabel="Navigate Right"
            testID="rightScrollButton"
            onPress={() => toggleArtBackward()}
          />
          <GlobalText
            style={[
              globalTextStyles.centeredText,
              galleryInteractionStyles.textLabelsStyle,
            ]}
          >
            details
          </GlobalText>
          <IconButton
            icon={icons.learnMore}
            mode="outlined"
            size={30}
            style={galleryInteractionStyles.secondaryButton}
            accessibilityLabel="Navigate Right"
            testID="rightScrollButton"
            onPress={() => toggleArtDetails()}
          />
        </Animated.View>
        )}
      </View>
    </View>
  );
}
