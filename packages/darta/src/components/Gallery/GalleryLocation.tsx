import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { format, toZonedTime } from 'date-fns-tz';
import fedHolidays from '@18f/us-federal-holidays';

import { TextElement } from '../Elements/_index';
import { DartaIconButtonWithText } from '../Darta/DartaIconButtonWithText';
import * as SVGs from '../../assets/SVGs';
import * as Colors from '@darta-styles';
import { globalTextStyles } from '../../styles/styles';
import { mapStylesJson } from '../../utils/mapStylesJson';
import { androidMapStyles } from '../../utils/mapStylesJson.android';

import { 
  modifyHoursOfOperation, 
  simplifyAddressCity, 
  simplifyAddressMailing 
} from '../../utils/functions';
import { EST_TIMEZONE } from '../../utils/constants';
import { IBusinessLocationData } from '@darta-types/dist';

const isAndroid = Platform.OS === 'android';
const HOLIDAY_OPTIONS = { shiftSaturdayHolidays: true, shiftSundayHolidays: true };
const DAYS_ORDER = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    width: '100%',
    marginBottom: 24,
  },
  contactContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 24,
  },
  locationContainer: {
    width: wp('100%'),
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 12,
  },
  hoursContainer: {
    width: '100%',
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
    marginVertical: 24,
  },
  map: {
    alignSelf: 'stretch', 
    height: '100%' 
  }
});

type GalleryLocationProps = {
  galleryLocationData: IBusinessLocationData,
  galleryName: string,
  openInMaps: (address: string) => void
};


const GalleryLocation = React.memo<GalleryLocationProps>(({ galleryLocationData, galleryName, openInMaps }) => {
  const [mapRegion, setMapRegion] = useState({
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    latitude: 0,
    longitude: 0,
  });
  const [galleryLocation, setGalleryLocation] = useState("");
  const [galleryAddress, setGalleryAddress] = useState("");
  const [hoursOfOperationArray, setHoursOfOperationArray] = useState<any>([]);
  const [holidayInfo, setHolidayInfo] = useState({ hasHoliday: false, holidayName: null });

  const markerRef = useRef({ latitude: 0, longitude: 0, galleryName });

  const getHoliday = useCallback((date, holidays) => {
    const zonedDate = toZonedTime(date, EST_TIMEZONE);
    const formattedDate = format(zonedDate, 'yyyy-MM-dd', { timeZone: EST_TIMEZONE });
    const holiday = holidays.find(h => h.dateString === formattedDate);
    return holiday ? holiday.name : null;
  }, []);

  const getWeekDates = useCallback((startDate = new Date(), weekStartsOn = 0) => {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const day = start.getDay();
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    start.setDate(start.getDate() - diff);
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }, []);

  const getHolidayForWeek = useCallback(({ weekDates, holidaysForYear }) => {
    for (const date of weekDates) {
      const holidayName = getHoliday(date, holidaysForYear);
      if (holidayName) return { date, name: holidayName };
    }
    return null;
  }, [getHoliday]);

  const setData = useCallback(() => {
    const { latitude, longitude } = galleryLocationData.coordinates || {};
    const region = {
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
      latitude: Number(latitude?.value) || 0,
      longitude: Number(longitude?.value) || 0,
      galleryName
    };
    markerRef.current = region;
    setMapRegion(region);

    const address = galleryLocationData.locationString?.value || "";
    setGalleryLocation(`${simplifyAddressMailing(address)} ${simplifyAddressCity(address)}`);
    setGalleryAddress(address);

    if (galleryLocationData?.businessHours?.hoursOfOperation) {
      const hoursArr = Object.entries(galleryLocationData.businessHours.hoursOfOperation)
        .map(([day, hours]) => ({
          day,
          open: modifyHoursOfOperation(hours.open.value),
          close: modifyHoursOfOperation(hours.close.value)
        }))
        .sort((a, b) => DAYS_ORDER.indexOf(a.day) - DAYS_ORDER.indexOf(b.day));
      setHoursOfOperationArray(hoursArr);
    }

    const currentYear = new Date().getFullYear();
    const holidaysForYear = fedHolidays.allForYear(currentYear, HOLIDAY_OPTIONS);
    const currentWeekDates = getWeekDates(new Date());

    if (currentWeekDates.length > 0 && holidaysForYear.length > 0) {
      const holidayForWeek = getHolidayForWeek({ weekDates: currentWeekDates, holidaysForYear });
      setHolidayInfo({
        hasHoliday: !!holidayForWeek,
        holidayName: holidayForWeek ? holidayForWeek.name : null
      });
    }
  }, [galleryLocationData, galleryName, getWeekDates, getHolidayForWeek]);

  useEffect(() => {
    setData();
  }, [setData]);

  return (
    <View style={styles.container}>
      <View style={styles.locationContainer}>
        <DartaIconButtonWithText 
          text={galleryLocation}
          iconComponent={SVGs.BlackPinIcon}
          onPress={() => openInMaps(galleryAddress)}
        />
      </View>
      <View style={styles.mapContainer}>
        <MapView  
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={mapRegion} 
          scrollEnabled={false}
          customMapStyle={isAndroid ? androidMapStyles : mapStylesJson}
          cacheEnabled={true}
        >
          <Marker
            coordinate={{
              latitude: markerRef.current.latitude,
              longitude: markerRef.current.longitude
            }}
            title={galleryLocation || "Gallery"}
          >
            <SVGs.NewMapPin />
          </Marker>
        </MapView>
      </View>
      <View style={styles.contactContainer}>
        <View>
          <TextElement style={{...globalTextStyles.sectionHeaderTitle, fontSize: 20}}>Hours</TextElement>
        </View>
        {hoursOfOperationArray.length > 0 && (
          <View style={styles.hoursContainer}>
            {hoursOfOperationArray.map((day, index) => (
              <View key={`${day.day}-${day.open}-${day.close}-${index}`} style={styles.hoursRow}>
                <TextElement style={day.open !== "Closed" ? styles.dayOpen : styles.dayClosed}>
                  {day.day}
                </TextElement>
                <TextElement style={day.open !== "Closed" ? styles.hoursOpen : styles.hoursClosed}>
                  {day.open !== "Closed" ? `${day.open} - ${day.close}` : "Closed"}
                </TextElement>
              </View>
            ))}
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
});

export default GalleryLocation;