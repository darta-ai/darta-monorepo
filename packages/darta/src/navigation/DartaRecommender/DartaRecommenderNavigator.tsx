import * as Colors from '@darta-styles';
import React from 'react';

import { UIStoreContext} from '../../state';
import {backButtonStyles, headerOptions} from '../../styles/styles';
import {ExhibitionRootEnum, RecommenderRoutesEnum} from '../../typing/routes';
import { View, Platform} from 'react-native';
import { DartaRecommenderTopTab } from './DartaRecommenderTopTab';
import { useNavigation, useNavigationContainerRef } from '@react-navigation/native';
import { useDeepLinking } from '../../components/LinkingAndNavigation/deepLinking';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { AddToListScreen } from '../../screens/Lists/AddToList';
import { TextElement } from '../../components/Elements/TextElement';
import { DartaRecommenderViewFlatList } from '../../screens/DartaRecommenderViewFlatList';
import { ListTopTab } from '../List/ListTopTab';
import * as SVGs from '../../assets/SVGs';
import { DartaRecommenderPreviousTopTab } from './DartaPreviousTopTab';
import { ArtworkScreen } from '../../screens/Artwork/ArtworkScreen';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants  from 'expo-constants';



import { editDartaUserAccount } from '../../api/userRoutes';

export const RecommenderStack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});



export function DartaRecommenderNavigator() {
  const {uiState} = React.useContext(UIStoreContext);

  const navigation: any = useNavigation();
  useDeepLinking(navigation);

  const notificationListener = React.useRef<Notifications.Subscription>();
  const responseListener = React.useRef<Notifications.Subscription>();

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
        // handleRegistrationError('Permission not granted to get push token for push notification!');
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        // handleRegistrationError('Project ID not found');
      }
      try {
      const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        return pushTokenString;
      } catch (e: unknown) {
        return;
        // handleRegistrationError(`${e}`);
      }
    } else {
      return;
      // handleRegistrationError('Must use physical device for push notifications');
    }
    }

  React.useEffect(() => {
    registerForPushNotificationsAsync()
      .then(async (token) => {
        if (token){
          editDartaUserAccount({expoPushToken: token})
        }
      })

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          const { data } = response.notification.request.content;
          if (!data?.showUpcomingScreen) {
            navigation.navigate('exhibitions', {
              screen: ExhibitionRootEnum.qrRouter,
              params: {
                screen: ExhibitionRootEnum.exhibitionDetails,
                params: {
                  exhibitionId: data?.exhibitionId,
                  galleryId: data?.galleryId,
                },
              },
            });
          } else {
            navigation.navigate('exhibitions', {
              screen: ExhibitionRootEnum.TopTab,
            });
          }
        });

      return () => {
        notificationListener.current &&
          Notifications.removeNotificationSubscription(
            notificationListener.current,
          );
        responseListener.current &&
          Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, []);

  return (
    <RecommenderStack.Navigator 
      screenOptions={{
        headerTintColor: Colors.PRIMARY_950, 
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, 
        headerBackImage: () => (
          <View style={backButtonStyles.backButton}>
            <BackButtonIcon />
          </View>
        ), 
        headerBackTitleVisible: false,
      }}
      >
        <RecommenderStack.Group>
          <RecommenderStack.Screen
            name={RecommenderRoutesEnum.recommenderHome}
            component={DartaRecommenderViewFlatList}
            options={{...headerOptions, 
              headerTitle: 'View'
            }}
          />
          <RecommenderStack.Screen
            name={RecommenderRoutesEnum.TopTabExhibition}
            component={DartaRecommenderTopTab}
            options={{...headerOptions, headerTitle: uiState.currentArtworkTombstoneHeader ?? ""}}
          />
          <RecommenderStack.Screen
            name={RecommenderRoutesEnum.recommenderIndividualArtwork}
            component={ArtworkScreen}
            options={{...headerOptions, headerTitle: uiState.currentArtworkTombstoneHeader ?? ""}}
            initialParams={{saveRoute: RecommenderRoutesEnum.recommenderLists, addPaddingTop: true}}
          />
          <RecommenderStack.Screen
            name={RecommenderRoutesEnum.TopTabPreviousExhibition}
            component={DartaRecommenderPreviousTopTab}
            options={{...headerOptions, headerTitle: uiState.currentExhibitionHeader ?? ""}}
          />
        </RecommenderStack.Group>
        <RecommenderStack.Group 
          screenOptions={{
              presentation: 'transparentModal',
              cardStyle: {backgroundColor: 'transparent'},
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {
                    duration: 550, // Duration in milliseconds, adjust as needed
                  },
                },
                close: {
                  animation: 'timing',
                  config: {
                    duration: 550, // Duration in milliseconds, adjust as needed
                  },
                },
              },
            }}>
            <RecommenderStack.Screen
              name={RecommenderRoutesEnum.recommenderLists}
              component={AddToListScreen}
              options={{ 
                headerMode: 'float', 
                cardStyle: {opacity: 1, margin:0, backgroundColor: 'transparent', width: '100%'}, 
                headerTitle: 'Add to list',
                headerTintColor: Colors.PRIMARY_50,
                headerStyle: {
                  backgroundColor: Colors.PRIMARY_950, 
                  opacity: 0.9,
                },
                headerBackImage: () => (
                  <View style={backButtonStyles.backButton}>
                    <TextElement style={{color: Colors.PRIMARY_50}}>Cancel</TextElement>
                  </View>
              ), 
            }}/>
            <RecommenderStack.Screen
              name={RecommenderRoutesEnum.recommenderGallery}
              component={ExhibitionGalleryScreen}
              initialParams={{showPastExhibitions: false, navigationRoute: RecommenderRoutesEnum.TopTabPreviousExhibition}}
              options={{...headerOptions, headerTitle: uiState?.galleryHeader ?? ""}}
              />
            <RecommenderStack.Screen
              name={RecommenderRoutesEnum.recommenderFullList}
              component={ListTopTab}
              initialParams= {{
                navigateToGalleryParams: RecommenderRoutesEnum.recommenderGallery,
              }}
              options={{
                headerTintColor: Colors.PRIMARY_950,
                headerStyle: {
                  backgroundColor: Colors.PRIMARY_50, 
                }, 
                headerBackImage: () => (
                  <View style={backButtonStyles.backButton}>
                    <SVGs.BackButtonIcon />
                  </View>
              ), 
              headerTitle: uiState.listHeader ?? ""}}
            />
          </RecommenderStack.Group>
    </RecommenderStack.Navigator>
  );
}
