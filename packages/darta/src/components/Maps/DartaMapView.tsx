import React from 'react';
import MapView, { LatLng, PROVIDER_GOOGLE, Polyline} from 'react-native-maps';
import { mapStylesJson } from '../../utils/mapStylesJson';
import { ExhibitionMapPin } from '@darta-types/dist';
import { StoreContext } from '../../state';
import * as Colors from '@darta-styles';
import { StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import _ from 'lodash';
import { MappedPins } from './MapPins';
import { MiniMappedPins } from './MiniMapPins';


type MapRegion = {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
}

const exploreMapStyles = StyleSheet.create({
  mapView: {
    alignSelf: 'stretch', 
    height: '100%' 
  },
  });


export const getZoomLevel = (
    minLat: number,
    maxLat: number,
    minLong: number,
    maxLong: number,
  ) => {  
    const latDelta = Math.abs(maxLat - minLat) * 0.1;
    const longDelta = Math.abs(maxLong - minLong) * 0.1;
    
    const zoomLevel = Math.min(
      Math.max(
        Math.log(360 / longDelta) / Math.LN2 - 7,
        Math.log(180 / latDelta) / Math.LN2 - 3.5
      ),
      20
    );
    
    return zoomLevel;
  };

  const DartaMapComponent = ({navigation, mapPins} : {
    navigation: any
    mapPins: ExhibitionMapPin[]
}) => {
    const mapRef = React.useRef<MapView>(null);

    const {state} = React.useContext(StoreContext);
    const [mapRegion] = React.useState<null | MapRegion>({
        latitudeDelta: 0.01,
        longitudeDelta: 0.09,
        latitude: 40.709, 
        longitude: -73.990
      });

    const prevMapPinsRef = React.useRef<ExhibitionMapPin[]>();

    const calculateMapRegion = React.useCallback(async () => {
      const hasLocationPermission = await Location.requestForegroundPermissionsAsync();
      let userLat: null | number = null;
      let userLong: null | number = null;
    
      if (hasLocationPermission.status === 'granted') {
        const userLocation = await Location.getCurrentPositionAsync();
        userLat = userLocation.coords.latitude;
        userLong = userLocation.coords.longitude;
      }
    
      const filteredMapPins = mapPins.filter(
        (pin) =>
          pin?.exhibitionLocation?.coordinates?.latitude &&
          pin?.exhibitionLocation?.coordinates?.longitude
      );
    
      const latitudes = filteredMapPins.map((pin) =>
        Number(pin?.exhibitionLocation?.coordinates?.latitude.value)
      );
      const longitudes = filteredMapPins.map((pin) =>
        Number(pin?.exhibitionLocation?.coordinates?.longitude.value)
      );
    
      const minLat = Math.min(...latitudes, userLat ? userLat : Number.MAX_SAFE_INTEGER);
      const maxLat = Math.max(...latitudes, userLat ? userLat : Number.MIN_SAFE_INTEGER);
      const minLong = Math.min(...longitudes, userLong ? userLong : Number.MAX_SAFE_INTEGER);
      const maxLong = Math.max(...longitudes, userLong ? userLong : Number.MIN_SAFE_INTEGER);
    
      const centerLat = (minLat + maxLat) / 2;
      const centerLong = (minLong + maxLong) / 2;
    
      const MIN_ZOOM_LEVEL = 13;
      const MAX_ZOOM_LEVEL = 13;
      const LATITUDE_DELTA_REF = 0.03;
      const LONGITUDE_DELTA_REF = 0.1;
      const MIN_ZOOM_PERSONAL_ZOOM = 15;
    
      let zoomLevel;
      if (latitudes.length === 0) {
        zoomLevel = Math.min(
          getZoomLevel(minLat, maxLat, minLong, maxLong),
          MIN_ZOOM_PERSONAL_ZOOM
        );
      } else {
        zoomLevel = Math.min(
          getZoomLevel(minLat, maxLat, minLong, maxLong),
          MIN_ZOOM_LEVEL
        );
      }
    
      const region = {
        latitude: centerLat,
        longitude: centerLong,
        latitudeDelta: LATITUDE_DELTA_REF * Math.pow(2, MAX_ZOOM_LEVEL - zoomLevel),
        longitudeDelta: LONGITUDE_DELTA_REF * Math.pow(2, MAX_ZOOM_LEVEL - zoomLevel),
      };
    
      if (!Object.is(region, mapRegion) && mapRegion && mapRef.current) {
        // Check if any pin is outside the current map region
        const isOutsideRegion = filteredMapPins.some((pin) => {
          const pinLat = Number(pin?.exhibitionLocation?.coordinates?.latitude.value);
          const pinLong = Number(pin?.exhibitionLocation?.coordinates?.longitude.value);
          return (
            pinLat < mapRegion.latitude - mapRegion.latitudeDelta / 2 ||
            pinLat > mapRegion.latitude + mapRegion.latitudeDelta / 2 ||
            pinLong < mapRegion.longitude - mapRegion.longitudeDelta / 2 ||
            pinLong > mapRegion.longitude + mapRegion.longitudeDelta / 2
          );
        });
    
        if (isOutsideRegion) {
          // If a pin is outside the region, zoom out to include all pins
          mapRef.current.animateToRegion(region, 500);
        } else if (latitudes.length < mapPins.length) {
          // If a pin is removed from the edge, zoom in
          const newZoomLevel = Math.min(zoomLevel + 1, MAX_ZOOM_LEVEL);
          const newRegion = {
            ...region,
            latitudeDelta: LATITUDE_DELTA_REF * Math.pow(2, MAX_ZOOM_LEVEL - newZoomLevel),
            longitudeDelta: LONGITUDE_DELTA_REF * Math.pow(2, MAX_ZOOM_LEVEL - newZoomLevel),
          };
          mapRef.current.animateToRegion(newRegion, 500);
        }
      }
    }, [state.mapPins?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView], mapPins]);
    
    React.useEffect(() => {
      if (!_.isEqual(prevMapPinsRef.current, mapPins)) {
        prevMapPinsRef.current = mapPins;
        calculateMapRegion();
      }
    }, [mapPins]);
  
    return (
        <MapView  
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={ exploreMapStyles.mapView }
            region={mapRegion as unknown as MapRegion} 
            customMapStyle={mapStylesJson}
            onMarkerPress={() => {}}
            showsUserLocation={true}
        >
            <MiniMappedPins pins={mapPins} navigation={navigation} city={state.currentlyViewingCity} view={state.currentlyViewingMapView}/>
            {state.isViewingWalkingRoute && (
                <Polyline
                coordinates={state.walkingRoute?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView] as unknown as LatLng[]}
                strokeWidth={2}
                strokeColor={Colors.PRIMARY_950}
                />
            )}
        </MapView>
    )
}

export default React.memo(DartaMapComponent);