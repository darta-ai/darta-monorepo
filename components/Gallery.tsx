import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Dimensions,
  View,
} from 'react-native';
import { galleryStyles } from './Gallery/galleryStyles';
import ArtOnDisplay from './Gallery/ArtOnDisplay';
import NavigateArt from './Gallery/NavigateArt';
import InteractionButtons from './Gallery/InteractionButtons';

// import kitchen2 from '../backgrounds/kitchen2.png';
// import HannahWall from '../backgrounds/HannahWall.png';
// import galleryWallRaw from '../backgrounds/galleryWallRaw.png';
import WallHorizontal from '../backgrounds/WallHorizontal.png';
import RotateScreenButton from './Gallery/RotateScreenButton';
import { DataT } from '../types';

function Gallery({ galleryImages } : {galleryImages : DataT[]}) {
  const [fullGallery] = useState<DataT[]>(galleryImages);
  const [artDisplayIndex, setArtDisplayIndex] = useState<number>(0);
  const [artOnDisplay, setArtOnDisplay] = useState(galleryImages[0]);
  const [backgroundImage] = useState(WallHorizontal);

  const [isPortrait, setIsPortrait] = useState(true);

  useEffect(() => {
    Dimensions.addEventListener('change', ({ window: { width: fullWidthPixels, height: fullHeightPixels } }) => {
      if (fullWidthPixels < fullHeightPixels) {
        setIsPortrait(true);
      } else {
        setIsPortrait(false);
      }
    });
  }, []);

  const wallHeight = 96;

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
    <ScrollView
      maximumZoomScale={10.0}
      contentContainerStyle={galleryStyles.container}
      centerContent
    >
      <ArtOnDisplay
        artOnDisplay={artOnDisplay}
        backgroundImage={backgroundImage}
        artToDisplay={artOnDisplay.image}
        wallHeight={wallHeight}
        isPortrait={isPortrait}
      />
      <RotateScreenButton
        isPortrait={isPortrait}
      />
      <NavigateArt
        toggleArtForward={toggleArtForward}
        toggleArtBackward={toggleArtBackward}
        isPortrait={isPortrait}
      />
      <InteractionButtons
        isPortrait={isPortrait}
        flipOrientation={flipOrientation}
      />
    </ScrollView>
  );
}

export default Gallery;
