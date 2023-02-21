import React, { useState, useEffect } from 'react';
import {
  Image, ScrollView, StyleSheet,
} from 'react-native';

// eslint-disable-next-line import/extensions, import/no-unresolved

function Artwork({
  artOnDisplay,
  artworkDimensions,
}) {
  const { dimensionsInches } = artOnDisplay;

  const imageAspectRatio = dimensionsInches.height / dimensionsInches.width;

  const artworkStyles = StyleSheet.create({
    artArea: {
      border: 'solid 2px',
      borderBottomColor: '#ffe',
      borderLeftColor: '#eed',
      borderRightColor: '#eed',
      borderTopColor: '#ccb',
      maxHeight: '100%',
      maxWidth: '100%',
      width: `${artworkDimensions.width}%`,
      height: `${artworkDimensions.height}%`,
    },
    frame: {
      backgroundColor: '#ddc',
      border: 'solid 5vmin #eee',
      borderBottomColor: '#fff',
      borderLeftColor: '#eee',
      borderRadius: 2,
      borderRightColor: '#eee',
      borderTopColor: '#ddd',
      boxShadow: '0 0 5px 0 rgba(0,0,0,.25) inset, 0 5px 10px 5px rgba(0,0,0,.25)',
      boxSizing: 'border-box',
      margin: '10vh 10vw',
      height: '80vh',
      padding: '8vmin',
      position: 'relative',
      textAlign: 'center',
    },

  });

  return (
    <ScrollView style={artworkStyles.frame}>
      <Image
        style={{ width: '100%' }}
        source={artOnDisplay.artArea}
      />
    </ScrollView>
  );
}

export { Artwork };
