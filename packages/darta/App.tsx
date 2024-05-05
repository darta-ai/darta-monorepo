import 'react-native-gesture-handler';

import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import { ExploreMapStackNavigator } from './src/navigation/ExploreMap/ExploreMapStackNavigator';
import { StatusBar, Platform, Alert, Linking} from 'react-native';
import React from 'react';
import {Provider as PaperProvider} from 'react-native-paper';
import * as Colors from '@darta-styles';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import analytics from '@react-native-firebase/analytics';

import {
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import {ExhibitionStackNavigator} from './src/navigation/Exhibition/ExhibitionStackNavigator';
import {UserStackNavigator} from './src/navigation/User/UserStackNavigator';
import StoreProvider  from './src/state/index';

import * as SplashScreen from 'expo-splash-screen';
import {AnimatedAppLoader} from './src/screens/SplashScreen/SplashScreen';

import {
  useFonts,
  DMSans_400Regular,
  DMSans_400Regular_Italic,
  DMSans_500Medium,
  DMSans_500Medium_Italic,
  DMSans_700Bold,
  DMSans_700Bold_Italic,
} from '@expo-google-fonts/dm-sans';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { DartaRecommenderNavigator } from './src/navigation/DartaRecommender/DartaRecommenderNavigator';
import * as SVGs from './src/assets/SVGs';
import { ExhibitionRootEnum, ExploreMapRootEnum, RecommenderRoutesEnum, UserRoutesEnum, ExhibitionPreviewEnum} from './src/typing/routes';
import ErrorBoundary from './src/components/ErrorBoundary/ErrorBoundary';
import { UserETypes, UserStoreContext } from './src/state/UserStore';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import remoteConfig from '@react-native-firebase/remote-config';
import Constants  from 'expo-constants';

export const RecommenderStack = createStackNavigator();
export const RootStack = createMaterialBottomTabNavigator();



Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}


function handleRegistrationError(errorMessage: string) {
alert(errorMessage);
throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
if (Platform.OS === 'android') {
  Notifications.setNotificationChannelAsync('default', {
    name: 'default',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#FF231F7C',
  });
}

if (Device.isDevice) {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    handleRegistrationError('Permission not granted to get push token for push notification!');
    return;
  }
  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
  }
  try {
  const pushTokenString = (
      await Notifications.getExpoPushTokenAsync({
        projectId,
      })
    ).data;
    // console.log(pushTokenString);
    return pushTokenString;
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
} else {
  handleRegistrationError('Must use physical device for push notifications');
}
}


