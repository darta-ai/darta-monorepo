import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {Artwork} from '@darta/types';
import {galleryStyles} from '../../styles/styles';

export function SavedArtOnDisplay({
  artImage,
  backgroundImage,
  backgroundImageDimensionsPixels,
  currentZoomScale,
  dimensionsInches,
  isPortrait,
  wallHeight,
  setCurrentZoomScale,
}: {
  artImage: string | undefined;
  backgroundImage: ImageSourcePropType;
  backgroundImageDimensionsPixels: any;
  currentZoomScale: number;
  dimensionsInches: Artwork['artworkDimensions'] | undefined;
  isPortrait: boolean;
  wallHeight: number;
  setCurrentZoomScale: (arg0: number) => void;
}) {
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const scrollViewRef = useRef<ScrollView | null>(null);

  const dimensionsMultiplierPortrait =
    backgroundImageDimensionsPixels.width /
    backgroundImageDimensionsPixels.height;

  const backgroundHeightInches = wallHeight;

  const backgroundWidthInches = wallHeight * dimensionsMultiplierPortrait;

  let artHeightInches;
  let artWidthInches;
  let artImageSize;
  let artImageLocation;
  let artHeightPixels = 0;
  let artWidthPixels = 0;
  if (dimensionsInches && dimensionsInches.heightIn.value && dimensionsInches.widthIn.value) {
    artHeightInches = parseInt(dimensionsInches.heightIn.value, 10);
    artWidthInches = parseInt(dimensionsInches.widthIn.value, 10);

    const pixelsPerInchHeight =
      backgroundImageDimensionsPixels.height / backgroundHeightInches;
    const pixelsPerInchWidth =
      backgroundImageDimensionsPixels.width / backgroundWidthInches;

    artImageSize = {
      height: artHeightInches * pixelsPerInchHeight,
      width: artWidthInches * pixelsPerInchWidth,
    };

    artHeightPixels = artHeightInches * pixelsPerInchHeight;
    artWidthPixels = artWidthInches * pixelsPerInchWidth;

    artImageLocation = {
      top:
        0.45 * backgroundImageDimensionsPixels.height - 0.5 * artHeightPixels,
      left:
        0.485 * backgroundImageDimensionsPixels.width - 0.5 * artWidthPixels,
    };
  }

  useEffect(() => {
    const isCurrentZoomOne = currentZoomScale === 1;
    if (isCurrentZoomOne) {
      return setScrollEnabled(false);
    }
    return setScrollEnabled(true);
  }, [currentZoomScale]);

  const galleryStylesPortrait = StyleSheet.create({
    container: {
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
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
    activityIndicator: {
      top: isPortrait ? hp('35%') : hp('20%'),
      justifyContent: 'center',
    },
    scrollViewStyle: {
      flexGrow: 1,
      justifyContent: 'center',
    },
  });
  return (
    <View style={galleryStylesPortrait.container}>
      <ScrollView
        ref={scrollViewRef}
        scrollEnabled={scrollEnabled}
        onScroll={({nativeEvent: {zoomScale}}) => {
          setCurrentZoomScale(zoomScale);
        }}
        zoomScale={currentZoomScale}
        scrollEventThrottle={7}
        maximumZoomScale={6}
        minimumZoomScale={1}
        scrollToOverflowEnabled={false}
        contentContainerStyle={galleryStylesPortrait.scrollViewStyle}
        centerContent
        horizontal
        pinchGestureEnabled
        removeClippedSubviews
        snapToAlignment="center">
        <ImageBackground
          source={backgroundImage}
          style={galleryStylesPortrait.screenContainer}>
          <View>
            <View style={galleryStylesPortrait.screenContainer}>
              <View style={galleryStylesPortrait.artContainer}>
                <View style={galleryStyles.frameStyle}>
                  <Image
                    source={{uri: artImage}}
                    style={galleryStylesPortrait.artwork}
                  />
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}
