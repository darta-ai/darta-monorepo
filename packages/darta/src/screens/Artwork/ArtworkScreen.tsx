import React, {useContext} from 'react';
import {Alert, View, Vibration, Linking} from 'react-native';
import {ETypes, StoreContext} from '../../state/Store';
import {TombstonePortrait} from '../../components/Tombstone/_index';
import {NeedAccountDialog} from '../../components/Dialog/NeedAccountDialog';
import { USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types/dist';
import { createArtworkRelationshipAPI } from '../../utils/apiCalls';
import auth from '@react-native-firebase/auth';
import { getDartaUser } from '../../api/userRoutes';
import analytics from '@react-native-firebase/analytics';
import { GalleryStoreContext, UserETypes } from '../../state';
import { UserStoreContext } from '../../state/UserStore';
import { getArtworkEmailAndGalleryAPI } from '../../api/artworkRoutes';


export function ArtworkScreen({route, navigation}: {route: any, navigation: any}) {
  const [artOnDisplay, setArtOnDisplay] = React.useState<any>(null)
  const [saveRoute, setSaveRoute] = React.useState<any>(null)

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
      const res = await getArtworkEmailAndGalleryAPI({artworkId})
      console.log({res})
      const {galleryEmail, galleryName} = res
      if (!galleryEmail) return

      const subject = `Inquiry: ${artOnDisplay.artworkTitle?.value} by ${artOnDisplay.artistName?.value}}`
      
      const body = `Hi ${galleryName},%0D%0A%0D%0A I saw ${artOnDisplay.artworkTitle?.value} by ${artOnDisplay.artistName?.value} on darta and I'm interested in learning more.`

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
      console.log(error)
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
    const email = auth().currentUser?.email ?? user?.email;
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
    Alert.alert(`We've let the gallery know`, `If they are interested in proceeding, they will reach out to you on the email you provided`, [
      {
        text: `Ok`,
        onPress: () => {},
      },
    ])
  }

  return (
    <View>
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
