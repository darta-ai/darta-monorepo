import React, {useContext} from 'react';
import {View, StyleSheet} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Location from 'expo-location';

import * as Colors from '@darta-styles';
import { mapStylesJson } from '../../utils/mapStylesJson';
import {StoreContext} from '../../state/Store';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { ExhibitionMapPin, MapPinCities } from '@darta-types';
import CustomMarker from '../../components/Previews/CustomMarker';
import * as SVGs from '../../assets/SVGs';
import { TextElement } from '../../components/Elements/TextElement';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import { Divider } from 'react-native-paper';
import { IconButtonElement } from '../../components/Elements/IconButtonElement';
import { ExploreMapRootEnum } from '../../typing/routes';


const exploreMapStyles = StyleSheet.create({
    container: {
        height: '100%',
        width: wp('100%'),
        backgroundColor: Colors.PRIMARY_100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchContainer:{
      position: 'absolute',
      top: hp('80%'), // Place it at the top
      right: 0, // Align it to the right
      zIndex: 1,
    },
    mapContainer: {
      backgroundColor: 'black',
      height: hp('100%'),
      width: wp('100%'),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
  },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      width: wp('100%'),
      margin: hp('1%'),
      height: hp('5%'),
    }, 
  mapView: {
    alignSelf: 'stretch', 
    height: '90%' 
  },
  bottomSheetContainer: {
    zIndex: 2,
  },
  bottomSheetContentContainer: {
    zIndex: 2,
    alignItems: 'center',
  },
})


export function ExploreMapHomeScreen({
    navigation,
}: {
    navigation?: any;
}) {
  const {state} = useContext(StoreContext);
  
  const [currentLocation] = React.useState<MapPinCities>(MapPinCities.newYork)
  const [mapRegion] = React.useState({
    latitudeDelta: 0.01,
    longitudeDelta: 0.09,
    latitude: 40.709, 
    longitude: -73.990
  })

  const mapRef = React.useRef<MapView>(null);

  React.useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
    })();

  }, [state.mapPins])
  
  
  const handleMarkerPress = React.useCallback((event) => {
    const newRegion = {
      ...mapRegion,
      ...event.nativeEvent.coordinate,
      latitudeDelta: 0.01,  // You might need to adjust these deltas
      longitudeDelta: 0.01,
    };

    const transitionSpeed = mapRegion.latitudeDelta >= 0.01 ? 500 : 250;
  
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, transitionSpeed); // 1000 is the duration of the animation in milliseconds
    }
  }, [mapRegion]);


  const handleModalToggle = React.useCallback(() => {
    navigation.navigate(ExploreMapRootEnum.bottomSheetOptions as never)
  }, [])


  const MappedPins = React.memo(({ pins } : { pins?: ExhibitionMapPin[] }) => (
    pins && pins.map((pin) => (
      pin?.exhibitionLocation?.coordinates?.latitude && pin?.exhibitionLocation?.coordinates?.longitude && (
        <View key={pin?.exhibitionId}>
          <CustomMarker 
            coordinate={{
              latitude: Number(pin.exhibitionLocation.coordinates.latitude.value),
              longitude: Number(pin.exhibitionLocation.coordinates.longitude.value)
            }}
            mapPin={pin}
            navigation={navigation}
          />
        </View>
      )
    ))
  ));


  
  return (
    <View style={exploreMapStyles.container}>
      <View style={exploreMapStyles.mapContainer}>
        <View style={exploreMapStyles.switchContainer}>
          <IconButtonElement 
            inUse={true}
            IconInUse={<SVGs.LayersIcon />}
            IconNotInUse={<SVGs.LayersIcon />}
            onPress={handleModalToggle}
          />
        </View>
        {Object.values(mapRegion).length > 0 && ( 
          <MapView  
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={ exploreMapStyles.mapView }
            region={mapRegion} 
            customMapStyle={mapStylesJson}
            onMarkerPress={handleMarkerPress}
            showsUserLocation={true}
            >
              <MappedPins pins={state.isViewingSaved ? state.mapPinsSaved?.[currentLocation] : state.mapPins?.[currentLocation]} />
            {/* {showSaved && userFollowsPins.length > 0 && <MappedPins pins={userFollowsPins} />}
            {!showSaved && allPins.length > 0 && <MappedPins pins={allPins} />} */}
          </MapView>
        )}
      </View>
    </View>
  );
}
