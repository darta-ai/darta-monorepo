import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  View,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import { OrientationLocker, PORTRAIT } from 'react-native-orientation-locker';
import {
  ArtOnDisplay,
  NavigateArt,
  ArtRatingButtons,
  GalleryViewOptions,
} from './GalleryComponents/index';
import { galleryComponentStyles } from './galleryStyles';
import {
  galleryDimensionsPortrait,
  duration,
  galleryDimensionsLandscape,
} from '../globalVariables';
import {
  DataT, OpenStateEnum, UserArtworkRatings, OrientationsEnum,
} from '../../types';

import { TombstonePortrait, TombstoneLandscape } from '../Tombstone/index';
import { getImages, getButtonSizes } from '../../functions/galleryFunctions';

// import kitchen2 from '../backgrounds/kitchen2.png';
// import HannahWall = require('../backgrounds/HannahWall.png');
// import WallHorizontal = require('../backgrounds/WallHorizontal.png');
const galleryWallRaw = require('../../backgrounds/galleryWallRaw.png');

export function Gallery({
  artworkIds,
} : {
  artworkIds : string[],
}) {
  const [fullGallery, setFullGallery] = useState<DataT[]>();
  const [artDisplayIndex, setArtDisplayIndex] = useState<number>(0);
  const [artOnDisplay, setArtOnDisplay] = useState<DataT | undefined>();
  const [backgroundImage] = useState<ImageSourcePropType>(galleryWallRaw);
  const [userArtworkRatings, setUserArtworkRatings] = useState<UserArtworkRatings>();
  const [isPortrait, setIsPortrait] = useState(true);
  const localButtonSizes = getButtonSizes(hp('100%'));

  useEffect(() => {
    const loadGallery = async () => {
      const fullImages = await getImages(artworkIds);
      setFullGallery(fullImages);

      const userRatingsEmpty = artworkIds.reduce((obj, id) => ({
        ...obj,
        [id]: {},
      }), {});
      setUserArtworkRatings(userRatingsEmpty);
    };
    loadGallery();
  }, []);

  useEffect(() => {
    if (fullGallery) {
      setArtOnDisplay(fullGallery.at(artDisplayIndex));
    }
  }, [artDisplayIndex]);

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

  const whichFadeAnim = (openIdentifier: OpenStateEnum)
  : {fadeAnim: Animated.Value, currentState: boolean} | null => {
    switch (openIdentifier) {
      case OpenStateEnum.openNav:
        return { fadeAnim: fadeAnimNav, currentState: openNav };
      case OpenStateEnum.openRatings:
        return { fadeAnim: fadeAnimRating, currentState: openRatings };
      case OpenStateEnum.openOptions:
        return { fadeAnim: fadeAnimOptions, currentState: openOptions };
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
      const { fadeAnim, currentState } = details;
      // eslint-disable-next-line no-unused-expressions
      currentState ? fadeOutButtons(openIdentifier, fadeAnim)
        : fadeInButtons(openIdentifier, fadeAnim);
    }
  };

  const flipOrientation = () => {
    setIsPortrait(!isPortrait);
    fadeOutButtons(OpenStateEnum.openOptions, fadeAnimOptions);
  };

  const screenRotation = (orientation:string) => {
    if (
      (isPortrait && (
        orientation === OrientationsEnum.landscapeLeft
        || orientation === OrientationsEnum.landscapeRight
      ))
      || (!isPortrait && (
        orientation === OrientationsEnum.portrait
        || orientation === OrientationsEnum.portraitUp
      ))
    ) {
      setIsPortrait(!isPortrait);
    }
  };

  const backgroundContainerDimensionsPixels = isPortrait
    ? { ...galleryDimensionsPortrait } : { ...galleryDimensionsLandscape };

  const wallHeight = 96;

  const userArtworkRated = (updatedRatings: any) => {
    setUserArtworkRatings({ ...userArtworkRatings, ...updatedRatings });
  };

  const toggleArtForward = () => {
    const numberOfArtworks = fullGallery?.length ?? 0;
    const currentDisplayIndex = artDisplayIndex;
    if (currentDisplayIndex + 1 >= numberOfArtworks) {
      setArtDisplayIndex(0);
    } else {
      setArtDisplayIndex(currentDisplayIndex + 1);
    }
  };
  const toggleArtBackward = () => {
    const numberOfArtworks = fullGallery?.length ?? 0;
    const currentDisplayIndex = artDisplayIndex;
    if (currentDisplayIndex === 0) {
      setArtDisplayIndex(numberOfArtworks - 1);
    } else {
      setArtDisplayIndex(currentDisplayIndex - 1);
    }
  };

  const [showArtDetails, setShowDetails] = useState<boolean>(false);

  const toggleArtDetails = () => {
    setShowDetails(!showArtDetails);
  };

  const screenContainer = isPortrait
    ? { height: hp('80%'), width: wp('95%') }
    : {
      height: hp('80%'),
      width: wp('75%'),
      left: wp('10%'),
    };

  const openInteractionContainer = isPortrait
    ? { height: hp('30%'), top: hp('49%') }
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
      }}
    >
      <OrientationLocker
        orientation={PORTRAIT}
        onDeviceChange={(orientation:string) => {
          screenRotation(orientation);
        }}
      />
      {!showArtDetails
        ? (
          <View
            style={[backgroundContainerDimensionsPixels, {
              transform: isPortrait ? [{ rotate: '0deg' }]
                : [{ rotate: '90deg' }],
              backgroundColor: 'black',
            }]}
          >
            <ArtOnDisplay
              artImage={artOnDisplay?.image}
              backgroundImage={backgroundImage}
              backgroundImageDimensionsPixels={backgroundContainerDimensionsPixels}
              dimensionsInches={artOnDisplay?.dimensionsInches}
              isPortrait={isPortrait}
              screenContainer={screenContainer}
              wallHeight={wallHeight}
              toggleArtForward={toggleArtForward}
              toggleArtBackward={toggleArtBackward}
            />
            <View style={[interactionContainer,
              (openNav || openRatings)
                && { ...openInteractionContainer },
            ]}
            >
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}
              >
                <NavigateArt
                  fadeAnimNav={fadeAnimNav}
                  isPortrait={isPortrait}
                  localButtonSizes={localButtonSizes}
                  openNav={openNav}
                  openIdentifier={OpenStateEnum.openNav}
                  toggleArtBackward={toggleArtBackward}
                  toggleArtDetails={toggleArtDetails}
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
                  userArtworkRatings={userArtworkRatings}
                  toggleButtonView={toggleButtonView}
                  userArtworkRated={userArtworkRated}
                />
              </View>
            </View>
            <View style={viewContainer}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
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
          </View>
        )
        : (
          <View>
            {isPortrait
              ? (
                <TombstonePortrait
                  artOnDisplay={artOnDisplay}
                  toggleArtDetails={toggleArtDetails}
                />
              )
              : (
                <TombstoneLandscape
                  artOnDisplay={artOnDisplay}
                  toggleArtDetails={toggleArtDetails}
                />
              )}
          </View>
        )}
    </View>
  );
}
