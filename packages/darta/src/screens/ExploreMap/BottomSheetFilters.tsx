import React from 'react';
import { View, StyleSheet, Dimensions, Alert, ScrollView } from 'react-native';
import * as Colors from '@darta-styles';
import { TextElement } from '../../components/Elements/TextElement';
import { Divider } from 'react-native-paper';
import { PanGestureHandler, State, TapGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { ETypes, StoreContext } from '../../state';
import { currentlyViewingMapView } from '../../state/Store';
import polyline from '@mapbox/polyline';
import * as Location from 'expo-location';
import { GallerySwitchContainer } from '../../components/Maps/GallerySwitchContainer';


const screenHeight = Dimensions.get('window').height;

interface PanGestureContext {
  startY: number;
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // height: screenHeight * 0.2,
    // backgroundColor: Colors.PRIMARY_950,
    justifyContent: 'flex-end',
  },
  blackTab: {
    backgroundColor: Colors.PRIMARY_950,
    height: 5,
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    opacity: 0.5,
  },
  bottomSheet: {
    backgroundColor: Colors.PRIMARY_50,
    height: screenHeight,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    gap: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 24
  }
});

export const BottomSheetNavigation = ({navigation}) => {
  const translateY = useSharedValue(0);
  const { state, dispatch } = React.useContext(StoreContext);
  const handleShowSaved = () => {
    if (state.currentlyViewingMapView === currentlyViewingMapView.savedGalleries) {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.all
      })
    } else {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.savedGalleries
      })
    }
    if (state.isViewingWalkingRoute) {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: false
      })
    }
  } 

  const handleShowNew = () => {
    if (state.currentlyViewingMapView === currentlyViewingMapView.newOpenings) {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.all
      })
    } else {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.newOpenings
      })
    }
    if (state.isViewingWalkingRoute) {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: false
      })
    }
  } 

  const handleShowRoute = async ({bypass} : {bypass?: boolean}) => {
    if (state.userAgreedToNavigationTerms || bypass) {
      if (!state.walkingRoute?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView]) {
        await fetchRouteWithWaypoints(state.mapPins?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView] ?? []);
      } else if (state.isViewingWalkingRoute) {
        dispatch({
          type: ETypes.setIsViewingWalkingRoute,
          isViewingWalkingRoute: false
        })
      } else {
        dispatch({
          type: ETypes.setIsViewingWalkingRoute,
          isViewingWalkingRoute: true
        })
      }
    } else {
      handleShowAgreement();
    }
  } 


  const fetchRouteWithWaypoints = React.useCallback(async (pins) => {
    if (!pins) {
      return;
    }
    const waypoints =  pins.map((pin) => {
      if(pin.exhibitionLocation?.coordinates?.latitude && pin.exhibitionLocation?.coordinates?.longitude){
        return {
          latitude: Number(pin.exhibitionLocation.coordinates.latitude.value),
          longitude: Number(pin.exhibitionLocation.coordinates.longitude.value)
        }
      }
    }).sort((a: any, b: any) => {
      if (!a || !b) return 0; 
      return a.latitude - b.latitude; 
    });
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
    
      const response = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&waypoints=optimize:true|${waypointsString}&mode=walking&key=${process.env.EXPO_PUBLIC_GOOGLE_MAPS}`);
      const json = await response.json();
    
      if (json.status === 'OK') {
        const optimizedRoute = json.routes[0].overview_polyline.points;
        const decodedPoints = polyline.decode(optimizedRoute);
        const routeCoordinates = decodedPoints.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));
        
        dispatch({
          type: ETypes.setWalkingRoute,
          walkingRoute: routeCoordinates
        })
        dispatch({
          type: ETypes.setIsViewingWalkingRoute,
          isViewingWalkingRoute: true
        })
        return routeCoordinates;
      } else {
        throw new Error('Failed to fetch optimized route');
      }
    } catch (error) {
      return null;
    }

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

  const setShowBottomSheet = React.useCallback(() => {
    navigation.goBack()
  },[])

  const tapGestureRef = React.useRef(null); 


  const bottomScreenMultiplier = 0.2;

  const bottomSheetStartPosition = screenHeight * bottomScreenMultiplier;

  const tapGestureHandler = React.useCallback((event) => {
    const { nativeEvent } = event;
    
    if (nativeEvent.state === State.BEGAN) { // Check if the tap gesture has ended
      const tapY = nativeEvent.absoluteY; // Get the Y-coordinate of the tap
      const withinBottomSheet = tapY > screenHeight * 0.6; 
      
      if (!withinBottomSheet) {
        runOnJS(setShowBottomSheet)();
      }
    }
  }, [bottomSheetStartPosition]); // 

  const panGestureEvent = React.useCallback(useAnimatedGestureHandler<any, any>({
    onStart: (_, context: PanGestureContext) => {
      context.startY = translateY.value;
      if (context.startY === 0) {
        context.startY = screenHeight * bottomScreenMultiplier;
      }
    },
    onActive: (event: any, context: PanGestureContext) => {
      const newY = event.translationY + context.startY;
      if (newY < 0) return; 
      translateY.value = newY;
    },
    onEnd: () => {
      runOnJS(setShowBottomSheet)();
    }
  }), []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const dynamicStyles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: Colors.PRIMARY_50,
    height: bottomSheetStartPosition, 
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    gap: 10,
  }
});

  return (
  <TapGestureHandler onHandlerStateChange={tapGestureHandler} ref={tapGestureRef}>
    <View style={styles.container}>
        <PanGestureHandler onGestureEvent={panGestureEvent} simultaneousHandlers={tapGestureRef}>
          <Animated.View style={[dynamicStyles.bottomSheet, animatedStyle]}>
              <TextElement style={{fontFamily: 'DMSans_400Regular'}}>Select up to 10 galleries</TextElement>
              <Divider/>
              <GallerySwitchContainer mapPins={state.mapPins?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView]} activeArrayLength={1}/>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </TapGestureHandler>
  );
};
