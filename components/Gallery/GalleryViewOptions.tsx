import React from 'react';
import { IconButton } from 'react-native-paper';
import {
  View,
  Animated,
} from 'react-native';
import { viewOptionsStyles, galleryInteractionStyles } from './styles';
import { icons, buttonSizes } from '../globalVariables';

function GalleryViewOptions({
  isPortrait,
  openOptions,
  fadeAnimOptions,
  flipOrientation,
  toggleOptionsView,
}: {
    isPortrait: boolean
    openOptions: boolean
    fadeAnimOptions: Animated.Value
    flipOrientation: () => void
    toggleOptionsView: () => void
}) {
  const rotateScreenContainerStyle = isPortrait
    ? viewOptionsStyles.rotateScreenContainerPortrait
    : viewOptionsStyles.rotateScreenContainerLandscape;

  return (
    <View style={rotateScreenContainerStyle}>
      <IconButton
        icon={icons.viewSettings}
        size={buttonSizes.small}
        mode="outlined"
        style={viewOptionsStyles.buttons}
        testID="rightScrollButton"
        onPress={() => toggleOptionsView()}
      />
      {openOptions && (
      <Animated.View
        style={[galleryInteractionStyles.animatedContainer, {
          opacity: fadeAnimOptions,
          justifyContent: 'flex-end',
        }]}
      >
        <IconButton
          mode="outlined"
          icon={icons.screenRotation}
          size={buttonSizes.small}
          style={viewOptionsStyles.viewOptionsButtonStyle}
          accessibilityLabel="Flip Screen Orientation"
          testID="flipScreenButton"
          onPress={() => flipOrientation()}
        />
      </Animated.View>
      )}
    </View>
  );
}

export { GalleryViewOptions };
