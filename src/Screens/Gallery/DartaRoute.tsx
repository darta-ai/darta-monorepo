// (galleryId: string, currentIndex?: number)
import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useEffect, useRef, useState} from 'react';
import {Animated, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {OrientationLocker, PORTRAIT} from 'react-native-orientation-locker';
// import { Button } from 'react-native-paper';
import ProgressBar from 'react-native-progress/Bar';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {getButtonSizes} from '../../../functions/galleryFunctions';
import {
  DataT,
  OpenStateEnum,
  OrientationsEnum,
  RatingEnum,
} from '../../../types';
import {
  DEFAULT_Gallery_Image,
  duration,
  galleryDimensionsLandscape,
  galleryDimensionsPortrait,
} from '../../globalVariables';
import {ETypes, StoreContext} from '../../State/Store';
import {
  ArtOnDisplay,
  CombinedInteractionButtons,
  GalleryViewOptions,
} from './GalleryComponents/index';
import {
  GalleryNavigatorEnum,
  GalleryRootStackParamList,
} from './galleryRoutes.d';
import {galleryComponentStyles} from './galleryStyles';

const galleryWallRaw = DEFAULT_Gallery_Image;

type ProfileScreenNavigationProp = StackNavigationProp<
  GalleryRootStackParamList,
  GalleryNavigatorEnum.gallery
>;

export function DartaRoute({
  navigation,
}: {
  navigation: ProfileScreenNavigationProp;
}) {
  console.log('DartaRoute re-rendered');
  const {state, dispatch} = useContext(StoreContext);

  const {galleryOnDisplayId} = state;

  const {
    numberOfArtworks,
    id: galleryId,
    fullDGallery,
  } = state.globalGallery[galleryOnDisplayId];

  const {userArtworkRatings} = state;

  const [fullGallery] = useState<DataT[]>(fullDGallery);

  const [artOnDisplay, setArtOnDisplay] = useState<DataT | undefined>(
    fullGallery.at(state.globalGallery[galleryId].galleryIndex),
  );
  const [backgroundImage] = useState<ImageSourcePropType>({
    uri: galleryWallRaw,
  });
  const [currentZoomScale, setCurrentZoomScale] = useState<number>(1);

  const localButtonSizes = getButtonSizes(hp('100%'));

  const [openNav, setOpenNav] = useState<boolean>(false);
  const [openRatings, setOpenRatings] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<boolean>(false);

  const fadeAnimNav = useRef(new Animated.Value(0)).current;
  const fadeAnimRating = useRef(new Animated.Value(0)).current;
  const fadeAnimOptions = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setArtOnDisplay(
      fullGallery.at(state.globalGallery[galleryId].galleryIndex),
    );
  }, [fullGallery, galleryId, state]);

  const openOrCloseContainer = (
    openIdentifier: OpenStateEnum,
    instructions?: boolean,
  ) => {
    switch (openIdentifier) {
      case OpenStateEnum.openNav:
        setOpenNav(instructions || !openNav);
        break;
      case OpenStateEnum.openRatings:
        setOpenRatings(instructions || !openRatings);
        break;
      case OpenStateEnum.openOptions:
        setOpenOptions(instructions || !openOptions);
        break;
      default:
        break;
    }
  };

  const whichFadeAnim = (
    openIdentifier: OpenStateEnum,
  ): {fadeAnim: Animated.Value; currentState: boolean} | null => {
    switch (openIdentifier) {
      case OpenStateEnum.openNav:
        return {fadeAnim: fadeAnimNav, currentState: openNav};
      case OpenStateEnum.openRatings:
        return {fadeAnim: fadeAnimRating, currentState: openRatings};
      case OpenStateEnum.openOptions:
        return {fadeAnim: fadeAnimOptions, currentState: openOptions};
      default:
        return null;
    }
  };

  const fadeButtons = (
    openIdentifier: OpenStateEnum,
    fadeAnim: Animated.Value,
    currentState: boolean,
    instructions?: boolean,
  ) => {
    openOrCloseContainer(openIdentifier, instructions);
    let toValue;
    if (instructions) {
      toValue = instructions ? 1 : 0;
    } else {
      toValue = currentState ? 0 : 1;
    }

    Animated.timing(fadeAnim, {
      toValue,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const toggleButtonView = (
    openIdentifier: OpenStateEnum,
    instructions?: boolean,
  ) => {
    const details = whichFadeAnim(openIdentifier);

    if (details) {
      const {fadeAnim, currentState} = details;
      return fadeButtons(openIdentifier, fadeAnim, currentState, instructions);
    }
  };

  const flipOrientation = () => {
    dispatch({
      type: ETypes.setPortrait,
    });
    toggleButtonView(OpenStateEnum.openOptions, false);
  };

  const screenRotation = (orientation: string) => {
    if (
      (state.isPortrait &&
        (orientation === OrientationsEnum.landscapeLeft ||
          orientation === OrientationsEnum.landscapeRight)) ||
      (!state.isPortrait &&
        (orientation === OrientationsEnum.portrait ||
          orientation === OrientationsEnum.portraitUp))
    ) {
      setCurrentZoomScale(1);
      dispatch({
        type: ETypes.setPortrait,
      });
    }
  };

  const backgroundContainerDimensionsPixels = state.isPortrait
    ? {...galleryDimensionsPortrait}
    : {...galleryDimensionsLandscape};

  const wallHeight = 96;

  const toggleArtForward = () => {
    console.log('triggered forward');
    const currentIndex = state.globalGallery[galleryId].galleryIndex;
    if (currentIndex + 1 >= numberOfArtworks) {
      dispatch({
        type: ETypes.indexArt,
        galleryId,
        currentIndex: 0,
      });
    } else {
      dispatch({
        type: ETypes.indexArt,
        galleryId,
        currentIndex: currentIndex + 1,
      });
    }
  };
  const toggleArtBackward = () => {
    console.log('triggered backwards');
    const currentIndex = state.globalGallery[galleryId].galleryIndex;
    if (currentIndex === 0) {
      dispatch({
        type: ETypes.indexArt,
        galleryId,
        currentIndex: state.globalGallery[galleryId].artworkIds.length - 1,
      });
    } else {
      dispatch({
        type: ETypes.indexArt,
        galleryId,
        currentIndex: currentIndex - 1,
      });
    }
  };

  const toggleArtTombstone = () => {
    dispatch({
      type: ETypes.setArtwork,
      artworkOnDisplayId: artOnDisplay?.id,
    });
    dispatch({
      type: ETypes.setTombstone,
      tombstoneTitle: artOnDisplay?.title,
    });
    navigation.navigate(GalleryNavigatorEnum.tombstone, {
      artOnDisplay,
    });
  };

  const rateArtwork = (rating: RatingEnum) => {
    if (!rating && !userArtworkRatings) {
      return;
    }
    dispatch({
      type: ETypes.rateArtwork,
      rating,
    });
  };

  const interactionContainer = state.isPortrait
    ? galleryComponentStyles.interactionContainerPortrait
    : galleryComponentStyles.interactionContainerLandscape;

  const viewContainer = state.isPortrait
    ? galleryComponentStyles.viewContainerPortrait
    : galleryComponentStyles.viewContainerLandscape;

  const SSDartaRoute = StyleSheet.create({
    container: {
      // borderWidth: 2,
      margin: state.isPortrait ? hp('0%') : hp('2%'),
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      marginTop: state.isPortrait ? hp('1%') : hp('17%'),
    },
    // artOnDisplayContainer: {
    // zIndex: 0,
    // position: 'absolute',
    // width: wp('95%'),
    // height: hp('12%'),
    // // top: hp('67%'),
    // marginLeft: 1,
    // },
    artOnDisplayContainer: {
      transform: state.isPortrait ? [{rotate: '0deg'}] : [{rotate: '90deg'}],
      backgroundColor: 'black',
    },
    interactionButtonsContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    galleryViewContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    progressBarContainer: {
      alignSelf: 'center',
    },
  });

  return (
    <SafeAreaProvider>
      <View style={SSDartaRoute.container}>
        <OrientationLocker
          orientation={PORTRAIT}
          onDeviceChange={(orientation: string) => {
            screenRotation(orientation);
          }}
        />
        {/* <View style={SSDartaRoute.container} /> */}
        <View
          style={[
            backgroundContainerDimensionsPixels,
            SSDartaRoute.artOnDisplayContainer,
          ]}>
          <ArtOnDisplay
            artImage={artOnDisplay?.image}
            backgroundImage={backgroundImage}
            backgroundImageDimensionsPixels={
              backgroundContainerDimensionsPixels
            }
            currentZoomScale={currentZoomScale}
            dimensionsInches={artOnDisplay?.dimensionsInches}
            isPortrait={state.isPortrait}
            wallHeight={wallHeight}
            rateArtwork={rateArtwork}
            setCurrentZoomScale={setCurrentZoomScale}
            toggleArtForward={toggleArtForward}
            toggleArtBackward={toggleArtBackward}
          />

          <View style={[interactionContainer]}>
            <View style={SSDartaRoute.interactionButtonsContainer}>
              <CombinedInteractionButtons
                localButtonSizes={localButtonSizes}
                fadeAnimRating={fadeAnimRating}
                isPortrait={state.isPortrait}
                openRatings={openRatings}
                rateArtwork={rateArtwork}
                toggleArtTombstone={toggleArtTombstone}
                toggleButtonView={toggleButtonView}
              />
            </View>
            <View style={SSDartaRoute.progressBarContainer}>
              <ProgressBar
                progress={
                  state.globalGallery[galleryId].galleryIndex /
                  (numberOfArtworks - 1)
                }
                borderRadius={10}
                width={state.isPortrait ? wp('90%') : hp('65%')}
                color="rgb(218, 223, 225)"
                useNativeDriver
                animated
              />
            </View>
          </View>
          <View style={viewContainer}>
            <View style={SSDartaRoute.galleryViewContainer}>
              <GalleryViewOptions
                isPortrait={state.isPortrait}
                fadeAnimOptions={fadeAnimOptions}
                openIdentifier={OpenStateEnum.openOptions}
                openOptions={openOptions}
                toggleButtonView={toggleButtonView}
                flipOrientation={flipOrientation}
                localButtonSizes={localButtonSizes}
              />
            </View>
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
