/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  View,
} from 'react-native';
import ProgressBar from 'react-native-progress/Bar';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GlobalText} from '../../GlobalElements/index';
import {globalTextStyles} from '../../styles';
import {galleryPreviewStyles} from '../galleryStyles';

const galleryWallRaw =
  'https://lh5.googleusercontent.com/hIu5cpHJlz8t3_ApZ-JIbXLT4QzIB04XpmvLcqVIOWXrfKjnLAo_fNqM60nGU5SVE2U=w2400';

export function GalleryPreview({
  body,
  preview,
  numberOfArtworks,
  numberOfRatedWorks,
  isLoading,
  text,
}: {
  body: string;
  preview: any;
  numberOfArtworks: number;
  numberOfRatedWorks: number;
  isLoading: boolean;
  text: string;
}) {
  const previewWorks = Object.keys(preview).map(id => (id = preview[id]));

  const maxDimensions = 50;
  const maxDimension = Math.floor(hp('20%') * 0.5);

  const resizedPreviewWorks = previewWorks.map(id => {
    const {
      dimensionsInches: {height, width},
    } = id;
    let displayHeight;
    let displayWidth;
    if (height >= width) {
      displayHeight = Math.floor((height / maxDimensions) * maxDimension);
      displayWidth = Math.floor((width / height) * displayHeight);
    } else {
      displayWidth = Math.floor((width / maxDimensions) * maxDimension);
      displayHeight = Math.floor((height / width) * displayWidth);
    }
    return {
      ...id,
      displayDimensions: {
        displayHeight,
        displayWidth,
      },
    };
  });

  return (
    <>
      <ImageBackground
        imageStyle={galleryPreviewStyles.previewContainerPortrait}
        source={{uri: galleryWallRaw}}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: hp('25%'),
          justifyContent: 'space-around',
        }}>
        <View style={{}}>
          <GlobalText
            style={[globalTextStyles.titleText, globalTextStyles.centeredText]}>
            {' '}
            {text}
          </GlobalText>
          <GlobalText
            style={[globalTextStyles.baseText, globalTextStyles.centeredText]}>
            {' '}
            {body}
          </GlobalText>
        </View>
        <View
          style={{
            height: maxDimension,
            alignItems: 'center',
            // alignContent: 'space-around',
          }}>
          <FlatList
            data={resizedPreviewWorks}
            contentContainerStyle={{
              alignItems: 'center',
              height: maxDimension,
              columnGap: wp('10%'),
            }}
            horizontal
            renderItem={({item}) => (
              <>
                {isLoading ? (
                  <ActivityIndicator
                    size="small"
                    color="black"
                    style={{
                      alignItems: 'center',
                      height: maxDimension,
                      columnGap: wp('15%'),
                      alignSelf: 'center',
                    }}
                  />
                ) : (
                  <Image
                    source={{uri: item.image}}
                    style={{
                      height: item.displayDimensions.displayHeight,
                      width: item.displayDimensions.displayWidth,
                      position: 'relative',
                    }}
                  />
                )}
              </>
            )}
          />
        </View>
        <View
          style={{
            marginBottom: hp('1%'),
            alignSelf: 'center',
            backgroundColor: 'rgb(0, 0, 0)',
            borderRadius: 20,
          }}>
          <ProgressBar
            progress={(numberOfRatedWorks ?? 0) / (numberOfArtworks ?? 1)}
            borderRadius={20}
            backgroundColor=""
            color="#FFF"
            width={wp('85%')}
            useNativeDriver
            animated
          />
        </View>
      </View>
    </>
  );
}
