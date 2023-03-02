import React, {
  useState, useEffect, useRef,
} from 'react';
import {
  ScrollView,
  View,
  Animated,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  ArtOnDisplay,
  NavigateArt,
  ArtRatingButtons,
  GalleryViewOptions,
} from './GalleryComponents/index';
import { galleryComponentStyles } from './galleryStyles';
import { galleryDimensionsPortrait, duration, galleryDimensionsLandscape } from '../globalVariables';
import { DataT } from '../../types';
import { TombstonePortrait, TombstoneLandscape } from '../Tombstone/index';

// import kitchen2 from '../backgrounds/kitchen2.png';
// import HannahWall from '../backgrounds/HannahWall.png';
// import WallHorizontal from '../backgrounds/WallHorizontal.png';
const galleryWallRaw = require('../../backgrounds/galleryWallRaw.png');

export function Gallery({ galleryImages } : {galleryImages : DataT[]}) {
  const [fullGallery] = useState<DataT[]>(galleryImages);
  const [artDisplayIndex, setArtDisplayIndex] = useState<number>(0);
  const [artOnDisplay, setArtOnDisplay] = useState<DataT | undefined>(galleryImages[0]);
  const [backgroundImage] = useState(galleryWallRaw);

  const userRatingsEmpty = fullGallery.map(
    // eslint-disable-next-line no-return-assign, no-param-reassign
    (artwork) => (artwork = artwork.id),
  ).reduce((obj, id) => ({
    ...obj,
    [id]: {},
  }), {});

  const [userArtworkRatings, setUserArtworkRatings] = useState(userRatingsEmpty);

  const [isPortrait, setIsPortrait] = useState(true);
  const [openNav, setOpenNav] = useState<boolean>(false);
  const [openRatings, setOpenRatings] = useState<boolean>(false);
  const [openOptions, setOpenOptions] = useState<boolean>(false);

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

  const fadeAnimOptions = useRef(new Animated.Value(0)).current;

  const fadeInOptions = () => {
    setOpenOptions(!openOptions);
    Animated.timing(fadeAnimOptions, {
      toValue: 1,
      duration,
      useNativeDriver: true,
    }).start();
  };

  const fadeOutOptions = async () => {
    Animated.timing(fadeAnimOptions, {
      toValue: 0,
      duration,
      useNativeDriver: true,
    }).start(() => {
      setOpenOptions(!openOptions);
    });
  };

  const toggleOptionsView = () => {
    if (openOptions) {
      fadeOutOptions();
    } else {
      fadeInOptions();
    }
  };

  const flipOrientation = () => {
    setIsPortrait(!isPortrait);
    fadeOutOptions();
  };

  useEffect(() => {
    setArtOnDisplay(fullGallery.at(artDisplayIndex));
  }, [artDisplayIndex]);

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
                  toggleArtForward={toggleArtForward}
                  toggleArtBackward={toggleArtBackward}
                  toggleArtDetails={toggleArtDetails}
                  setOpenNav={setOpenNav}
                  isPortrait={isPortrait}
                  openNav={openNav}
                />
                <ArtRatingButtons
                  isPortrait={isPortrait}
                  artOnDisplayId={artOnDisplay?.id}
                  userArtworkRatings={userArtworkRatings}
                  openRatings={openRatings}
                  setOpenRatings={setOpenRatings}
                  userArtworkRated={userArtworkRated}
                />
              </View>
            </View>
            <View style={viewContainer}>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start' }}>
                <GalleryViewOptions
                  isPortrait={isPortrait}
                  openOptions={openOptions}
                  fadeAnimOptions={fadeAnimOptions}
                  toggleOptionsView={toggleOptionsView}
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
