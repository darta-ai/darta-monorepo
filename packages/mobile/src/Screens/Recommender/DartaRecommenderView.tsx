// (galleryId: string, currentIndex?: number)
import {StackNavigationProp} from '@react-navigation/stack';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {Animated, ImageSourcePropType, StyleSheet, View} from 'react-native';
import {OrientationLocker, PORTRAIT} from 'react-native-orientation-locker';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {getButtonSizes} from '../../../functions/galleryFunctions';
import {
  DataT,
  OpenStateEnum,
  OrientationsEnum,
  RatingEnum,
} from '../../../types';
import {
  ArtOnDisplay,
  CombinedInteractionButtons,
  GalleryViewOptions,
} from '../../Components/Darta/index';
import {
  DEFAULT_Gallery_Image,
  duration,
  galleryDimensionsLandscape,
  galleryDimensionsPortrait,
} from '../../globalVariables';
import {
  GalleryNavigatorEnum,
  GalleryRootStackParamList,
} from '../../Navigators/Routes/galleryRoutes.d';
import {ETypes, StoreContext} from '../../State/Store';
import {galleryComponentStyles} from './galleryStyles';

const galleryWallRaw = DEFAULT_Gallery_Image;

type ProfileScreenNavigationProp = StackNavigationProp<
  GalleryRootStackParamList,
  GalleryNavigatorEnum.gallery
>;

export function DartaRecommenderView({
  navigation,
}: {
  navigation: ProfileScreenNavigationProp;
}) {
  const {state, dispatch} = useContext(StoreContext);

  const {galleryOnDisplayId} = state;

  const {
    numberOfArtworks,
    id: galleryId,
    fullDGallery,
  } = state.globalGallery[galleryOnDisplayId];

  const {userArtworkRatings} = state;

  const arrayGallery: DataT[] = Object.values(fullDGallery);

  const [fullGallery] = useState<DataT[]>(arrayGallery);

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
  const toggleArtBackward = useCallback(() => {
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
  }, [dispatch, galleryId, state.globalGallery]);

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

  const SSDartaGalleryView = StyleSheet.create({
    container: {
      margin: state.isPortrait ? hp('0%') : hp('2%'),
      justifyContent: 'center',
      alignSelf: 'center',
      alignItems: 'center',
      marginTop: state.isPortrait ? hp('1%') : hp('17%'),
    },
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
      <View style={SSDartaGalleryView.container}>
        <OrientationLocker
          orientation={PORTRAIT}
          onDeviceChange={(orientation: string) => {
            screenRotation(orientation);
          }}
        />
        <View
          style={[
            backgroundContainerDimensionsPixels,
            SSDartaGalleryView.artOnDisplayContainer,
          ]}>
          <ArtOnDisplay
            artImage={artOnDisplay?.image}
            backgroundImage={backgroundImage}
            backgroundImageDimensionsPixels={
              backgroundContainerDimensionsPixels
            }
            artOnDisplay={artOnDisplay!}
            currentZoomScale={currentZoomScale}
            dimensionsInches={artOnDisplay?.dimensionsInches}
            isPortrait={state.isPortrait}
            wallHeight={wallHeight}
            rateArtwork={rateArtwork}
            setCurrentZoomScale={setCurrentZoomScale}
            toggleArtForward={toggleArtForward}
            toggleArtBackward={toggleArtBackward}
          />

          <View style={interactionContainer}>
            <View style={SSDartaGalleryView.interactionButtonsContainer}>
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

            <View style={SSDartaGalleryView.progressBarContainer}>
              {/* <ProgressBar
                progress={
                  state.globalGallery[galleryId].galleryIndex /
                  (numberOfArtworks - 1)
                }
                borderRadius={10}
                width={state.isPortrait ? wp('90%') : hp('65%')}
                color="rgb(218, 223, 225)"
                useNativeDriver
                animated
              /> */}
            </View>
          </View>
          <View style={viewContainer}>
            <View style={SSDartaGalleryView.galleryViewContainer}>
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
