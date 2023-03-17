import React from 'react';
import { View } from 'react-native';

import styles from '../assets/styles';
import { GallerySelector } from '../components/GallerySelector';

function Home() {
  return (
    <View style={styles.containerHome}>
      <GallerySelector />
    </View>
  );
}

export default Home;
