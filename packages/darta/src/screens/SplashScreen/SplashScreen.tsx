import * as Colors from "@darta-styles";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Animated,
  StyleSheet,
  View,
  Easing,
} from "react-native";
import { listExhibitionPreviewUserFollowing, listExhibitionPreviewsCurrent, listExhibitionPreviewsForthcoming} from "../../api/exhibitionRoutes";
import { ETypes, StoreContext, GalleryStoreContext, GalleryETypes, ExhibitionStoreContext, ExhibitionETypes, ViewStoreContext, ViewETypes} from "../../state";
import { Artwork, GalleryPreview, MapPinCities, USER_ARTWORK_EDGE_RELATIONSHIP } from "@darta-types";
import { listExhibitionPinsByCity } from "../../api/locationRoutes";
import { getDartaUser } from "../../api/userRoutes";
import { getUserUid } from "../../utils/functions";
import { listArtworksToRateAPI, listGalleryRelationshipsAPI, listUserArtworkAPI } from "../../utils/apiCalls";
import FastImage from "react-native-fast-image";
import analytics from '@react-native-firebase/analytics';
import { listUserLists } from "../../api/listRoutes";
import {  } from "../../state";
import { UserETypes, UserStoreContext } from "../../state/UserStore";
import { TextElement } from "../../components/Elements/TextElement";
import { heightPercentageToDP } from "react-native-responsive-screen";

SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
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
        galleryFollows,
        exhibitionPreviewsCurrent,
        exhibitionPreviewsForthcoming,
        userFollowingExhibitionPreviews, 
        exhibitionMapPins,
        likedArtwork,
        savedArtwork,
        inquiredArtwork,
        artworksToRate, 
        userListPreviews
      ] = await Promise.all([
        // user
        uid ? getDartaUser({uid}) : null,
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
        // likedArtwork
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE, limit: 10 }),
        // savedArtwork
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE, limit: 40 }),
        // inquiredArtwork
        listUserArtworkAPI({ action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE, limit: 40 }),
        // artworksToRate
        listArtworksToRateAPI({startNumber: 0, endNumber: 20}),
        // userLists
        listUserLists()
      ]);

      // User Profile
      if (user) {
        userDispatch({
          type: UserETypes.setUser,
          userData: user
        });
      }

      // User Lists
      if (userListPreviews) {
        dispatch({
          type: ETypes.setUserListPreviews,
          userListPreviews
        });
      }

      let artworksToRateUrls: {uri : string}[] =  []
      // Artworks To Rate Screen
      if(artworksToRate){
        viewDispatch({
          type: ViewETypes.setArtworksToRate,
          artworksToRate
        })
        for(let art of Object.values(artworksToRate)){
          if(art?.artworkImage?.value){
            artworksToRateUrls.push({uri: art?.artworkImage?.value})
          }
        }
        FastImage.preload(artworksToRateUrls)
      }

      // Exhibition Preview Screen 
      exhibitionDispatch({type: ExhibitionETypes.saveUserFollowsExhibitionPreviews, exhibitionPreviews: userFollowingExhibitionPreviews})
      exhibitionDispatch({type: ExhibitionETypes.saveForthcomingExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsForthcoming})
      exhibitionDispatch({type: ExhibitionETypes.saveCurrentExhibitionPreviews, exhibitionPreviews: exhibitionPreviewsCurrent})



      // Map Screen 
      if (exhibitionMapPins) {
        dispatch({
          type: ETypes.saveExhibitionMapPins,
          mapPins: exhibitionMapPins,
          mapPinCity: MapPinCities.newYork
        });
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
      type ImageUrlObject = { uri: string };

      const imageUrlsToPrefetch: ImageUrlObject[] = [];

      const addImageUrlToPrefetch = (url: string | null | undefined) => {
        if (!url) return;
        imageUrlsToPrefetch.push({ uri: url });
      };
      
      // for (let artworkValue of artworksToRate) {
      //   addImageUrlToPrefetch(artworkValue?.artworkImage?.value);
      // }
      
      for (let exhibitionValue of Object.values({...exhibitionPreviewsCurrent, ...exhibitionPreviewsForthcoming, ...exhibitionPreviewsCurrent})) {
        if (exhibitionValue?.artworkPreviews) {
          for (let art of Object.values(exhibitionValue?.artworkPreviews)) {
            addImageUrlToPrefetch(art?.artworkImage?.value);
          }
        }
      
        addImageUrlToPrefetch(exhibitionValue?.exhibitionPrimaryImage?.value);
        if (exhibitionValue?.galleryLogo?.value) addImageUrlToPrefetch(exhibitionValue?.galleryLogo?.value);
      }
      
      // Need to figure out what takes the longest to load and prefetch those images. What takes so long? 
      // Then try to make that more efficient. 
      // Cache images is key. 
      // DO some research - is it cacheing the images by default. 
      // Preload the ones that they're going to see first. 
      // FastImage.preload(imageUrlsToPrefetch);

      // Colors only when it animates. 

      // Not leaving the app. Directions?

      // Need to make new groups on the screen. 

      // Need to look into pre-rendering components for the view screen to quickly move between all of them. 

      // Need to give the user option to turn off scaling

      // Too minimalist? No title on the image. Need to add the title of the image. 
      
      await SplashScreen.hideAsync();
      setAppReady(true)
    } catch (e) {
      console.log(e);
    } finally {
      setAppReady(true);
    }
  }, []);


  const wiggleAnim = React.useRef(new Animated.Value(0)).current; 

  React.useEffect(() => {
    wiggleAnim.addListener(() => {})
  }, [])

  useEffect(() => {
    loadDataAsync(); // This function will load data and set 'isAppReady' to true
    handleWiggle();
  }, []);


  const handleWiggle = () => {
    const wiggleSequence = Animated.sequence([
      Animated.timing(wiggleAnim, {
        toValue: 0,  // Rotate slightly right
        duration: 750,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0.5,  // Rotate slightly right
        duration: 750,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0,  // Rotate slightly left
        duration: 750,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: -0.5,  // Rotate slightly left
        duration: 750,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0,  // Rotate slightly left
        duration: 750,  // Quicker wiggle
        easing: Easing.elastic(4),  // Bouncy effect
        useNativeDriver: true,
      }),
    ]);
  
    // Continuous loop of wiggle
    Animated.loop(wiggleSequence).start();
  };

  // const handleWiggle = async () => {
  //   // Start the first part of the wiggle animation
  //   Animated.timing(wiggleAnim, {
  //     toValue: 0.5,  // Rotate slightly right
  //     duration: 500,
  //     useNativeDriver: true,
  //   }).start(async () => {
      
  //     Animated.sequence([
  //       Animated.timing(wiggleAnim, {
  //         toValue: -0.5,  // Rotate slightly left
  //         duration: 500,
  //         useNativeDriver: true,
  //       }),
  //       Animated.timing(wiggleAnim, {
  //         toValue: 0,  // Return to original position
  //         duration: 500,
  //         useNativeDriver: true,
  //       }),
  //     ]).start(async () => {
  //       await loadDataAsync()
  //       Animated.sequence([
  //         Animated.timing(wiggleAnim, {
  //           toValue: -0.5,  // Rotate slightly left
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //         Animated.timing(wiggleAnim, {
  //           toValue: 0,  // Rotate slightly left
  //           duration: 500,
  //           useNativeDriver: true,
  //         }),
  //       ]).start()
  //     });
  //   });
  // };

  const rotate = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-25deg', '25deg'],  // Small rotation range for wiggle
  });

  return (
      <View style={{ flex: 1 }}>
      {isAppReady && children}
      {!isSplashAnimationComplete && (
        <Animated.View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: Colors.PRIMARY_50,
              opacity: animation, // This controls the fade out
              alignItems: 'center',
              justifyContent: 'center',
              gap: 24
            },
          ]}
        >
          <Animated.Text style={{ transform: [{ rotate }], fontFamily: 'DMSans_700Bold', fontSize: 24 }}>
            darta
          </Animated.Text>
          <TextElement style={{fontSize: 16, fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_950}}>the digital art advisor</TextElement>
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


