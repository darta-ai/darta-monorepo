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

import {TextElement} from '../Elements/_index';
import {globalTextStyles} from '../../styles/styles';
import {ExhibitionDates} from '@darta-types';
import { PRIMARY_700, PRIMARY_900, PRIMARY_100, PRIMARY_50 } from '@darta-styles';
import { customLocalDateString } from '../../utils/functions';


export function ExhibitionPreviewMini({
    exhibitionHeroImage,
    exhibitionId,
    exhibitionTitle,
    exhibitionDates,
    exhibitionArtist,
    onPress
}: {
    exhibitionHeroImage: string,
    exhibitionId: string,
    exhibitionTitle: string,
    exhibitionGallery: string, 
    exhibitionDates: ExhibitionDates,
    galleryLogoLink: string,
    exhibitionArtist: string,
    onPress: ({exhibitionId} : {exhibitionId: string}) => void
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
      backgroundColor: PRIMARY_50,
      borderWidth: 1,
    },
    heroImageContainer: {
      height: '65%',
      marginTop: 10,
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
      width: '100%',
      height: '25%',
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

  let startDate = ""
  let endDate = "";

  if (exhibitionDates.exhibitionStartDate.value && exhibitionDates.exhibitionEndDate.value) {
      startDate = customLocalDateString(new Date(exhibitionDates.exhibitionStartDate.value))
      endDate = customLocalDateString(new Date(exhibitionDates.exhibitionEndDate.value))
  }

  return (
    <>
    <TouchableOpacity 
      onPress={() => onPress({exhibitionId})}
    >
      <View
        style={exhibitionPreview.container}>
          <View style={exhibitionPreview.heroImageContainer} >
            <Image 
                source={{uri: exhibitionHeroImage}} 
                style={exhibitionPreview.heroImage} 
            />
          </View>

        <View style={exhibitionPreview.textContainer}>
          <TextElement
            style={{...globalTextStyles.centeredText, fontWeight: 'bold', color: PRIMARY_900, fontSize: 18}}>
            {' '}
            {exhibitionArtist}
          </TextElement>
          <TextElement
            style={{...globalTextStyles.italicTitleText, color: PRIMARY_900, fontSize: 16}}>
            {' '}
            {exhibitionTitle}
          </TextElement>
          <TextElement
            style={{...globalTextStyles.centeredText, color: PRIMARY_900, fontSize: 12}}>
            {' '}
            {startDate} {' - '} {endDate}
          </TextElement>
        </View>
      <TextElement
      style={{...globalTextStyles.centeredText, textDecorationLine: 'underline', fontSize: 12}}>
      {' '}
      tap to view
    </TextElement>
      </View>
      </TouchableOpacity>
    </>
  );
}
