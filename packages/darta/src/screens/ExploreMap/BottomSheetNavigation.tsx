import React from 'react';
import { View, StyleSheet, Dimensions, Alert } from 'react-native';
import * as Colors from '@darta-styles';
import { TextElement } from '../../components/Elements/TextElement';
import { Divider } from 'react-native-paper';
import { IconButtonElement } from '../../components/Elements/IconButtonElement';
import * as SVGs from '../../assets/SVGs';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  runOnJS,
} from 'react-native-reanimated';
import { ETypes, ExhibitionStoreContext, StoreContext } from '../../state';
import AsyncStorage from '@react-native-async-storage/async-storage';
import polyline from '@mapbox/polyline';
import { MapPinCities } from '@darta-types/dist';

const screenHeight = Dimensions.get('window').height;

interface PanGestureContext {
  startY: number;
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: screenHeight * 0.2, // 50% of the screen height
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    gap: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 12
  }
});

export const BottomSheetNavigation = ({ navigation }) => {
  const translateY = useSharedValue(0);
  const { state, dispatch} = React.useContext(StoreContext);

  const handleShowSaved = () => {
    dispatch({
      type: ETypes.isViewingSaved,
      isViewingSaved: !state.isViewingSaved
    })
    if (state.isViewingWalkingRoute) {
      dispatch({
        type: ETypes.isViewingWalkingRoute,
        isViewingWalkingRoute: false
      })
    }
  } 

  const handleShowRoute = async () => {
    if (await AsyncStorage.getItem('userAccepted') === 'true') {
      if (!state.walkingRoute) {
        await fetchRouteWithWaypoints();
      }
      dispatch({
        type: ETypes.isViewingWalkingRoute,
        isViewingWalkingRoute: !state.isViewingWalkingRoute
      })
    } else {
      handleShowAgreement();
    }
  } 


  const fetchRouteWithWaypoints = React.useCallback(async () => {
    const pins = state.mapPinsSaved?.[MapPinCities.newYork];
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
    }).sort((a, b) => {
      if (!a || !b) return 0; 
      return a.longitude - b.longitude; 
    });
    try {
      const origin = waypoints[0] ? `${waypoints[0].latitude},${waypoints[0].longitude}` : '';
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
        return routeCoordinates;
      } else {
        throw new Error('Failed to fetch optimized route');
      }
    } catch (error) {
      return null;
    }

  }, []);

  const userAccepted = () => {
    AsyncStorage.setItem('userAccepted', 'true');
    handleShowRoute()
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


  const panGestureEvent = useAnimatedGestureHandler<any, any>({
    onStart: (_, context: PanGestureContext) => {
      context.startY = translateY.value;
      if (context.startY === 0) {
        context.startY = screenHeight * 0.5;
      }
    },
    onActive: (event: any, context: PanGestureContext) => {
      const newY = event.translationY + context.startY;
      // Prevent moving the bottom sheet up
      if (newY < 0) return; 
      translateY.value = newY;
    },
    onEnd: () => {
      runOnJS(navigation.goBack)();
      }
    });
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const dynamicStyles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: Colors.PRIMARY_50,
    height: screenHeight * 0.2, // 50% of the screen height
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    gap: 10,
  }
});


  return (
    <View style={styles.container}>
      <PanGestureHandler onGestureEvent={panGestureEvent}>
        <Animated.View style={[dynamicStyles.bottomSheet, animatedStyle]}>
        {/* <View style={styles.blackTab}/> */}
        {/* <View style={styles.bottomSheet}> */}
            <TextElement>Filters</TextElement>
            <Divider/>
            <View style={styles.optionsContainer}>
              <IconButtonElement 
                  inUse={true}
                  IconInUse={<SVGs.NewBellBlack />}
                  IconNotInUse={<SVGs.NewBellWhite />}
                  onPress={handleShowSaved}
                  text={"New"}
                />
                <IconButtonElement 
                inUse={!state.currentlyViewingMapView[MapPinCities.newYork]}
                IconInUse={<SVGs.HeartFill />}
                IconNotInUse={<SVGs.HeartEmpty />}
                onPress={handleShowSaved}
                text={"Following"}
              />
              {
                state.isViewingSaved && (
                  <IconButtonElement 
                    inUse={!state.isViewingWalkingRoute}
                    IconInUse={<SVGs.FigureWalkingLogoBlack />}
                    IconNotInUse={<SVGs.FigureWalkingLogoWhite />}
                    onPress={handleShowRoute}
                    text={"Route"}
                  />
                )
              }
            </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};
