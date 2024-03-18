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
import * as SVGs from '../../assets/SVGs';

import {TextElement} from '../Elements/_index';
import {ExhibitionDates, Images} from '@darta-types';
import * as Colors from '@darta-styles';
import { customLocalDateStringEnd, customLocalDateStringStart, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';
import FastImage from 'react-native-fast-image';
import { Button, Surface } from 'react-native-paper';
import { DartaImageComponent } from '../Images/DartaImageComponent';


type ExhibitionPreviewMiniProps = {
  exhibitionHeroImage: Images,
  exhibitionId: string,
  exhibitionTitle: string,
  exhibitionGallery: string, 
  exhibitionDates: ExhibitionDates, // Assuming ExhibitionDates is defined elsewhere
  galleryLogoLink: string,
  exhibitionArtist: string,
  exhibitionLocation: string,
  userUnviewed: boolean,
  onPress: ({ exhibitionId }: { exhibitionId: string }) => void
};


const exhibitionPreview = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
  },
  bellContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    zIndex: 2,
  },
  heroImageContainer: {
    height: 262,
    width: wp('90%'),
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
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

const ExhibitionPreviewMini = React.memo<ExhibitionPreviewMiniProps>(({
    exhibitionHeroImage,
    exhibitionId,
    exhibitionTitle,
    exhibitionDates,
    exhibitionArtist,
    exhibitionLocation,
    userUnviewed,
    onPress
}) => {


  let startDate = ""
  let endDate = "";

  let city = ""
  let mailing = ""

  if (exhibitionDates.exhibitionStartDate.value && exhibitionDates.exhibitionEndDate.value) {
      startDate = customLocalDateStringStart({date: new Date(exhibitionDates.exhibitionStartDate.value), isUpperCase: false})
      endDate = customLocalDateStringEnd({date: new Date(exhibitionDates.exhibitionEndDate.value), isUpperCase: false})
  }
  if (exhibitionLocation){
    city = simplifyAddressCity(exhibitionLocation)
    mailing = simplifyAddressMailing(exhibitionLocation)
  }

  return (
      <View
        style={exhibitionPreview.container}>
          {userUnviewed &&
          <View style={exhibitionPreview.bellContainer}>
            <SVGs.NewBell />
          </View>
          }
          <TextElement
            style={exhibitionPreview.exhibitionTitle}>
            {exhibitionArtist?.trim() ?? "Group Show"}
          </TextElement>
          <TextElement
            style={exhibitionPreview.artistTitle}>
            {exhibitionTitle?.trim()}
          </TextElement>
          <Surface elevation={1} style={{...exhibitionPreview.heroImageContainer, marginTop: 24}}>
            <DartaImageComponent 
                uri= {exhibitionHeroImage} 
                style={exhibitionPreview.heroImage} 
                resizeMode={FastImage.resizeMode.contain}
                priority={FastImage.priority.high}
                size={"smallImage"}
            />
          </Surface>
          <TextElement
            style={{...exhibitionPreview.exhibitionTitle, marginTop: 24}}>
            {startDate} {' - '} {endDate}
          </TextElement>
          <TextElement style={exhibitionPreview.artistTitle}>
            {`${mailing} ${city}`}
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
