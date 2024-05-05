import React, {useContext} from 'react';
import {Alert, View, Vibration, Linking, StyleSheet} from 'react-native';
import {TombstonePortrait} from '../../components/Tombstone/_index';
import {NeedAccountDialog} from '../../components/Dialog/NeedAccountDialog';
import { USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types';
import { createArtworkRelationshipAPI } from '../../utils/apiCalls';
import auth from '@react-native-firebase/auth';
import { getDartaUser } from '../../api/userRoutes';
import analytics from '@react-native-firebase/analytics';
import { GalleryStoreContext, UIStoreContext, UiETypes, UserETypes } from '../../state';
import { UserStoreContext } from '../../state/UserStore';
import { getArtworkEmailAndGalleryAPI } from '../../api/artworkRoutes';
import { useFocusEffect } from '@react-navigation/native';
import * as Colors from '@darta-styles'
import * as Haptics from 'expo-haptics';

export function ArtworkScreen({route, navigation}: {route: any, navigation: any}) {
  const {uiDispatch} = useContext(UIStoreContext);
  const [artOnDisplay, setArtOnDisplay] = React.useState<any>(null)
  const [saveRoute, setSaveRoute] = React.useState<any>(null)
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.PRIMARY_50,
    paddingTop: route?.params?.addPaddingTop ? 48 : 0,
  }
})

  React.useEffect(() => {
    if (route.params){
      setArtOnDisplay(route.params.artOnDisplay)
      setSaveRoute(route.params.saveRoute)
    }

    navigation.getParent()?.setOptions({
      tabBarStyle: {
        display: "none"
      }
    });
    return () => navigation.getParent()?.setOptions({
      tabBarStyle: undefined
    });

  }, []);

  useFocusEffect(
    React.useCallback(() => {
      uiDispatch({
        type: UiETypes.setTombstoneHeader,
        currentArtworkHeader: artOnDisplay?.artworkTitle?.value!,
      })
    }, [route.params])
  )
  
  
  const [dialogVisible, setDialogVisible] = React.useState(false)

  const {userDispatch} = useContext(UserStoreContext);
  const {galleryState} = useContext(GalleryStoreContext);
  
  const likeArtwork = async ({artworkId} : {artworkId: string}) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    try {
      await createArtworkRelationshipAPI({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
      userDispatch({
        type: UserETypes.setUserLikedArtwork,
        artworkId,
      })
      
    } catch(error){
      // console.log(error)
    } 
  }


  const saveArtwork = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    if (auth().currentUser === null) {
      return setDialogVisible(true)
    }
    navigation.navigate(saveRoute, {artwork: artOnDisplay})
  }

  const inquireArtwork = async ({artworkId} : {artworkId: string}) => {
    try {
      let galleryEmail = galleryState.galleryData?.[artOnDisplay?.galleryId]?.primaryContact?.value
      let galleryName = galleryState.galleryData?.[artOnDisplay?.galleryId]?.galleryName?.value

      if (!galleryEmail) {
        const res = await getArtworkEmailAndGalleryAPI({artworkId});
        ({galleryEmail, galleryName} = res)
      }
      if (!galleryEmail) return

      const subject = `Inquiry: ${artOnDisplay.artworkTitle?.value} by ${artOnDisplay.artistName?.value}`
      
      const body = `${galleryName}, 
      
      I am interested in learning more about "${artOnDisplay.artworkTitle?.value}" by ${artOnDisplay.artistName?.value.toLowerCase()}.`

      const url = `mailto:${galleryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen){
        await Linking.openURL(url)
        await createArtworkRelationshipAPI({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE})
        userDispatch({
          type: UserETypes.setUserInquiredArtwork,
          artworkId,
        })
        analytics().logEvent('inquire_artwork', {artworkId})
        inquireSuccessAlert()
      } else {
        Alert.alert('Something went wrong', `Please try again later, or email the gallery at ${galleryEmail}`)
      }
    } catch(error){
      // console.log(error)
    } 
  }

  const inquireAlert = async ({artworkId} : {artworkId: string}) =>
  {
    // if (auth().currentUser === null) {
    //   // TO-DO WAIT FOR FIREBASE FIX
    //   // return setDialogVisible(true)
    //   // console.log(auth)
    // }
    Vibration.vibrate(100)
    const user = await getDartaUser({uid: auth().currentUser?.uid ?? ''})
    const galleryName = galleryState.galleryData?.[artOnDisplay?.galleryId]?.galleryName?.value ?? "the gallery";
    Alert.alert(`Reach out to ${galleryName}?`, `we'll autofill an email for you - and you can take it from there`, [
      {
        text: 'Cancel',
        onPress: () => {},
        style: 'destructive',
      },
      {
        text: `Yes`,
        onPress: () => inquireArtwork({artworkId}),
      },
    ])
};

  const inquireSuccessAlert = () => {
    Alert.alert(`We've added ${artOnDisplay?.artworkTitle?.value ?? "the artwork"} to your inquired list`, `You can manage this list from the profile tab`, [
      {
        text: `Ok`,
        onPress: () => {},
      },
    ])
  }

  return (
    <View style={styles.container}>
      <TombstonePortrait 
        artwork={artOnDisplay}
        inquireAlert={inquireAlert}
        likeArtwork={likeArtwork}
        saveArtwork={saveArtwork}
      />
      <NeedAccountDialog 
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
      />
    </View>
  );
}
