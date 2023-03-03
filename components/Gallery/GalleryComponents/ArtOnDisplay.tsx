import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  View,
  ImageBackground,
  ImageSourcePropType,
  ActivityIndicator,
} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { DataT } from '../../../types';
import { galleryStyles } from '../galleryStyles';

export function ArtOnDisplay({
  artImage,
  backgroundImage,
  backgroundImageDimensionsPixels,
  dimensionsInches,
  isPortrait,
  wallHeight,
  toggleArtForward,
  toggleArtBackward,
}: {
    artImage: string | undefined,
    backgroundImage: ImageSourcePropType,
    backgroundImageDimensionsPixels: any
    dimensionsInches: DataT['dimensionsInches'] | undefined
    isPortrait: boolean
    wallHeight: number
    toggleArtForward: ()=> void
    toggleArtBackward: ()=> void
}) {
  const [touchX, setTouchX] = useState<number>(0);
  const [touchY, setTouchY] = useState<number>(0);

  const swipeArtwork = (pageX:number, pageY:number) => {
    if (isPortrait) {
      // Y axis is to prevent the pinch to zoom resulting in a touch
      if ((pageX - touchX > wp('55%')) && (pageY - touchY < hp('25%'))) {
        toggleArtForward();
      }
      if (touchX - pageX > wp('55%') && (pageY - touchY < hp('25%'))) {
        toggleArtBackward();
      }
    } else {
      if (pageY - touchY > hp('25%') && (pageX - touchX < wp('25%'))) {
        toggleArtForward();
      }
      if (touchY - pageY > hp('25%') && (pageX - touchX < wp('25%'))) {
        toggleArtBackward();
      }
    }
  };

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
      height: '100%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <ImageBackground
        source={backgroundImage}
        resizeMethod="resize"
      >
        <View
          style={galleryStylesPortrait.screenContainer}
          onTouchStart={({ nativeEvent: { pageX, pageY } }) => {
            setTouchX(pageX);
            setTouchY(pageY);
          }}
          // onTouchMove={({ nativeEvent: { pageX, pageY } }) => {
          // }}
          onTouchEnd={({ nativeEvent: { pageX, pageY } }) => {
            swipeArtwork(pageX, pageY);
          }}
        >
          <View style={galleryStylesPortrait.artContainer}>

            <View
              style={galleryStyles.frameStyle}
            >
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
