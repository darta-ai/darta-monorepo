import React, { useState } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { Image, View, StyleSheet, TouchableOpacity } from 'react-native';
import {
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';

import { TextElement } from '../Elements/TextElement';
import { globalTextStyles } from '../../styles/styles';
import { Button, Divider } from 'react-native-paper';

import { simplifyAddress } from '../../utils/functions';

import * as Colors from '@darta-styles';
import { ExhibitionMapPin } from '@darta-types';
import { customDateString, customLocalDateString } from '../../utils/functions';


const exhibitionPreview = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: 225,
      width: 300,
      gap: 25,
      justifyContent: 'space-around',
      alignItems: 'center',
      borderColor: Colors.PRIMARY_700,
    },
    galleryContainer:{
        height: '30%',
        width: '95%',
        display:'flex',
        flexDirection: "row",
        gap: 10,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',

    },
    galleryNameContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    exhibitionContainer:{
        height: '60%',
        width: '95%',
        display:'flex',
        flexDirection: "row",
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImageContainer: {
      height: '100%',
      width: '35%',
      marginLeft: wp('1%'),
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    }, 
    textContainer:{
      width: '60%',
      height: '100%',
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "space-around",

    },
    galleryIcon: {
      position: 'absolute',  
      top: 2,                
      right: 2,              
      borderRadius: 20,
    },
    divider: {
        width: '60%',
        alignSelf: 'center',
        color: Colors.PRIMARY_950
    },
  })


const CustomMarker = ({ 
  coordinate, 
  mapPin, 
  setUpperLevelExhibition, 
  setUpperLevelGallery,
  setUpperLevelShowCallout
} : {
  coordinate: any, 
  mapPin: ExhibitionMapPin, 
  setUpperLevelExhibition: (id: string) => void
  setUpperLevelGallery: (id: string) => void
  setUpperLevelShowCallout: (bool: boolean) => void
}) => {
  const [showCallout, setShowCallout] = useState(false);

  const handleSetShowCallout = (val: boolean) => {
    switch(val){
      case true:
        setUpperLevelShowCallout(true)
        setShowCallout(true)
        break;
      case false:
        setUpperLevelShowCallout(false)
        setShowCallout(false)
        break;
    }
  }

  let startDate = ""
  let endDate = "";

  if (mapPin.exhibitionDates?.exhibitionStartDate.value && mapPin.exhibitionDates?.exhibitionEndDate.value) {
      startDate = customDateString(new Date(mapPin.exhibitionDates.exhibitionStartDate.value))
      endDate = customDateString(new Date(mapPin.exhibitionDates.exhibitionEndDate.value))
  }

  const date = new Date();
  let hasUpcomingOpening = false


  let openingEnd = "";

  if (mapPin.receptionDates?.receptionStartTime.value && mapPin.receptionDates?.receptionEndTime.value) {
    const startDateOpening = new Date(mapPin.receptionDates?.receptionStartTime.value);
    const endDateOpening = new Date(mapPin.receptionDates.receptionEndTime.value);
    hasUpcomingOpening = endDateOpening >= date;
    if(hasUpcomingOpening){
      openingEnd = customLocalDateString(endDateOpening);
    }
  }

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => {
        handleSetShowCallout(true)
        setUpperLevelExhibition(mapPin.exhibitionId)
        setUpperLevelGallery(mapPin.galleryId)
      }}
      key={mapPin.exhibitionId}
      
      pinColor={hasUpcomingOpening ? Colors.ADOBE_500 : Colors.PRIMARY_800}
    >
      {showCallout && (
        <Callout style={exhibitionPreview.container} onPress={() => handleSetShowCallout(false)}>
            <View style={exhibitionPreview.galleryContainer} >
                <Image
                    source={{uri: mapPin.galleryLogo.value || ""}}
                    style={{width: 30, height: 30, resizeMode: 'contain'}}
                />
                <View style={exhibitionPreview.galleryNameContainer}>
                  <TextElement style={{...globalTextStyles.centeredText, fontWeight: 'bold', color: Colors.PRIMARY_900, fontSize: 15}}>{mapPin.galleryName.value}</TextElement>
                  <TextElement style={{...globalTextStyles.centeredText, color: Colors.PRIMARY_900, fontSize: 14}}>{simplifyAddress(mapPin.exhibitionLocation.locationString?.value)}</TextElement>
                </View>
            </View>
            <View style={exhibitionPreview.exhibitionContainer}>
                <View style={exhibitionPreview.heroImageContainer} >
                    <Image 
                        source={{uri: mapPin?.exhibitionPrimaryImage.value || ""}} 
                        style={exhibitionPreview.heroImage} 
                    />
                </View>
                <View style={exhibitionPreview.textContainer}>
                    <View>
                    <TextElement
                        style={{color: Colors.PRIMARY_900, fontSize: 14}}>
                            {mapPin.exhibitionArtist?.value || "Group Show"}
                    </TextElement>
                    <TextElement
                        style={{fontStyle: 'italic', color: Colors.PRIMARY_900, fontSize: 12}}>
                        {mapPin.exhibitionTitle.value}
                    </TextElement>
                    </View>
                    <TextElement
                        style={{...globalTextStyles.baseText, color: Colors.PRIMARY_900, fontSize: 12}}>
                        {startDate} {' - '} {endDate}
                    </TextElement>
                </View>
            </View>
            <View style={{width: '100%', height: '15%', alignItems: "center"}}>
            {hasUpcomingOpening && (
                <View>
                    <TextElement
                        style={{...globalTextStyles.baseText, fontWeight: "bold", color: Colors.PRIMARY_900, fontSize: 12}}>
                        {"Opening: "}{openingEnd}
                    </TextElement>
                </View>
            )}
            </View>
        </Callout>
      )}
    </Marker>
  );
};

export default CustomMarker;
