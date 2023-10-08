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

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

function AnimatedSplashScreen({ children }) {
  const {dispatch} = React.useContext(StoreContext)
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
  

  const onImageLoaded = useCallback(async () => {
    try {
      const {galleries, exhibitions, exhibitionPreviews} : 
      {galleries: {[key: string] : IGalleryProfileData}, exhibitions: {[key: string] : Exhibition}, artwork: ArtworkObject, exhibitionPreviews: {[key: string]: ExhibitionPreview}} = await listAllExhibitionsPreviewsForUser({limit: 10})
      
      const exhibitionMapPins = await listExhibitionPinsByCity({cityName: MapPinCities.newYork})
      dispatch({type: ETypes.saveExhibitionMapPins, mapPins: exhibitionMapPins, mapPinCity: MapPinCities.newYork})
      
      const artworkImages: any = []
      let artwork: ArtworkObject = {};
      Object.values(exhibitions).forEach((exhibitionValue) => {
        if (exhibitionValue?.artworks){
          artwork = {
            ...artwork,
            ...exhibitionValue.artworks
          }
          Object.values(exhibitionValue.artworks).forEach((artworkValue) => {
            if (artworkValue.artworkImage?.value){
              artworkImages.push(Image.prefetch(artworkValue.artworkImage.value))
            }
          })
        }
      })
      Promise.all(artworkImages)


      const exhibitionImages: any = []

      Object.values(exhibitions).forEach((exhibitionValue) => {
        if (exhibitionValue.exhibitionPrimaryImage?.value){
          exhibitionImages.push(Image.prefetch(exhibitionValue.exhibitionPrimaryImage.value))
        }
      })

      Promise.all(exhibitionImages)

      dispatch({type: ETypes.saveExhibitionPreviews, exhibitionPreviews})
      dispatch({type: ETypes.saveGalleries, galleryDataMulti: galleries})
      dispatch({type: ETypes.saveArtworkMulti, artworkDataMulti: artwork})
      dispatch({type: ETypes.saveExhibitionMulti, exhibitionDataMulti: exhibitions})
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


