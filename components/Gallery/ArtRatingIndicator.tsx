import React from 'react';
import { IconButton } from 'react-native-paper';
import {
  View,
  Alert,
} from 'react-native';
import { artworkRatingStyles } from './styles';
import { icons } from './globals';

function ArtRatingIndicator({
  isPortrait,
  artworkRatedString,
}: {
    isPortrait: boolean
    artworkRatedString: string
}) {
  const rotateScreenContainerStyle = isPortrait
    ? artworkRatingStyles.artworkRatingPortrait
    : artworkRatingStyles.artworkRatingLandscape;

  const artworkString:string = artworkRatedString ?? 'thinking';

  return (
    <View style={{ zIndex: 1 }}>
      <IconButton
        icon={icons[artworkString]}
        size={20}
        disabled
        mode="outlined"
        style={rotateScreenContainerStyle}
        testID="rightScrollButton"
        onPress={() => Alert.alert('hi!')}
      />
    </View>
  );
}

export default ArtRatingIndicator;
