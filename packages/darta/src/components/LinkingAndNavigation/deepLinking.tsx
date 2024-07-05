import React, { useEffect, useState } from 'react';
import { ETypes, StoreContext, UIStoreContext, UiETypes, GalleryStoreContext, GalleryETypes, ExhibitionStoreContext, ExhibitionETypes, UserStoreContext } from '../../state';
import * as Linking from 'expo-linking';
import { ExhibitionPreviewEnum, ExhibitionRootEnum, ListEnum, RecommenderRoutesEnum } from '../../typing/routes';
import { readExhibition, readMostRecentGalleryExhibitionForUser } from '../../api/exhibitionRoutes';
import { listGalleryExhibitionPreviewForUser, readGallery } from '../../api/galleryRoutes';
import { createGalleryRelationshipAPI } from '../../utils/apiCalls';
import { readListForUser } from '../../api/listRoutes';
import { FullList } from '@darta-types/dist';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants  from 'expo-constants';
import { editDartaUserAccount, saveExpoPushTokenAPI } from '../../api/userRoutes';



export function useDeepLinking(navigation) {
  const {dispatch} = React.useContext(StoreContext);
  const { userState } = React.useContext(UserStoreContext);
  const {uiDispatch} = React.useContext(UIStoreContext);
  const {galleryDispatch} = React.useContext(GalleryStoreContext);
  const {exhibitionDispatch} = React.useContext(ExhibitionStoreContext);

  const notificationListener = React.useRef<Notifications.Subscription>();
  const responseListener = React.useRef<Notifications.Subscription>();


  async function fetchMostRecentExhibitionData({locationId} : {locationId: string}): Promise<{exhibitionId: string, galleryId: string} | void> {
    try {
        const {exhibition, gallery} = await readMostRecentGalleryExhibitionForUser({locationId})
        const supplementalExhibitions = await listGalleryExhibitionPreviewForUser({galleryId: gallery._id})
        const galleryData = {...gallery, galleryExhibitions: supplementalExhibitions}
        galleryDispatch({
            type: GalleryETypes.saveGallery,
            galleryData: galleryData,
        })
        uiDispatch({
            type: UiETypes.setCurrentHeader,
            currentExhibitionHeader: exhibition.exhibitionTitle.value!,
          })
          exhibitionDispatch({
            type: ExhibitionETypes.saveExhibition,
            exhibitionData: exhibition,
        })
        dispatch({
            type: ETypes.setQRCodeExhibitionId,
            qRCodeExhibitionId: exhibition?._id,
        })
        dispatch({
            type: ETypes.setQRCodeGalleryId,
            qrCodeGalleryId: gallery._id,
        })
        return {
            exhibitionId: exhibition._id,
            galleryId: gallery._id
        }
    } catch (error: any){
        // console.log(error)
    }
}


async function fetchExhibitionById({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string} ): Promise<{exhibitionId: string, galleryId: string} | void> {
  try {
      const [gallery, supplementalExhibitions, exhibition] = await Promise.all([
        readGallery({ galleryId }),
        listGalleryExhibitionPreviewForUser({ galleryId }),
        readExhibition({ exhibitionId })
    ])
      const galleryData = { ...gallery, galleryExhibitions: supplementalExhibitions };
      galleryDispatch({
          type: GalleryETypes.saveGallery,
          galleryData: galleryData,
      })
      uiDispatch({
        type: UiETypes.setCurrentHeader,
        currentExhibitionHeader: exhibition.exhibitionTitle.value!,
      })
      exhibitionDispatch({
          type: ExhibitionETypes.saveExhibition,
          exhibitionData: exhibition,
      })
      dispatch({
          type: ETypes.setQRCodeExhibitionId,
          qRCodeExhibitionId: exhibition?._id,
      })
      dispatch({
          type: ETypes.setQRCodeGalleryId,
          qrCodeGalleryId: gallery._id,
      })
      return {
          exhibitionId: exhibition._id,
          galleryId: gallery._id
      }
  } catch (error: any){
      // console.log(error)
  }
}

async function fetchListById({listId} : {listId: string}): Promise<FullList | void>{
  try {
    const list = await readListForUser({ listId })
    dispatch({
      type: ETypes.setUserLists,
      userLists: list,
    })
    return Object.values(list)[0]
  } catch (error: any){
    // console.log(error)
  }
}

const handleDeepLink = async (event) => {
  const params = Linking.parse(event.url).queryParams;

  if (params && params.locationId) {
    navigation.navigate('exhibitions', { screen: ExhibitionRootEnum.genericLoading });
    try {
      const res = await fetchMostRecentExhibitionData({locationId: params.locationId.toString()});
      if (res) {
        const {exhibitionId, galleryId} = res;
        navigation.navigate('exhibitions', {
          screen: ExhibitionRootEnum.qrRouter,
          params: {
            screen: ExhibitionRootEnum.exhibitionDetails,  
            params: {
              exhibitionId,
              galleryId
            }
          }
        });
        await createGalleryRelationshipAPI({galleryId});
      }
    } catch(error) {
      return;
      // Handle error
    }
  } else if (params && params.exhibitionId && params.galleryId) {
    navigation.navigate('exhibitions', { screen: ExhibitionRootEnum.genericLoading });
    try {
      const res = await fetchExhibitionById({exhibitionId: params.exhibitionId.toString(), galleryId: params.galleryId.toString()});
      if (res) {
        const {exhibitionId, galleryId} = res;
        navigation.navigate('exhibitions', {
          screen: ExhibitionRootEnum.qrRouter,
          params: {
            screen: ExhibitionRootEnum.exhibitionDetails,  
            params: {
              exhibitionId,
              galleryId,
            }
          }
        });
      }
    } catch(error) {
      // Handle error
    }
  } else if (params && params.listId) {
    try {
      const res = await fetchListById({listId: params.listId.toString()});
      uiDispatch({
        type: UiETypes.setListHeader,
        currentExhibitionHeader: res?.listName ?? ""
      });
      navigation.navigate('Visit', {
        screen: RecommenderRoutesEnum.recommenderFullList,
        params: {
          screen: ListEnum.fullList,  
          params: {
            listId: params.listId.toString(),
          }
        }
      });
    } catch(error) {
      return;
      // Handle error
    }
  } else {
    // Handle invalid deep link
  }
};

const handlePushNotification = async (response) => {
  const { data } = response.notification.request.content;
  if (!data?.showUpcomingScreen) {
    const res = await fetchExhibitionById({
      exhibitionId: data.exhibitionId.toString(),
      galleryId: data.galleryId.toString(),
    });
    if (res) {
      const { exhibitionId, galleryId } = res;
      navigation.navigate('exhibitions', {
        screen: ExhibitionRootEnum.qrRouter,
        params: {
          screen: ExhibitionRootEnum.exhibitionDetails,
          params: {
            exhibitionId,
            galleryId,
          },
        },
      });
    }
  } else {
    navigation.navigate('exhibitions', {
      screen: ExhibitionPreviewEnum.forthcoming,
    });
  }
};
  // state to track if initialURL has been processed
  const [urlsProcessed, setUrlsProcessed] = useState<string[]>([]);
  useEffect(() => {
    const checkInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && urlsProcessed.includes(initialUrl) === false) {
        handleDeepLink({ url: initialUrl });
        setUrlsProcessed([...urlsProcessed, initialUrl]);
      }
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

    // check the initial URL
    checkInitialURL();

    // register for push notifications
    registerForPushNotificationsAsync().then(async (token) => {
      console.log({token})
      if (token) {
        saveExpoPushTokenAPI({expoPushToken: token})
      }
    })

    // set up the event listener for deep linking
    const deepLinkSubscription = Linking.addEventListener('url', handleDeepLink);

    // set up the event listener for push notifications
    const pushNotificationSubscription = Notifications.addNotificationResponseReceivedListener(handlePushNotification);

    // cleanup the event listeners on component unmount
    return () => {
      deepLinkSubscription.remove();
      Notifications.removeNotificationSubscription(pushNotificationSubscription);

      notificationListener.current &&
      Notifications.removeNotificationSubscription(
        notificationListener.current,
      );
    responseListener.current &&
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [navigation, handleDeepLink, urlsProcessed]);
}
