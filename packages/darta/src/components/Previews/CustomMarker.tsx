import React, { useState } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image'
import { TextElement } from '../Elements/TextElement';
import { globalTextStyles } from '../../styles/styles';

import { customLocalDateStringEnd, customLocalDateStringStart, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';

import * as Colors from '@darta-styles';
import { ExhibitionMapPin } from '@darta-types';
import { ETypes, StoreContext } from '../../state/Store';
import { ExploreMapRootEnum } from '../../typing/routes';
import {Button } from 'react-native-paper';
import { GoogleMapsPinIcon } from '../../assets/SVGs';


const CustomMarker = ({ 
  coordinate, 
  mapPin, 
  navigation
} : {
  coordinate: any, 
  mapPin: ExhibitionMapPin, 
  navigation: any
}) => {

  const {state, dispatch} = React.useContext(StoreContext);
  const [showCallout, setShowCallout] = useState(true);

  const navigateToExhibitionScreens = async () => {
    if (!mapPin.exhibitionId || !mapPin.galleryId){
      return
    }
    if (state.exhibitionData && state.exhibitionData[mapPin.exhibitionId]){
      const exhibition = state.exhibitionData[mapPin.exhibitionId]
      dispatch({
        type: ETypes.setCurrentHeader,
        currentExhibitionHeader: exhibition.exhibitionTitle.value!,
      })
    }
    navigation.navigate(ExploreMapRootEnum.TopTabExhibition, {galleryId: mapPin.galleryId, exhibitionId: mapPin._id, internalAppRoute: true});
  }

  const navigateToGalleryScreen = async () => {
    if (!mapPin.galleryId){
      return
    }
    navigation.navigate(ExploreMapRootEnum.exploreMapGallery, {galleryId: mapPin.galleryId});
  }

  const [startDate, setStartDate] = React.useState<string>()
  const [endDate, setEndDate] = React.useState<string>()
  const [hasUpcomingOpening, setHasUpcomingOpening] = React.useState<boolean>(false)
  const [openingEnd, setOpeningEnd] = React.useState<string>()
  const [hasCurrentShow, setHasCurrentOpening] = React.useState<boolean>(false)


  const [line1, setLine1] = React.useState<string>("")
  const [line2, setLine2] = React.useState<string>("")
  const [exhibitionTitle, setExhibitionTitle] = React.useState<string>("")
  const [artistName, setArtistName] = React.useState<string>("")

  React.useEffect(() => {
    let hasOpening = false;
    if (mapPin.exhibitionDates?.exhibitionStartDate.value && mapPin.exhibitionDates?.exhibitionEndDate.value) {
      setStartDate(customLocalDateStringStart({date : new Date(mapPin.exhibitionDates.exhibitionStartDate.value), isUpperCase: false}))
      setEndDate(customLocalDateStringEnd({date : new Date(mapPin.exhibitionDates.exhibitionEndDate.value), isUpperCase: false}))
    }


    if (mapPin.receptionDates?.receptionStartTime.value && mapPin.receptionDates?.receptionEndTime.value) {
      const endDateOpening = new Date(mapPin.receptionDates.receptionEndTime.value);
      setHasUpcomingOpening(endDateOpening >= new Date());
      if(hasUpcomingOpening){
        setOpeningEnd(customLocalDateStringStart({date: endDateOpening, isUpperCase: false}))
      }
    }
    if (mapPin.exhibitionDates?.exhibitionDuration && mapPin.exhibitionDates.exhibitionDuration?.value === "Ongoing/Indefinite"){
      setHasCurrentOpening(true)
      hasOpening = true
    } else if (mapPin.exhibitionDates?.exhibitionEndDate?.value){
      setHasCurrentOpening(mapPin.exhibitionDates.exhibitionEndDate.value >= new Date().toISOString())
    } 
    setLine1(mapPin.galleryName?.value || "")
    const city = simplifyAddressCity(mapPin.exhibitionLocation?.locationString?.value)
    const address = simplifyAddressMailing(mapPin.exhibitionLocation?.locationString?.value)
    setLine2(`${address} ${city}`|| "")

    setExhibitionTitle(mapPin.exhibitionTitle?.value || "")

    setArtistName(mapPin.exhibitionArtist?.value || "Group Show")
    }, [])


  const chooseRouteAndNavigate = () => {
    if (hasCurrentShow){
      navigateToExhibitionScreens()
    } else (
      navigateToGalleryScreen()
    )
  }
  const customMarker = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: hasCurrentShow ? 281 : 158,
      width: 315,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 24,
      gap: 20
    },
    galleryContainer:{
        width: '100%',
        height: 50,
        display:'flex',
        flexDirection: "row",
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        gap: 4
    },
    galleryNameContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    exhibitionContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: 100,
      width: '100%',
      gap: 16,
      justifyContent: 'space-around',
      alignItems: 'center',
      
    },
    heroImageContainer: {
      height: 100,
      width: '40%',
      display:'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroImage: {
      width: '100%',
      height: '100%',
    },
    textContainer:{
      width: '60%',
      height: 100,
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "center",
    }, 
    buttonStyles: {
      width: 265,
      height: 38,
      backgroundColor: Colors.PRIMARY_950,
      alignSelf: "center",
    },
    buttonContentStyle: {
      justifyContent: "center",
      alignItems: "center",
      padding: 0, // Or any other desired padding
    },
    buttonTextColor: {
      color: Colors.PRIMARY_50,
      fontSize: 14,
      fontFamily: "DMSans_700Bold",
    }
  })


  return (
    <Marker
      coordinate={coordinate}
      key={mapPin.exhibitionId}
      onTouchStart={() => setShowCallout(true)}
      pinColor={hasUpcomingOpening ? Colors.ADOBE_500 : Colors.PRIMARY_800}
    >
      <GoogleMapsPinIcon /> 
      {showCallout && (
        <Callout style={customMarker.container} 
        onTouchStart={() => setShowCallout(false)} 
        onPress={() => {chooseRouteAndNavigate()}}>
            <View style={customMarker.galleryContainer} >
                <View style={customMarker.galleryNameContainer}>
                  <TextElement style={{...globalTextStyles.subHeaderInformation, fontSize: 22}}>{line1}</TextElement>
                  <TextElement style={globalTextStyles.paragraphText}>{line2}</TextElement>
                </View>
            </View> 
            {hasCurrentShow && (
            <View style={customMarker.exhibitionContainer}>
                <View style={customMarker.heroImageContainer} >
                  <FastImage 
                  source={{uri: mapPin.exhibitionPrimaryImage.value || ""}} 
                  style={customMarker.heroImage} 
                  resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              <View style={customMarker.textContainer}>
                <TextElement
                  style={globalTextStyles.subHeaderInformationSize14}>
                  {exhibitionTitle}
                </TextElement>
                <TextElement
                  style={globalTextStyles.paragraphTextSize14}>
                  {startDate} {' - '} {endDate}
                </TextElement>
                <TextElement style={globalTextStyles.paragraphTextSize14}>{artistName}</TextElement>
              </View>
            </View>
            )}
              <Button 
                style={customMarker.buttonStyles}
                contentStyle={customMarker.buttonContentStyle}
                onPress={() => {chooseRouteAndNavigate()}}>
              <TextElement style={customMarker.buttonTextColor}>{hasCurrentShow ? "View Exhibition" : "View Gallery"}</TextElement>
            </Button>
        </Callout>
       
      )}
    </Marker>
  );
};

export default CustomMarker;
