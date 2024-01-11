import React from 'react';
import {View, StyleSheet } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as Colors from '@darta-styles';
import { mapStylesJson } from '../../utils/mapStylesJson';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { ExhibitionMapPin } from '@darta-types';
import CustomMarkerList from '../../components/Previews/CustomMarkerList';


const exploreMapStyles = StyleSheet.create({
    container: {
        height: hp('75%'),
        width: wp('100%'),
        backgroundColor: Colors.PRIMARY_100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textContainer: {
      height: '100%',
      width: wp('100%'),
      backgroundColor: Colors.PRIMARY_100,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
  },
    textHeader:{
      color: Colors.PRIMARY_950,
      fontSize: 20,
      marginBottom: 24,
      fontFamily: 'DMSans_400Regular',
    },
    text:{
      color: Colors.PRIMARY_950,
      fontSize: 14,
      marginBottom: 24,
      fontFamily: 'DMSans_400Regular',
    },
    mapContainer: {
      height: hp('100%'),
      width: wp('100%'),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  },
  mapView: {
    alignSelf: 'stretch', 
    height: '100%' 
  }
})


export function ListMapComponent({
    navigation,
    showPins,
    exhibitionPins,
}: {
    navigation?: any;
    showPins: boolean
    exhibitionPins: {[key: string] :any}
}) {

    const initialMapRegion = React.useMemo(() => ({
        latitudeDelta: 0.01,
        longitudeDelta: 0.06,
        latitude: 40.719, 
        longitude: -73.990
      }), []);
  const [mapRegion, setMapRegion] = React.useState<any>(initialMapRegion)

  const handleMarkerPress = React.useCallback((event) => {
    setMapRegion({
      ...mapRegion,
      ...event.nativeEvent.coordinate,
    });
  }, [mapRegion]);
  
  const handleRegionChangeComplete = React.useCallback((event) => {
    setMapRegion(event);
  }, []);
  
  return (
      <View style={exploreMapStyles.container}>
        <View style={exploreMapStyles.mapContainer}>
          {mapRegion && showPins && (
            <MapView  
                cacheEnabled={true}
                followsUserLocation={true}
                userLocationPriority={'balanced'}
                initialRegion={initialMapRegion}
                provider={PROVIDER_GOOGLE}
                style={ exploreMapStyles.mapView }
                region={mapRegion} 
                customMapStyle={mapStylesJson}
                onMarkerPress={handleMarkerPress}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={true}
                >
                {showPins && Object.values(exhibitionPins).map((pin: ExhibitionMapPin) => {
                  if(pin?.exhibitionLocation?.coordinates?.latitude 
                    && pin?.exhibitionLocation?.coordinates?.longitude){
                      return (
                      <View key={pin?.exhibitionTitle.value}>
                        <CustomMarkerList 
                          coordinate={{latitude: Number(pin.exhibitionLocation.coordinates.latitude.value), longitude: Number(pin.exhibitionLocation.coordinates.longitude.value)}}
                          mapPin={pin}
                          navigation={navigation}
                        />
                      </View>
                    )
                  } 
                })}
            </MapView>
          )}
        </View>
      </View>
    );
}