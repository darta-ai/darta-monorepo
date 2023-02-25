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
import InteractionButtons from './Gallery/InteractionButtons';

// import kitchen2 from '../backgrounds/kitchen2.png';
// import HannahWall from '../backgrounds/HannahWall.png';
import galleryWallRaw from '../backgrounds/galleryWallRaw.png';
import WallHorizontal from '../backgrounds/WallHorizontal.png';
import RotateScreenButton from './Gallery/RotateScreenButton';
import { DataT } from '../types';

function Gallery({ galleryImages } : {galleryImages : DataT[]}) {
  const [fullGallery] = useState<DataT[]>(galleryImages);
  const [artDisplayIndex, setArtDisplayIndex] = useState<number>(0);
  const [artOnDisplay, setArtOnDisplay] = useState(galleryImages[0]);
  const [backgroundImage] = useState(galleryWallRaw);

  const [isPortrait, setIsPortrait] = useState(true);

  const backgroundContainerDimensionsPixels = {
    height: isPortrait ? hp('75%')
      // : wp('100%')
      : wp('100%'),
    width: isPortrait ? wp('95%')
      // : hp('80%'),
      : hp('75%'),
  };

  const galleryStyles = StyleSheet.create({
    backgroundImageDimensionsPixels: {
      height: '100%',
      width: '100%',
      borderWidth: 2,
      position: 'absolute',
      zIndex: 2,
      top: '0%',
    },
  });

  const wallHeight = 108;

  const flipOrientation = () => {
    setIsPortrait(!isPortrait);
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
    <View
      style={backgroundContainerDimensionsPixels}
    >
      <ScrollView
        style={{
          borderColor: 'yellow',
          borderWidth: 5,
          transform: isPortrait ? [{ rotate: '0deg' }]
            : [{ rotate: '90deg' }],
        }}
        contentContainerStyle={{ alignItems: 'center', alignSelf: 'center' }}
        maximumZoomScale={10.0}
        scrollEnabled
        centerContent
      >
        <ArtOnDisplay
          artOnDisplay={artOnDisplay}
          backgroundImage={backgroundImage}
          artToDisplay={artOnDisplay.image}
          wallHeight={wallHeight}
          isPortrait={isPortrait}
          backgroundImageDimensionsPixels={backgroundContainerDimensionsPixels}
        />
        <View style={galleryStyles.backgroundImageDimensionsPixels}>
          <NavigateArt
            toggleArtForward={toggleArtForward}
            toggleArtBackward={toggleArtBackward}
            isPortrait={isPortrait}
          />
          <InteractionButtons
            isPortrait={isPortrait}
            flipOrientation={flipOrientation}
          />
          <RotateScreenButton
            isPortrait={isPortrait}
          />
        </View>
      </ScrollView>
    </View>
  );
}

export default Gallery;
