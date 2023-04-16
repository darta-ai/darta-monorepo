import React, {useEffect, useRef, useState} from 'react';
import {Animated, ImageSourcePropType, View} from 'react-native';
import {OrientationLocker, PORTRAIT} from 'react-native-orientation-locker';
import {Button} from 'react-native-paper';
import ProgressBar from 'react-native-progress/Bar';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {getButtonSizes} from '../../functions/galleryFunctions';
import {
  DataT,
  OpenStateEnum,
  OrientationsEnum,
  RatingEnum,
  SnackTextEnum,
  UserArtworkRatings,
} from '../../types';
import {GlobalText} from '../GlobalElements';
import {
  duration,
  galleryDimensionsLandscape,
  galleryDimensionsPortrait,
  icons,
} from '../globalVariables';
import {
  ArtOnDisplay,
  // ArtRatingButtons,
  GalleryViewOptions,
  // NavigateArt,
} from '../Screens/Gallery/GalleryComponents/index';
import {galleryComponentStyles} from '../Screens/Gallery/galleryStyles';
import {
  TombstoneLandscape,
  TombstonePortrait,
} from '../Screens/Gallery/Tombstone/index';
import {globalTextStyles} from '../styles';

// const kitchen2 = require('../../backgrounds/kitchen2.png');
// const HannahWall = require('../../backgrounds/HannahWall.png');
// import WallHorizontal = require('../backgrounds/WallHorizontal.png');
const galleryWallRaw = require('../../backgrounds/galleryWallRaw.png');

// (galleryId: string, currentIndex?: number)

