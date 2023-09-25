/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import {DEFAULT_Gallery_Image} from '../../utils/constants';
import {globalTextStyles, galleryPreviewStyles} from '../../styles/styles';
import {ExhibitionDates, IOpeningLocationData} from '@darta-types';
import MapView, {Marker} from 'react-native-maps';


export function GalleryPreview({
    exhibitionHeroImage,
    exhibitionTitle,
    exhibitionGallery, 
    exhibitionDates,
    exhibitionLocationData
}: {
    exhibitionHeroImage: string,
    exhibitionTitle: string,
    exhibitionGallery: string, 
    exhibitionDates: ExhibitionDates,
    exhibitionLocationData: IOpeningLocationData
}) {

    const exhibitionPreview = StyleSheet.create({
        heroImage: {
            width: wp('50%'),
            height: hp('20%'),
            resizeMode: 'cover',
            borderRadius: 20,
        },
    })

    let latitude, longitude;

    if (exhibitionLocationData.coordinates && 
        exhibitionLocationData.coordinates?.latitude &&
        exhibitionLocationData.coordinates?.longitude &&
        exhibitionLocationData.coordinates.latitude?.value &&
        exhibitionLocationData.coordinates.longitude?.value) {
        latitude = parseInt(exhibitionLocationData.coordinates.latitude.value!, 10);
        longitude = parseInt(exhibitionLocationData.coordinates.longitude.value!, 10);
    }

  
  return (
    <>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          height: hp('20%'),
          marginTop: hp('1%'),
          justifyContent: 'space-around',
        }}>
            <Image 
                source={{uri: exhibitionHeroImage}} 
                style={exhibitionPreview.heroImage} 
            />
        <View 
            style={{
                display: 'flex',
                flexDirection: 'column',
            }}
        >
          <TextElement
            style={[globalTextStyles.titleText, globalTextStyles.centeredText]}>
            {' '}
            {exhibitionTitle}
          </TextElement>
          <TextElement
            style={[globalTextStyles.baseText, globalTextStyles.centeredText]}>
            {' '}
            {exhibitionGallery}
          </TextElement>
          <TextElement
            style={[globalTextStyles.baseText, globalTextStyles.centeredText]}>
            {' '}
            {exhibitionDates}
          </TextElement>
        </View>
        {exhibitionLocationData.locality?.value && (
        <MapView
            key={`${exhibitionLocationData.coordinates?.googleMapsPlaceId}`}
        >
            <Marker
            coordinate={{latitude: latitude as number, longitude: longitude as number}}
            />
            </MapView>
        )}
      </View>
    </>
  );
}
