import React, { useState, useEffect } from 'react';
import { View, Image, useWindowDimensions} from 'react-native';
import {calculateHeightFromDistanceHorizontal, calculateDistanceFromHeightHorizontal}from '../functions/distanceCalculator'
// import galleryWall from '../backgrounds/galleryWall.png';
import kitchen2 from '../backgrounds/kitchen2.png'
// import galleryWallRaw from '../backgrounds/galleryWallRaw.png'
import data from '../assets/data/demo'
// import GalleryWall2Vertical from '../backgrounds/Gallery1WallVertical.png'

import {Slider} from 'react-native-slider';

// eslint-disable-next-line import/extensions, import/no-unresolved
import styles from '../assets/styles';

function Gallery() {
  // Custom styling
  const fullWidth = useWindowDimensions().width;
  const fullHeight = useWindowDimensions().height;

  const [artOnDisplay] = useState(data[0]);

  const [perspectiveDistance] = useState(9)

  const [backgroundHeight, setBackgroundHeight] = useState(120);

  const wallHeight = calculateHeightFromDistanceHorizontal(6)
  const userDistance = calculateDistanceFromHeightHorizontal(8)
  console.log({newDistance : wallHeight, userDistance})

  const [zoom, setZoom] = useState(1)

  console.log(fullWidth * 0.9)

  const [backgroundImage] = useState(kitchen2);
  const [backgroundImageDimensions] = useState({height : fullHeight * (backgroundHeight / 150), width : (backgroundHeight * (3 * zoom))})

  const [screenRatio, setScreenRatio] = useState(backgroundImageDimensions.height / backgroundImageDimensions.width);

  const [artworkDimensions, setArtworkDimensions] = useState({height: "", width: ""});
  const [artworkDisplayLocation, setArtworkDisplayLocation] = useState({top: 40, left: 40})
  const [artworkWidth, setArtworkWidth] = useState()

  // 10 feet

  const convertArtworkDimensions = () => {
    const artworkHeight = (artOnDisplay.dimensionsInches.height / backgroundHeight) * 100;

    const artworkRatio = artOnDisplay.dimensionsInches.height / artOnDisplay.dimensionsInches.width;
    console.log('artworkRatio', artworkRatio, screenRatio)

    const artworkWidth = (artworkHeight * screenRatio) 
    console.log({width: `${artworkWidth}`, height: `${artworkHeight}%`})
    setArtworkDimensions({width: `${artworkWidth}`, height: `${artworkHeight}%`});
  }

  useEffect(()=>{
    convertArtworkDimensions()
  }, [backgroundHeight])


  const backgroundStyle = [
    {
      width: backgroundImageDimensions.width,
      height: backgroundImageDimensions.height,
      position: "relative",
      margin: 0,
      top: 0,
      left: 0,
    }, 
  ];

  const artStyle = [
    {
      position: "absolute",
      top: `${artworkDisplayLocation.top}%`,
      left: `${artworkDisplayLocation.left}}%`,
      width: `${artworkDimensions.width}%`,
      height: `${artworkDimensions.height}%`
    }, 
  ];


  // const nameStyle = [
  //   {
  //     paddingTop: 15,
  //     paddingBottom: 7,
  //     color: '#363636',
  //     fontSize: 30,
  //   },
  // ];

  return (
    <View style={styles.containerCardItem}>
      <Image
        source={backgroundImage}
        style={backgroundStyle}
      />
      <Image 
        source={artOnDisplay.image}
        style={artStyle}
      />

      <Slider />
    </View>
  );
}

export default Gallery;