function App() {
  const {userDispatch} = React.useContext( UserStoreContext );

  // const [expoPushToken, setExpoPushToken] = React.useState('');
  // const [notification, setNotification] = React.useState<
  //   Notifications.Notification | undefined
  // >(undefined);
  // const notificationListener = React.useRef<Notifications.Subscription>();
  // const responseListener = React.useRef<Notifications.Subscription>();

  // Uncomment for push notifications
  // React.useEffect(() => {
  //   registerForPushNotificationsAsync()
  //     .then((token) => setExpoPushToken(token ?? ''))
  //     .catch((error: any) => setExpoPushToken(`${error}`));

  //   notificationListener.current =
  //     Notifications.addNotificationReceivedListener((notification) => {
  //       setNotification(notification);
  //     });

  //   responseListener.current =
  //     Notifications.addNotificationResponseReceivedListener((response) => {
  //       console.log(response);
  //     });

  //     return () => {
  //       notificationListener.current &&
  //         Notifications.removeNotificationSubscription(
  //           notificationListener.current,
  //         );
  //       responseListener.current &&
  //         Notifications.removeNotificationSubscription(responseListener.current);
  //     };
  //   }, []);

  React.useEffect(() => {
    auth().onAuthStateChanged((userState: FirebaseAuthTypes.User | null) => {
      if (userState?.uid && userState.email) {
        userDispatch({
          type: UserETypes.setUser,
          userData: {
            uid: userState.uid,
            email: userState.email,
          }
        })
      } else{
        userDispatch({
          type: UserETypes.setUser,
          userData: {
            uid: "",
            email: "",
          }
        })
      }
      })
    checkForUpdate()
  }, []);



  try{
    useFonts({
      DMSans_400Regular,
      DMSans_400Regular_Italic,
      DMSans_500Medium,
      DMSans_500Medium_Italic,
      DMSans_700Bold,
      DMSans_700Bold_Italic,
    });
  } catch{
    console.log("error loading fonts")
  } 

  const theme = {
    ...DefaultTheme,
    // Specify custom property
    myOwnProperty: true,
    // Specify custom property in nested object
    colors: {
      ...DefaultTheme.colors,
      myOwnColor: '#BADA55',
      secondaryContainer: Colors.PRIMARY_50,
      underlineColor: 'transparent', 
      background: Colors.PRIMARY_50,
    },
  };

  const [isTabVisible, setIsTabVisible] = React.useState(true);

  function getActiveRouteName(state) {
    const route = state.routes[state.index];
    if (route?.state) {
      // Dive into nested navigators
      return getActiveRouteName(route.state);
    }
    return route.name;
  }
  

  const navigationRef = useNavigationContainerRef();
  const routeNameRef = React.useRef();

  const handleNavigationChange = (state) => {
    // Find the current active route
    const route = getActiveRouteName(state);
    // Based on the route, decide whether to show or hide the tab bar
    const showTabBarRoutes = {
      [RecommenderRoutesEnum.recommenderHome]: true,
      [ExhibitionRootEnum.exhibitionHome]: true,
      [ExhibitionPreviewEnum.onView]: true,
      [ExhibitionPreviewEnum.following]: true,
      [ExhibitionPreviewEnum.forthcoming]: true,
      [ExploreMapRootEnum.exploreMapHome]: true,
      [ExhibitionRootEnum.exhibitionDetails]: true,
      [ExhibitionRootEnum.exhibitionGallery]: true,
      [ExhibitionRootEnum.artworkList]: true,
      [ExploreMapRootEnum.exploreMapGallery]: true, 
      // [ExploreMapRootEnum.bottomSheetOptions]: true,
      [UserRoutesEnum.home]: true,
      [UserRoutesEnum.userSavedArtwork]: true,
      [UserRoutesEnum.userInquiredArtwork]: true,
      [UserRoutesEnum.UserGalleryAndArtwork]: true,
      [UserRoutesEnum.UserPastTopTabNavigator]: true,
      [UserRoutesEnum.UserGallery]: true,
      [ExhibitionRootEnum.genericLoading]: true,
      [ExploreMapRootEnum.exploreRouterFullList]: true,
    }
    setIsTabVisible(showTabBarRoutes[route]);
  };

  // remote config

  const checkForUpdate = async () => { 
    let currentVersion = "";
    const isAndroid = Platform.OS === 'android';
    const isIOS = Platform.OS === 'ios';
    const removeVersion = Constants.expoConfig?.version;
    // use remote config to get the current version
    await remoteConfig().fetchAndActivate();
  
    const promptUpdate = remoteConfig().getValue("promptUpdate").asBoolean();
    isAndroid && (currentVersion = remoteConfig().getValue("currentAndroidVersion").asString());
    isIOS && (currentVersion = remoteConfig().getValue("currentIOSVersion").asString());
  
    // if the current version is not the same as the app version, show an alert to download the app
    if (promptUpdate && currentVersion !== removeVersion) {
      Alert.alert(
        "Fantastic New Update Available",
        "A new version of the app is available. Please download the latest version from the app store.",
        [
          {
            text: "OK",
            onPress: () => {
              if (isAndroid) {
                Linking.openURL("https://play.google.com/store/apps/details?id=com.darta");
              } else if (isIOS) {
                Linking.openURL("https://apps.apple.com/us/app/darta-digital-art-advisor/id6469072913");
              }
            },
          },
        ]
      );
    }
    }

   return (
      <PaperProvider theme={theme}>
        <StoreProvider>
          <ErrorBoundary>
            <NavigationContainer ref={navigationRef} onStateChange={(state) => {
              handleNavigationChange(state)
              const previousRouteName = routeNameRef.current;
              const currentRouteName = navigationRef?.getCurrentRoute()?.name;
              const isDev = process.env.EXPO_PUBLIC_ENVIRONMENT === "development";
              if (previousRouteName !== currentRouteName && !isDev) {
                analytics().logEvent(`screen_view`, {
                  screen_name: currentRouteName,
                });
              }
              }}>
              <AnimatedAppLoader>
                <StatusBar barStyle="dark-content" />
                  <RootStack.Navigator 
                  initialRouteName="explore"
                  activeColor={Colors.PRIMARY_950}
                  inactiveColor={Colors.PRIMARY_300}
                  backBehavior={'order'}
                  barStyle={{ backgroundColor: Colors.PRIMARY_50, paddingBottom: 0, height: isTabVisible ? heightPercentageToDP('12.5%') : heightPercentageToDP('0%'), display: isTabVisible ? 'flex' : 'none'}}
                  labeled={true} 
                  >
                    <RootStack.Screen
                      name="View"
                      component={DartaRecommenderNavigator}
                      options={{
                        tabBarLabel: "View",
                        tabBarIcon: ({ focused }) => {
                          return (
                          focused ? <SVGs.ViewFocusedIcon /> : <SVGs.ViewUnfocusedIcon />
                        )},
                      }}
                    />
                    <RootStack.Screen
                      name="exhibitions"
                      component={ExhibitionStackNavigator}
                      options={{
                        tabBarLabel: "Exhibitions",
                        tabBarIcon: ({ focused }) => (
                          focused ? <SVGs.PaletteFocusedIcon /> : <SVGs.PaletteUnfocusedIcon />
                        )
                      }}
                    />
                    <RootStack.Screen
                      name="Visit"
                      component={ExploreMapStackNavigator}
                      options={{
                        tabBarLabel: "Visit",
                        tabBarIcon: ({ focused }) => (
                          focused ? <SVGs.VisitFocusedIcon /> : <SVGs.VisitUnfocusedIcon />
                        )
                      }}
                    />
                    <RootStack.Screen
                      name="Profile"
                      component={UserStackNavigator}
                      options={{
                        tabBarLabel: "Profile",
                        tabBarIcon: ({ focused }) => (
                          focused ? <SVGs.ProfileFocusedIcon /> : <SVGs.ProfileUnfocusedIcon />
                        )
                      }}
                    />
                  </RootStack.Navigator>
                </AnimatedAppLoader>  
              </NavigationContainer>
            </ErrorBoundary>
          </StoreProvider>
        </PaperProvider>
    );
}

export default App;