export function Gallery({
  fullDGallery,
  resumedDisplayIndex,
  galleryId,
  numberOfRatedWorks,
  numberOfArtworks,
  userArtworkRatings,
  isPortrait,
  setIsPortrait,
  showGallery,
  setUserArtworkRatings,
}: {
  fullDGallery: DataT[];
  resumedDisplayIndex: number;
  galleryId: string;
  numberOfRatedWorks: number;
  numberOfArtworks: number;
  userArtworkRatings: UserArtworkRatings;
  isPortrait: boolean;

  setIsPortrait: (arg0: boolean) => void;

  showGallery: (galleryId: string, currentIndex?: number) => void;
  setUserArtworkRatings: (
    galleryId: string,

    artOnDisplayId: string,

    updatedRatings: any,
  ) => void;
}) {
  const [fullGallery] = useState<DataT[]>(fullDGallery);
  const [artDisplayIndex, setArtDisplayIndex] =
    useState<number>(resumedDisplayIndex);
  const [artOnDisplay, setArtOnDisplay] = useState<DataT | undefined>();
  const [backgroundImage] = useState<ImageSourcePropType>(galleryWallRaw);
  const [currentZoomScale, setCurrentZoomScale] = useState<number>(1);

  const localButtonSizes = getButtonSizes(hp('100%'));

  useEffect(() => {
    if (fullGallery) {
      setArtOnDisplay(fullGallery.at(artDisplayIndex));
    }
  }, [artDisplayIndex, fullGallery]);

  const [openNav, setOpenNav] = useState<boolean>(false);
  const [openRatings, setOpenRatings] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<boolean>(false);

  const fadeAnimNav = useRef(new Animated.Value(0)).current;
  const fadeAnimRating = useRef(new Animated.Value(0)).current;
  const fadeAnimOptions = useRef(new Animated.Value(0)).current;

  const openOrCloseContainer = (openIdentifier: OpenStateEnum) => {
    switch (openIdentifier) {
      case OpenStateEnum.openNav:
        setOpenNav(!openNav);
        break;
      case OpenStateEnum.openRatings:
        setOpenRatings(!openRatings);
        break;
      case OpenStateEnum.openOptions:
        setOpenOptions(!openOptions);
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

  const fadeInButtons = (
    openIdentifier: OpenStateEnum,
    fadeAnim: Animated.Value,
  ) => {
    openOrCloseContainer(openIdentifier);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutButtons = async (
    openIdentifier: OpenStateEnum,
    fadeAnim: Animated.Value,
  ) => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(() => {
      openOrCloseContainer(openIdentifier);
    });
  };

  const toggleButtonView = (openIdentifier: OpenStateEnum) => {
    const details = whichFadeAnim(openIdentifier);

    if (details) {
      const {fadeAnim, currentState} = details;
      currentState
        ? fadeOutButtons(openIdentifier, fadeAnim)
        : fadeInButtons(openIdentifier, fadeAnim);
    }
  };

  const flipOrientation = () => {
    setIsPortrait(!isPortrait);
    fadeOutButtons(OpenStateEnum.openOptions, fadeAnimOptions);
  };

  const screenRotation = (orientation: string) => {
    if (
      (isPortrait &&
        (orientation === OrientationsEnum.landscapeLeft ||
          orientation === OrientationsEnum.landscapeRight)) ||
      (!isPortrait &&
        (orientation === OrientationsEnum.portrait ||
          orientation === OrientationsEnum.portraitUp))
    ) {
      setCurrentZoomScale(1);
      setIsPortrait(!isPortrait);
    }
  };

  const backgroundContainerDimensionsPixels = isPortrait
    ? {...galleryDimensionsPortrait}
    : {...galleryDimensionsLandscape};

  const wallHeight = 96;

  const toggleArtForward = () => {
    const currentDisplayIndex = artDisplayIndex;
    if (currentDisplayIndex + 1 >= numberOfArtworks) {
      setArtDisplayIndex(0);
    } else {
      setArtDisplayIndex(currentDisplayIndex + 1);
    }
  };
  const toggleArtBackward = () => {
    const currentDisplayIndex = artDisplayIndex;
    if (currentDisplayIndex === 0) {
      setArtDisplayIndex(numberOfArtworks - 1);
    } else {
      setArtDisplayIndex(currentDisplayIndex - 1);
    }
  };

  const [showArtTombstone, setShowArtTombstone] = useState<boolean>(false);

  const toggleArtTombstone = () => {
    setShowArtTombstone(!showArtTombstone);
  };

  // Rating State
  const [visibleSnack, setVisibleSnack] = useState(false);
  const [snackBarText, setSnackBarText] = useState('hey hey 👋');

  const rateArtwork = (
    rating: RatingEnum,
    openIdentifier: OpenStateEnum,
    artOnDisplayId: string,
  ) => {
    if (!artOnDisplayId || !userArtworkRatings) {
      return;
    }
    const artworkRating = {
      [artOnDisplayId]: {
        [rating]: true,
      },
    };
    setUserArtworkRatings(galleryId, artOnDisplayId, {...artworkRating});

    toggleButtonView(openIdentifier);
    setVisibleSnack(true);
    setSnackBarText(SnackTextEnum[rating]);
  };

  const screenContainer = isPortrait
    ? {height: hp('80%'), width: wp('95%')}
    : {
        height: hp('80%'),
        width: wp('75%'),
        left: wp('10%'),
      };

  const openInteractionContainer = isPortrait
    ? {height: hp('30%'), top: hp('49%')}
    : {};

  const interactionContainer = isPortrait
    ? galleryComponentStyles.interactionContainerPortrait
    : galleryComponentStyles.interactionContainerLandscape;

  const viewContainer = isPortrait
    ? galleryComponentStyles.viewContainerPortrait
    : galleryComponentStyles.viewContainerLandscape;

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        ...screenContainer,
      }}>
      <OrientationLocker
        orientation={PORTRAIT}
        onDeviceChange={(orientation: string) => {
          screenRotation(orientation);
        }}
      />
      <View
        style={{
          zIndex: 0,
          position: 'absolute',
          width: wp('95%'),
          height: hp('12%'),
          top: hp('67%'),
          marginLeft: 1,
        }}
      />
      {!showArtTombstone ? (
        <View
          style={[
            backgroundContainerDimensionsPixels,
            {
              transform: isPortrait ? [{rotate: '0deg'}] : [{rotate: '90deg'}],
              backgroundColor: 'black',
            },
          ]}>
          <View>
            <ProgressBar
              progress={numberOfRatedWorks / numberOfArtworks}
              borderRadius={0}
              width={
                isPortrait ? screenContainer.width : screenContainer.height
              }
              color="rgb(218, 223, 225)"
              useNativeDriver
              animated
            />
          </View>
          <ArtOnDisplay
            artImage={artOnDisplay?.image}
            backgroundImage={backgroundImage}
            backgroundImageDimensionsPixels={
              backgroundContainerDimensionsPixels
            }
            currentZoomScale={currentZoomScale}
            dimensionsInches={artOnDisplay?.dimensionsInches}
            isPortrait={isPortrait}
            visibleSnack={visibleSnack}
            wallHeight={wallHeight}
            setCurrentZoomScale={setCurrentZoomScale}
            setVisibleSnack={setVisibleSnack}
            toggleArtForward={toggleArtForward}
            toggleArtBackward={toggleArtBackward}
          />

          <View
            style={[
              interactionContainer,
              (openNav || openRatings) && {...openInteractionContainer},
            ]}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <NavigateArt
                fadeAnimNav={fadeAnimNav}
                isPortrait={isPortrait}
                localButtonSizes={localButtonSizes}
                openNav={openNav}
                openIdentifier={OpenStateEnum.openNav}
                toggleArtBackward={toggleArtBackward}
                toggleArtTombstone={toggleArtTombstone}
                toggleArtForward={toggleArtForward}
                toggleButtonView={toggleButtonView}
              />
              <ArtRatingButtons
                artOnDisplayId={artOnDisplay?.id}
                fadeAnimRating={fadeAnimRating}
                localButtonSizes={localButtonSizes}
                isPortrait={isPortrait}
                openIdentifier={OpenStateEnum.openRatings}
                openRatings={openRatings}
                snackBarText={snackBarText}
                userArtworkRatings={userArtworkRatings}
                visibleSnack={visibleSnack}
                rateArtwork={rateArtwork}
                setVisibleSnack={setVisibleSnack}
                toggleButtonView={toggleButtonView}
              />
            </View>
          </View>
          <View style={viewContainer}>
            <View
              style={{flex: 1, flexDirection: 'row', alignItems: 'flex-start'}}>
              <GalleryViewOptions
                isPortrait={isPortrait}
                fadeAnimOptions={fadeAnimOptions}
                openIdentifier={OpenStateEnum.openOptions}
                openOptions={openOptions}
                toggleButtonView={toggleButtonView}
                flipOrientation={flipOrientation}
                localButtonSizes={localButtonSizes}
              />
            </View>
          </View>
          <Button
            icon={icons.back}
            style={{
              position: 'absolute',
              top: isPortrait ? '1%' : '3%',
              opacity: 0.7,
              backgroundColor: '#FFF',
            }}
            accessibilityLabel="Navigate To Gallery Selector"
            testID="galleryBack"
            onPress={() => showGallery(galleryId, artDisplayIndex)}>
            <GlobalText
              style={[
                globalTextStyles.centeredText,
                {justifyContent: 'flex-start'},
              ]}>
              back
            </GlobalText>
          </Button>
        </View>
      ) : (
        <View>
          {isPortrait ? (
            <TombstonePortrait
              artOnDisplay={artOnDisplay}
              artOnDisplayId={artOnDisplay?.id}
              openIdentifier={OpenStateEnum.tombstone}
              snackBarText={snackBarText}
              userArtworkRatings={userArtworkRatings}
              visibleSnack={visibleSnack}
              rateArtwork={rateArtwork}
              setVisibleSnack={setVisibleSnack}
              toggleArtTombstone={toggleArtTombstone}
            />
          ) : (
            <TombstoneLandscape
              artOnDisplay={artOnDisplay}
              artOnDisplayId={artOnDisplay?.id}
              openIdentifier={OpenStateEnum.tombstone}
              snackBarText={snackBarText}
              userArtworkRatings={userArtworkRatings}
              visibleSnack={visibleSnack}
              rateArtwork={rateArtwork}
              setVisibleSnack={setVisibleSnack}
              toggleArtTombstone={toggleArtTombstone}
            />
          )}
        </View>
      )}
    </View>
  );
}
