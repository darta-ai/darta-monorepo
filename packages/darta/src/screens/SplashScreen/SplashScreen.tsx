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
import { Artwork, MapPinCities, USER_ARTWORK_EDGE_RELATIONSHIP } from "@darta-types";
import { listExhibitionPinsByCity } from "../../api/locationRoutes";
import { getDartaUser } from "../../api/userRoutes";
import { getUserLocalUid } from "../../utils/functions";
import { listGalleryRelationships, listUserArtwork } from "../../utils/apiCalls";
import { listDartaUserFollowsGallery } from "../../api/galleryRoutes";


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
 

  const onImageLoaded2 = useCallback(async () => {
    try {
      const userUuid = await getUserLocalUid();
  
      const [
        user,
        galleryFollows,
        exhibitionPreviews,
        exhibitionMapPins,
        likedArtwork,
        savedArtwork,
        inquiredArtwork
      ] = await Promise.all([
        userUuid ? getDartaUser({ localStorageUid: userUuid }) : null,
        listGalleryRelationships(),
        listAllExhibitionsPreviewsForUser({ limit: 2 }),
        listExhibitionPinsByCity({ cityName: MapPinCities.newYork }),
        listUserArtwork({ action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE, limit: 10 }),
        listUserArtwork({ action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE, limit: 10 }),
        listUserArtwork({ action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE, limit: 10 })
      ]);
  
      if (user) {
        dispatch({
          type: ETypes.setUser,
          userData: user
        });
      }
  
      if (galleryFollows?.length) {
        dispatch({
          type: ETypes.setGalleryPreviewMulti,
          galleryPreviews: galleryFollows.reduce((acc, el) => ({ ...acc, [el?._id]: true }), {})
        });
      }
  
      if (exhibitionMapPins) {
        dispatch({
          type: ETypes.saveExhibitionMapPins,
          mapPins: exhibitionMapPins,
          mapPinCity: MapPinCities.newYork
        });
      }
  
      const processArtworkData = (data, dispatchType) => {
        if (data && Object.values(data).length > 0) {
          const artworkIds = Object.values(data).reduce((acc, el) => ({ ...acc, [el?._id]: true }), {});
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
  
      const combinedArtwork = { ...likedArtworkData, ...savedArtworkData, ...inquiredArtworkData };
      if (combinedArtwork && Object.values(combinedArtwork).length > 0) {
        dispatch({
          type: ETypes.saveArtworkMulti,
          artworkDataMulti: combinedArtwork
        });
      }
  
      const prefetchImageUrls: Promise<boolean>[] = [];
  
      const addImageUrlToPrefetch = url => {
        if (url) {
          prefetchImageUrls.push(Image.prefetch(url));
        }
      };
  
      for (let artworkValue of Object.values(combinedArtwork)) {
        addImageUrlToPrefetch(artworkValue?.artworkImage?.value);
      }
  
      for (let exhibitionValue of Object.values(exhibitionPreviews)) {
        if (exhibitionValue?.artworkPreviews) {
          for (let art of Object.values(exhibitionValue?.artworkPreviews)) {
            addImageUrlToPrefetch(art?.artworkImage.value);
          }
        }
        
        addImageUrlToPrefetch(exhibitionValue?.exhibitionPrimaryImage?.value);
        addImageUrlToPrefetch(exhibitionValue?.galleryLogo?.value);
      }
      
  
      await Promise.all(prefetchImageUrls);
  
      dispatch({type: ETypes.saveExhibitionPreviews, exhibitionPreviews})
  
      await SplashScreen.hideAsync();
    } catch (e) {
      console.log(e);
    } finally {
      setAppReady(true);
    }
  }, []);
  
  

  const onImageLoaded = useCallback(async () => {
    // auth().signOut()
    try {
      const userUuid = await getUserLocalUid();
      if (userUuid) {
        const user = await getDartaUser({localStorageUid: userUuid})
        dispatch({
          type: ETypes.setUser,
          userData: {
            ...user
          }
        })
      }
      const galleryFollows = await listGalleryRelationships()
      if (galleryFollows && galleryFollows.length > 0){
        const galleryFollowsIds = galleryFollows.reduce((acc, el) => ({...acc, [el?._id as string] : true}), {})
        dispatch({
          type: ETypes.setGalleryPreviewMulti,
          galleryPreviews: galleryFollowsIds
        })
      }

      const imageUrls: string[] = []
      const artworkImages: any = []
      const exhibitionImages: any = []

      const exhibitionPreviews = await listAllExhibitionsPreviewsForUser({limit: 2})
      
      const exhibitionMapPins = await listExhibitionPinsByCity({cityName: MapPinCities.newYork})
      dispatch({type: ETypes.saveExhibitionMapPins, mapPins: exhibitionMapPins, mapPinCity: MapPinCities.newYork})

      
      const likedArtwork = await listUserArtwork({action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE, limit: 10})
      const savedArtwork = await listUserArtwork({action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE, limit: 10})
      const inquiredArtwork = await listUserArtwork({action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE, limit: 10})


      let likedArtworkIds = {}
      let savedArtworkIds = {}
      let inquiredArtworkIds = {}
      if (likedArtwork && Object.values(likedArtwork).length > 0){
        likedArtworkIds = Object.values(likedArtwork).reduce((acc, el) => ({...acc, [el?._id as string] : true}), {})
      }
      if (savedArtwork && Object.values(savedArtwork).length > 0){
        savedArtworkIds = Object.values(savedArtwork).reduce((acc, el) => ({...acc, [el?._id as string] : true}), {})
      }
      if (inquiredArtwork && Object.values(inquiredArtwork).length > 0){
        inquiredArtworkIds = Object.values(inquiredArtwork).reduce((acc, el) => ({...acc, [el?._id as string] : true}), {})
      }

      dispatch({
        type: ETypes.setUserLikedArtworkMulti,
        artworkIds: likedArtworkIds
      })

      dispatch({
        type: ETypes.setUserSavedArtworkMulti,
        artworkIds: savedArtworkIds
      })
      
      dispatch({
        type: ETypes.setUserInquiredArtworkMulti,
        artworkIds: inquiredArtworkIds
      })

      const artwork: {[key: string]: Artwork} = {...likedArtwork, ...savedArtwork, ...inquiredArtwork}

      if (artwork && Object.values(artwork).length > 0){
        dispatch({
          type: ETypes.saveArtworkMulti,
          artworkDataMulti: artwork
        })
      }
      

      Object.values(artwork).forEach((artworkValue) => {
        if (artworkValue?.artworkImage?.value){
          artworkImages.push(
            Image.prefetch(artworkValue?.artworkImage.value)
          )
        }
      })

      Object.values(exhibitionPreviews).forEach((exhibitionValue) => {
        if (exhibitionValue?.artworkPreviews){
          Object.values(exhibitionValue?.artworkPreviews).forEach((art) => {
            artworkImages.push(
              Image.prefetch(art?.artworkImage.value)
            )
            art = {...artwork, ...art}
            imageUrls.push(art?.artworkImage.value)
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
        Promise.all(exhibitionImages)
        Promise.all(artworkImages)
  
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
            onLoadEnd={onImageLoaded2}
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


