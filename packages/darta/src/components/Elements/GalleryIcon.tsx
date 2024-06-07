import React from 'react';

import { View, StyleSheet } from 'react-native';
// import FastImage from 'react-native-fast-image';
import { DartaImageComponent } from '../Images/DartaImageComponent';

export function GalleryIcon({galleryLogo}: {galleryLogo: string}) {
const galleryIconStyles = StyleSheet.create({
    container: {
        width: 40,
        height: 40,
        overflow: 'hidden',
    },
    image: {
        width: 40,
        height: 40,
        backgroundColor: 'transparent'
    }
})
  return (
    <View style={galleryIconStyles.container}>
        <DartaImageComponent 
          uri={{value: galleryLogo}} 
          style={galleryIconStyles.image} 
          priority={"normal"} 
          size={"smallImage"}
        />
    </View>
  );
}

