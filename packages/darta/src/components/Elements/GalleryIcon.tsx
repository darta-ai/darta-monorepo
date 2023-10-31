import React from 'react';

import { View, Image, StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

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
        resizeMode: 'contain',
        backgroundColor: 'transparent'
    }
})
  return (
    <View style={galleryIconStyles.container}>
        <FastImage source={{uri: galleryLogo}} style={galleryIconStyles.image} resizeMode={FastImage.resizeMode.contain}
/>
    </View>
  );
}

