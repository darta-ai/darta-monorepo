import React, {useContext} from 'react';
import {View, StyleSheet, Platform } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';

import * as Colors from '@darta-styles';
import { StoreContext} from '../../state/Store';
import { ExhibitionMapPin } from '@darta-types';
import { TextElement } from '../../components/Elements/TextElement';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { mapStylesJson } from '../../utils/mapStylesJson';
import CustomMarkerList from '../../components/Previews/CustomMarkerList';
import { androidMapStyles } from '../../utils/mapStylesJson.android';

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
      backgroundColor: Colors.PRIMARY_50,
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
    longitudeDelta: 0.09,
    latitude: 40.719, 
    longitude: -73.990
  })
  const mapListRef = React.useRef<MapView>(null);
  const [showPins, setShowPins] = React.useState<boolean>(false)

  const [exhibitionPins, setExhibitionPins] = React.useState<ExhibitionMapPin[]>([])

  React.useEffect(() => {
    const pins = state?.userLists?.[route.params.listId]?.listPins
    const region = state?.userLists?.[route.params.listId]?.mapRegion
    if (pins?.length){
      setExhibitionPins(pins)
      setMapRegion(region)
      setShowPins(true)
    } else {
      setShowPins(false)
    }
  }, [state.userLists?.[route.params.listId]]);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     calculateMapRegion()
  //     setPinsAndUpdateState()
  //   }, [state.userLists, state.userLists?.[route.params.listId], calculateMapRegion, setPinsAndUpdateState])
  // )

    // React.useEffect(()=> {
    //   if (exhibitionPins && Object.values(exhibitionPins).length > 0 ){
    //     setShowPins(true)
    //   } else{
    //     setShowPins(false)
    //   }
    // },[exhibitionPins])

  const handleMarkerPress = React.useCallback((event) => {
      const newRegion = {
        ...mapRegion,
        ...event.nativeEvent.coordinate,
        latitudeDelta: 0.01,  // You might need to adjust these deltas
        longitudeDelta: 0.01,
      };
  
      const transitionSpeed = mapRegion.latitudeDelta >= 0.01 ? 500 : 250;
    
      if (mapListRef.current) {
        mapListRef.current.animateToRegion(newRegion, transitionSpeed); // 1000 is the duration of the animation in milliseconds
      }
    }, [mapRegion]);
  
  if (showPins){
    return (
      <View style={exploreMapStyles.container}>
      <View style={exploreMapStyles.mapContainer}>
        {Object.values(mapRegion).length > 0 && ( 
        <MapView  
          ref={mapListRef}
          provider={PROVIDER_GOOGLE}
          style={exploreMapStyles.mapView }
          region={mapRegion} 
          customMapStyle={ Platform.OS === "ios"  ? mapStylesJson : androidMapStyles}
          onMarkerPress={handleMarkerPress}
          showsUserLocation={true}
          >
            {exhibitionPins && exhibitionPins.map((pin: ExhibitionMapPin) => {
              if(pin?.exhibitionLocation?.coordinates?.latitude 
                && pin?.exhibitionLocation?.coordinates?.longitude){
                  return (
                  <View key={pin?.exhibitionId}>
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
        <View style={{width: '90%'}}>
          <TextElement style={exploreMapStyles.textHeader}>No artwork from this list is currently on display</TextElement>
          <TextElement style={exploreMapStyles.text}>Add artwork from current exhibitions to get started</TextElement>
        </View>
      </View>

    )
  }

}