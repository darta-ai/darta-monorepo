import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import * as Colors from '@darta-styles';
import { TextElement } from '../../components/Elements/TextElement';
import { Divider } from 'react-native-paper';
import { ETypes, StoreContext, UserETypes, UserStoreContext } from '../../state';
import polyline from '@mapbox/polyline';
import * as Location from 'expo-location';
import { GallerySwitchContainer } from '../../components/Maps/GallerySwitchContainer';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';
import DartaMapComponent from '../../components/Maps/DartaMapView';
import { ExhibitionMapPin } from '@darta-types/dist';
import _ from 'lodash';
import { incrementUserGeneratedRoute } from '../../api/userRoutes';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAVED_ROUTE_SETTINGS } from '../../utils/constants';
import analytics from '@react-native-firebase/analytics';

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

const routeNames = {
  all: "All New York Galleries",
  savedGalleries: "Galleries You Follow",
  newOpenings: "Newly Opened Exhibitions",
  newClosing: "Exhibitions Closing Soon",
  walkingRoute: "Your Route",
  openingTonight: "Exhibitions Opening Tonight",
}

export const PlanARoute = ({navigation}) => {
  const { state, dispatch } = React.useContext(StoreContext);
  const { userState, userDispatch } = React.useContext(UserStoreContext);
  const [loadingRoute, setLoadingRoute] = React.useState(false);

  const memoizedMapPinsPlanARoute = React.useMemo(() => {
    return state.mapPinIds?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView]?.map((locationId) => {
        if (state.allMapPins?.[locationId] && state.mapPinStatus?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView][locationId]) {
          return state.allMapPins[locationId];
        }
      }).filter((pin: any) => pin);
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
    } 
  } 

  const fetchRouteWithWaypoints = React.useCallback(async ({pins} : {pins: ExhibitionMapPin[]}) => {
    if (!pins) {
      return;
    }
    const startTime = Date.now();
    // if (userState.user?.routeGenerationCount?.routeGeneratedCountWeekly && userState.user.routeGenerationCount.routeGeneratedCountWeekly >= 6) {
    //   Alert.alert('Route Limit Reached', 'You have reached your weekly limit of 6 routes. Please try again after next Wednesday.')
    //   return;
    // }
    setLoadingRoute(true);
    const locationIds = pins.map((waypoint) => waypoint?.locationId);
    if (_.isEqual(locationIds, state.mapPinIds?.[state.currentlyViewingCity]?.walkingRoute)){
      return navigation.goBack();
    }
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

      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypointsString}&mode=walking&fields=routes.overview_polyline.points&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS}`);
      const json = await response.json();
      if (json.status === 'OK') {
        const optimizedRoute = json.routes[0].overview_polyline.points;
        const decodedPoints = polyline.decode(optimizedRoute);
        const routeCoordinates = decodedPoints.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));

        const endTime = Date.now();
        const duration = endTime - startTime; 
        
        dispatch({
          type: ETypes.setWalkingRoute,
          walkingRoute: routeCoordinates,
          customMapLocationIds: locationIds,
          setWalkingRouteRender: true
        })
        dispatch({
          type: ETypes.setIsViewingWalkingRoute,
          isViewingWalkingRoute: true
        })

        navigation.goBack()

        analytics().logEvent('route_generation_success', {
          duration,
        });

        AsyncStorage.setItem(SAVED_ROUTE_SETTINGS, JSON.stringify({routeCoordinates, locationIds, generatedDate: new Date().toISOString()}));

        const artworkGeneratedCount = await incrementUserGeneratedRoute();
        if (Number.isInteger(Number(artworkGeneratedCount))) {
          userDispatch({
            type: UserETypes.setRoutesGenerated,
            artworkGeneratedCount
          })
        } else {
          userDispatch({
            type: UserETypes.setRoutesGenerated,
            artworkGeneratedCount: userState.user?.routeGenerationCount?.routeGeneratedCountWeekly ?  userState.user?.routeGenerationCount?.routeGeneratedCountWeekly + 1 : 1
          })
        }
      } else {
        throw new Error('Failed to fetch optimized route');
      }
    } catch (error) {
      errorGeneratingRoute();
      analytics().logEvent('route_generation_failure');
    }
    setLoadingRoute(false)
  }, []);

  const handleShowAgreement = () => {
    Alert.alert(
      "Route Agreement", "The provided route is for guidance only. Road conditions and regulations change; please verify the route and comply with all traffic laws. Use at your own risk. darta is not liable for any discrepancies or incidents.",
      [
        {
          text: `Agree`,
          onPress: () => handleShowRoute({bypass: true})
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'destructive'
        },
      ]
    )
  } 

  const errorGeneratingRoute = () => {
    Alert.alert('Error', 'Failed to generate route. Please try again.')
  };

  // React.useEffect(() => {
  //   setMapPinsState(memoizedMapPinsPlanARoute)
  // }, [state.mapPinStatus?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView]])

  const addLocationIdToMapPins = (locationId: string) => {
    if (mapPinsState.length <= 10 && state.allMapPins?.[locationId]) {
      setMapPinsState([...mapPinsState, state.allMapPins?.[locationId]]);
    }
  };

  const removeLocationIdFromMapPins = (locationId: string) => {
    if (mapPinsState.length > 0) {
      setMapPinsState(mapPinsState.filter((pin) => {
        return pin?.locationId !== locationId
      }));
    }
  }

  return (
    <View style={styles.container}>
        <View style={styles.bottomSheet}>
          <View style={{height: hp('25%')}}>
            <DartaMapComponent 
              navigation={navigation}
              mapPins={mapPinsState}
            />
          </View>
          <View style={{marginTop: 12, gap: 3}}>
            <TextElement style={{fontFamily: 'DMSans_700Bold', fontSize: 24}}>{routeNames[state.currentlyViewingMapView]}</TextElement>
            <TextElement style={{fontFamily: 'DMSans_400Regular'}}>{`Select up to ${10 - mapPinsState.length} more Galleries`}</TextElement>
            <Divider style={{marginBottom: 12}} />
            <View>
              <GallerySwitchContainer 
                mapPins={allMapPinsPlanARoute} 
                activeArrayLength={mapPinsState?.length}
                addLocationIdToMapPins={addLocationIdToMapPins}
                removeLocationIdFromMapPins={removeLocationIdFromMapPins}
                />
            </View>
          </View>
          <View style={{marginBottom: 14}}>
            <Button 
              onPress={handleShowAgreement}
              labelStyle={{color: Colors.PRIMARY_50}}
              style={styles.buttonStyles}
              contentStyle={styles.buttonContentStyle}
              loading={loadingRoute}
              disabled={loadingRoute}
              >
                {!loadingRoute && <TextElement style={styles.buttonTextColor}>Generate Route</TextElement>}
                {loadingRoute && <TextElement style={styles.buttonTextColor}>can take up to 10 seconds</TextElement>}
            </Button>
            <View style={{margin: 10}}>
              <TextElement style={{fontSize: 10}}>Limit 6 routes a week per account, resetting on Wednesdays</TextElement>
              <TextElement style={{fontSize: 10}}>You have generated {userState.user?.routeGenerationCount?.routeGeneratedCountWeekly ?? 0} this week</TextElement>
            </View>
          </View>
        </View>
      </View>
  );
};
