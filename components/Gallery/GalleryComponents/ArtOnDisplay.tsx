import React, {useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {DataT} from '../../../types';
import {galleryStyles} from '../galleryStyles';

export function ArtOnDisplay({
  artImage,
  backgroundImage,
  backgroundImageDimensionsPixels,
  currentZoomScale,
  dimensionsInches,
  isPortrait,
  visibleSnack,
  wallHeight,
  setCurrentZoomScale,
  setVisibleSnack,
  toggleArtForward,
  toggleArtBackward,
}: {
  artImage: string | undefined;
  backgroundImage: ImageSourcePropType;
  backgroundImageDimensionsPixels: any;
  currentZoomScale: number;
  dimensionsInches: DataT['dimensionsInches'] | undefined;
  isPortrait: boolean;
  visibleSnack: boolean;
  wallHeight: number;
  // eslint-disable-next-line no-unused-vars
  setCurrentZoomScale: (arg0: number) => void;
  // eslint-disable-next-line no-unused-vars
  setVisibleSnack: (arg0: boolean) => void;
  toggleArtForward: () => void;
  toggleArtBackward: () => void;
}) {
  type SetTouch = {
    touchX: number;
    touchY: number;
  };
  const [touchCoordinates, setTouchCoordinates] = useState<SetTouch>({
    touchX: 0,
    touchY: 0,
  });
  const [scrollEnabled, setScrollEnabled] = useState(false);

  const scrollViewRef = useRef<ScrollView | null>(null);

  const swipeArtwork = (pageX: number, pageY: number): void => {
    if (currentZoomScale !== 1) {
      return;
    }
    const {touchX, touchY} = touchCoordinates;
    if (isPortrait) {
      // Y axis is to prevent the pinch to zoom resulting in a touch
      if (pageX - touchX > wp('25%') && pageY - touchY < hp('25%')) {
        toggleArtBackward();
      }
      if (touchX - pageX > wp('25%') && pageY - touchY < hp('25%')) {
        toggleArtForward();
      }
    } else {
      if (pageY - touchY > hp('10%') && pageX - touchX < wp('25%')) {
        toggleArtBackward();
      }
      if (touchY - pageY > hp('10%') && pageX - touchX < wp('25%')) {
        toggleArtForward();
      }
    }
  };

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
  if (dimensionsInches) {
    ({height: artHeightInches, width: artWidthInches} = dimensionsInches);

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

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .onStart(() => {
      const isCurrentZoomOne = currentZoomScale === 1;
      if (isCurrentZoomOne) {
        setScrollEnabled(true);
        setCurrentZoomScale(3);
        scrollViewRef.current?.scrollTo({
          x: backgroundImageDimensionsPixels.width - 0.25 * artWidthPixels,
          y: backgroundImageDimensionsPixels.height - 0.25 * artHeightPixels,
          animated: false,
        });
      } else {
        setCurrentZoomScale(1);
        setScrollEnabled(false);
        scrollViewRef.current?.scrollToEnd({animated: false});
      }
    });

  useEffect(() => {
    const isCurrentZoomOne = currentZoomScale === 1;
    if (isCurrentZoomOne) {
      setScrollEnabled(false);
    } else {
      setScrollEnabled(true);
    }
  }, [touchCoordinates]);

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
    <GestureDetector gesture={doubleTap}>
      <ScrollView
        ref={scrollViewRef}
        scrollEnabled={scrollEnabled}
        onScroll={({nativeEvent: {zoomScale}}) =>
          setCurrentZoomScale(zoomScale)
        }
        zoomScale={currentZoomScale}
        scrollEventThrottle={7}
        maximumZoomScale={6}
        minimumZoomScale={1}
        scrollToOverflowEnabled={false}
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
        centerContent
        horizontal
        pinchGestureEnabled
        removeClippedSubviews
        snapToAlignment="center">
        <View
          style={{
            zIndex: 0,
            height: '100%',
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ImageBackground
            source={backgroundImage}
            // resizeMethod="resize"
          >
            <Pressable
              onTouchStart={({nativeEvent: {pageX, pageY}}) => {
                setTouchCoordinates({touchX: pageX, touchY: pageY});
                if (visibleSnack) {
                  setVisibleSnack(false);
                }
              }}
              onTouchEnd={({nativeEvent: {pageX, pageY}}) => {
                swipeArtwork(pageX, pageY);
              }}>
              <View style={galleryStylesPortrait.screenContainer}>
                <View style={galleryStylesPortrait.artContainer}>
                  <View style={galleryStyles.frameStyle}>
                    {artImage ? (
                      <Image
                        source={{uri: artImage}}
                        style={galleryStylesPortrait.artwork}
                      />
                    ) : (
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
            </Pressable>
          </ImageBackground>
        </View>
      </ScrollView>
    </GestureDetector>
  );
}
