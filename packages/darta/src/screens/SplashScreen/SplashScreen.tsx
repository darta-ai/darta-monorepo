import * as Colors from "@darta-styles";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
} from "react-native";
import { listExhibitionPreviewUserFollowing, listExhibitionPreviewsCurrent, listExhibitionPreviewsForthcoming, listExhibitionForUserSavedCurrent} from "../../api/exhibitionRoutes";
import { ETypes, StoreContext, GalleryStoreContext, GalleryETypes, ExhibitionStoreContext, ExhibitionETypes, ViewStoreContext, ViewETypes} from "../../state";
import { Artwork, GalleryPreview, MapPinCities, USER_ARTWORK_EDGE_RELATIONSHIP } from "@darta-types";
import { listExhibitionPinsByCity } from "../../api/locationRoutes";
import { getDartaUser } from "../../api/userRoutes";
import { getUserUid } from "../../utils/functions";
import { listArtworksToRateAPI, listGalleryRelationshipsAPI, listUserArtworkAPI } from "../../utils/apiCalls";
// import FastImage from "react-native-fast-image";
import analytics from '@react-native-firebase/analytics';
import { listUserLists } from "../../api/listRoutes";
import { UserETypes, UserStoreContext } from "../../state/UserStore";
import { TextElement } from "../../components/Elements/TextElement";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SAVED_ROUTE_SETTINGS } from "../../utils/constants";


SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.PRIMARY_50,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24
  },
  dartaContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4
  },
  header: {
    fontFamily: 'DMSans_400Regular', 
    fontSize: 24,
  },
  subHeader: {
    fontSize: 16, 
    fontFamily: 'DMSans_400Regular', 
    color: Colors.PRIMARY_950
  }
});

