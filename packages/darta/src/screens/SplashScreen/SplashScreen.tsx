import { PRIMARY_400, } from "@darta-styles";
import { Asset } from "expo-asset";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { Image } from "react-native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
} from "react-native";
import { listAllExhibitionsPreviewsForUser } from "../../api/exhibitionRoutes";
import { ETypes, StoreContext } from "../../state/Store";
import { ArtworkObject, Exhibition, ExhibitionPreview, IGalleryProfileData, MapPinCities } from "@darta-types";
import { listExhibitionPinsByCity } from "../../api/locationRoutes";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {USER_UID_KEY} from '../../utils/constants'
import { v4 as uuidv4 } from 'uuid';
import auth from '@react-native-firebase/auth';
import { createUser } from "../../api/userRoutes";


SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

function AnimatedSplashScreen({ children }) {
  const {state, dispatch} = React.useContext(StoreContext)
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);
  
  const getUserLocalUid = async () => {
    // await auth()
    // .signOut()
    // .then(() => console.log('User signed out!'));
    // await AsyncStorage.setItem(USER_UID_KEY, "")
      try {
          let userUid = await AsyncStorage.getItem(USER_UID_KEY);
          const uid = auth().currentUser?.uid
          if (!userUid && !uid) {
              userUid = uuidv4();
              if(userUid) {
                await AsyncStorage.setItem(USER_UID_KEY, userUid)
                await createUser({localStorageUid: userUid})
              };
          }

          return userUid;
      } catch (error) {
          console.error('Failed to get user UID:', error);
          return null;
      }
  }

  const onImageLoaded = useCallback(async () => {
    try {
      const userUuid = await getUserLocalUid();
      if (userUuid) {
        dispatch({
          type: ETypes.setUser,
          userData: {
            localStorageUid: userUuid
          }
        })
      }

      const exhibitionPreviews = await listAllExhibitionsPreviewsForUser({limit: 2})
      
      const exhibitionMapPins = await listExhibitionPinsByCity({cityName: MapPinCities.newYork})
      dispatch({type: ETypes.saveExhibitionMapPins, mapPins: exhibitionMapPins, mapPinCity: MapPinCities.newYork})
      
      

      const imageUrls: string[] = []
      const artworkImages: any = []
      const exhibitionImages: any = []
      Object.values(exhibitionPreviews).forEach((exhibitionValue) => {
        if (exhibitionValue?.artworkPreviews){
          Object.values(exhibitionValue?.artworkPreviews).forEach((artwork) => {
            artworkImages.push(
              Image.prefetch(artwork?.artworkImage.value)
            )
            imageUrls.push(artwork?.artworkImage.value)
          })
        } if (exhibitionValue?.exhibitionPrimaryImage?.value){
          exhibitionImages.push(
            Image.prefetch(exhibitionValue.exhibitionPrimaryImage?.value)
          )
        } if (exhibitionValue?.galleryLogo.value){
          exhibitionImages.push(
            Image.prefetch(exhibitionValue?.galleryLogo.value)
          )
        }
      })
      
      try{
        Promise.all(artworkImages)
  
        Promise.all(exhibitionImages)
      } catch {

      }

      dispatch({type: ETypes.saveExhibitionPreviews, exhibitionPreviews})

      await SplashScreen.hideAsync();
    } catch (e) {
      console.log(e)
    } finally {
      setAppReady(true);
    }
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: PRIMARY_400,
              opacity: animation,
              display: "flex",
              height: "100%",
              width: "100%",
              alignSelf: "center",
              alignItems: "center",
            },
          ]}
        >
          <Animated.Image
            style={{
              width: "50%",
              height: "50%",
              resizeMode:  "contain",
              transform: [
                {
                  scale: animation,
                },
              ],
            }}
            source={require('../../assets/dartahousewhite.png')}
            onLoadEnd={onImageLoaded}
            fadeDuration={30}
          />
        </Animated.View>
      )}
    </View>
  );
}

export function AnimatedAppLoader({ children }) {
  const [isSplashReady, setSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      setSplashReady(true);
    }

    prepare();
  }, []);

  if (!isSplashReady) {
    return null;
  }

  return <AnimatedSplashScreen>{children}</AnimatedSplashScreen>;
}


