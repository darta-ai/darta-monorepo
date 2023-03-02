import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  ScrollView,
  View,
  Animated,
  ImageSourcePropType,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
import { DataT, OpenStateEnum, UserArtworkRatings } from '../../types';
import { TombstonePortrait, TombstoneLandscape } from '../Tombstone/index';
import { getImages } from './galleryFunctions';

// import kitchen2 from '../backgrounds/kitchen2.png';
// import HannahWall from '../backgrounds/HannahWall.png';
// import WallHorizontal from '../backgrounds/WallHorizontal.png';
const galleryWallRaw = require('../../backgrounds/galleryWallRaw.png');

export function Gallery({ artworkIds } : {artworkIds : string[]}) {
  const [fullGallery, setFullGallery] = useState<DataT[]>();
  const [artDisplayIndex, setArtDisplayIndex] = useState<number>(0);
  const [artOnDisplay, setArtOnDisplay] = useState<DataT | undefined>();
  const [backgroundImage] = useState<ImageSourcePropType>(galleryWallRaw);
  const [userArtworkRatings, setUserArtworkRatings] = useState<UserArtworkRatings>();

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

  const [isPortrait, setIsPortrait] = useState(true);
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [openRatings, setOpenRatings] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<boolean>(false);

  const fadeAnimOptions = useRef(new Animated.Value(0)).current;
  const fadeAnimRating = useRef(new Animated.Value(0)).current;
  const fadeAnimNav = useRef(new Animated.Value(0)).current;

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
        console.log('triggered', OpenStateEnum.openRatings);
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

  const backgroundContainerDimensionsPixels = isPortrait
    ? { ...galleryDimensionsPortrait } : { ...galleryDimensionsLandscape };

  const wallHeight = 96;

  const userArtworkRated = (updatedRatings: any) => {
    setUserArtworkRatings({ ...userArtworkRatings, ...updatedRatings });
  };

  const toggleArtForward = () => {
    const numberOfArtworks = fullGallery.length;
    const currentDisplayIndex = artDisplayIndex;
    if (currentDisplayIndex + 1 >= numberOfArtworks) {
      setArtDisplayIndex(0);
    } else {
      setArtDisplayIndex(currentDisplayIndex + 1);
    }
  };
  const toggleArtBackward = () => {
    const numberOfArtworks = fullGallery.length;
    const currentDisplayIndex = artDisplayIndex;
    if (currentDisplayIndex === 0) {
      setArtDisplayIndex(numberOfArtworks - 1);
    } else {
      setArtDisplayIndex(currentDisplayIndex - 1);
    }
  };

  const [showArtDetails, setShowDetails] = useState(true);

  const toggleArtDetails = () => {
    setShowDetails(!showArtDetails);
  };
  const interactionContainer = isPortrait
    ? galleryComponentStyles.interactionContainerPortrait
    : galleryComponentStyles.interactionContainerLandscape;

  const viewContainer = isPortrait
    ? galleryComponentStyles.viewContainerPortrait
    : galleryComponentStyles.viewContainerLandscape;

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      left: isPortrait ? undefined : '10%',
      height: isPortrait ? hp('80%') : hp('80%'),
      width: isPortrait ? wp('95%') : wp('75%'),
    }}
    >

      {showArtDetails
        ? (
          <ScrollView
            style={[backgroundContainerDimensionsPixels, {
              transform: isPortrait ? [{ rotate: '0deg' }]
                : [{ rotate: '90deg' }],
              backgroundColor: 'black',
            }]}
            maximumZoomScale={10.0}
            scrollEnabled
            centerContent
          >
            <ArtOnDisplay
              dimensionsInches={artOnDisplay?.dimensionsInches}
              backgroundImage={backgroundImage}
              artImage={artOnDisplay?.image}
              wallHeight={wallHeight}
              backgroundImageDimensionsPixels={backgroundContainerDimensionsPixels}
              isPortrait={isPortrait}
            />
            <View style={interactionContainer}>
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
                  openIdentifier={OpenStateEnum.openNav}
                  toggleArtBackward={toggleArtBackward}
                  toggleArtDetails={toggleArtDetails}
                  toggleArtForward={toggleArtForward}
                  toggleButtonView={toggleButtonView}
                />
                <ArtRatingButtons
                  artOnDisplayId={artOnDisplay?.id}
                  fadeAnimRating={fadeAnimRating}
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
                  toggleButtonView={toggleButtonView}
                  flipOrientation={flipOrientation}
                />
              </View>
            </View>
          </ScrollView>
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
