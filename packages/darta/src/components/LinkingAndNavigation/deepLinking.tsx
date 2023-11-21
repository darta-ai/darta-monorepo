import { useEffect, useState, useContext } from 'react';
import { ETypes, StoreContext } from '../../state/Store';
import * as Linking from 'expo-linking';
import { ExhibitionRootEnum } from '../../typing/routes';
import { readExhibition, readMostRecentGalleryExhibitionForUser } from '../../api/exhibitionRoutes';
import { listGalleryExhibitionPreviewForUser, readGallery } from '../../api/galleryRoutes';
import { createGalleryRelationshipAPI } from '../../utils/apiCalls';


export function useDeepLinking(navigation) {
  const {state, dispatch} = useContext(StoreContext);


  async function fetchMostRecentExhibitionData({locationId} : {locationId: string}): Promise<{exhibitionId: string, galleryId: string} | void> {
    try {
        const {exhibition, gallery} = await readMostRecentGalleryExhibitionForUser({locationId})
        const supplementalExhibitions = await listGalleryExhibitionPreviewForUser({galleryId: gallery._id})
        const galleryData = {...gallery, galleryExhibitions: supplementalExhibitions}
        dispatch({
            type: ETypes.saveGallery,
            galleryData: galleryData,
        })
        dispatch({
            type: ETypes.setCurrentHeader,
            currentExhibitionHeader: exhibition.exhibitionTitle.value!,
          })
        dispatch({
            type: ETypes.saveExhibition,
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
        console.log(error)
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
      dispatch({
          type: ETypes.saveGallery,
          galleryData: galleryData,
      })
      dispatch({
          type: ETypes.setCurrentHeader,
          currentExhibitionHeader: exhibition.exhibitionTitle.value!,
        })
      dispatch({
          type: ETypes.saveExhibition,
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
      console.log(error)
  }
}

  const handleDeepLink = async (event) => {
    const params = Linking.parse(event.url).queryParams;

    if (params && params.locationId) {
      navigation.navigate('exhibitions', { screen: ExhibitionRootEnum.genericLoading });
      try{
        const res = await fetchMostRecentExhibitionData({locationId: params.locationId.toString()})
        // if (res){
        //   const {exhibitionId, galleryId} = res
        //     navigation.navigate('exhibitions', {
        //       screen: ExhibitionRootEnum.qrRouter,
        //       params: {
        //           screen: ExhibitionRootEnum.exhibitionDetails,  
        //           params: {
        //             exhibitionId,
        //             galleryId
        //           }
        //       }
        //   });
        //   await createGalleryRelationshipAPI({galleryId})
        // }
        if (res) {
          const { exhibitionId, galleryId } = res;
          
          // Reset the stack and navigate to the new route
          navigation.reset({
            index: 1, // Defines the active route in the stack after the reset
            routes: [
              { name: 'exhibitions' }, // This is your initial route in the stack
              { 
                name: 'exhibitions',
                params: {
                  screen: ExhibitionRootEnum.qrRouter,
                  params: {
                    screen: ExhibitionRootEnum.exhibitionDetails,
                    params: {
                      exhibitionId,
                      galleryId,
                    },
                  },
                },
              },
            ],
          });
          await createGalleryRelationshipAPI({galleryId})
        }
      } catch(error: any){
        navigation.goBack()
      }
    } else if (params && params.exhibitionId && params.galleryId) {
      navigation.navigate('exhibitions', { screen: ExhibitionRootEnum.genericLoading});
      const res = await fetchExhibitionById({exhibitionId: params.exhibitionId.toString(), galleryId: params.galleryId.toString()})
      // if (res){
      //   const {exhibitionId, galleryId} = res
      //   navigation.navigate('exhibitions', {
      //     screen: ExhibitionRootEnum.qrRouter,
      //     params: {
      //         screen: ExhibitionRootEnum.exhibitionDetails,  
      //         params: {
      //           exhibitionId,
      //           galleryId,
      //         }
      //     }
      // });
      // }
      if (res) {
        const { exhibitionId, galleryId } = res;
        
        // Reset the stack and navigate to the new route
        navigation.reset({
          index: 1, // Defines the active route in the stack after the reset
          routes: [
            { name: 'exhibitions' }, // This is your initial route in the stack
            { 
              name: 'exhibitions',
              params: {
                screen: ExhibitionRootEnum.qrRouter,
                params: {
                  screen: ExhibitionRootEnum.exhibitionDetails,
                  params: {
                    exhibitionId,
                    galleryId,
                  },
                },
              },
            },
          ],
        });
      }
      
    } else {
        navigation.goBack()
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
