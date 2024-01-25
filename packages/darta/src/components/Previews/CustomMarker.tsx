import React, { useState } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { View, StyleSheet, Animated } from 'react-native';

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
import { DartaImageComponent } from '../Images/DartaImageComponent';
import { Easing } from 'react-native-reanimated';
import { GoogleMapsPinBlackIcon } from '../../assets/SVGs/GoogleMapsPinBlack';

const customMarker = StyleSheet.create({
  galleryContainer:{
      width: '100%',
      height: 40,
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
  }, 
  subheaderInformation: {
    ...globalTextStyles.subHeaderInformation, 
    fontSize: 22
  }
})


const CustomMarker = React.memo(({ 
  coordinate, 
  mapPin, 
  navigation
} : {
  coordinate: any, 
  mapPin: ExhibitionMapPin, 
  navigation: any
}) => {

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


  const [line1, setLine1] = React.useState<string>("")
  const [line2, setLine2] = React.useState<string>("")
  const [exhibitionTitle, setExhibitionTitle] = React.useState<string>("")
  const [artistName, setArtistName] = React.useState<string>("")
  const [buttonText, setButtonText] = React.useState<string>("View Gallery")


  React.useEffect(() => {
    let hasOpening = false;
    console.log({exhibitionEndDate: mapPin.exhibitionDates?.exhibitionEndDate?.value, exhibitionTitle: mapPin.exhibitionTitle?.value, hasOpening})
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
    setLine1(mapPin.galleryName?.value || "")
    const city = simplifyAddressCity(mapPin.exhibitionLocation?.locationString?.value)
    const address = simplifyAddressMailing(mapPin.exhibitionLocation?.locationString?.value)
    setLine2(`${address} ${city}`|| "")

    setExhibitionTitle(mapPin.exhibitionTitle?.value || "")

    setArtistName(mapPin.exhibitionArtist?.value || "Group Show")
    }, [])

  React.useEffect(() => {
    if (hasUpcomingOpening){
      handleWiggle()
    }
  }, [hasUpcomingOpening])


  const chooseRouteAndNavigate = () => {
    if (hasCurrentShow){
      navigateToExhibitionScreens()
    } else (
      navigateToGalleryScreen()
    )
  }



  const wiggleAnim = React.useRef(new Animated.Value(0)).current; 

  React.useEffect(() => {
    wiggleAnim.addListener(() => {})
  }, [])

  
  const handleWiggle = () => {
    const wiggleSequence = Animated.sequence([
      Animated.timing(wiggleAnim, {
        toValue: 0,  // Rotate slightly right
        duration: 750,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0.25,  // Rotate slightly right
        duration: 500,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0,  // Rotate slightly left
        duration: 500,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: -0.25,  // Rotate slightly left
        duration: 500,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0,  // Rotate slightly left
        duration: 500,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0,  // Rotate slightly left
        duration: 1000,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
    ]);
  
    // Continuous loop of wiggle
    Animated.loop(wiggleSequence).start();
  };

  const rotate = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'], // Reduced angle for subtler effect
  });


  const customMarkerDynamic = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: hasCurrentShow ? 250 : 158,
      width: 315,
      justifyContent: 'flex-start',
      alignItems: 'center',
      padding: 18,
      gap: 20
    },
    wiggleFriend: {
      transform: [{ rotate }]
    } 
  })


  return (
    <Marker
      coordinate={coordinate}
      key={mapPin.exhibitionId}
      onTouchEnd={() => setShowCallout(true)}
    >
      <Animated.View style={customMarkerDynamic.wiggleFriend}>
      {hasUpcomingOpening ?  <GoogleMapsPinIcon/> : <GoogleMapsPinBlackIcon /> }
        {/* <GoogleMapsPinIcon/> */}
      </Animated.View>
      {showCallout && (
        <Callout style={customMarkerDynamic.container} 
        onTouchStart={() => setShowCallout(false)} 
        onPress={() => {chooseRouteAndNavigate()}}>
            <View style={customMarker.galleryContainer} >
                <View style={customMarker.galleryNameContainer}>
                  <TextElement style={customMarker.subheaderInformation}>{line1}</TextElement>
                  <TextElement style={globalTextStyles.paragraphText}>{line2}</TextElement>
                </View>
            </View> 
            {hasCurrentShow && (
            <View style={customMarker.exhibitionContainer}>
                <View style={customMarker.heroImageContainer} >
                  <DartaImageComponent 
                  uri={mapPin?.exhibitionPrimaryImage?.value || ""}
                  priority={FastImage.priority.normal}
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
              <TextElement style={customMarker.buttonTextColor}>{buttonText}</TextElement>
            </Button>
        </Callout>
       
      )}
    </Marker>
  );
})

export default CustomMarker;
