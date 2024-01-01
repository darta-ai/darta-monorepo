import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Location from 'expo-location';

import * as Colors from '@darta-styles';
import { mapStylesJson } from '../../utils/mapStylesJson';
import {ETypes, StoreContext} from '../../state/Store';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { CoordinateFields, ExhibitionDates, ExhibitionMapPin, IBusinessLocationData, IOpeningLocationData, Images, MapPinCities, PublicFields, ReceptionDates } from '@darta-types';
import CustomMarkerList from '../../components/Previews/CustomMarkerList';
import { listExhibitionPinsByCity } from "../../api/locationRoutes";
import { UserStoreContext } from '../../state';


const exploreMapStyles = StyleSheet.create({
    container: {
        height: '95%',
        width: wp('100%'),
        backgroundColor: Colors.PRIMARY_100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
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
  }
})


export function ListMap({
    navigation,
    route,
}: {
    navigation?: any;
    route: any;
}) {
  const {state, dispatch} = useContext(StoreContext);
  const [currentLocation] = React.useState<MapPinCities>(MapPinCities.newYork)
  const [mapRegion, setMapRegion] = React.useState({
    latitudeDelta: 0.01,
    longitudeDelta: 0.06,
    latitude: 40.709, 
    longitude: -73.990
  })

  const [exhibitionPins, setExhibitionPins] = React.useState<{[key: string] :ExhibitionMapPin}>({})

  React.useEffect(() => {
    if (state.userLists && state.userLists[route.params.listId]){
      const list = state.userLists[route.params.listId]
      const listArtwork = list.artwork
      let maxLongitude = 40.709;
      let maxLatitude = -73.990;
      const formattedListPins: ExhibitionMapPin[] = Object.values(listArtwork).map((artwork) => {
        // console.log(artwork.exhibition.exhibitionLocation)
        if (artwork.exhibition?.exhibitionLocation?.coordinates?.latitude?.value && artwork.exhibition?.exhibitionLocation?.coordinates?.longitude?.value){
          if (Number(artwork.exhibition?.exhibitionLocation?.coordinates?.latitude?.value) > maxLongitude){
            maxLongitude = Number(artwork.exhibition?.exhibitionLocation?.coordinates?.latitude?.value)
          }
          if (Number(artwork.exhibition?.exhibitionLocation?.coordinates?.longitude?.value) > maxLatitude){
            maxLatitude = Number(artwork.exhibition?.exhibitionLocation?.coordinates?.longitude?.value)
          }
        }
        if (!artwork.exhibition?.isCurrentlyShowing) return {} as ExhibitionMapPin
        return {
          exhibitionId: artwork.exhibition?.exhibitionId as string,
          galleryId: artwork.gallery?.galleryId as string,
          artworkId: artwork.artwork?.artworkId as string,
          exhibitionName: artwork.artwork?.artworkTitle as PublicFields,
          exhibitionArtist: artwork.artwork?.artistName as PublicFields,
          exhibitionLocation: {
            isPrivate: false,
            coordinates: {
              latitude: {
                value: artwork.exhibition?.exhibitionLocation?.coordinates?.latitude.value as string,
              },
              longitude: {
                value: artwork.exhibition?.exhibitionLocation?.coordinates?.longitude.value as string,
              }, 
              googleMapsPlaceId: { value: ""}
            }, 
            locationString: artwork.exhibition?.exhibitionLocation?.locationString as PublicFields,
          },
          exhibitionPrimaryImage: artwork.artwork?.artworkImage as Images,
          galleryName: artwork.gallery?.galleryName as PublicFields,
          galleryLogo: {} as Images,
          exhibitionTitle: artwork.artwork?.artworkTitle as PublicFields,
          exhibitionType: {value: "Solo Show"},
          exhibitionDates: artwork.exhibition?.exhibitionDates as ExhibitionDates,
          receptionDates: {} as ReceptionDates,
        }
      })

      setMapRegion({
        ...mapRegion,
        latitude: maxLongitude,
        longitude: maxLatitude
      })

      const objectPins = formattedListPins.reduce((accumulator, artwork) => {
        // Use artworkId as a unique key for each artwork
        const key = artwork.exhibitionId;
    
        // Assign the artwork to its key in the accumulator
        accumulator[key] = artwork;
    
        return accumulator;
    }, {} as {[key: string]: ExhibitionMapPin});
      setExhibitionPins(objectPins)
      
    }
    (async () => {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
    })();
  }, [state.mapPins])

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
    <ScrollView refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>
        <View style={exploreMapStyles.container}>
          <View style={exploreMapStyles.mapContainer}>
            <MapView  
              provider={PROVIDER_GOOGLE}
              style={ exploreMapStyles.mapView }
              region={mapRegion} 
              customMapStyle={mapStylesJson}
              onMarkerPress={handleMarkerPress}
              onRegionChangeComplete={handleRegionChangeComplete}
              showsUserLocation={true}
              >
                {exhibitionPins && Object.values(exhibitionPins).length > 0 
                && Object.values(exhibitionPins).map((pin: ExhibitionMapPin) => {
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
          </View>
        </View>
    </ScrollView>
  );
}
