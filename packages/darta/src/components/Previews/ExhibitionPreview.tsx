/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {GalleryIcon, TextElement} from '../Elements/_index';
import {globalTextStyles, galleryPreviewStyles} from '../../styles/styles';
import {ExhibitionDates, IOpeningLocationData} from '@darta-types';
import { PRIMARY_950, PRIMARY_700, PRIMARY_900, PRIMARY_200, PRIMARY_100 } from '@darta-styles';
import { customLocalDateString } from '../../utils/functions';


export function ExhibitionPreview({
    exhibitionHeroImage,
    exhibitionTitle,
    exhibitionGallery, 
    exhibitionDates,
    galleryLogoLink,
    exhibitionArtist
}: {
    exhibitionHeroImage: string,
    exhibitionTitle: string,
    exhibitionGallery: string, 
    exhibitionDates: ExhibitionDates,
    galleryLogoLink: string,
    exhibitionArtist: string
}) {

  const exhibitionPreview = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: hp('35%'),
      width: wp('90%'),
      margin: hp('1%'),
      gap: wp('1%'),
      justifyContent: 'space-around',
      alignItems: 'center',
      borderRadius: 5,
      borderColor: PRIMARY_700,
      backgroundColor: PRIMARY_100,
      borderWidth: 1,
    },
    heroImageContainer: {
      height: '50%',
      width: '100%',
      display:'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginLeft: wp('1%'),
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    textContainer:{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      gap: wp('5%'),
      width: '100%',
      height: '20%',
      alignItems: 'center',  
    },
    mapContainer: {
      width: '15%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'black',
      borderWidth: 1,
    },
    galleryIcon: {
      position: 'absolute',  
      top: 2,                
      right: 2,              
      borderRadius: 20,
    },
  })

  let startDate, endDate;

  if (exhibitionDates.exhibitionStartDate.value && exhibitionDates.exhibitionEndDate.value) {
      startDate = customLocalDateString(new Date(exhibitionDates.exhibitionStartDate.value))
      endDate = customLocalDateString(new Date(exhibitionDates.exhibitionEndDate.value))
  }

  return (
    <>
    <TouchableOpacity 
      onPress={() => console.log('pressed')}
    >
      <View
        style={exhibitionPreview.container}>
            <View style={exhibitionPreview.galleryIcon}>
              {/* <GalleryIcon galleryLogo={galleryLogoLink}/> */}
            </View>
          <View style={exhibitionPreview.heroImageContainer} >
            <Image 
                source={{uri: exhibitionHeroImage}} 
                style={exhibitionPreview.heroImage} 
            />
          </View>

        <View style={exhibitionPreview.textContainer}>
          <TextElement
            style={{...globalTextStyles.centeredText, fontWeight: 'bold', color: PRIMARY_900}}>
            {' '}
            {exhibitionTitle} {' - '} {exhibitionArtist}
          </TextElement>
          <TextElement
            style={{...globalTextStyles.centeredText, fontWeight: 'bold', color: PRIMARY_900}}>
            {' '}
            {startDate} {' - '} {endDate}
          </TextElement>
        </View>
      <TextElement
      style={{...globalTextStyles.centeredText, textDecorationLine: 'underline', fontSize: 12}}>
      {' '}
      click to view
    </TextElement>
      </View>
      </TouchableOpacity>
    </>
  );
}