function AnimatedSplashScreen({ children }) {
  const {dispatch} = React.useContext(StoreContext)
  const {galleryDispatch} = React.useContext(GalleryStoreContext)
  const {exhibitionDispatch} = React.useContext(ExhibitionStoreContext)
  const {viewDispatch} = React.useContext(ViewStoreContext)
  const {userDispatch} = React.useContext(UserStoreContext)
  const animation = useMemo(() => new Animated.Value(1), []);
  const [isAppReady, setAppReady] = useState(false);
  const [isSplashAnimationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (isAppReady) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 3000,
        useNativeDriver: true,
      }).start(() => setAnimationComplete(true));
    }
  }, [isAppReady]);
 

  const loadDataAsync = useCallback(async () => {
    try {
      const uid = await getUserUid();
  
      const [
        user,
        artworksToRate, 
      ] = await Promise.all([
        // user
        uid ? getDartaUser({uid}) : null,
        // artworksToRate
        listArtworksToRateAPI({startNumber: 0, endNumber: 20}),
      ]);

      // User Profile
      if (user) {
        userDispatch({
          type: UserETypes.setUser,
          userData: user
        });
      }

      // Artworks To Rate Screen
      if(artworksToRate){
        viewDispatch({
          type: ViewETypes.setArtworksToRate,
          artworksToRate
        })
      }

      await SplashScreen.hideAsync();
      setAppReady(true)
      getAuxiliaryData();
    } catch (e) {
      // console.log('!!!', e);
    } finally {
      setAppReady(true);
    }
  }, []);


  const getAuxiliaryData = useCallback(async () => {
    try {  
      const [
        galleryFollows,
        exhibitionPreviewsCurrent,
        exhibitionPreviewsForthcoming,
        userFollowingExhibitionPreviews, 
        exhibitionMapPins,
        likedArtwork,
        savedArtwork,
        inquiredArtwork,
        userListPreviews,
        savedRoute,
        userSavedExhibitions
      ] = await Promise.all([
        //galleryFollows
        listGalleryRelationshipsAPI(),
        //exhibitionPreviewsCurrent
        listExhibitionPreviewsCurrent({ limit: 7 }),
        //exhibitionPreviewsUpcoming 
        listExhibitionPreviewsForthcoming({ limit: 7 }),
        //exhibitionPreviewsUserFollowing
        listExhibitionPreviewUserFollowing({ limit: 7 }),
        // exhibitionMapPins
        listExhibitionPinsByCity({ cityName: MapPinCities.newYork }),
        // likedArtwork TODO: FIX THIS FOR JUST IDS
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE, limit: 1 }),
        // savedArtwork
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE, limit: 40 }),
        // inquiredArtwork
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE, limit: 40 }),
        // userLists
        listUserLists(),
        // getUnViewedExhibitionsCountForUser()
        AsyncStorage.getItem(SAVED_ROUTE_SETTINGS),
        // userSavedExhibitions
        listExhibitionForUserSavedCurrent()
      ]);

      // User Lists
      if (userListPreviews) {
        dispatch({
          type: ETypes.setUserListPreviews,
          userListPreviews
        });
      }

      // Exhibitions Following 
      if (userSavedExhibitions){
        exhibitionDispatch({
          type: ExhibitionETypes.saveUserSavedExhibitions,
          exhibitionIds: userSavedExhibitions
        })
      }

      // Exhibition Preview Screen 
      exhibitionDispatch({type: ExhibitionETypes.saveUserFollowsExhibitionPreviews, exhibitionPreviews: userFollowingExhibitionPreviews})
      exhibitionDispatch({type: ExhibitionETypes.saveForthcomingExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsForthcoming})
      exhibitionDispatch({type: ExhibitionETypes.saveCurrentExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsCurrent})


      // Map Screen 
      if (exhibitionMapPins && galleryFollows) {
        const userGalleryFollowed = galleryFollows?.reduce((acc, el) => {
          if (el?._id) {
            acc[el._id] = true; // Set the value to true, or some other logic if needed
          }
          return acc;
        }, {});
        dispatch({
          type: ETypes.saveExhibitionMapPins,
          mapPins: exhibitionMapPins,
          mapPinCity: MapPinCities.newYork,
          userGalleryFollowed,
          userSavedExhibitions
        });
      }

  
      const processArtworkData = (data: any, dispatchType: UserETypes) => {
        if (data && Object.values(data).length > 0) {
          let artworkIds: { [key: string]: boolean } = {};
          artworkIds = Object.values(data).reduce((acc: any, el: any) => ({ ...acc, [el?._id]: true }), {}) as { [key: string]: boolean };
          userDispatch({
            type: dispatchType,
            artworkIds
          });
        }
        return data;
      };

      const likedArtworkData = processArtworkData(likedArtwork, UserETypes.setUserLikedArtworkMulti);
      const savedArtworkData = processArtworkData(savedArtwork, UserETypes.setUserSavedArtworkMulti);
      const inquiredArtworkData = processArtworkData(inquiredArtwork, UserETypes.setUserInquiredArtworkMulti);
  
      const combinedArtwork: {[key: string] : Artwork} = { ...likedArtworkData, ...savedArtworkData, ...inquiredArtworkData };
      if (combinedArtwork && Object.values(combinedArtwork).length > 0) {
        userDispatch({
          type: UserETypes.saveArtworkMulti,
          artworkDataMulti: combinedArtwork
        });
      }
      
      if (savedRoute) {
        const data = JSON.parse(savedRoute)
        dispatch({
          type: ETypes.setWalkingRoute,
          walkingRoute: data?.routeCoordinates,
          customMapLocationIds: data?.locationIds,
          setWalkingRouteRender: false
        })
      }

      // Gallery Follows Screen
      if (galleryFollows?.length) {
        const galleryPreviews: {[key: string] : GalleryPreview} = galleryFollows.reduce((acc, el) => ({ ...acc, [el?._id]: el }), {})
        galleryDispatch({
          type: GalleryETypes.setGalleryPreviewMulti,
          galleryPreviews
        });
        userDispatch({
          type: UserETypes.setUserFollowGalleriesMulti,
          galleryFollowIds: galleryFollows.reduce((acc, el) => ({ ...acc, [el?._id]: true }), {})
        });
      }

      await SplashScreen.hideAsync();
      setAppReady(true)
    } catch (e) {
      // console.log('!!!', e);
    } finally {
      setAppReady(true);
    }
  }, []);


  const dAnim = React.useRef(new Animated.Value(0)).current;
  const a1Anim = React.useRef(new Animated.Value(0)).current;
  const rAnim = React.useRef(new Animated.Value(0)).current;
  const tAnim = React.useRef(new Animated.Value(0)).current;
  const a2Anim = React.useRef(new Animated.Value(0)).current;


  React.useEffect(() => {
    dAnim.addListener(() => {return})
    a1Anim.addListener(() => {return})
    rAnim.addListener(() => {return})
    tAnim.addListener(() => {return})
    a2Anim.addListener(() => {return})
  }, [])

  dAnim.removeAllListeners();
  a1Anim.removeAllListeners();
  rAnim.removeAllListeners();
  tAnim.removeAllListeners();
  a2Anim.removeAllListeners();
  
  const sineWaveAnimation = (animatedValue, delay) => {
    return Animated.sequence([
      Animated.timing(animatedValue, {
        toValue: 10, // Amplitude of the wave
        duration: 500,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: -10,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);
  };
  
  
  
  React.useEffect(() => {
    async function fireLoad() {
      await loadDataAsync();
    }
  
    const cycleDuration = 3000; // Total duration for each letter's full cycle
    const animations = [
      sineWaveAnimation(dAnim, 0),
      sineWaveAnimation(a1Anim, cycleDuration / 5 * 1),
      sineWaveAnimation(rAnim, cycleDuration / 5 * 2),
      sineWaveAnimation(tAnim, cycleDuration / 5 * 3),
      sineWaveAnimation(a2Anim, cycleDuration / 5 * 4),
    ];
  
    // Start all animations
    animations.forEach((anim) => anim.start());
    fireLoad(); 
    return () => animations.forEach((anim) => anim.stop()); // Cleanup
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
              ...styles.container,
              opacity: animation, // This controls the fade out
            },
          ]}
        >
          <View style={styles.dartaContainer}>
            <Animated.Text style={{ transform: [{ translateY: dAnim }], ...styles.header }}>
              d
            </Animated.Text>
            <Animated.Text style={{ transform: [{ translateY: a1Anim }], ...styles.header }}>
              a
            </Animated.Text>
            <Animated.Text style={{ transform: [{ translateY: rAnim }], ...styles.header}}>
              r
            </Animated.Text>
            <Animated.Text style={{ transform: [{ translateY: tAnim }], ...styles.header }}>
              t
            </Animated.Text>
            <Animated.Text style={{ transform: [{ translateY: a2Anim }], ...styles.header }}>
              a
            </Animated.Text>
          </View>
          <TextElement style={styles.subHeader}>digital art advisor</TextElement>
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
      analytics().setAnalyticsCollectionEnabled(true);
      analytics().logAppOpen()
    }
    prepare();
  }, []);

  if (!isSplashReady) {
    return null;
  }

  return <AnimatedSplashScreen>{children}</AnimatedSplashScreen>;
}


