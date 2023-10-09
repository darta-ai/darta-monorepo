import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Location from 'expo-location';
import {Button} from 'react-native-paper';
import { readExhibition } from '../../api/exhibitionRoutes';
import { readGallery } from '../../api/galleryRoutes';
import { mdiMapMarkerAccount } from '@mdi/js';

import * as Colors from '@darta-styles';
import { mapStylesJson } from '../../utils/mapStylesJson';
import {
  ExploreMapRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import { ExhibitionMapPin, MapPinCities } from '@darta-types';
import CustomMarker from '../../components/Previews/CustomMarker';
import { listExhibitionPinsByCity } from "../../api/locationRoutes";


const exploreMapStyles = StyleSheet.create({
    container: {
        width: wp('100%'),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapContainer: {
      borderColor: Colors.PRIMARY_900,
      borderWidth: 3,
      height: hp('70%'),
      width: wp('95%'),
      display: 'flex',
      marginTop: wp('5%'),
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
    }
})


export function ExploreMapHomeScreen({
    navigation,
}: {
    navigation?: any;
}) {
  const {state, dispatch} = useContext(StoreContext);
  const [currentLocation, setCurrentLocation] = React.useState<MapPinCities>(MapPinCities.newYork)
  const [mapRegion, setMapRegion] = React.useState({
    latitudeDelta: 0.01,
    longitudeDelta: 0.06,
    latitude: 40.721, 
    longitude: -73.995
  })

  const [exhibitionPins, setExhibitionPins] = React.useState<{[key: string] :ExhibitionMapPin}>({})

  React.useEffect(() => {
    if (state.mapPins && state.mapPins?.[currentLocation]){
      setExhibitionPins(state.mapPins?.[currentLocation])
    }
  }, [])

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
      const exhibitionMapPins = await listExhibitionPinsByCity({cityName: currentLocation})
      dispatch({type: ETypes.saveExhibitionMapPins, mapPins: exhibitionMapPins, mapPinCity: currentLocation})
    } catch {

    }
  setTimeout(() => {
      setRefreshing(false);
  }, 500)  }, []);


    type LocationType = {
      latitude: number,
      longitude: number,
      latitudeDelta: number,
      longitudeDelta: number,
    }

    // 40.7158° N, 73.9970° W

    const testLocation = {
      latitude: 40.7265, 
      longitude: -73.9815
    }


  const [userLocation, setUserLocation] = React.useState<LocationType | null>(null);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      if (loc.coords.latitude && loc.coords.longitude){
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.00,
          longitudeDelta: 0.05,
        });
      }
    })();
  }, []);
  
  const [showNavigateButton, setShowNavigateButton] = React.useState<boolean>(false)
  const [exhibitionId, setExhibitionId] = React.useState<string>("")
  const [galleryId, setGalleryId] = React.useState<string>("")
  const [loading, setLoading] = React.useState<boolean>(false)

  const navigateToExhibitionScreens = async () => {
    setLoading(true)
    if (!exhibitionId || !galleryId){
      setLoading(false)
    }
    if (state.exhibitionData && state.exhibitionData[exhibitionId]){
      const exhibition = state.exhibitionData[exhibitionId]
      dispatch({
        type: ETypes.setCurrentHeader,
        currentExhibitionHeader: exhibition.exhibitionTitle.value!,
      })
    }
    navigation.navigate(ExploreMapRootEnum.TopTabExhibition, {galleryId: galleryId, exhibitionId: exhibitionId, internalAppRoute: true});
    setLoading(false)
  }

  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>
        <View style={exploreMapStyles.container}>
          <View style={exploreMapStyles.mapContainer}>
            {Object.values(mapRegion).length > 0 && ( 
            <MapView  
              provider={PROVIDER_GOOGLE}
              style={{ alignSelf: 'stretch', height: '100%' }}
              region={mapRegion} 
              customMapStyle={mapStylesJson}
              onMarkerPress={(event) =>{
                setShowNavigateButton(true)
                setMapRegion({
                  ...mapRegion,
                  ...event.nativeEvent.coordinate,
                })
              }}
              onRegionChangeComplete={(event) => {setMapRegion(event)}}
              showsUserLocation={true}
              onPress={() => setShowNavigateButton(false)}
              >
                {exhibitionPins && Object.values(exhibitionPins).length > 0 
                && Object.values(exhibitionPins).map((pin: ExhibitionMapPin) => {
                  if(pin.exhibitionLocation.coordinates?.latitude && pin.exhibitionLocation.coordinates?.longitude){
                    return (
                      <View key={pin.exhibitionId}>
                        <CustomMarker 
                          coordinate={{latitude: Number(pin.exhibitionLocation.coordinates.latitude.value), longitude: Number(pin.exhibitionLocation.coordinates.longitude.value)}}
                          mapPin={pin}
                          setUpperLevelExhibition={setExhibitionId}
                          setUpperLevelGallery={setGalleryId}
                          setUpperLevelShowCallout={setShowNavigateButton}
                        />
                      </View>
                    )
                  }
                })}
            </MapView>
            )}
          </View>
          {showNavigateButton && (
          <View style={exploreMapStyles.buttonContainer}>
            <Button loading={loading} mode="contained" style={{backgroundColor: Colors.PRIMARY_700}} textColor={Colors.PRIMARY_50} onPress={() => navigateToExhibitionScreens()}>View Exhibition</Button>
          </View>
          )}
          <View>

          </View>
        </View>
    </ScrollView>
  );
}
