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
import { ETypes, StoreContext } from '../../state/Store';
import { ExploreMapRootEnum } from '../../typing/routes';


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
  const [showCallout, setShowCallout] = useState(false);

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
    navigation.navigate(ExploreMapRootEnum.TopTabExhibition, {galleryId: mapPin.galleryId, exhibitionId: mapPin.exhibitionId, internalAppRoute: true});
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

  React.useEffect(() => {
    if (mapPin.exhibitionDates?.exhibitionStartDate.value && mapPin.exhibitionDates?.exhibitionEndDate.value) {
      setStartDate(customDateString(new Date(mapPin.exhibitionDates.exhibitionStartDate.value)))
      setEndDate(customDateString(new Date(mapPin.exhibitionDates.exhibitionEndDate.value)))
    }


    if (mapPin.receptionDates?.receptionStartTime.value && mapPin.receptionDates?.receptionEndTime.value) {
      const endDateOpening = new Date(mapPin.receptionDates.receptionEndTime.value);
      setHasUpcomingOpening(endDateOpening >= new Date());
      if(hasUpcomingOpening){
        setOpeningEnd(customLocalDateString(endDateOpening))
      }
    }
    if (mapPin.exhibitionDates.exhibitionDuration && mapPin.exhibitionDates.exhibitionDuration.value === "Ongoing/Indefinite"){
      setHasCurrentOpening(true)
    } else if (mapPin.exhibitionDates?.exhibitionEndDate?.value){
      setHasCurrentOpening(mapPin.exhibitionDates.exhibitionEndDate.value >= new Date().toISOString())
    } 

    }, [])


  const chooseRouteAndNavigate = () => {
    if (hasCurrentShow){
      navigateToExhibitionScreens()
    } else (
      navigateToGalleryScreen()
    )
  }
    
  const exhibitionPreview = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: hasCurrentShow ? 225 : 100,
      width: 300,
      justifyContent: 'space-around',
      alignItems: 'center',
      borderColor: Colors.PRIMARY_700,
    },
    galleryContainer:{
        height: 50,
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
        height: 150,
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
    learnMoreContainer: {
      width: '100%', 
      height: 20, 
      alignItems: "center"
    }
  })


  return (
    <Marker
      coordinate={coordinate}
      key={mapPin.exhibitionId}
      onPress={() => setShowCallout(true)}
      pinColor={hasUpcomingOpening ? Colors.ADOBE_500 : Colors.PRIMARY_800}
    >
      {showCallout && (
        <Callout style={exhibitionPreview.container} 
        onTouchStart={() => setShowCallout(false)} 
        onPress={() => {chooseRouteAndNavigate()}}>
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
            {hasCurrentShow && (
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
            )}
            {hasUpcomingOpening && (
            <View style={{width: '100%', height: '15%', alignItems: "center"}}>
                <View>
                    <TextElement
                        style={{...globalTextStyles.baseText, fontWeight: "bold", color: Colors.PRIMARY_900, fontSize: 12}}>
                        {"Opening: "}{openingEnd}
                    </TextElement>
                </View>
            </View>
            )}
            <View style={exhibitionPreview.learnMoreContainer}>
              <TextElement
                  style={{...globalTextStyles.baseText, fontWeight: "bold", color: Colors.PRIMARY_900, fontSize: 12}}>
                  Tap to view
              </TextElement>
            </View>
        </Callout>
      )}
    </Marker>
  );
};

export default CustomMarker;
