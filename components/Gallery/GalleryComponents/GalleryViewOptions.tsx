import React from 'react';
import { IconButton } from 'react-native-paper';
import {
  View,
  Animated,
} from 'react-native';
import { viewOptionsStyles, galleryInteractionStyles } from '../galleryStyles';
import { icons } from '../../globalVariables';
import { OpenStateEnum } from '../../../types';

function GalleryViewOptions({
  fadeAnimOptions,
  isPortrait,
  localButtonSizes,
  openIdentifier,
  toggleButtonView,
  flipOrientation,
}: {
    isPortrait: boolean
    fadeAnimOptions: Animated.Value
    openIdentifier: OpenStateEnum
    localButtonSizes: any
    // eslint-disable-next-line
    toggleButtonView:(openIdentifier: OpenStateEnum) => void
    flipOrientation: () => void
}) {
  const rotateScreenContainerStyle = isPortrait
    ? viewOptionsStyles.rotateScreenContainerPortrait
    : viewOptionsStyles.rotateScreenContainerLandscape;

  return (
    <View style={rotateScreenContainerStyle}>
      <IconButton
        icon={icons.viewSettings}
        size={localButtonSizes.small}
        mode="outlined"
        style={viewOptionsStyles.buttons}
        testID="rightScrollButton"
        onPress={() => toggleButtonView(openIdentifier)}
      />
      {/* {openOptions && ( */}
      <Animated.View
        style={[galleryInteractionStyles.animatedContainer, {
          opacity: fadeAnimOptions,
          justifyContent: 'flex-end',
        }]}
      >
        <IconButton
          mode="outlined"
          icon={icons.screenRotation}
          size={localButtonSizes.small}
          style={viewOptionsStyles.viewOptionsButtonStyle}
          accessibilityLabel="Flip Screen Orientation"
          testID="flipScreenButton"
          onPress={() => flipOrientation()}
        />
      </Animated.View>
      {/* )} */}
    </View>
  );
}

export { GalleryViewOptions };
