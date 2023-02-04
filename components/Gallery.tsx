import React, { useState } from 'react';
import { View, Image, Dimensions } from 'react-native';
import GalleryWall1Horizontal from '../backgrounds/GalleryWall1Horizontal.png';
// import GalleryWall2Vertical from '../backgrounds/Gallery1WallVertical.png'

// eslint-disable-next-line import/extensions, import/no-unresolved
import styles from '../assets/styles';

function Gallery() {
  // Custom styling
  const fullWidth = Dimensions.get('window').width;
  const fullHeight = Dimensions.get('window').height;

  const [backgroundImage] = useState(GalleryWall1Horizontal);

  const imageStyle = [
    {
      width: fullWidth,
      height: fullHeight - 500,
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
      {/* IMAGE */}
      <Image
        source={backgroundImage}
        style={imageStyle}
      />
    </View>
  );
}

export default Gallery;
