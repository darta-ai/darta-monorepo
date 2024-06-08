import React, {useCallback, useContext, useRef, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Animated,
  View,
  Pressable
} from 'react-native';
// import FastImage from 'react-native-fast-image'
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {Artwork, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types'
import {StoreContext} from '../../state/Store';
import { createArtworkRelationshipAPI, deleteArtworkRelationshipAPI } from '../../utils/apiCalls';
import { Onboard } from '../Darta/Onboard';
import { Surface } from 'react-native-paper';
import * as Colors from '@darta-styles'
import { LinearGradient } from 'expo-linear-gradient';
import { UserETypes, UserStoreContext } from '../../state/UserStore';

const galleryStylesPortrait = StyleSheet.create({
  container: {
    zIndex: 0,
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollViewStyles: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  frameStyle: {
    backgroundColor: 'transparent',
    width: '100%',
    height: '100%',
    position: 'absolute', // This ensures the artContainer is positioned relative to its first positioned (not static) ancestor element
  },
});

interface ArtDimensions {
  artImageSize: { height: number; width: number; } | null;
  artImageLocation: { top: number; left: number; } | null;
  artHeightPixels: number;
  artWidthPixels: number;
}

export function ArtOnWall({
  artworkDimensions,
  artOnDisplay,
  artImage,
  backgroundImageDimensionsPixels,
  currentZoomScale,
  isPortrait,
  opacityAnimatedValue,
  wallHeight = 96,
  rateArtwork,
  setCurrentZoomScale,
  toggleArtForward,
  toggleArtBackward,
  toggleArtTombstone
}: {
  artOnDisplay: Artwork;
  artImage: string | undefined;
  backgroundImageDimensionsPixels: any;
  currentZoomScale: number;
  artworkDimensions: Artwork['artworkDimensions'] | undefined;
  isPortrait: boolean;
  opacityAnimatedValue: any;
  wallHeight?: number;
  rateArtwork: (rating: USER_ARTWORK_EDGE_RELATIONSHIP) => void;
  setCurrentZoomScale: (arg0: number) => void;
  toggleArtForward: () => void;
  toggleArtBackward: () => void;
  toggleArtTombstone: () => void;
}) {
  const {state} = useContext(StoreContext);
  const {userState, userDispatch} = React.useContext(UserStoreContext);

  const [isPanActionEnabled, setIsPanActionEnabled] = useState(true);

  const scrollViewRef = useRef<ScrollView | null>(null);

  enum ArtRatingGesture {
    swipeUp = 'swipeUp',
    swipeDown = 'swipeDown',
  }

  const handleArtRatingGesture = useCallback(
    async (gesture: ArtRatingGesture) => {
      const artworkOnDisplayId = artOnDisplay._id;
      const likedArtworks = userState.userLikedArtwork;
      const dislikedArtworks = userState.userDislikedArtwork;
      const savedArtworks = userState.userSavedArtwork;

      const userLiked = likedArtworks?.[artworkOnDisplayId!] || false
      const userSaved = savedArtworks?.[artworkOnDisplayId!] || false
      const userDisliked = dislikedArtworks?.[artworkOnDisplayId!] || false

      switch (gesture) {
        case ArtRatingGesture.swipeUp:
          if (userLiked) {
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.SAVE);
            break;
          } else if (userDisliked) {
            userDispatch({
              type: UserETypes.removeUserDislikedArtwork,
              artworkId: artOnDisplay._id,
            })
            try{
              await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
            } catch {
              // console.log("error removing disliked artwork")
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
            userDispatch({
              type: UserETypes.removeUserSavedArtwork,
              artworkId: artOnDisplay._id,
            })
            try{
              await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
            } catch {
              // console.log("error removing disliked artwork")
            }
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.LIKE);
            break;
          } else if (userLiked) {
            userDispatch({
              type: UserETypes.removeUserLikedArtwork,
              artworkId: artOnDisplay._id,
            })
            try{
              await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
            } catch {
              // console.log("error removing disliked artwork")
            }
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.UNRATED);
            break;
          } else if (userDisliked) {
            break;
          } else {
            userDispatch({
              type: UserETypes.removeUserDislikedArtwork,
              artworkId: artOnDisplay._id,
            })
            try{
              await deleteArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE})
            } catch {
              // console.log("error removing disliked artwork")
            }
            rateArtwork(USER_ARTWORK_EDGE_RELATIONSHIP.DISLIKE);
            break;
          }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, ArtRatingGesture.swipeUp, ArtRatingGesture.swipeDown, rateArtwork],
  );

  const [artDimensions, setArtDimensions] = React.useState<ArtDimensions>({
    artImageSize: null,
    artImageLocation: null,
    artHeightPixels: 0,
    artWidthPixels: 0,
  });

  const getDimensions = React.useCallback(() => {
    const dimensionsMultiplierPortrait =
      backgroundImageDimensionsPixels.width /
      backgroundImageDimensionsPixels.height;

    const backgroundWidthInches = wallHeight * dimensionsMultiplierPortrait;

    let artHeightInches, artWidthInches, artImageSize, artImageLocation, artHeightPixels, artWidthPixels;

    if (artworkDimensions && artworkDimensions.heightIn.value && artworkDimensions.widthIn.value) {
      artHeightInches = parseInt(artworkDimensions.heightIn.value);
      artWidthInches = parseInt(artworkDimensions.widthIn.value);

      const pixelsPerInchHeight =
        backgroundImageDimensionsPixels.height / wallHeight;
      const pixelsPerInchWidth =
        backgroundImageDimensionsPixels.width / backgroundWidthInches;

      artHeightPixels = artHeightInches * pixelsPerInchHeight;
      artWidthPixels = artWidthInches * pixelsPerInchWidth;

      artImageSize = {
        height: artHeightPixels,
        width: artWidthPixels,
      };

      artImageLocation = {
        top: 0.45 * backgroundImageDimensionsPixels.height - 0.5 * artHeightPixels,
        left: 0.5 * backgroundImageDimensionsPixels.width - 0.5 * artWidthPixels,
      };
    }

    return { artImageSize, artImageLocation, artHeightPixels, artWidthPixels };

  }, [artworkDimensions, backgroundImageDimensionsPixels, wallHeight]);

  React.useEffect(() => {
    
    const { artImageSize, artImageLocation, artHeightPixels, artWidthPixels } = getDimensions();
    setArtDimensions({ artImageSize, artImageLocation, artHeightPixels, artWidthPixels });

    const setSaw = async () => {
      try{
        if (artOnDisplay?._id) {
          createArtworkRelationshipAPI({artworkId: artOnDisplay._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.VIEWED})
        }
      } catch(err: any){
      }
    }
    setSaw()
  }, [artOnDisplay]);

  React.useEffect(() => {
    const { artImageSize, artImageLocation, artHeightPixels, artWidthPixels } = getDimensions();
    setArtDimensions({ artImageSize, artImageLocation, artHeightPixels, artWidthPixels });
  }, [state.isPortrait])


  const handleToggleArtForward = () => {
    toggleArtForward();
  }

  const handleToggleArtBackwards = () => {
    toggleArtBackward();
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
        ? runOnJS(handleToggleArtBackwards)()
        : runOnJS(handleArtRatingGesture)(ArtRatingGesture.swipeUp);
    });

  const panGestureLeft = Gesture.Pan()
    .activeOffsetX(-wp('20%'))
    .onStart(() => {
      if (!isPanActionEnabled) {
        return;
      }

      state.isPortrait
        ? runOnJS(handleToggleArtForward)()
        : runOnJS(handleArtRatingGesture)(ArtRatingGesture.swipeDown);
    });

  const panGestureUp = Gesture.Pan()
    .activeOffsetY(wp('20%'))
    .onStart(() => {
      if (!isPanActionEnabled) {
        return;
      }

      if (!state.isPortrait){
        runOnJS(handleToggleArtBackwards)();
      } else {
        return
      }
    });

  const panGestureDown = Gesture.Pan()
    .activeOffsetY(-wp('20%'))
    .onStart(async () => {
      if (!isPanActionEnabled) {
        return;
      }

      if (!state.isPortrait){
        runOnJS(handleToggleArtForward)();
      } else {
        return
      }
    });

    const [isLoaded, setIsLoading] = useState<boolean>(false);

    const imageOpacity = React.useRef(new Animated.Value(0)).current;
  
    const handleImageLoad = () => {
      setIsLoading(true);
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
    };

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .maxDistance(9)
    .onEnd((_, success) => {
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

  const galleryStylesPortraitDynamic = StyleSheet.create({
    artContainer: {
      top: artDimensions.artImageLocation?.top,
      left: artDimensions.artImageLocation?.left,
      height: artDimensions.artImageSize?.height,
      width: artDimensions.artImageSize?.width,
    },
    artwork: {
      height: artDimensions.artImageSize?.height,
      width: artDimensions.artImageSize?.width,
      // shadowColor: Colors.PRIMARY_300, // Shadow color should generally be black for realistic shadows
      // shadowOffset: { width: 0, height: 4.29 }, // Adjust the height for the depth of the shadow
      // shadowOpacity: 1,
      // shadowRadius: 4.29, // A larger shadow
    },
    activityIndicator: {
      top: hp('35%'),
      justifyContent: 'center',
    },
    screenContainer: {
      width: backgroundImageDimensionsPixels.width,
      height: hp('100%'),
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
          <LinearGradient colors={[Colors.PRIMARY_50, Colors.PRIMARY_100, Colors.PRIMARY_200]}>
            <Onboard />
              <View style={galleryStylesPortraitDynamic.screenContainer}>
                <View style={galleryStylesPortraitDynamic.artContainer}>
                  <View style={galleryStylesPortrait.frameStyle}>
                    {artImage && (
                      <Pressable onPress={toggleArtTombstone}>
                        <Surface style={{backgroundColor:"transparent"}}>
                          <Animated.View style={{opacity: opacityAnimatedValue}}>
                            <Animated.View style={{opacity: imageOpacity}}>
                              {/* <FastImage
                                source={{uri: artImage, priority: FastImage.priority.normal}}
                                style={galleryStylesPortraitDynamic.artwork}
                                resizeMode={FastImage.resizeMode.contain}
                                onLoad={handleImageLoad}
                                
                              /> */}
                            </Animated.View>
                          </Animated.View>
                          </Surface>
                        </Pressable>
                    )} 
                  </View>
                </View>
              </View>
            </LinearGradient>
        </GestureDetector>
      </ScrollView>
    </GestureDetector>
  );
}
