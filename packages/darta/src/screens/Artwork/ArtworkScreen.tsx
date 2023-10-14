import React, {useContext} from 'react';
import {Alert, View} from 'react-native';
import {ETypes, StoreContext} from '../../state/Store';
import {TombstonePortrait} from '../../components/Tombstone/_index';
import {NeedAccountDialog} from '../../components/Dialog/NeedAccountDialog';
import { createUserArtworkRelationship } from '../../api/artworkRoutes';
import { IGalleryProfileData, USER_ARTWORK_EDGE_RELATIONSHIP } from '@darta-types/dist';
import { createArtworkRelationship } from '../../utils/apiCalls';
import auth from '@react-native-firebase/auth';
import { listGalleryExhibitionPreviewForUser, readGallery } from '../../api/galleryRoutes';


export function ArtworkScreen({route}: {route: any}) {
  let artOnDisplay: any = null;
  if (route.params){
    ({artOnDisplay} = route.params);
  }
  
  const [dialogVisible, setDialogVisible] = React.useState(false)

  const {state, dispatch} = useContext(StoreContext);

  const [galleryName, setGalleryName] = React.useState<string>();


  const fetchFullGallery = async ({galleryId}: {galleryId: string}): Promise<IGalleryProfileData | null> => {
    try {
      const [gallery, exhibitionPreviews] = await Promise.all([
        readGallery({ galleryId }),
        listGalleryExhibitionPreviewForUser({ galleryId })
      ]);

      const galleryData = {...gallery, galleryExhibitions: exhibitionPreviews}

      dispatch({
        type: ETypes.saveGallery,
        galleryData: galleryData
      })
      // Now use gallery and exhibitionPreviews as needed
      return galleryData;
    } catch (error) {
      // Handle any errors that might occur during any of the above promises
      console.error("There was an error:", error);
    }
    return null
  }

  React.useEffect(() => {

    const fetchGallery = async () => {
      const galleryId = artOnDisplay?.galleryId;
      if (galleryId && !state?.galleryData?.[galleryId]){
        const galleryData = await fetchFullGallery({galleryId})
        if(galleryData){
          setGalleryName(galleryData.galleryName.value ?? "the gallery");
        }
      }
    }
    fetchGallery()

  }, [, state?.galleryData]);
  
  const [saveLoading, setSaveLoading] = React.useState(false);  
  const [likeLoading, setLikeLoading] = React.useState(false);

  const likeArtwork = async ({artworkId} : {artworkId: string}) => {
    if (auth().currentUser === null) {
      return setDialogVisible(true)
    }
    setLikeLoading(true)
    try {
      await createArtworkRelationship({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.LIKE})
      dispatch({
        type: ETypes.setUserLikedArtwork,
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
      await createArtworkRelationship({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
      dispatch({
        type: ETypes.setUserSavedArtworkMulti,
        artworkIds: {[artworkId]: true},
      })
      dispatch({
        type: ETypes.saveArtworkMulti,
        artworkDataMulti: {[artworkId]: artOnDisplay},
      })
    } catch(error){
      console.log(error)
    } finally {
      setSaveLoading(false)
    }
  }

  const inquireArtwork = async ({artworkId} : {artworkId: string}) => {
    if (auth().currentUser === null) {
      return setDialogVisible(true)
    }
    try {
      await createArtworkRelationship({artworkId, action: USER_ARTWORK_EDGE_RELATIONSHIP.INQUIRE})
      dispatch({
        type: ETypes.setUserInquiredArtwork,
        artworkId,
      })
    } catch(error){
      console.log(error)
    } 
  }

  const inquireAlert = ({artworkId} : {artworkId: string}) =>
  {
    if (auth().currentUser === null) {
      return setDialogVisible(true)
    }
    const email = auth().currentUser?.email;
    if (email){
      Alert.alert(`We'll let ${galleryName} know you're interested`, 'How would you like to get in contact?', [
        {
          text: `${email}`,
          onPress: () => inquireArtwork({artworkId}),
        },
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'destructive',
        },
      ])
    } else {
      setDialogVisible(true)
    }
  };

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
