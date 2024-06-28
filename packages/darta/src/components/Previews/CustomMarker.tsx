import React, { useState } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet, Animated, ActivityIndicator } from 'react-native';

import { TextElement } from '../Elements/TextElement';
import { globalTextStyles } from '../../styles/styles';

import { customLocalDateStringEndShort, customLocalDateStringStartShort, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';

import * as Colors from '@darta-styles';
import { ExhibitionMapPin } from '@darta-types';
import { ExhibitionStoreContext, UIStoreContext, UiETypes } from '../../state';
import { ExploreMapRootEnum } from '../../typing/routes';
import {Button } from 'react-native-paper';
import { NewMapPin, NewMapPinRed } from '../../assets/SVGs';
import { Easing } from 'react-native-reanimated';
import { Image } from 'expo-image';

const customMarker = StyleSheet.create({
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
    gap: 4,
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
  }, 
  subheaderInformation: {
    ...globalTextStyles.subHeaderInformation, 
    fontSize: 20,
  },
  activityIndicator: {
    position: 'absolute',
  },
})


const CustomMarker = React.memo(({ 
  coordinate, 
  mapPin, 
  navigation,
  isOpeningUpcoming,
} : {
  coordinate: any, 
  mapPin: ExhibitionMapPin, 
  navigation: any,
  isOpeningUpcoming: boolean,
}) => {

  const {exhibitionState} = React.useContext(ExhibitionStoreContext);
  const {uiDispatch} = React.useContext(UIStoreContext);

  const [showCallout, setShowCallout] = useState(true);

  const navigateToExhibitionScreens = React.useCallback(async () => {
    if (!mapPin.exhibitionId || !mapPin.galleryId){
      return
    }
    if (exhibitionState.exhibitionData && exhibitionState.exhibitionData[mapPin.exhibitionId]){
      const exhibition = exhibitionState.exhibitionData[mapPin.exhibitionId]
      uiDispatch({
        type: UiETypes.setCurrentHeader,
        currentExhibitionHeader: exhibition.exhibitionTitle.value!,
      })
    }
    navigation.navigate(ExploreMapRootEnum.TopTabExhibition, {galleryId: mapPin.galleryId, exhibitionId: mapPin._id, internalAppRoute: true});
  }, [mapPin.exhibitionId, mapPin.galleryId, exhibitionState.exhibitionData])

  const navigateToGalleryScreen = React.useCallback(async () => {
    if (!mapPin.galleryId){
      return
    }
    navigation.navigate(ExploreMapRootEnum.exploreMapGallery, {galleryId: mapPin.galleryId});
  }, [mapPin.galleryId] )


  const [markerData, setMarkerData] = React.useState({
    startDate: '',
    endDate: '',
    hasUpcomingOpening: isOpeningUpcoming,
    hasCurrentShow: false,
    line1: '',
    line2: '',
    exhibitionTitle: '',
    artistName: '',
    buttonText: 'View Gallery',
  });


  React.useEffect(() => {
    let hasOpening = false;
    let startDate = '';
    let endDate = '';
    let hasUpcomingOpening = isOpeningUpcoming;
    let hasCurrentOpening = false;
    let line1 = mapPin.galleryName?.value || '';
    let line2 = '';
    let exhibitionTitle = '';
    let artistName = '';
    let buttonText = 'View Gallery';
  
    if (mapPin.exhibitionDates?.exhibitionStartDate.value && mapPin.exhibitionDates?.exhibitionEndDate.value) {
      startDate = customLocalDateStringStartShort({
        date: new Date(mapPin.exhibitionDates.exhibitionStartDate.value),
        isUpperCase: false,
      });
      endDate = customLocalDateStringEndShort({
        date: new Date(mapPin.exhibitionDates.exhibitionEndDate.value),
        isUpperCase: false,
      });
    }
  
    if (mapPin.receptionDates?.receptionStartTime?.value && mapPin.receptionDates?.receptionEndTime.value) {
      const receptionEndDate = new Date(mapPin.receptionDates?.receptionEndTime?.value);
      hasUpcomingOpening = receptionEndDate >= new Date();
    }
  
    if (mapPin.exhibitionDates?.exhibitionDuration && mapPin.exhibitionDates.exhibitionDuration?.value === 'Ongoing/Indefinite') {
      hasCurrentOpening = true;
      buttonText = 'View Exhibition';
      hasOpening = true;
    } else if (mapPin.exhibitionDates?.exhibitionEndDate?.value) {
      hasCurrentOpening = mapPin.exhibitionDates.exhibitionEndDate.value >= new Date().toISOString();
      buttonText = hasCurrentOpening ? 'View Exhibition' : 'View Gallery';
    }
  
    const address = simplifyAddressMailing(mapPin.exhibitionLocation?.locationString?.value);
    const city = simplifyAddressCity(mapPin.exhibitionLocation?.locationString?.value);
    line2 = `${address} ${city}` || '';
  
    exhibitionTitle = mapPin.exhibitionTitle?.value || '';
    artistName = mapPin.exhibitionArtist?.value || 'Group Show';
  
    setMarkerData({
      startDate,
      endDate,
      hasUpcomingOpening,
      hasCurrentShow: hasCurrentOpening,
      line1,
      line2,
      exhibitionTitle,
      artistName,
      buttonText,
    });
  }, [mapPin]);



  const chooseRouteAndNavigate = () => {
    if (markerData.hasCurrentShow){
      navigateToExhibitionScreens()
    } else (
      navigateToGalleryScreen()
    )
  }

  const customMarkerDynamic = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: markerData.hasCurrentShow ? 260 : 158,
      width: 315,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 18,
      gap: 20
    },
  })

  const [isLoading, setIsLoading] = React.useState(true);

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  const handleError = (error: any) => {
    // console.log('Image load error:', error);
    setIsLoading(false);
  };

  return (
    <Marker
      coordinate={coordinate}
      onPress={() => setShowCallout(true)}
      tracksViewChanges={false}
    >
      {markerData.hasUpcomingOpening ?  <NewMapPinRed/> : <NewMapPin /> }
      {showCallout && (
        <Callout style={customMarkerDynamic.container} 
        onTouchStart={() => setShowCallout(false)} 
        onPress={chooseRouteAndNavigate}>
            <View style={customMarker.galleryContainer} >
                <View style={customMarker.galleryNameContainer}>
                  <TextElement style={customMarker.subheaderInformation}>{markerData.line1}</TextElement>
                  <TextElement style={globalTextStyles.paragraphText}>{markerData.line2}</TextElement>
                </View>
            </View> 
            {markerData.hasCurrentShow && (
            <View style={customMarker.exhibitionContainer}>
                <View style={customMarker.heroImageContainer} >
                  <Image 
                  source={mapPin?.exhibitionPrimaryImage?.mediumImage?.value ?? mapPin?.exhibitionPrimaryImage.value}
                  priority={"normal"}
                  contentFit='contain'
                  style={customMarker.heroImage} 
                  onLoadStart={handleLoadStart}
                  onLoadEnd={handleLoadEnd}
                  onError={handleError}
                  />
                  {isLoading && (
                    <ActivityIndicator
                      style={customMarker.activityIndicator}
                      size="small"
                      color={Colors.PRIMARY_950}
                    />
                  )}
                </View>
              <View style={customMarker.textContainer}>
                <TextElement
                  style={globalTextStyles.subHeaderInformationSize14}>
                  {markerData.exhibitionTitle?.trim()}
                </TextElement>
                <TextElement
                  style={globalTextStyles.paragraphTextSize14}>
                  {markerData.startDate} {' - '} {markerData.endDate}
                </TextElement>
                <TextElement style={globalTextStyles.paragraphTextSize14}>{markerData.artistName?.trim()}</TextElement>
              </View>
            </View>
            )}
              <Button 
                style={customMarker.buttonStyles}
                contentStyle={customMarker.buttonContentStyle}
                onPress={() => {chooseRouteAndNavigate()}}>
              <TextElement style={customMarker.buttonTextColor}>{markerData.buttonText}</TextElement>
            </Button>
        </Callout>
       
      )}
    </Marker>
  );
})

export default CustomMarker;
