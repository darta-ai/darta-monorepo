import React from 'react';
import {IconButton} from 'react-native-paper';

import {IconT} from '../../typing/types';
import { View, Image, StyleSheet } from 'react-native';
import { PRIMARY_50 } from '@darta-styles';

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

