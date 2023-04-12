import React, {useContext, useEffect, useRef, useState} from 'react';
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
import {OpenStateEnum, RatingEnum} from '../../../types';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {StoreContext} from '../galleryStore';

import {DataT} from '../../../types';
import {galleryStyles} from '../galleryStyles';

export function ArtOnDisplay({
  artImage,
  backgroundImage,
  backgroundImageDimensionsPixels,
  currentZoomScale,
  dimensionsInches,
  isPortrait,
  wallHeight,
  rateArtwork,
  setCurrentZoomScale,
  toggleArtForward,
  toggleArtBackward,
}: {
  artImage: string | undefined;
  backgroundImage: ImageSourcePropType;
  backgroundImageDimensionsPixels: any;
  currentZoomScale: number;
  dimensionsInches: DataT['dimensionsInches'] | undefined;
  isPortrait: boolean;
  wallHeight: number;
  rateArtwork: (rating: RatingEnum, openIdentifier: OpenStateEnum) => void;
  setCurrentZoomScale: (arg0: number) => void;
  toggleArtForward: () => void;
  toggleArtBackward: () => void;
}) {
  const {state} = useContext(StoreContext);
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

  enum ArtRatingGesture {
    swipeUp = 'swipeUp',
    swipeDown = 'swipeDown',
  }

  const handleArtRatingGesture = (gesture: ArtRatingGesture) => {
    const {artworkOnDisplayId, userArtworkRatings} = state;

    const currentArtworkRating = userArtworkRatings[artworkOnDisplayId];
    switch (gesture) {
      case ArtRatingGesture.swipeUp:
        if (currentArtworkRating[RatingEnum.like]) {
          rateArtwork(RatingEnum.save, OpenStateEnum.swiped);
          break;
        } else if (currentArtworkRating[RatingEnum.dislike]) {
          rateArtwork(RatingEnum.unrated, OpenStateEnum.swiped);
          break;
        } else if (currentArtworkRating[RatingEnum.save]) {
          break;
        } else {
          rateArtwork(RatingEnum.like, OpenStateEnum.swiped);
          break;
        }
      case ArtRatingGesture.swipeDown:
        if (currentArtworkRating[RatingEnum.save]) {
          rateArtwork(RatingEnum.like, OpenStateEnum.swiped);
          break;
        } else if (currentArtworkRating[RatingEnum.like]) {
          rateArtwork(RatingEnum.unrated, OpenStateEnum.swiped);
          break;
        } else if (currentArtworkRating[RatingEnum.dislike]) {
          break;
        } else {
          rateArtwork(RatingEnum.dislike, OpenStateEnum.swiped);
          break;
        }
    }
  };

  const swipeArtwork = (pageX: number, pageY: number): void => {
    if (currentZoomScale !== 1) {
      return;
    }
    const {touchX, touchY} = touchCoordinates;
    if (isPortrait) {
      // Y axis is to prevent the pinch to zoom resulting in a touch
      if (pageX - touchX > wp('25%') && pageY - touchY < hp('25%')) {
        toggleArtBackward();
      } else if (touchX - pageX > wp('25%') && pageY - touchY < hp('25%')) {
        toggleArtForward();
      } else if (pageX - touchX < wp('10%') && touchY - pageY > hp('10%')) {
        handleArtRatingGesture(ArtRatingGesture.swipeUp);
      } else if (pageX - touchX < wp('10%') && pageY - touchY > hp('10%')) {
        handleArtRatingGesture(ArtRatingGesture.swipeDown);
      }
    } else {
      if (pageY - touchY > hp('10%') && pageX - touchX < wp('25%')) {
        toggleArtBackward();
      }
      if (touchY - pageY > hp('10%') && pageX - touchX < wp('25%')) {
        toggleArtForward();
      }
      if (pageY - touchY < hp('10%') && pageX - touchX > wp('10%')) {
        handleArtRatingGesture(ArtRatingGesture.swipeUp);
      }
      if (touchY - pageY < hp('10%') && touchX - pageX > wp('25%')) {
        handleArtRatingGesture(ArtRatingGesture.swipeDown);
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
          <ImageBackground source={backgroundImage}>
            <Pressable
              onTouchStart={({nativeEvent: {pageX, pageY}}) => {
                setTouchCoordinates({touchX: pageX, touchY: pageY});
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
