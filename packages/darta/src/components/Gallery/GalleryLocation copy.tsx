/* eslint-disable no-param-reassign */
/* eslint-disable no-return-assign */
import React from 'react';
import {
  StyleSheet,
  View,
  Platform
} from 'react-native';

import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';

import {TextElement} from '../Elements/_index';
import {IBusinessLocationData} from '@darta-types';
import * as Colors from '@darta-styles';
import { modifyHoursOfOperation, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';
import { DartaIconButtonWithText } from '../Darta/DartaIconButtonWithText';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import * as SVGs from '../../assets/SVGs';
import { mapStylesJson } from '../../utils/mapStylesJson';
import { globalTextStyles } from '../../styles/styles';
import { androidMapStyles } from '../../utils/mapStylesJson.android';
import fedHolidays from '@18f/us-federal-holidays';
import { format, toZonedTime } from 'date-fns-tz'
import { EST_TIMEZONE } from '../../utils/constants';


const options = { shiftSaturdayHolidays: true, shiftSundayHolidays: true };

const isAndroid = Platform.OS === 'android';

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
    latitude: 0 as number, 
    longitude: 0 as number,
  })

  const markerRef = React.useRef({
    latitude: 0,
    longitude: 0,
    galleryName
  });

  const [galleryLocation, setGalleryLocation] = React.useState<string>("")
  const [galleryAddress, setGalleryAddress] = React.useState<string>("")
  const [hoursOfOperationArray, setHoursOfOperationArray] = React.useState<{day: string, open: string, close: string}[]>([]);

  const setData = React.useCallback(()=>{
    const latitude = galleryLocationData.coordinates?.latitude.value
    const longitude = galleryLocationData.coordinates?.longitude.value

    const region = {
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
      latitude: Number(latitude), 
      longitude: Number(longitude),
      galleryName
    }
    markerRef.current = region;
    setMapRegion(region)

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

    const currentYear = new Date().getFullYear();
    const holidaysForYear = fedHolidays.allForYear(currentYear, options);

    const today = new Date(); 
    const currentWeekDates = getWeekDates(today);

    if (currentWeekDates.length > 0 && holidaysForYear.length > 0 ) {
      const holidayForWeek = getHolidayForWeek({ weekDates: currentWeekDates, holidaysForYear });
      setHolidayInfo({
        hasHoliday: !!holidayForWeek,
        holidayName: holidayForWeek ? holidayForWeek.name : null
      });
    }

  }, [galleryLocationData, galleryName]);

  const [holidayInfo, setHolidayInfo] = React.useState<{ hasHoliday: boolean, holidayName: string | null }>({
    hasHoliday: false,
    holidayName: null
  });


  const getHoliday = React.useCallback((date: Date, holidays: any): string | null => {
    const zonedDate = toZonedTime(date, EST_TIMEZONE);
    const formattedDate = format(zonedDate, 'yyyy-MM-dd', { timeZone: EST_TIMEZONE });
    const holiday = holidays.find((holiday: any) => holiday.dateString === formattedDate);
    return holiday ? holiday.name : null;
  }, []);

  const getWeekDates = React.useCallback((startDate: Date = new Date(), weekStartsOn: number = 0) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    // Adjust the start date to the beginning of the week
    const day = start.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    start.setDate(start.getDate() - diff);
  
    // Generate an array of 7 dates
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }, []);


  const getHolidayForWeek = React.useCallback(({weekDates, holidaysForYear} : {weekDates : Date[], holidaysForYear : any}): { date: Date; name: string } | null => {
    for (const date of weekDates) {
      const holidayName = getHoliday(date, holidaysForYear);
      if (holidayName) {
        return { date, name: holidayName };
      }
    }
    return null;
  }, []);

  React.useEffect(() => {
    setData();
  }, [galleryLocationData, setData]);

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
            customMapStyle={!isAndroid ? mapStylesJson : androidMapStyles}
            cacheEnabled={true}
            >
              <Marker
                key={markerRef.current.latitude}
                coordinate={{
                  latitude: markerRef.current.latitude,
                  longitude: markerRef.current.longitude
                }}
                title={galleryLocation ?? "Gallery"}
                >
                  <SVGs.NewMapPin />
                </Marker>
            </MapView>
          </View>
          <View style={galleryDetailsStyles.contactContainer}>
          <View>
            <TextElement style={{...globalTextStyles.sectionHeaderTitle, fontSize: 20}}>Hours</TextElement>
          </View>
          {hoursOfOperationArray.length > 0 && (
            <View style={galleryDetailsStyles.hoursContainer}>
              {hoursOfOperationArray.map((day, index) => {
                return (
                  <View key={`${day.day}-${day.open}-${day.close}-${index}`}>
                    {day.open !== "Closed" ? (
                      <View style={galleryDetailsStyles.hoursRow}>
                        <TextElement style={galleryDetailsStyles.dayOpen}>
                          {day.day}
                        </TextElement>
                        <TextElement style={galleryDetailsStyles.hoursOpen}>
                          {day.open} - {day.close}
                        </TextElement>
                      </View>
                    ) : (
                      <View style={galleryDetailsStyles.hoursRow}>
                        <TextElement style={galleryDetailsStyles.dayClosed}>
                          {day.day}
                        </TextElement>
                        <TextElement style={galleryDetailsStyles.hoursClosed}>
                          Closed
                        </TextElement>
                      </View>
                    )}
                  </View>
                );
              })}
                {holidayInfo.hasHoliday && holidayInfo.holidayName && (
                  <View style={{marginTop: 24}}>
                    <TextElement>
                      ⚠️ Hours may vary: {holidayInfo.holidayName}
                    </TextElement>
                  </View>
                )}
            </View>
          )}
        </View>
      </View>
  );
})

export default GalleryLocation  
