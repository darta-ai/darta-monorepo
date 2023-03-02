import React from 'react';
import {
  Animated,
  View,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { galleryInteractionStyles } from '../galleryStyles';
import { icons } from '../../globalVariables';
import { GlobalText } from '../../GlobalElements';
import { globalTextStyles } from '../../styles';
import { OpenStateEnum } from '../../../types';

export function NavigateArt({
  fadeAnimNav,
  isPortrait,
  openIdentifier,
  toggleArtForward,
  toggleArtBackward,
  toggleArtDetails,
  toggleButtonView,
} : {
  fadeAnimNav: Animated.Value,
  isPortrait: boolean
  openIdentifier: OpenStateEnum
  toggleArtForward: ()=> void
  toggleArtBackward: ()=> void
  toggleArtDetails: ()=> void
  toggleButtonView:
  // eslint-disable-next-line
  (openIdentifier: OpenStateEnum) => void
}) {
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
            onLongPress={() => toggleButtonView(openIdentifier)}
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
      </View>
    </View>
  );
}
