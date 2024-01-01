import React, { useState } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image'
import { TextElement } from '../Elements/TextElement';
import { globalTextStyles } from '../../styles/styles';

import { customLocalDateStringEnd, customLocalDateStringStart, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';

import * as Colors from '@darta-styles';
import { ExhibitionMapPin } from '@darta-types';
import { ExhibitionStoreContext, StoreContext, UIStoreContext, UiETypes } from '../../state';
import { ExploreMapRootEnum } from '../../typing/routes';
import {Button } from 'react-native-paper';
import { GoogleMapsPinIcon, MapPinCircleDotIcon} from '../../assets/SVGs';

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
    gap: 12,
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
    fontSize: 22
  }
})


const CustomMarkerList = React.memo(({ 
  coordinate, 
  mapPin, 
  navigation
} : {
  coordinate: any, 
  mapPin: ExhibitionMapPin, 
  navigation: any
}) => {

  console.log()
  const {exhibitionState} = React.useContext(ExhibitionStoreContext);
  const {uiDispatch} = React.useContext(UIStoreContext);

  const [showCallout, setShowCallout] = useState(true);

  const navigateToExhibitionScreens = async () => {
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
  const [hasCurrentShow, setHasCurrentOpening] = React.useState<boolean>(false)


  const [galleryName, setGalleryName] = React.useState<string>("")
  const [artworkTitle, setArtworkTitle] = React.useState<string>("")
  const [artistName, setArtistName] = React.useState<string>("")
  const [buttonText, setButtonText] = React.useState<string>("View Gallery")
  const [galleryAddress, setGalleryAddress] = React.useState<string>("")
  const [galleryCity, setGalleryCity] = React.useState<string>("")

  React.useEffect(() => {
    let hasOpening = false;
    if (mapPin.exhibitionDates?.exhibitionStartDate.value && mapPin.exhibitionDates?.exhibitionEndDate.value) {
      setStartDate(customLocalDateStringStart({date : new Date(mapPin.exhibitionDates.exhibitionStartDate.value), isUpperCase: false}))
      setEndDate(customLocalDateStringEnd({date : new Date(mapPin.exhibitionDates.exhibitionEndDate.value), isUpperCase: false}))
    }


    if (mapPin.receptionDates?.receptionStartTime?.value && mapPin.receptionDates?.receptionEndTime.value) {
      const receptionEndDate = new Date(mapPin.receptionDates?.receptionEndTime?.value);
      const isOpeningUpcoming = (receptionEndDate >= new Date());
      setHasUpcomingOpening(isOpeningUpcoming);
    }
    if (mapPin.exhibitionDates?.exhibitionDuration && mapPin.exhibitionDates.exhibitionDuration?.value === "Ongoing/Indefinite"){
      setHasCurrentOpening(true)
      setButtonText("View Exhibition")
      hasOpening = true
    } else if (mapPin.exhibitionDates?.exhibitionEndDate?.value){
      const currentOpening = (mapPin.exhibitionDates.exhibitionEndDate.value >= new Date().toISOString())
      setHasCurrentOpening(currentOpening)
      setButtonText(currentOpening ? "View Exhibition" : "View Gallery")
    } 
    setGalleryName(mapPin.galleryName?.value || "")
    console.log({mapPin: mapPin.exhibitionLocation?.locationString?.value})
    const city = simplifyAddressCity(mapPin.exhibitionLocation?.locationString?.value)
    const address = simplifyAddressMailing(mapPin.exhibitionLocation?.locationString?.value)
    setGalleryAddress(address || "")
    setGalleryCity( city|| "")

    setArtworkTitle(mapPin.exhibitionTitle?.value || "")

    setArtistName(mapPin.exhibitionArtist?.value || "Group Show")
    }, [])


  const chooseRouteAndNavigate = () => {
    if (hasCurrentShow){
      navigateToExhibitionScreens()
    } else (
      navigateToGalleryScreen()
    )
  }
  const customMarkerDynamic = StyleSheet.create({
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
  })

  

  return (
    <Marker
      coordinate={coordinate}
      key={mapPin.exhibitionId}
      onTouchStart={() => setShowCallout(true)}
    >
      {hasUpcomingOpening ? <MapPinCircleDotIcon />: <GoogleMapsPinIcon/> }
      {showCallout && (
        <Callout style={customMarkerDynamic.container} 
        onTouchStart={() => setShowCallout(false)} 
        onPress={() => {chooseRouteAndNavigate()}}>
            <View style={customMarker.galleryContainer} >
                <View style={customMarker.galleryNameContainer}>
                  <TextElement style={customMarker.subheaderInformation}>{artistName}</TextElement>
                  <TextElement style={globalTextStyles.paragraphText}>{artworkTitle}</TextElement>
                </View>
            </View> 
            {hasCurrentShow && (
            <View style={customMarker.exhibitionContainer}>
                <View style={customMarker.heroImageContainer} >
                  <FastImage 
                  source={{uri: mapPin?.exhibitionPrimaryImage?.value || ""}} 
                  style={customMarker.heroImage} 
                  resizeMode={FastImage.resizeMode.contain}
                  />
                </View>
              <View style={customMarker.textContainer}>
                <TextElement
                  style={globalTextStyles.subHeaderInformationSize14}>
                  {galleryName}
                </TextElement>
                <View>
                  <TextElement
                    style={globalTextStyles.paragraphTextSize14NoHeight}>
                    {galleryAddress}
                  </TextElement>
                  <TextElement
                    style={globalTextStyles.paragraphTextSize14NoHeight}>
                    {galleryCity}
                  </TextElement>
                </View>
                <TextElement
                  style={globalTextStyles.paragraphTextSize14}>
                  {startDate} {' - '} {endDate}
                </TextElement>
              </View>
            </View>
            )}
              <Button 
                style={customMarker.buttonStyles}
                contentStyle={customMarker.buttonContentStyle}
                onPress={() => {chooseRouteAndNavigate()}}>
              <TextElement style={customMarker.buttonTextColor}>{buttonText}</TextElement>
            </Button>
        </Callout>
       
      )}
    </Marker>
  );
})

export default CustomMarkerList;
