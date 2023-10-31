import { useEffect, useState } from 'react';
import * as Linking from 'expo-linking';
import { ExhibitionRootEnum } from '../../typing/routes';

export function useDeepLinking(navigation) {
  const handleDeepLink = (event) => {
    const params = Linking.parse(event.url).queryParams;

    if (params && params.locationId) {
      navigation.navigate('exhibitions', {
        screen: ExhibitionRootEnum.qrRouter,
        params: {
            screen: ExhibitionRootEnum.exhibitionDetails,  
            params: {
              locationId: params.locationId
            }
        }
    });
    } else if (params && params.exhibitionId && params.galleryId) {
      navigation.navigate('exhibitions', {
          screen: ExhibitionRootEnum.qrRouter,
          params: {
              screen: ExhibitionRootEnum.exhibitionDetails,  
              params: {
                exhibitionId: params.exhibitionId,
                galleryId: params.galleryId,
              }
          }
      });
    } else {
        return
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
