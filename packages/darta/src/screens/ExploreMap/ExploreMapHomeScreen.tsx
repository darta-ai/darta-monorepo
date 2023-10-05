import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Location from 'expo-location';

import {PRIMARY_600, PRIMARY_900} from '@darta-styles';
import { mapStylesJson } from '../../utils/mapStylesJson';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import {ETypes, StoreContext} from '../../state/Store';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import { ExhibitionMapPin, MapPinCities } from '@darta-types';
import CustomMarker from '../../components/Previews/CustomMarker';
import { listExhibitionPinsByCity } from "../../api/locationRoutes";


type ExhibitionDetailsScreenNavigationProp = StackNavigationProp<
ExhibitionNavigatorParamList,
ExhibitionRootEnum.exhibitionDetails
>;

const exploreMapStyles = StyleSheet.create({
    container: {
        width: wp('100%'),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('3%'),
        marginBottom: hp('1%'),
    },
    mapContainer: {
      borderColor: PRIMARY_900,
      borderWidth: 3,
      height: hp('70%'),
      width: wp('95%'),
      display: 'flex',
      margin: wp('5%'),
      justifyContent: 'center',
      alignItems: 'center',
  },
})

type ExhibitionDetailsRouteProp = RouteProp<ExhibitionStackParamList, ExhibitionRootEnum.exhibitionDetails>;

export function ExploreMapHomeScreen({
    route,
    navigation,
}: {
    route?: ExhibitionDetailsRouteProp;
    navigation?: any;
}) {
  const {state, dispatch} = useContext(StoreContext);
  const [currentLocation, setCurrentLocation] = React.useState<MapPinCities>(MapPinCities.newYork)
  const [mapRegion, setMapRegion] = React.useState({
    latitudeDelta: 0.00,
    longitudeDelta: 0.06,
    latitude: 40.721, 
    longitude: -73.995
  })

  const [displayedExhibition, setDisplayedExhibition] = React.useState<ExhibitionMapPin>({} as ExhibitionMapPin)
  const [exhibitionPins, setExhibitionPins] = React.useState<{[key: string] :ExhibitionMapPin}>({})

  React.useEffect(() => {
    if (state.mapPins && state.mapPins[currentLocation]){
      setExhibitionPins(state.mapPins[currentLocation])
    }
  }, [])

  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
      const exhibitionMapPins = await listExhibitionPinsByCity({cityName: currentLocation})
      console.log(Object.values(exhibitionMapPins))
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
  
  


  return (
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} tintColor={PRIMARY_600} onRefresh={onRefresh} />}>
        <View style={exploreMapStyles.container}>
          <View style={exploreMapStyles.mapContainer}>
            <MapView  provider={PROVIDER_GOOGLE}
              style={{ alignSelf: 'stretch', height: '100%' }}
              region={mapRegion} 
              customMapStyle={mapStylesJson}
              onMarkerPress={(event) =>{
                setMapRegion({
                  ...mapRegion,
                  ...event.nativeEvent.coordinate,
                })
              }}
              onDoublePress={(event) =>console.log(event.nativeEvent)}
              >
                {/* {userLocation && (
                <Marker
                  coordinate={{latitude: userLocation.latitude, longitude: userLocation.longitude}}
                  image={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Location_dot_blue.svg/64px-Location_dot_blue.svg.png'}}
                />
                )} */}
                {exhibitionPins && Object.values(exhibitionPins).length > 0 
                && Object.values(exhibitionPins).map((pin: ExhibitionMapPin) => {
                  if(pin.exhibitionLocation.coordinates?.latitude && pin.exhibitionLocation.coordinates?.longitude){
                    return (
                      <View key={pin.exhibitionId}>
                        <CustomMarker 
                          coordinate={{latitude: Number(pin.exhibitionLocation.coordinates.latitude.value), longitude: Number(pin.exhibitionLocation.coordinates.longitude.value)}}
                          mapPin={pin}
                        />
                      </View>
                    )
                  }
                })}
            </MapView>
          </View>
          <View>

          </View>
        </View>
    </ScrollView>
  );
}
