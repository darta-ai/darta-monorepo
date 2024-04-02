import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import * as Colors from '@darta-styles';
import { TextElement } from '../../components/Elements/TextElement';
import { Divider } from 'react-native-paper';
import { ETypes, StoreContext } from '../../state';
import polyline from '@mapbox/polyline';
import * as Location from 'expo-location';
import { GallerySwitchContainer } from '../../components/Maps/GallerySwitchContainer';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import DartaMapComponent from '../../components/Maps/DartaMapView';
import { ExhibitionMapPin } from '@darta-types/dist';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  blackTab: {
    backgroundColor: Colors.PRIMARY_950,
    height: 5,
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    opacity: 0.5,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 24
  },
  bottomSheet: {
    backgroundColor: Colors.PRIMARY_50,
    height: hp('100%'), 
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    gap: 10,
  },
  buttonStyles: {
    width: '100%',
    backgroundColor: Colors.PRIMARY_950,
    alignSelf: "center",
    marginTop: 24,
  },
  buttonContentStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: wp('90%'),
    padding: 0, // Or any other desired padding
  },
  buttonTextColor: {
    color: Colors.PRIMARY_50,
    fontFamily: "DMSans_700Bold",
  }
});

export const PlanARoute = ({navigation, route}) => {
  const { state, dispatch } = React.useContext(StoreContext);
  const [loadingRoute, setLoadingRoute] = React.useState(false);

  const memoizedMapPinsPlanARoute = React.useMemo(() => {
    return state.mapPinIds?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView]?.map((locationId) => {
        if (state.allMapPins?.[locationId] && state.mapPinStatus?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView][locationId]) {
          return state.allMapPins[locationId];
        }
      }).filter((pin) => pin);
  }, [state.mapPins, state.currentlyViewingCity, state.currentlyViewingMapView, state.mapPinStatus?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView]]);

  const allMapPinsPlanARoute = React.useMemo(() => {
    return state.mapPinIds?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView]?.map((locationId: string) => {
        if (state.allMapPins?.[locationId]) {
          return state.allMapPins[locationId];
        }
      });
  }, [state.mapPins, state.currentlyViewingCity, state.currentlyViewingMapView]);

  const [mapPinsState, setMapPinsState] = React.useState<ExhibitionMapPin[]>(memoizedMapPinsPlanARoute);



  const handleShowRoute = async ({bypass} : {bypass?: boolean}) => {
    if (state.userAgreedToNavigationTerms || bypass) {
      if (state.isViewingWalkingRoute) {
        dispatch({
          type: ETypes.setIsViewingWalkingRoute,
          isViewingWalkingRoute: false
        })
      } else {
        await fetchRouteWithWaypoints({pins: mapPinsState});
        dispatch({
          type: ETypes.setIsViewingWalkingRoute,
          isViewingWalkingRoute: true
        })
      }
    } else {
      handleShowAgreement();
    }
  } 


  const fetchRouteWithWaypoints = React.useCallback(async ({pins} : {pins: ExhibitionMapPin[]}) => {
    if (!pins) {
      return;
    }
    setLoadingRoute(true)
    const waypoints =  pins.map((pin) => {
      if(pin?.exhibitionLocation?.coordinates?.latitude && pin?.exhibitionLocation?.coordinates?.longitude){
        return {
          latitude: Number(pin.exhibitionLocation.coordinates.latitude.value),
          longitude: Number(pin.exhibitionLocation.coordinates.longitude.value)
        }
      }
    }).sort((a: any, b: any) => {
      if (!a || !b) return 0; 
      return a.latitude - b.latitude; 
    }).filter((waypoint) => waypoint);

    try {
      const hasLocationPermission = await Location.requestForegroundPermissionsAsync();
      let origin = '';
      if (hasLocationPermission.status === 'granted') {
        const userLocation = await Location.getCurrentPositionAsync()
        origin = `${userLocation.coords.latitude},${userLocation.coords.longitude}`;
      } else {
        origin = waypoints[0] ? `${waypoints[0].latitude},${waypoints[0].longitude}` : '';
      }
      const destination = waypoints[waypoints.length - 1] ? `${waypoints[waypoints.length - 1]?.latitude},${waypoints[waypoints.length - 1]?.longitude}` : '';
      const waypointsString = waypoints.map(coord => `${coord?.latitude},${coord?.longitude}`).join('|');
      console.log({waypointsString})

      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypointsString}&mode=walking&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS}`);
      const json = await response.json();
    
      if (json.status === 'OK') {
        const optimizedRoute = json.routes[0].overview_polyline.points;
        const decodedPoints = polyline.decode(optimizedRoute);
        const routeCoordinates = decodedPoints.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));
        
        console.log({routeCoordinates})
        dispatch({
          type: ETypes.setWalkingRoute,
          walkingRoute: routeCoordinates,
          customMapPins: pins
        })
        dispatch({
          type: ETypes.setIsViewingWalkingRoute,
          isViewingWalkingRoute: true
        })
        console.log('!!!', routeCoordinates.length)
        navigation.goBack()
      } else {
        throw new Error('Failed to fetch optimized route');
      }
    } catch (error) {
      return null;
    }
    setLoadingRoute(false)
  }, []);

  const userAccepted = () => {
    dispatch({
      type: ETypes.setUserAgreedToNavigationTerms,
      userAgreedToNavigationTerms: true
    })
    handleShowRoute({bypass: true})
  }

  const handleShowAgreement = () => {
    Alert.alert(
      "Route Agreement", "The provided route is for guidance only. Road conditions and regulations change; please verify the route and comply with all traffic laws. Use at your own risk. darta is not liable for any discrepancies or incidents.",
      [
        {
          text: `Agree`,
          onPress: () => userAccepted()
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'destructive'
        },
      ]
    )
  } 

  React.useEffect(() => {
    setMapPinsState(memoizedMapPinsPlanARoute)
  }, [state.mapPinStatus?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView]])

  return (
    <View style={styles.container}>
        <View style={styles.bottomSheet}>
          <View style={{height: 200}}>
            <DartaMapComponent 
              navigation={navigation}
              mapPins={mapPinsState}
            />
          </View>
          <View style={{marginTop: 12}}>
            <TextElement style={{fontFamily: 'DMSans_400Regular'}}>{`Select up to ${10 - mapPinsState.length} more Galleries`}</TextElement>
            <Divider style={{marginBottom: 12}} />
            <View>
              <GallerySwitchContainer mapPins={allMapPinsPlanARoute} activeArrayLength={mapPinsState?.length}/>
            </View>
          </View>
          <View style={{marginBottom: 12}}>
            <Button 
            onPress={handleShowAgreement}
            labelStyle={{color: Colors.PRIMARY_50}}
            style={styles.buttonStyles}
            contentStyle={styles.buttonContentStyle}
            loading={loadingRoute}
            >
              <TextElement style={styles.buttonTextColor}>Generate Route</TextElement>
            </Button>
          </View>
        </View>
      </View>
  );
};
