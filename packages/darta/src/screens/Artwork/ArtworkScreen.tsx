import React, {useContext} from 'react';
import {Alert, View, Vibration} from 'react-native';
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


export function ArtworkScreen({route, navigation}: {route: any, navigation: any}) {
  let artOnDisplay: any = null;
  if (route.params){
    ({artOnDisplay} = route.params);
  }

  React.useEffect(() => {
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

  const {state, dispatch} = useContext(StoreContext);
  const {userDispatch} = useContext(UserStoreContext);
  const {galleryState} = useContext(GalleryStoreContext);
  
  const [saveLoading, setSaveLoading] = React.useState(false);  
  const [likeLoading, setLikeLoading] = React.useState(false);

  const likeArtwork = async ({artworkId} : {artworkId: string}) => {
    if (auth().currentUser === null) {
      return setDialogVisible(true)
    }
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
    setSaveLoading(true)
    try {
      await createArtworkRelationshipAPI({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
      userDispatch({
        type: UserETypes.setUserSavedArtworkMulti,
        artworkIds: {[artworkId]: true},
      })
      userDispatch({
        type: UserETypes.saveArtworkMulti,
        artworkDataMulti: {[artworkId]: artOnDisplay},
      })
      analytics().logEvent('save_artwork_modal', {artworkId})
    } catch(error){
      console.log(error)
    } finally {
      setSaveLoading(false)
    }
  }

  const inquireArtwork = async ({artworkId} : {artworkId: string}) => {
    // if (auth().currentUser === null) {
    //   return setDialogVisible(true)
    // }
    try {
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
    if (auth().currentUser === null) {
      // TO-DO WAIT FOR FIREBASE FIX
      // return setDialogVisible(true)
      // console.log(auth)
    }
    Vibration.vibrate(100)
    const user = await getDartaUser({uid: auth().currentUser?.uid ?? ''})
    const email = auth().currentUser?.email ?? user?.email;
    const firstName = user?.legalFirstName;
    const lastName = user?.legalLastName;
    const galleryName = galleryState.galleryData?.[artOnDisplay?.galleryId]?.galleryName?.value ?? "the gallery";
    if (email && firstName && lastName){
      Alert.alert(`Share your name and email with ${galleryName}?`, `We will email ${galleryName} and let them know you're interested`, [
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
    } else {
      setDialogVisible(true)
    }
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
