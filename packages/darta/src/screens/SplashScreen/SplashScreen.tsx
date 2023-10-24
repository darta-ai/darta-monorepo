import * as Colors from "@darta-styles";
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
import { Artwork, GalleryPreview, MapPinCities, USER_ARTWORK_EDGE_RELATIONSHIP } from "@darta-types";
import { listExhibitionPinsByCity } from "../../api/locationRoutes";
import { getDartaUser } from "../../api/userRoutes";
import { getUserUid } from "../../utils/functions";
import { listArtworksToRateAPI, listGalleryRelationshipsAPI, listUserArtworkAPI } from "../../utils/apiCalls";
import { DEFAULT_Gallery_Image } from "../../utils/constants";

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
 

  const onImageLoaded = useCallback(async () => {
    try {
      const uid = await getUserUid();
  
      const [
        user,
        galleryFollows,
        exhibitionPreviews,
        exhibitionMapPins,
        likedArtwork,
        savedArtwork,
        inquiredArtwork,
        artworksToRate
      ] = await Promise.all([
        // user
        uid ? getDartaUser({uid}) : null,
        //galleryFollows
        listGalleryRelationshipsAPI(),
        //exhibitionPreviews
        listAllExhibitionsPreviewsForUser({ limit: 10 }),
        // exhibitionMapPins
        listExhibitionPinsByCity({ cityName: MapPinCities.newYork }),
        // likedArtwork
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE, limit: 100 }),
        // savedArtwork
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE, limit: 100 }),
        // inquiredArtwork
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE, limit: 100 }),
        // artworksToRate
        listArtworksToRateAPI({startNumber: 0, endNumber: 10})
      ]);

  
      if (user) {
        dispatch({
          type: ETypes.setUser,
          userData: user
        });
      }

      if(artworksToRate){
        dispatch({
          type: ETypes.setArtworksToRate,
          artworksToRate
        })
      }
  
      if (galleryFollows?.length) {
        const galleryPreviews: {[key: string] : GalleryPreview} = galleryFollows.reduce((acc, el) => ({ ...acc, [el?._id]: el }), {})
        dispatch({
          type: ETypes.setGalleryPreviewMulti,
          galleryPreviews
        });
        dispatch({
          type: ETypes.setUserFollowGalleriesMulti,
          galleryFollowIds: galleryFollows.reduce((acc, el) => ({ ...acc, [el?._id]: true }), {})
        });
      }
  
      if (exhibitionMapPins) {
        dispatch({
          type: ETypes.saveExhibitionMapPins,
          mapPins: exhibitionMapPins,
          mapPinCity: MapPinCities.newYork
        });
      }
  
      const processArtworkData = (data: any, dispatchType: ETypes) => {
        if (data && Object.values(data).length > 0) {
          let artworkIds: { [key: string]: boolean } = {};
          artworkIds = Object.values(data).reduce((acc: any, el: any) => ({ ...acc, [el?._id]: true }), {}) as { [key: string]: boolean };
          dispatch({
            type: dispatchType,
            artworkIds
          });
        }
        return data;
      };

      const likedArtworkData = processArtworkData(likedArtwork, ETypes.setUserLikedArtworkMulti);
      const savedArtworkData = processArtworkData(savedArtwork, ETypes.setUserSavedArtworkMulti);
      const inquiredArtworkData = processArtworkData(inquiredArtwork, ETypes.setUserInquiredArtworkMulti);
  
      const combinedArtwork: {[key: string] : Artwork} = { ...likedArtworkData, ...savedArtworkData, ...inquiredArtworkData };
      if (combinedArtwork && Object.values(combinedArtwork).length > 0) {
        dispatch({
          type: ETypes.saveArtworkMulti,
          artworkDataMulti: combinedArtwork
        });
      }
  
      const prefetchImageUrls: Promise<boolean>[] = [];
  
      const addImageUrlToPrefetch = (url: string) => {
        if (url) {
          prefetchImageUrls.push(Image.prefetch(url));
        }
      };
  
      for (let artworkValue of Object.values(combinedArtwork)) {
        if (artworkValue?.artworkImage?.value){
          addImageUrlToPrefetch(artworkValue?.artworkImage?.value);
        }
      }
  
      for (let exhibitionValue of Object.values(exhibitionPreviews)) {
        if (exhibitionValue?.artworkPreviews) {
          for (let art of Object.values(exhibitionValue?.artworkPreviews)) {
            addImageUrlToPrefetch(art?.artworkImage?.value);
          }
        }
        
        addImageUrlToPrefetch(exhibitionValue?.exhibitionPrimaryImage?.value);
        if (exhibitionValue?.galleryLogo?.value) addImageUrlToPrefetch(exhibitionValue?.galleryLogo?.value);
      }
      
  
      Promise.all(prefetchImageUrls);
      await Image.prefetch(DEFAULT_Gallery_Image)
  
      dispatch({type: ETypes.saveExhibitionPreviews, exhibitionPreviews})
  
      await SplashScreen.hideAsync();
    } catch (e) {
      console.log(e);
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
              backgroundColor: Colors.PRIMARY_600,
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


