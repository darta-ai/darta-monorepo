import React from 'react';
import { IconButton } from 'react-native-paper';
import {
  View,
  Alert,
} from 'react-native';
import { rotateButtonStyles } from './styles';

function GalleryOptionsButton({
  isPortrait,
}: {
    isPortrait: boolean
}) {
  const rotateScreenContainerStyle = isPortrait
    ? rotateButtonStyles.rotateScreenContainerPortrait
    : rotateButtonStyles.rotateScreenContainerLandscape;

  return (
    <View style={{ zIndex: 1 }}>
      <IconButton
        icon="settings-helper"
        size={20}
        mode="outlined"
        style={rotateScreenContainerStyle}
        testID="rightScrollButton"
        onPress={() => Alert.alert('hi!')}
      />
    </View>
  );
}

export default GalleryOptionsButton;
