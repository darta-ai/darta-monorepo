import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  ImageSourcePropType,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { DataT } from '../../types';
import { galleryStyles } from './galleryStyles';

function ArtOnDisplay({
  artOnDisplay,
  backgroundImage,
  artToDisplay,
  wallHeight,
  isPortrait,
  backgroundImageDimensionsPixels,
}: {
    artOnDisplay: DataT
    backgroundImage: ImageSourcePropType,
    artToDisplay: string,
    wallHeight: number
    isPortrait: boolean
    backgroundImageDimensionsPixels: any
}) {
  const dimensionsMultiplierPortrait = (backgroundImageDimensionsPixels.width
    / backgroundImageDimensionsPixels.height);

  const backgroundHeightInches = wallHeight;

  const backgroundWidthInches = wallHeight * dimensionsMultiplierPortrait;

  const { height: artHeightInches, width: artWidthInches } = artOnDisplay.dimensionsInches;

  const pixelsPerInchHeight = backgroundImageDimensionsPixels.height / backgroundHeightInches;
  const pixelsPerInchWidth = backgroundImageDimensionsPixels.width / backgroundWidthInches;

  const artImageSize = {
    height: (artHeightInches * pixelsPerInchHeight),
    width: (artWidthInches * pixelsPerInchWidth),
  };

  const artHeightPixels = artHeightInches * pixelsPerInchHeight;
  const artWidthPixels = artWidthInches * pixelsPerInchWidth;

  const artImageLocation = {
    top: (0.45 * backgroundImageDimensionsPixels.height) - (0.5 * artHeightPixels),
    left: (0.485 * backgroundImageDimensionsPixels.width) - (0.5 * artWidthPixels),
  };

  const galleryStylesPortrait = StyleSheet.create({
    screenContainer: {
      width: backgroundImageDimensionsPixels.width,
      height: backgroundImageDimensionsPixels.height,
    },
    artContainer: {
      top: artImageLocation.top,
      left: artImageLocation.left,
    },
    artwork: {
      borderRadius: 0.5,
      height: artImageSize.height,
      width: artImageSize.width,
    },
  });
  return (
    <View style={{
      zIndex: 0,
      borderWidth: 8,
      borderColor: 'red',
    }}
    >
      <ImageBackground
        source={backgroundImage}
        resizeMethod="resize"
      >
        <View style={galleryStylesPortrait.screenContainer}>
          <View style={galleryStylesPortrait.artContainer}>
            <View style={galleryStyles.frameStyle}>
              <Image
                style={galleryStylesPortrait.artwork}
                src={artToDisplay}
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

export default ArtOnDisplay;
