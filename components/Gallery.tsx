import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
// import { galleryStyles } from './Gallery/galleryStyles';
import ArtOnDisplay from './Gallery/ArtOnDisplay';
import NavigateArt from './Gallery/NavigateArt';
import ArtRatingButtons from './Gallery/ArtRatingButtons';

// import kitchen2 from '../backgrounds/kitchen2.png';
// import HannahWall from '../backgrounds/HannahWall.png';
// import WallHorizontal from '../backgrounds/WallHorizontal.png';
import galleryWallRaw from '../backgrounds/galleryWallRaw.png';
import GalleryOptionsButton from './Gallery/GalleryOptionsButton';
import { DataT } from '../types';

function Gallery({ galleryImages } : {galleryImages : DataT[]}) {
  const [fullGallery] = useState<DataT[]>(galleryImages);
  const [artDisplayIndex, setArtDisplayIndex] = useState<number>(0);
  const [artOnDisplay, setArtOnDisplay] = useState(galleryImages[0]);
  const [backgroundImage] = useState(galleryWallRaw);

  const userRatingsEmpty = fullGallery.map((artwork) => (artwork = artwork.id))
    .reduce((obj, id) => ({
      ...obj,
      [id]: {
      },
    }), {});

  const [userArtworkRatings, setUserArtworkRatings] = useState(userRatingsEmpty);

  const [isPortrait, setIsPortrait] = useState(true);

  const backgroundContainerDimensionsPixels = {
    height: isPortrait ? hp('75%')
      : wp('100%'),
    width: isPortrait ? wp('95%')
      : hp('80%'),
  };

  const galleryComponentStyles = StyleSheet.create({
    backgroundImageDimensionsPixels: {
      height: '100%',
      width: '100%',
      position: 'absolute',
      zIndex: 2,
    },
  });

  const wallHeight = 96;

  const flipOrientation = () => {
    setIsPortrait(!isPortrait);
  };

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

  useEffect(() => {
    setArtOnDisplay(fullGallery.at(artDisplayIndex));
  }, [artDisplayIndex]);

  return (
    <View style={{
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute',
      height: isPortrait ? undefined : hp('78%'),
      width: isPortrait ? undefined : wp('95%'),
      backgroundColor: 'black',
    }}
    >
      <ScrollView
        style={[backgroundContainerDimensionsPixels, {
          transform: isPortrait ? [{ rotate: '0deg' }]
            : [{ rotate: '90deg' }],
        }]}
        maximumZoomScale={10.0}
        scrollEnabled
        centerContent
      >
        <ArtOnDisplay
          artOnDisplay={artOnDisplay}
          backgroundImage={backgroundImage}
          artToDisplay={artOnDisplay.image}
          wallHeight={wallHeight}
          backgroundImageDimensionsPixels={backgroundContainerDimensionsPixels}
        />
        <View style={galleryComponentStyles.backgroundImageDimensionsPixels}>
          <NavigateArt
            toggleArtForward={toggleArtForward}
            toggleArtBackward={toggleArtBackward}
            isPortrait={isPortrait}
          />
          <ArtRatingButtons
            isPortrait={isPortrait}
            artOnDisplayId={artOnDisplay.id}
            userArtworkRatings={userArtworkRatings}
            flipOrientation={flipOrientation}
            userArtworkRated={userArtworkRated}
          />
          <GalleryOptionsButton
            isPortrait={isPortrait}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default Gallery;
