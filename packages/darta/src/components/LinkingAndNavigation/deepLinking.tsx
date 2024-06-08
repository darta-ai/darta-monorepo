import React, { useEffect, useState } from 'react';
import { ETypes, StoreContext, UIStoreContext, UiETypes, GalleryStoreContext, GalleryETypes, ExhibitionStoreContext, ExhibitionETypes } from '../../state';
import * as Linking from 'expo-linking';
import { ExhibitionRootEnum, ListEnum, RecommenderRoutesEnum } from '../../typing/routes';
import { readExhibition, readMostRecentGalleryExhibitionForUser } from '../../api/exhibitionRoutes';
import { listGalleryExhibitionPreviewForUser, readGallery } from '../../api/galleryRoutes';
import { createGalleryRelationshipAPI } from '../../utils/apiCalls';
import { readListForUser } from '../../api/listRoutes';
import { FullList } from '@darta-types/dist';


export function useDeepLinking(navigation) {
  const {dispatch} = React.useContext(StoreContext);
  const {uiDispatch} = React.useContext(UIStoreContext);
  const {galleryDispatch} = React.useContext(GalleryStoreContext);
  const {exhibitionDispatch} = React.useContext(ExhibitionStoreContext);



  async function fetchMostRecentExhibitionData({locationId} : {locationId: string}): Promise<{exhibitionId: string, galleryId: string} | void> {
    try {
        const {exhibition, gallery} = await readMostRecentGalleryExhibitionForUser({locationId})
        const supplementalExhibitions = await listGalleryExhibitionPreviewForUser({galleryId: gallery._id})
        const galleryData = {...gallery, galleryExhibitions: supplementalExhibitions}
        galleryDispatch({
            type: GalleryETypes.saveGallery,
            galleryData: galleryData,
        })
        uiDispatch({
            type: UiETypes.setCurrentHeader,
            currentExhibitionHeader: exhibition.exhibitionTitle.value!,
          })
          exhibitionDispatch({
            type: ExhibitionETypes.saveExhibition,
            exhibitionData: exhibition,
        })
        dispatch({
            type: ETypes.setQRCodeExhibitionId,
            qRCodeExhibitionId: exhibition?._id,
        })
        dispatch({
            type: ETypes.setQRCodeGalleryId,
            qrCodeGalleryId: gallery._id,
        })
        return {
            exhibitionId: exhibition._id,
            galleryId: gallery._id
        }
    } catch (error: any){
        // console.log(error)
    }
}


async function fetchExhibitionById({exhibitionId, galleryId} : {exhibitionId: string, galleryId: string} ): Promise<{exhibitionId: string, galleryId: string} | void> {
  try {
      const [gallery, supplementalExhibitions, exhibition] = await Promise.all([
        readGallery({ galleryId }),
        listGalleryExhibitionPreviewForUser({ galleryId }),
        readExhibition({ exhibitionId })
    ])
      const galleryData = { ...gallery, galleryExhibitions: supplementalExhibitions };
      galleryDispatch({
          type: GalleryETypes.saveGallery,
          galleryData: galleryData,
      })
      uiDispatch({
        type: UiETypes.setCurrentHeader,
        currentExhibitionHeader: exhibition.exhibitionTitle.value!,
      })
      exhibitionDispatch({
          type: ExhibitionETypes.saveExhibition,
          exhibitionData: exhibition,
      })
      dispatch({
          type: ETypes.setQRCodeExhibitionId,
          qRCodeExhibitionId: exhibition?._id,
      })
      dispatch({
          type: ETypes.setQRCodeGalleryId,
          qrCodeGalleryId: gallery._id,
      })
      return {
          exhibitionId: exhibition._id,
          galleryId: gallery._id
      }
  } catch (error: any){
      // console.log(error)
  }
}

async function fetchListById({listId} : {listId: string}): Promise<FullList | void>{
  try {
    const list = await readListForUser({ listId })
    dispatch({
      type: ETypes.setUserLists,
      userLists: list,
    })
    return Object.values(list)[0]
  } catch (error: any){
    // console.log(error)
  }
}

const handleDeepLink = async (event) => {
  const params = Linking.parse(event.url).queryParams;

  if (params && params.locationId) {
    navigation.navigate('exhibitions', { screen: ExhibitionRootEnum.genericLoading });
    try {
      const res = await fetchMostRecentExhibitionData({locationId: params.locationId.toString()});
      if (res) {
        const {exhibitionId, galleryId} = res;
        navigation.navigate('exhibitions', {
          screen: ExhibitionRootEnum.qrRouter,
          params: {
            screen: ExhibitionRootEnum.exhibitionDetails,  
            params: {
              exhibitionId,
              galleryId
            }
          }
        });
        await createGalleryRelationshipAPI({galleryId});
      }
    } catch(error) {
      return;
      // Handle error
    }
  } else if (params && params.exhibitionId && params.galleryId) {
    navigation.navigate('exhibitions', { screen: ExhibitionRootEnum.genericLoading });
    try {
      const res = await fetchExhibitionById({exhibitionId: params.exhibitionId.toString(), galleryId: params.galleryId.toString()});
      if (res) {
        const {exhibitionId, galleryId} = res;
        navigation.navigate('exhibitions', {
          screen: ExhibitionRootEnum.qrRouter,
          params: {
            screen: ExhibitionRootEnum.exhibitionDetails,  
            params: {
              exhibitionId,
              galleryId,
            }
          }
        });
      }
    } catch(error) {
      // Handle error
    }
  } else if (params && params.listId) {
    try {
      const res = await fetchListById({listId: params.listId.toString()});
      uiDispatch({
        type: UiETypes.setListHeader,
        currentExhibitionHeader: res?.listName ?? ""
      });
      navigation.navigate('Visit', {
        screen: RecommenderRoutesEnum.recommenderFullList,
        params: {
          screen: ListEnum.fullList,  
          params: {
            listId: params.listId.toString(),
          }
        }
      });
    } catch(error) {
      return;
      // Handle error
    }
  } else {
    // Handle invalid deep link
  }
};
  // state to track if initialURL has been processed
  const [urlsProcessed, setUrlsProcessed] = useState<string[]>([]);

  useEffect(() => {
    const checkInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl && urlsProcessed.includes(initialUrl) === false) {
        handleDeepLink({ url: initialUrl });
        setUrlsProcessed([...urlsProcessed, initialUrl]);
      }
    }

    // check the initial URL
    checkInitialURL();

    // set up the event listener for deep linking
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // cleanup the event listener on component unmount
    return () => {
      subscription.remove();
    };
  }, [navigation, handleDeepLink, urlsProcessed]);
}
