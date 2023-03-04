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
  localButtonSizes,
  openNav,
  openIdentifier,
  toggleArtForward,
  toggleArtBackward,
  toggleArtDetails,
  toggleButtonView,
} : {
  fadeAnimNav: Animated.Value,
  isPortrait: boolean
  localButtonSizes: any
  openNav: boolean
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
      <View style={galleryInteractionStyles.containerPortraitFlex}>
        <View style={{ alignSelf: 'flex-start' }}>
          <IconButton
            icon={icons.learnMore}
            mode="outlined"
            size={localButtonSizes.large}
            style={galleryInteractionStyles.secondaryButton}
            accessibilityLabel="Navigate Right"
            testID="rightScrollButton"
            onPress={() => toggleArtDetails()}
            onLongPress={() => {
              toggleButtonView(openIdentifier);
            }}
          />
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
            left
          </GlobalText>
          <IconButton
            icon={icons.navigateLeft}
            disabled={!openNav}
            mode="outlined"
            size={localButtonSizes.medium}
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
            right
          </GlobalText>
          <IconButton
            disabled={!openNav}
            icon={icons.navigateRight}
            mode="outlined"
            size={localButtonSizes.medium}
            style={navigateRightStyles}
            accessibilityLabel="Navigate Left"
            testID="leftScrollButton"
            onPress={() => toggleArtForward()}
            onLongPress={() => {
              toggleButtonView(openIdentifier);
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
}
