/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  FlatList,
  Image,
  ImageBackground,
  SafeAreaView,
  TouchableOpacity,
  View,
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { GlobalText } from '../../GlobalElements/index';
import { globalTextStyles } from '../../styles';
import { galleryPreviewStyles } from '../galleryStyles';

const galleryWallRaw = require('../../../backgrounds/galleryWallRaw.png');

export function GalleryPreview({
  body,
  galleryId,
  preview,
  numberOfArtworks,
  numberOfRatedWorks,
  text,
  showGallery,
}:{
    body:string
    galleryId:string
    preview:any
    numberOfArtworks: number
    numberOfRatedWorks: number
    text:string
    // eslint-disable-next-line no-shadow, no-unused-vars
    showGallery: (galleryId: string) => void
}) {
  const previewWorks = Object.keys(preview).map((id) => id = preview[id]);

  const maxDimensions = 50;
  const maxDimension = Math.floor(hp('20%') * 0.5);

  const resizedPreviewWorks = previewWorks.map((id) => {
    const { dimensionsInches: { height, width } } = id;
    let displayHeight;
    let displayWidth;
    if (height >= width) {
      displayHeight = Math.floor(((height / maxDimensions) * maxDimension));
      displayWidth = Math.floor(((width / height) * displayHeight));
    } else {
      displayWidth = Math.floor(((width / maxDimensions) * maxDimension));
      displayHeight = Math.floor(((height / width) * displayWidth));
    }
    return ({
      ...id,
      displayDimensions: {
        displayHeight,
        displayWidth,
      },
    });
  });

  return (
    <TouchableOpacity
      style={{
        margin: 10,
      }}
      onPress={() => showGallery(galleryId)}
    >
      <ImageBackground
        imageStyle={galleryPreviewStyles.previewContainerPortrait}
        source={galleryWallRaw}
      />
      <View style={{
        display: 'flex',
        flexDirection: 'column',
        height: hp('25%'),
        justifyContent: 'space-around',
      }}
      >
        <View style={{}}>
          <GlobalText style={[globalTextStyles.titleText, globalTextStyles.centeredText]}>
            {' '}
            {text}
          </GlobalText>
          <GlobalText style={[globalTextStyles.baseText, globalTextStyles.centeredText]}>
            {' '}
            {body}
          </GlobalText>
        </View>
        <SafeAreaView style={{
          height: maxDimension,
          alignItems: 'center',
          alignContent: 'space-around',

        }}
        >
          <FlatList
            data={resizedPreviewWorks}
            contentContainerStyle={{
              alignItems: 'center',
              height: maxDimension,
              columnGap: wp('15%'),
            }}
            horizontal
            renderItem={({ item }) => (
              <Image
                source={{ uri: item.image }}
                style={{
                  height: item.displayDimensions.displayHeight,
                  width: item.displayDimensions.displayWidth,
                }}
              />
            )}
          />
        </SafeAreaView>
        <View style={{
          marginBottom: hp('1%'), alignSelf: 'center', backgroundColor: 'rgb(0, 0, 0)', borderRadius: 20,
        }}
        >
          <ProgressBar
            progress={numberOfRatedWorks / numberOfArtworks}
            borderRadius={20}
            backgroundColor=""
            color="#FFF"
            width={wp('85%')}
            useNativeDriver
            animated
          />
        </View>
      </View>
    </TouchableOpacity>
  );
}
