import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {DataT, OpenStateEnum, RatingEnum} from '../../../types';
import {galleryStyles} from '../../Screens/Gallery/galleryStyles';
import {ETypes, StoreContext} from '../../State/Store';

export function ArtOnDisplay({
  artOnDisplay,
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
  artOnDisplay: DataT;
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
  const {state, dispatch} = useContext(StoreContext);

  const [isPanActionEnabled, setisPanActionEnabled] = useState(true);

  const scrollViewRef = useRef<ScrollView | null>(null);

  enum ArtRatingGesture {
    swipeUp = 'swipeUp',
    swipeDown = 'swipeDown',
  }

  const handleArtRatingGesture = useCallback(
    (gesture: ArtRatingGesture) => {
      const {artworkOnDisplayId, userArtworkRatings} = state;

      const currentArtworkRating = userArtworkRatings[artworkOnDisplayId];
      switch (gesture) {
        case ArtRatingGesture.swipeUp:
          if (currentArtworkRating[RatingEnum.like]) {
            dispatch({
              type: ETypes.setSaveArtwork,
              artOnDisplay,
              saveWork: true,
            });
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
            dispatch({
              type: ETypes.setSaveArtwork,
              artOnDisplay,
              saveWork: false,
            });
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
    },
    [state, ArtRatingGesture.swipeUp, ArtRatingGesture.swipeDown, rateArtwork],
  );

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

  const handleDoubleTap = () => {
    if (isPanActionEnabled) {
      setisPanActionEnabled(false);
      const targetScale = 3;

      // Calculate the translation values
      setCurrentZoomScale(targetScale);

      scrollViewRef.current?.scrollTo({
        x: wp('90%'),
        y: hp('75%'),
        animated: false,
      });
    } else {
      setisPanActionEnabled(true);
      setCurrentZoomScale(1);
      scrollViewRef.current?.scrollToEnd({animated: false});
    }
  };

  const panGestureRight = Gesture.Pan()
    .activeOffsetX(wp('20%'))
    .onStart(() => {
      if (!isPanActionEnabled) {
        return;
      }
      state.isPortrait
        ? runOnJS(toggleArtBackward)()
        : runOnJS(handleArtRatingGesture)(ArtRatingGesture.swipeUp);
    });

  const panGestureLeft = Gesture.Pan()
    .activeOffsetX(-wp('20%'))
    .onStart(() => {
      if (!isPanActionEnabled) {
        return;
      }

      state.isPortrait
        ? runOnJS(toggleArtForward)()
        : runOnJS(handleArtRatingGesture)(ArtRatingGesture.swipeDown);
    });

  const panGestureUp = Gesture.Pan()
    .activeOffsetY(wp('20%'))
    .onStart(() => {
      if (!isPanActionEnabled) {
        return;
      }

      state.isPortrait
        ? runOnJS(handleArtRatingGesture)(ArtRatingGesture.swipeDown)
        : runOnJS(toggleArtBackward)();
    });

  const panGestureDown = Gesture.Pan()
    .activeOffsetY(-wp('20%'))
    .onStart(async () => {
      if (!isPanActionEnabled) {
        return;
      }

      state.isPortrait
        ? runOnJS(handleArtRatingGesture)(ArtRatingGesture.swipeUp)
        : runOnJS(toggleArtForward)();
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDistance(9)
    .onEnd((event, success) => {
      'worklet';

      if (success) {
        runOnJS(handleDoubleTap)();
      }
      return success;
    });

  const composed = Gesture.Exclusive(
    panGestureRight,
    panGestureLeft,
    panGestureUp,
    panGestureDown,
  );

  const galleryStylesPortrait = StyleSheet.create({
    container: {
      zIndex: 0,
      height: '99%',
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollViewStyles: {
      flexGrow: 1,
      justifyContent: 'center',
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
  });

  return (
    <GestureDetector gesture={composed}>
      <ScrollView
        ref={scrollViewRef}
        scrollEnabled={!isPanActionEnabled}
        // pinchGestureEnabled={isPanActionEnabled}
        onScrollEndDrag={({nativeEvent: {zoomScale}}) => {
          setCurrentZoomScale(zoomScale);
          if (zoomScale <= 1.1) {
            setisPanActionEnabled(true);
          } else {
            setisPanActionEnabled(false);
          }
        }}
        zoomScale={currentZoomScale}
        scrollEventThrottle={7}
        maximumZoomScale={6}
        minimumZoomScale={1}
        scrollToOverflowEnabled={false}
        contentContainerStyle={galleryStylesPortrait.scrollViewStyles}
        centerContent
        horizontal
        removeClippedSubviews
        snapToAlignment="center">
        <GestureDetector gesture={doubleTapGesture}>
          <ImageBackground source={backgroundImage}>
            <View>
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
                        style={galleryStylesPortrait.activityIndicator}
                      />
                    )}
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </GestureDetector>
      </ScrollView>
    </GestureDetector>
  );
}
