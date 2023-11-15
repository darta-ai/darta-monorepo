/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import {ExhibitionDates} from '@darta-types';
import * as Colors from '@darta-styles';
import { customLocalDateStringEnd, customLocalDateStringStart } from '../../utils/functions';
import FastImage from 'react-native-fast-image';
import { Button, Surface } from 'react-native-paper';


type ExhibitionPreviewMiniProps = {
  exhibitionHeroImage: string,
  exhibitionId: string,
  exhibitionTitle: string,
  exhibitionGallery: string, 
  exhibitionDates: ExhibitionDates, // Assuming ExhibitionDates is defined elsewhere
  galleryLogoLink: string,
  exhibitionArtist: string,
  onPress: ({ exhibitionId }: { exhibitionId: string }) => void
};

const ExhibitionPreviewMini = React.memo<ExhibitionPreviewMiniProps>(({
    exhibitionHeroImage,
    exhibitionId,
    exhibitionTitle,
    exhibitionDates,
    exhibitionArtist,
    onPress
}) => {

  const exhibitionPreview = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      alignItems: 'flex-start',
    },
    heroImageContainer: {
      height: 262,
      width: wp('90%'),
      display:'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroImage: {
      height: '100%',
      width: '100%',
      resizeMode: 'contain',
      backgroundColor: 'transparent',
      zIndex: 1,
      shadowOpacity: 1, 
      shadowRadius: 3.03,
      shadowOffset: {
          width: 0,
          height: 3.03,
      },
      shadowColor: Colors.PRIMARY_300,
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
    exhibitionTitle: {
      fontFamily: 'DMSans_700Bold',
      fontSize: 16,
      color: Colors.PRIMARY_950,
    },
    artistTitle: {
      fontFamily: 'DMSans_400Regular',
      fontSize: 16,
      color: Colors.PRIMARY_900,
    },
    buttonStyles: {
      width: '100%',
      backgroundColor: Colors.PRIMARY_950,
      alignSelf: "center",
      marginTop: 24,
    },
    buttonContentStyle: {
      justifyContent: "center",
      alignItems: "center",
      width: wp('90%'),
      padding: 0, // Or any other desired padding
    },
    buttonTextColor: {
      color: Colors.PRIMARY_50,
      fontFamily: "DMSans_700Bold",
    }
  })

  let startDate = ""
  let endDate = "";

  if (exhibitionDates.exhibitionStartDate.value && exhibitionDates.exhibitionEndDate.value) {
      startDate = customLocalDateStringStart({date: new Date(exhibitionDates.exhibitionStartDate.value), isUpperCase: false})
      endDate = customLocalDateStringEnd({date: new Date(exhibitionDates.exhibitionEndDate.value), isUpperCase: false})
  }

  return (
      <View
        style={exhibitionPreview.container}>
          <TextElement
            style={exhibitionPreview.exhibitionTitle}>
            {exhibitionArtist ?? "Group Show"}
          </TextElement>
          <TextElement
            style={exhibitionPreview.artistTitle}>
            {exhibitionTitle}
          </TextElement>
          <View style={{...exhibitionPreview.heroImageContainer, marginTop: 24}} >
              <FastImage 
                  source={{uri: exhibitionHeroImage}} 
                  style={exhibitionPreview.heroImage} 
                  resizeMode={FastImage.resizeMode.contain}
              />
          </View>
          <TextElement
            style={{...exhibitionPreview.exhibitionTitle, marginTop: 24}}>
            {startDate} {' - '} {endDate}
          </TextElement>
          <Button 
             onPress={() => onPress({exhibitionId})}
             style={exhibitionPreview.buttonStyles}
             contentStyle={exhibitionPreview.buttonContentStyle}
             >
              <TextElement style={exhibitionPreview.buttonTextColor}>View Details</TextElement>
            </Button>
      </View>
  );
})

export default ExhibitionPreviewMini  
