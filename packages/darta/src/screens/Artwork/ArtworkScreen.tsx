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
  
  const [saveLoading, setSaveLoading] = React.useState(false);  
  const [likeLoading, setLikeLoading] = React.useState(false);

  const likeArtwork = async ({artworkId} : {artworkId: string}) => {
    setLikeLoading(true)
    try {
      await createArtworkRelationshipAPI({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
      userDispatch({
        type: UserETypes.setUserLikedArtwork,
        artworkId,
      })
      
    } catch(error){
      console.log(error)
    } finally {
      setLikeLoading(false)
    }
  }


  const saveArtwork = async ({artworkId} : {artworkId: string}) => {
    if (auth().currentUser === null) {
      return setDialogVisible(true)
    }
    // setSaveLoading(true)
    navigation.navigate(saveRoute, {artwork: artOnDisplay})
    try {
      // await createArtworkRelationshipAPI({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
      // userDispatch({
      //   type: UserETypes.setUserSavedArtworkMulti,
      //   artworkIds: {[artworkId]: true},
      // })
      // userDispatch({
      //   type: UserETypes.saveArtworkMulti,
      //   artworkDataMulti: {[artworkId]: artOnDisplay},
      // })
      // analytics().logEvent('save_artwork_modal', {artworkId})
    } catch(error){
      console.log(error)
    } finally {
      // setSaveLoading(false)
    }
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
      
      const body = `Hi ${galleryName}, I saw ${artOnDisplay.artworkTitle?.value} by ${artOnDisplay.artistName?.value} on darta and I am interested in learning more.`

      const url = `mailto:${galleryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
      Linking.canOpenURL(url)
        .then((supported) => {
          if (!supported) {
            console.log(`Can't handle URL: ${url}`);
          } else {
            return Linking.openURL(url);
          }
        })
        .catch((err) => console.error('An error occurred', err));
      await createArtworkRelationshipAPI({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE})
      userDispatch({
        type: UserETypes.setUserInquiredArtwork,
        artworkId,
      })
      analytics().logEvent('inquire_artwork', {artworkId})
      inquireSuccessAlert()
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
    Alert.alert(`Reach out to ${galleryName}?`, `darta will open your email app`, [
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
    Alert.alert(`We've added ${artOnDisplay?.artworkTitle?.value ?? "the artwork"} to your inquired list`, `If this was a mistake, feel free to remove it`, [
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
        saveLoading={saveLoading}
        likeLoading={likeLoading}
      />
      <NeedAccountDialog 
        dialogVisible={dialogVisible}
        setDialogVisible={setDialogVisible}
      />
    </View>
  );
}
