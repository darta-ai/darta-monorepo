import React from 'react';
import {Animated, View} from 'react-native';
import {IconButton} from 'react-native-paper';

import {OpenStateEnum} from '../../../types';
import {icons} from '../../globalVariables';
import {
  galleryInteractionStyles,
  viewOptionsStyles,
} from '../../Screens/Gallery/galleryStyles';

function GalleryViewOptions({
  fadeAnimOptions,
  isPortrait,
  localButtonSizes,
  openIdentifier,
  openOptions,
  toggleButtonView,
  flipOrientation,
}: {
  fadeAnimOptions: Animated.Value;
  isPortrait: boolean;
  localButtonSizes: any;
  openIdentifier: OpenStateEnum;
  openOptions: boolean;

  toggleButtonView: (openIdentifier: OpenStateEnum) => void;
  flipOrientation: () => void;
}) {
  console.log('rendering GalleryViewOptions');
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
      <Animated.View
        style={[
          galleryInteractionStyles.animatedContainer,
          {
            opacity: fadeAnimOptions,
            justifyContent: 'flex-end',
          },
        ]}>
        <IconButton
          mode="outlined"
          icon={icons.screenRotation}
          size={localButtonSizes.small}
          disabled={!openOptions}
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

export {GalleryViewOptions};
