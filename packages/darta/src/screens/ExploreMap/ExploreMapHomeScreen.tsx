import React from 'react';
import {View, StyleSheet, Alert, Platform} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Location from 'expo-location';

import * as Colors from '@darta-styles';
import { StoreContext, currentlyViewingMapView } from '../../state/Store';
import MapView, { LatLng, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { MapPinCities } from '@darta-types';
import * as SVGs from '../../assets/SVGs';
import { IconButtonElement } from '../../components/Elements/IconButtonElement';
import { ExploreMapRootEnum } from '../../typing/routes';
import { FilterBanner } from '../../components/Maps/MapFilterBanner';
import { mapStylesJson } from '../../utils/mapStylesJson';
import { androidMapStyles } from '../../utils/mapStylesJson.android';
import { MappedPins } from '../../components/Maps/MapPins';


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
    top: hp('12.5%'), // Place it at the top
    left: 0, // Align it to the right
    zIndex: 1,
  },
  layersContainer:{
    position: 'absolute',
    bottom: hp('10%'), 
    right: 0, 
    marginRight: 16,
    marginBottom: 16,
    shadowColor: Colors.PRIMARY_950,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,

    zIndex: 1,
    gap: 6,
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
  height: '100%' 
},
bottomSheetContainer: {
  zIndex: 2,
},
bottomSheetContentContainer: {
  zIndex: 2,
  alignItems: 'center',
},
});

function ExploreMapHomeScreen({
    navigation,
}: {
    navigation?: any;
}) {

  const {state} = React.useContext(StoreContext);

  const isAndroid = Platform.OS === 'android';

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
  
  const handleMarkerPress = React.useCallback((event : any) => {
    let { latitude, longitude } = event.nativeEvent.coordinate;
    const newRegion = {
      ...mapRegion,
      latitude: Number(latitude) + 0.0025,
      longitude: Number(longitude),
      latitudeDelta: 0.01,  // You might need to adjust these deltas
      longitudeDelta: 0.01,
    };

    const transitionSpeed = mapRegion.latitudeDelta >= 0.01 ? 500 : 250;
  
    if (mapRef.current) {
      mapRef.current.animateToRegion(newRegion, transitionSpeed); // 1000 is the duration of the animation in milliseconds
    }
  }, []);

  const handleModalToggle = async () => {
    navigation.navigate(ExploreMapRootEnum.bottomSheetOptions, {mapRegion})
  }

  React.useEffect(() => {
    if (state.currentlyViewingMapView?.[currentlyViewingMapView?.walkingRoute] && !state.mapPins?.[MapPinCities?.newYork][currentlyViewingMapView?.walkingRoute].length) {
      Alert.alert('No galleries to show', `Follow some galleries by tapping the heart icon on the gallery's page.`)
    }
  }, state.currentlyViewingMapView?.[currentlyViewingMapView?.walkingRoute])

  const memoizedMapPins = React.useMemo(() => {
    return state.mapPinIds?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView]?.map((locationId) => {
          if (state.allMapPins?.[locationId]) {
          return state.allMapPins[locationId];
          }
      });
  }, [state?.currentlyViewingCity, state?.currentlyViewingMapView, state.mapPinIds]);

  return (
    <>
      <View style={exploreMapStyles.container}>
        <View style={exploreMapStyles.mapContainer}>
          <View style={exploreMapStyles.switchContainer}>
            <FilterBanner navigation={navigation} />
          </View>
          <View style={exploreMapStyles.layersContainer}>
            <IconButtonElement 
              inUse={false}
              IconInUse={<SVGs.FigureWalkingLogoBlack />}
              IconNotInUse={<SVGs.FigureWalkingLogoWhite />}
              onPress={handleModalToggle}
            />
          </View>
          {Object.values(mapRegion).length > 0 && ( 
            <MapView  
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              style={exploreMapStyles.mapView}
              initialRegion={mapRegion}
              customMapStyle={!isAndroid ? mapStylesJson : androidMapStyles}
              onMarkerPress={handleMarkerPress}
              showsUserLocation={true}
              >
                <MappedPins pins={memoizedMapPins} navigation={navigation} city={state.currentlyViewingCity} view={state.currentlyViewingMapView}/>
                {state.currentlyViewingMapView === currentlyViewingMapView.walkingRoute && state?.customViews?.[state.currentlyViewingCity]?.walkingRoute && state?.customViews?.[state.currentlyViewingCity]?.walkingRoute?.length !== 0 && (
                  <Polyline
                    coordinates={state?.customViews?.[state.currentlyViewingCity]?.walkingRoute as unknown as LatLng[]}
                    strokeWidth={2}
                    strokeColor={Colors.PRIMARY_950}
                    lineDashPattern={[2, 2]}
                    miterLimit={10}
                  />
                )}
            </MapView>
          )}
        </View>
      </View>
    </>
  );
}

export { ExploreMapHomeScreen }