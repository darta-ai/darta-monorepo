import React from 'react';
import CustomMarker from '../Previews/CustomMarker';
import { View } from 'react-native';
import { ExhibitionMapPin } from '@darta-types/dist';

export const MappedPins = React.memo(
    ({ pins, navigation, city, view}: { pins?: ExhibitionMapPin[], navigation: any, city: string, view: string }) => (
      <>
        {pins && pins.map((pin) => {
          let isOpeningUpcoming = false;
          if (pin?.receptionDates?.receptionStartTime?.value && pin?.receptionDates?.receptionEndTime.value) {
            const receptionEndDate = new Date(pin.receptionDates?.receptionEndTime?.value);
            isOpeningUpcoming = (receptionEndDate >= new Date());
          }
          return (
            pin?.exhibitionLocation?.coordinates?.latitude && pin?.exhibitionLocation?.coordinates?.longitude && (
              <View key={`${pin.exhibitionLocation.coordinates.latitude.value}-${pin.exhibitionLocation.coordinates.longitude.value}-${city}-${view}`}>
                <CustomMarker
                  coordinate={{
                    latitude: Number(pin.exhibitionLocation.coordinates.latitude.value),
                    longitude: Number(pin.exhibitionLocation.coordinates.longitude.value)
                  }}
                  isOpeningUpcoming={isOpeningUpcoming}
                  mapPin={pin}
                  navigation={navigation}
                />
              </View>
            )
          );
        })}
      </>
    ),
    (prevProps, nextProps) => {
      return JSON.stringify(prevProps.pins) === JSON.stringify(nextProps.pins);
    }
  );