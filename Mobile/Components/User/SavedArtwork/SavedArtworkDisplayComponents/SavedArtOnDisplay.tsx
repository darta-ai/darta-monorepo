import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
// import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  // widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {
  DataT,
  // OpenStateEnum,
  // RatingEnum
} from '../../../../../types';
// import {StoreContext} from '../../../../../State/Store';
import {galleryStyles} from '../../../../Screens/Gallery/galleryStyles';

export function SavedArtOnDisplay({
  artImage,
  backgroundImage,
  backgroundImageDimensionsPixels,
  currentZoomScale,
  dimensionsInches,
  isPortrait,
  wallHeight,
  // rateArtwork,
  setCurrentZoomScale,
}: {
  artImage: string | undefined;
  backgroundImage: ImageSourcePropType;
  backgroundImageDimensionsPixels: any;
  currentZoomScale: number;
  dimensionsInches: DataT['dimensionsInches'] | undefined;
  isPortrait: boolean;
  wallHeight: number;
  // rateArtwork: (rating: RatingEnum, openIdentifier: OpenStateEnum) => void;
  setCurrentZoomScale: (arg0: number) => void;
}) {
  // const {state} = useContext(StoreContext);
  // type SetTouch = {
  //   touchX: number;
  //   touchY: number;
  // };

  const [scrollEnabled, setScrollEnabled] = useState(false);

  const scrollViewRef = useRef<ScrollView | null>(null);

  // enum ArtRatingGesture {
  //   swipeUp = 'swipeUp',
  //   swipeDown = 'swipeDown',
  // }

  // const handleArtRatingGesture = useCallback(
  //   (gesture: ArtRatingGesture) => {
  //     const {artworkOnDisplayId, userArtworkRatings} = state;

  //     const currentArtworkRating = userArtworkRatings[artworkOnDisplayId];
  //     switch (gesture) {
  //       case ArtRatingGesture.swipeUp:
  //         if (currentArtworkRating[RatingEnum.like]) {
  //           rateArtwork(RatingEnum.save, OpenStateEnum.swiped);
  //           break;
  //         } else if (currentArtworkRating[RatingEnum.dislike]) {
  //           rateArtwork(RatingEnum.unrated, OpenStateEnum.swiped);
  //           break;
  //         } else if (currentArtworkRating[RatingEnum.save]) {
  //           break;
  //         } else {
  //           rateArtwork(RatingEnum.like, OpenStateEnum.swiped);
  //           break;
  //         }
  //       case ArtRatingGesture.swipeDown:
  //         if (currentArtworkRating[RatingEnum.save]) {
  //           rateArtwork(RatingEnum.like, OpenStateEnum.swiped);
  //           break;
  //         } else if (currentArtworkRating[RatingEnum.like]) {
  //           rateArtwork(RatingEnum.unrated, OpenStateEnum.swiped);
  //           break;
  //         } else if (currentArtworkRating[RatingEnum.dislike]) {
  //           break;
  //         } else {
  //           rateArtwork(RatingEnum.dislike, OpenStateEnum.swiped);
  //           break;
  //         }
  //     }
  //   },
  //   [state, ArtRatingGesture.swipeUp, ArtRatingGesture.swipeDown, rateArtwork],
  // );

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

  // const doubleTap = Gesture.Tap()
  //   .numberOfTaps(2)
  //   .onStart(() => {
  //     const isCurrentZoomOne = currentZoomScale === 1;
  //     if (isCurrentZoomOne) {
  //       setScrollEnabled(true);
  //       setCurrentZoomScale(3);
  //       scrollViewRef.current?.scrollTo({
  //         x: backgroundImageDimensionsPixels.width - 0.25 * artWidthPixels,
  //         y: backgroundImageDimensionsPixels.height - 0.25 * artHeightPixels,
  //         animated: false,
  //       });
  //     } else {
  //       setCurrentZoomScale(1);
  //       setScrollEnabled(false);
  //       scrollViewRef.current?.scrollToEnd({animated: false});
  //     }
  //   });

  useEffect(() => {
    const isCurrentZoomOne = currentZoomScale === 1;
    if (isCurrentZoomOne) {
      return setScrollEnabled(false);
    }
    return setScrollEnabled(true);
  }, [currentZoomScale]);

  const galleryStylesPortrait = StyleSheet.create({
    container: {
      zIndex: 0,
      height: '100%',
      width: '100%',
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
              {/* <GestureDetector gesture={doubleTap}> */}
              <View style={galleryStylesPortrait.artContainer}>
                <View style={galleryStyles.frameStyle}>
                  <Image
                    source={{uri: artImage}}
                    style={galleryStylesPortrait.artwork}
                  />
                </View>
              </View>
              {/* </GestureDetector> */}
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}
