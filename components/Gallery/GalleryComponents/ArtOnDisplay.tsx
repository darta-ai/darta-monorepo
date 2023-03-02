import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { DataT } from '../../../types';
import { galleryStyles } from '../galleryStyles';

export function ArtOnDisplay({
  dimensionsInches,
  backgroundImage,
  artImage,
  wallHeight,
  backgroundImageDimensionsPixels,
  isPortrait,
}: {
    dimensionsInches: DataT['dimensionsInches'] | undefined
    backgroundImage: ImageSourcePropType,
    artImage: string | undefined,
    wallHeight: number
    backgroundImageDimensionsPixels: any
    isPortrait: boolean
}) {
  const dimensionsMultiplierPortrait = (backgroundImageDimensionsPixels.width
    / backgroundImageDimensionsPixels.height);

  const backgroundHeightInches = wallHeight;

  const backgroundWidthInches = wallHeight * dimensionsMultiplierPortrait;

  let artHeightInches;
  let artWidthInches;
  let artImageSize;
  let artImageLocation;
  if (dimensionsInches) {
    ({ height: artHeightInches, width: artWidthInches } = dimensionsInches);

    const pixelsPerInchHeight = backgroundImageDimensionsPixels.height / backgroundHeightInches;
    const pixelsPerInchWidth = backgroundImageDimensionsPixels.width / backgroundWidthInches;

    artImageSize = {
      height: (artHeightInches * pixelsPerInchHeight),
      width: (artWidthInches * pixelsPerInchWidth),
    };

    const artHeightPixels = artHeightInches * pixelsPerInchHeight;
    const artWidthPixels = artWidthInches * pixelsPerInchWidth;

    artImageLocation = {
      top: (0.45 * backgroundImageDimensionsPixels.height) - (0.5 * artHeightPixels),
      left: (0.485 * backgroundImageDimensionsPixels.width) - (0.5 * artWidthPixels),
    };
  }
  const galleryStylesPortrait = StyleSheet.create({
    screenContainer: {
      width: backgroundImageDimensionsPixels.width,
      height: backgroundImageDimensionsPixels.height,
    },
    artContainer: {
      top: artImageLocation?.top,
      left: artImageLocation?.left,
    },
    artwork: {
      borderRadius: 0.5,
      height: artImageSize?.height,
      width: artImageSize?.width,
    },
  });
  return (
    <View style={{
      zIndex: 0,
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <ImageBackground
        source={backgroundImage}
        resizeMethod="resize"
      >
        <View style={galleryStylesPortrait.screenContainer}>
          <View style={galleryStylesPortrait.artContainer}>
            <View style={galleryStyles.frameStyle}>
              {artImage
                ? (
                  <Image
                    source={{ uri: artImage }}
                    style={galleryStylesPortrait.artwork}
                  />
                )
                : (
                  <ActivityIndicator
                    style={{
                      top: isPortrait ? hp('35%') : hp('20%'),
                      justifyContent: 'center',
                    }}
                  />
                )}

            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
