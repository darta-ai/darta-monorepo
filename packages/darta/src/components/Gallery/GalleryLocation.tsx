/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import {ExhibitionDates, IBusinessLocationData} from '@darta-types';
import * as Colors from '@darta-styles';
import { customLocalDateStringEnd, customLocalDateStringStart, modifyHoursOfOperation, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';
import FastImage from 'react-native-fast-image';
import { Button, Surface } from 'react-native-paper';
import { DartaImageComponent } from '../Images/DartaImageComponent';
import { DartaIconButtonWithText } from '../Darta/DartaIconButtonWithText';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as SVGs from '../../assets/SVGs';
import { mapStylesJson } from '../../utils/mapStylesJson';
import { globalTextStyles } from '../../styles/styles';





const galleryDetailsStyles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 24,
  },
  contactContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 24,
  },
  locationContainer: {
      width: wp('100%'),
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
  },
  hoursContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 13
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  dayOpen: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'DMSans_400Regular',
  },
  hoursOpen: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
    color: Colors.PRIMARY_900,
  },
  dayClosed: {
    fontSize: 16,
    color: Colors.PRIMARY_200,
    fontFamily: 'DMSans_400Regular',
  },
  hoursClosed: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular_Italic',
    color: Colors.PRIMARY_200,
    fontStyle: 'italic'
  },
  mapContainer: {
    height: hp('30%'), 
    width: '100%',
    marginTop: 24,
    marginBottom: 24,
  },
  map: {
    alignSelf: 'stretch', 
    height: '100%' 
  }
})

type GalleryLocationProps = {
  galleryLocationData: IBusinessLocationData,
  galleryName: string,
  openInMaps: (address: string) => void
};


const GalleryLocation = React.memo<GalleryLocationProps>(({
    galleryLocationData,
    galleryName,
    openInMaps
}) => {
  const [mapRegion, setMapRegion] = React.useState<any>({
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    latitude: 0, 
    longitude: 0,
  })

  const [galleryLocation, setGalleryLocation] = React.useState<string>("")
  const [galleryAddress, setGalleryAddress] = React.useState<string>("")
  const [hoursOfOperationArray, setHoursOfOperationArray] = React.useState<{day: string, open: string, close: string}[]>([]);
  const [marker, setMarker] = React.useState<any>({
    latitude: 0,
    longitude: 0,
    galleryName
  })

  const setData = React.useCallback(()=>{
    const latitude = galleryLocationData.coordinates?.latitude.value
    const longitude = galleryLocationData.coordinates?.longitude.value

    const region = {
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
      latitude: latitude, 
      longitude: longitude,
      galleryName
    }
    setMapRegion(region)
    setMarker(region)

    const galleryAddress = galleryLocationData.locationString?.value
    setGalleryLocation(`${simplifyAddressMailing(galleryAddress)} ${simplifyAddressCity(galleryAddress)}`)

    setGalleryAddress(galleryAddress ?? "")


    const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    if (galleryLocationData?.businessHours?.hoursOfOperation){
      const hoursArr = Object.entries(galleryLocationData.businessHours.hoursOfOperation).map(([day, hours]) => ({
        day: day,
        open: modifyHoursOfOperation(hours.open.value),
        close: modifyHoursOfOperation(hours.close.value)
      })).sort((a, b) => {
        return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
      });
      setHoursOfOperationArray(hoursArr)
    }

  }, [galleryLocationData])


  React.useEffect(() => {
    return setData()
  }, [])
  
  return (
      <View
        style={galleryDetailsStyles.container}>
        <View style={galleryDetailsStyles.locationContainer}>
            <DartaIconButtonWithText 
            text={galleryLocation}
            iconComponent={SVGs.BlackPinIcon}
            onPress={() => openInMaps(galleryAddress)}
            />
        </View>
        <View style={galleryDetailsStyles.mapContainer}>
          <MapView  
            provider={PROVIDER_GOOGLE}
            style={galleryDetailsStyles.map}
            region={mapRegion} 
            scrollEnabled={false}
            customMapStyle={mapStylesJson}
            >
              <Marker
                key={marker.latitude}
                coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                description={galleryLocation ?? "Gallery"}
                title={galleryName ?? "Gallery"}
                >
                  <SVGs.GoogleMapsPinIcon />
                </Marker>
            </MapView>
          </View>
          <View style={galleryDetailsStyles.contactContainer}>
          <View>
            <TextElement style={{...globalTextStyles.sectionHeaderTitle, fontSize: 20}}>Hours</TextElement>
          </View>
          {hoursOfOperationArray.length > 0 && (
        <View style={galleryDetailsStyles.hoursContainer}>
          {hoursOfOperationArray.map((day, index) => (
            <View key={`${day.day}-${day.open}-${day.close}-${index}`}>
            {day.open !== "Closed" ?
            (
            <View style={galleryDetailsStyles.hoursRow}>
              <TextElement style={galleryDetailsStyles.dayOpen}>{day.day}</TextElement>
              <TextElement style={galleryDetailsStyles.hoursOpen}>{day.open} - {day.close}</TextElement>
            </View>
            ) : (
            <View style={galleryDetailsStyles.hoursRow}>
              <TextElement style={galleryDetailsStyles.dayClosed}>{day.day}</TextElement>
              <TextElement style={galleryDetailsStyles.hoursClosed}>Closed</TextElement>
            </View>
              )}
            </View>
          ))}
        </View>
        )}
        </View>
      </View>
  );
})

export default GalleryLocation  
