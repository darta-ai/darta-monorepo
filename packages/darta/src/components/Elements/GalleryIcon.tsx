import React from 'react';

import { View, Image, StyleSheet } from 'react-native';

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
        <Image source={{uri: galleryLogo}} style={galleryIconStyles.image}/>
    </View>
  );
}

