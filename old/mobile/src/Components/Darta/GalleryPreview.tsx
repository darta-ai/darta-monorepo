/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GlobalText} from '../../GlobalElements/index';
import {DEFAULT_Gallery_Image} from '../../globalVariables';
import {galleryPreviewStyles} from '../../Screens/Gallery/galleryStyles';
import {globalTextStyles} from '../../styles';

const galleryWallRaw = DEFAULT_Gallery_Image;

export function GalleryPreview({
  body,
  preview,
  isLoading,
  text,
  personalGalleryId,
  showGallery,
}: {
  body: string;
  preview: any;
  isLoading: boolean;
  text: string;
  personalGalleryId: string;
  showGallery: (personalGalleryId: string) => void;
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
          marginTop: hp('1%'),
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
        <TouchableOpacity
          style={{
            height: maxDimension,
            alignItems: 'center',
          }}
          onPress={() => showGallery(personalGalleryId)}>
          <FlatList
            data={resizedPreviewWorks}
            contentContainerStyle={{
              alignItems: 'center',
              height: maxDimension,
              columnGap: wp('10%'),
            }}
            horizontal
            renderItem={({item}) => (
              <View>
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
              </View>
            )}
          />
        </TouchableOpacity>
        <View
          style={{
            marginBottom: hp('1%'),
            alignSelf: 'center',
            backgroundColor: 'rgb(0, 0, 0)',
            borderRadius: 20,
          }}
        />
      </View>
    </>
  );
}
