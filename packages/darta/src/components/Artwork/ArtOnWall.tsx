import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Animated,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image'
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types'
import {galleryStyles} from '../../styles/styles';
import {ETypes, StoreContext} from '../../state/Store';
import { createArtworkRelationshipAPI, deleteArtworkRelationshipAPI } from '../../utils/apiCalls';
import { Onboard } from '../Darta/Onboard';

export function ArtOnWall({
  artworkDimensions,
  artOnDisplay,
  artImage,
  backgroundImage,
  backgroundImageDimensionsPixels,
  currentZoomScale,
  isPortrait,
  opacityAnimatedValue,
  wallHeight,
  rateArtwork,
  setCurrentZoomScale,
  toggleArtForward,
  toggleArtBackward,
}: {
  artOnDisplay: Artwork;
  artImage: string | undefined;
  backgroundImage: ImageSourcePropType;
  backgroundImageDimensionsPixels: any;
  currentZoomScale: number;
  artworkDimensions: Artwork['artworkDimensions'] | undefined;
  isPortrait: boolean;
  opacityAnimatedValue: any;
  wallHeight: number;
  rateArtwork: (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => void;
  setCurrentZoomScale: (arg0: number) => void;
  toggleArtForward: () => void;
  toggleArtBackward: () => void;
}) {
  const {state, dispatch} = useContext(StoreContext);

  const [isPanActionEnabled, setIsPanActionEnabled] = useState(true);

  const scrollViewRef = useRef<ScrollView | null>(null);

  enum ArtRatingGesture {
    swipeUp = 'swipeUp',
    swipeDown = 'swipeDown',
  }

  React.useEffect(() => {
    const setSaw = async () => {
      try{
        if (artOnDisplay?._id) {
          createArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.VIEWED})
        }
      } catch(err: any){
      }
    }
    setSaw()
  }, [artOnDisplay])

  const handleArtRatingGesture = useCallback(
    async (gesture: ArtRatingGesture) => {
      const artworkOnDisplayId = artOnDisplay._id;
      const likedArtworks = state.userLikedArtwork;
      const dislikedArtworks = state.userDislikedArtwork;
      const savedArtworks = state.userSavedArtwork;

      const userLiked = likedArtworks?.[artworkOnDisplayId!] || false
      const userSaved = savedArtworks?.[artworkOnDisplayId!] || false
      const userDisliked = dislikedArtworks?.[artworkOnDisplayId!] || false

      switch (gesture) {
        case ArtRatingGesture.swipeUp:
          if (userLiked) {
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.SAVE);
            break;
          } else if (userDisliked) {
            dispatch({
              type: ETypes.removeUserDislikedArtwork,
              artworkId: artOnDisplay._id,
            })
            try{
              await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
            } catch {
              console.log("error removing disliked artwork")
            }
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED);
            break;
          } else if (userSaved) {
            break;
          } else {
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.LIKE);
            break;
          }
        case ArtRatingGesture.swipeDown:
          if (userSaved) {

            dispatch({
              type: ETypes.removeUserSavedArtwork,
              artworkId: artOnDisplay._id,
            })
            try{
              await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
            } catch {
              console.log("error removing disliked artwork")
            }
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.LIKE);
            break;
          } else if (userLiked) {
            dispatch({
              type: ETypes.removeUserLikedArtwork,
              artworkId: artOnDisplay._id,
            })
            try{
              await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
            } catch {
              console.log("error removing disliked artwork")
            }
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED);
            break;
          } else if (userDisliked) {
            break;
          } else {
            dispatch({
              type: ETypes.removeUserDislikedArtwork,
              artworkId: artOnDisplay._id,
            })
            try{
              await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
            } catch {
              console.log("error removing disliked artwork")
            }
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE);
            break;
          }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  if (artworkDimensions && artworkDimensions.heightIn.value && artworkDimensions.widthIn.value) {
    artHeightInches = parseInt(artworkDimensions.heightIn.value);
    artWidthInches = parseInt(artworkDimensions.widthIn.value);

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
        0.5 * backgroundImageDimensionsPixels.height - 0.5 * artHeightPixels,
      left:
        0.5 * backgroundImageDimensionsPixels.width - 0.5 * artWidthPixels,
    };
  }

  const handleDoubleTap = () => {
    if (isPanActionEnabled) {
      setIsPanActionEnabled(false);
      const targetScale = 3;

      // Calculate the translation values
      setCurrentZoomScale(targetScale);

      if (state.isPortrait){
        scrollViewRef.current?.scrollTo({
          x: wp('100%'),
          y: hp('70%'),
          animated: false,
        });
      } else {
        scrollViewRef.current?.scrollTo({
          x: hp('75%'),
          y: wp('100%'),
          animated: false,
        });
      }
    } else {
      setIsPanActionEnabled(true);
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
      height: hp('100%'),
    },
    artContainer: {
      top: artImageLocation?.top,
      left: artImageLocation?.left,
      height: artImageSize?.height,
      width: artImageSize?.width,
    },
    artwork: {
      height: artImageSize?.height,
      width: artImageSize?.width,
      resizeMode: 'contain',
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
        onScrollEndDrag={({nativeEvent: {zoomScale}}) => {
          setCurrentZoomScale(zoomScale);
          if (zoomScale <= 1.1) {
            setIsPanActionEnabled(true);
          } else {
            setIsPanActionEnabled(false);
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
            <Onboard />
            <View >
              <View style={galleryStylesPortrait.screenContainer}>
                <View style={galleryStylesPortrait.artContainer}>
                  <View style={galleryStyles.frameStyle}>
                    {artImage ? (
                        <Animated.View style={{opacity: opacityAnimatedValue}}>
                          <FastImage
                            source={{uri: artImage, priority: FastImage.priority.normal}}
                            style={galleryStylesPortrait.artwork}
                            resizeMode={FastImage.resizeMode.contain}
                          />
                        </Animated.View>
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
