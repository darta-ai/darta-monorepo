import React, { useState } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { Image, View, StyleSheet } from 'react-native';
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

import FastImage from 'react-native-fast-image'
import { TextElement, TextElementOneLine } from '../Elements/TextElement';
import { globalTextStyles } from '../../styles/styles';

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
  const [line3, setLine3] = React.useState<string>("")


  React.useEffect(() => {
    let hasOpening = false;
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
      hasOpening = true
    } else if (mapPin.exhibitionDates?.exhibitionEndDate?.value){
      setHasCurrentOpening(mapPin.exhibitionDates.exhibitionEndDate.value >= new Date().toISOString())
    } 
    const hasCurrentOpening = mapPin.exhibitionDates.exhibitionEndDate.value && mapPin.exhibitionDates.exhibitionEndDate.value >= new Date().toISOString()
    const hasOngoingOpening = mapPin.exhibitionDates?.exhibitionDuration?.value === "Ongoing/Indefinite";

    if (hasCurrentOpening || hasOngoingOpening){
      setLine1(mapPin.exhibitionArtist?.value || "")
      setLine2(mapPin.exhibitionTitle?.value || "")
      setLine3(simplifyAddress(mapPin.exhibitionLocation?.locationString?.value) ?? "")
    } else {
      setLine1(mapPin.galleryName.value || "")
      setLine2(simplifyAddress(mapPin.exhibitionLocation?.locationString?.value) ?? "")
    }

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
      height: hasCurrentShow ? hp('30%') : hp('5%'),
      width: 300,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    galleryContainer:{
        width: '100%',
        display:'flex',
        height: hasCurrentShow ? hp('5%') : '100%',
        flexDirection: "row",
        gap: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        margin: hp('1%'),
    },
    galleryNameContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
    },
    exhibitionContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: hp('22%'),
      width: '100%',
      marginTop: hp('3%'),
      gap: wp('1%'),
      justifyContent: 'space-around',
      alignItems: 'center',
      
    },
    heroImageContainer: {
      height: hp('15%'),
      width: '100%',
      display:'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroImage: {
      width: '100%',
      height: '100%',
      resizeMode: 'contain',
    },
    textContainer:{
      width: '100%',
      height: hp('5%'),
      display: "flex",
      flexDirection: "column",
      alignContent: "center",
      justifyContent: "space-around",

    }
  })


  return (
    <Marker
      coordinate={coordinate}
      key={mapPin.exhibitionId}
      onTouchStart={() => setShowCallout(true)}
      pinColor={hasUpcomingOpening ? Colors.ADOBE_500 : Colors.PRIMARY_800}
    >
      {showCallout && (
        <Callout style={customMarker.container} 
        onTouchStart={() => setShowCallout(false)} 
        onPress={() => {chooseRouteAndNavigate()}}>
            <View style={customMarker.galleryContainer} >
                <FastImage
                    source={{uri: mapPin.galleryLogo.value || ""}}
                    style={{width: hp('5%'), maxHeight: hp('5%'), height: '100%'}}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={customMarker.galleryNameContainer}>
                  <TextElement style={{...globalTextStyles.centeredText, fontWeight: 'bold', color: Colors.PRIMARY_900, fontSize: 15}}>{line1}</TextElement>
                  <TextElement style={{...globalTextStyles.centeredText, color: Colors.PRIMARY_900, fontSize: 14}}>{line2}</TextElement>
                </View>
            </View> 
            {hasCurrentShow && (
            <View style={customMarker.exhibitionContainer}>
                <View style={customMarker.heroImageContainer} >
                  <FastImage 
                  source={{uri: mapPin.exhibitionPrimaryImage.value || ""}} 
                  style={customMarker.heroImage} 
                  />
                </View>
              <View style={customMarker.textContainer}>
                <TextElement
                  style={{...globalTextStyles.centeredText, color: Colors.PRIMARY_900, fontSize: 12}}>
                  {' '}
                  {startDate} {' - '} {endDate}
                </TextElement>
                <TextElement style={{...globalTextStyles.centeredText, color: Colors.PRIMARY_900, fontSize: 12}}>{line3}</TextElement>
              </View>
                <TextElement
                style={{...globalTextStyles.centeredText, fontSize: 10}}>
                {' '}
                tap to view
              </TextElement>
            </View>
            )}
        </Callout>
       
      )}
    </Marker>
  );
};

export default CustomMarker;
