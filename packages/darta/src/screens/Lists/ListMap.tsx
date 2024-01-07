import React, {useContext} from 'react';
import {View, StyleSheet } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import * as Location from 'expo-location';

import * as Colors from '@darta-styles';
import { mapStylesJson } from '../../utils/mapStylesJson';
import {StoreContext} from '../../state/Store';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import { ExhibitionDates, ExhibitionMapPin, Images, MapPinCities, PrivateFields, PublicFields, ReceptionDates } from '@darta-types';
import CustomMarkerList from '../../components/Previews/CustomMarkerList';
import { TextElement } from '../../components/Elements/TextElement';


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
      fontFamily: 'DMSans',
    },
    text:{
      color: Colors.PRIMARY_950,
      fontSize: 14,
      marginBottom: 24,
      fontFamily: 'DMSans',
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


export function ListMap({
    navigation,
    route,
}: {
    navigation?: any;
    route: any;
}) {
  const {state} = useContext(StoreContext);
  const [mapRegion, setMapRegion] = React.useState<any>({
    latitudeDelta: 0.01,
    longitudeDelta: 0.06,
    latitude: 40.719, 
    longitude: -73.990
  })

  React.useEffect(()=>{
    setMapRegion({
      latitudeDelta: 0.01,
      longitudeDelta: 0.06,
      latitude: 40.719, 
      longitude: -73.990
    })
    setMapRegion(mapRegion)
  }, [])

  const [exhibitionPins, setExhibitionPins] = React.useState<{[key: string] :ExhibitionMapPin}>({})



  React.useEffect(() => {
    if (state.userLists && state.userLists[route.params.listId]){
      const list = state.userLists[route.params.listId]
      const listArtwork = list.artwork
      let minLat = Number.MAX_VALUE;
      let maxLat = -Number.MAX_VALUE;
      let minLng = Number.MAX_VALUE;
      let maxLng = -Number.MAX_VALUE;

      const formattedListPins: ExhibitionMapPin[] = Object.values(listArtwork).map((artwork) => {
        const latitude = Number(artwork.exhibition?.exhibitionLocation?.coordinates?.latitude?.value);
        const longitude = Number(artwork.exhibition?.exhibitionLocation?.coordinates?.longitude?.value);

        if(latitude && longitude){
          // Update min and max values
          minLat = Math.min(minLat, latitude);
          maxLat = Math.max(maxLat, latitude);
          minLng = Math.min(minLng, longitude);
          maxLng = Math.max(maxLng, longitude);
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
            locationString: artwork.exhibition?.exhibitionLocation?.locationString as PrivateFields,
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

              // Calculate center and delta
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;
        const latitudeDelta = maxLat - minLat + 0.05; // Added padding
        const longitudeDelta = maxLng - minLng + 0.05; // Added padding

        // Set the map region
        if (centerLat && centerLng && latitudeDelta && longitudeDelta){
          setMapRegion({
            latitude: centerLat,
            longitude: centerLng,
            latitudeDelta,
            longitudeDelta
          });
        } else {
          setMapRegion({
            latitudeDelta: 0.01,
            longitudeDelta: 0.06,
            latitude: 40.719, 
            longitude: -73.990
          })
        }
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
  }, [state.userLists]);

  const [showPins, setShowPins] = React.useState<boolean>(false)

  React.useEffect(()=> {
    if (exhibitionPins && Object.values(exhibitionPins).length > 0 ){
      setShowPins(true)
    }else{
      setShowPins(false)
    }
  },[exhibitionPins])

  const handleMarkerPress = React.useCallback((event) => {
    setMapRegion({
      ...mapRegion,
      ...event.nativeEvent.coordinate,
    });
  }, [mapRegion]);
  
  const handleRegionChangeComplete = React.useCallback((event) => {
    setMapRegion(event);
  }, []);
  
  if (showPins){
    return (
      <View style={exploreMapStyles.container}>
        <View style={exploreMapStyles.mapContainer}>
          {mapRegion && showPins && (
            <MapView  
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
  } else if (!showPins) {
    return(
      <View style={exploreMapStyles.textContainer}>
        <TextElement style={exploreMapStyles.textHeader}>No artwork from your list on display</TextElement>
        <TextElement style={exploreMapStyles.text}>This map is for artwork that is currently up</TextElement>
      </View>

    )
  }

}
