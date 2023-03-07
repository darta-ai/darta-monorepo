import React from 'react';
import {
  TouchableOpacity,
  StyleSheet, ImageBackground,
  View,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ProgressBar from 'react-native-progress/Bar';
import { GlobalText } from '../GlobalElements/index';

import { globalTextStyles } from '../styles';

const galleryWallRaw = require('../../backgrounds/galleryWallRaw.png');

const galleryPreviewStyles = StyleSheet.create({
  previewContainerPortrait: {
    borderWidth: 2,
    borderRadius: 20,
    backgroundColor: '#FFF',
    height: hp('20%'),
    flex: 1,
    flexDirection: 'column',
  },
});

export function GalleryPreview({
  body,
  galleryId,
  numberOfArtworks,
  numberOfRatedWorks,
  isPortrait,
  text,
  showGallery,
}:{
    body:string
    galleryId:string
    numberOfArtworks: number
    numberOfRatedWorks: number
    isPortrait: boolean
    text:string
    // eslint-disable-next-line no-shadow, no-unused-vars
    showGallery: (galleryId: string) => void
}) {
  return (
    <View>
      <TouchableOpacity
        style={{ margin: 10, height: hp('20%') }}
        onPress={() => showGallery(galleryId)}
      >
        <ImageBackground
          imageStyle={galleryPreviewStyles.previewContainerPortrait}
          source={galleryWallRaw}
        >
          <GlobalText style={[globalTextStyles.titleText, globalTextStyles.centeredText]}>
            {' '}
            {text}
          </GlobalText>
          <GlobalText style={[globalTextStyles.baseText, globalTextStyles.centeredText]}>
            {' '}
            {body}
          </GlobalText>
          <View>
            <ProgressBar
              progress={numberOfRatedWorks / numberOfArtworks}
              borderRadius={20}
              width={wp('90%')}
              color="rgb(0, 0, 0)"
              useNativeDriver
              animated
            />
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}
