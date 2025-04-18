import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import {ExhibitionPreviewEnum, ExhibitionRootEnum} from '../../typing/routes';
import { tabBarScreenOptions } from '../../theme/themeConstants';
import { ExhibitionPreviewScreen } from '../../screens/Exhibition/ExhibitionsPreviewScreen';

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as StoreReview from 'expo-store-review';
import * as Colors from '@darta-styles';
import { ExhibitionStoreContext } from '../../state';
import { Badge } from 'react-native-paper';

export const ExhibitionHomeTopTab = createMaterialTopTabNavigator();
export type ExhibitionStackParamList = {
  [ExhibitionRootEnum.exhibitionDetails]: {
    exhibitionId?: string;
    galleryId?: string;
    internalAppRoute: boolean;
    locationId?: string;
  };
  [ExhibitionRootEnum.artworkList]: {
    exhibitionId?: string;
    galleryId?: string;
    locationId?: string;
  };
  [ExhibitionRootEnum.exhibitionGallery]: {
    galleryId?: string;
    exhibitionId?: string;
    navigationRoute?: string;
    showPastExhibitions: boolean
  };
};

export function ExhibitionHomeTopTabNavigator({route} : {route: any}) {

    const {exhibitionState} = React.useContext(ExhibitionStoreContext);

    const [showFollowingExhibitionPreviews, setShowFollowing] = React.useState<boolean>(false)
    const [showUpcomingExhibitionPreviews, setShowUpcoming] = React.useState<boolean>(false)

    React.useEffect(() => {
      if (exhibitionState.userFollowsExhibitionPreviews && Object.keys(exhibitionState.userFollowsExhibitionPreviews).length > 0) {
        setShowFollowing(true)
      }
      if (exhibitionState.forthcomingExhibitionPreviews && Object.keys(exhibitionState.forthcomingExhibitionPreviews).length > 0){
        setShowUpcoming(true)
      }
    },[])
        
    const requestReview = async () => {
        try {
        // Check if the device is able to review
        const isAvailable = await StoreReview.isAvailableAsync();
        if (!isAvailable) {
            return;
        }
    
        // Get the number of app opens from AsyncStorage
        const appOpens = await AsyncStorage.getItem('appOpens');
        const opens = appOpens ? parseInt(appOpens) : 0;
    
        // Define the number of opens required before showing the review prompt
        const opensRequired = 5;
    
        if (opens >= opensRequired) {
            // Show the review prompt
            StoreReview.requestReview();
            // Reset the app opens counter
            await AsyncStorage.setItem('appOpens', '0');
        } else {
            // Increase the app opens counter
            await AsyncStorage.setItem('appOpens', (opens + 1).toString());
        }
            } catch (error) {
            console.error('Error requesting store review:', error);
        }
    };

    React.useEffect(() => {
        requestReview();
    }, []);

    
    const FollowingBadge = () => {
      const unviewedCount = React.useMemo(() => {
        const { userFollowsExhibitionPreviews } = exhibitionState;
        if (!userFollowsExhibitionPreviews) return 0;
        return Object.values(userFollowsExhibitionPreviews).filter((exhibition) => !exhibition.userViewed && !exhibitionState.userViewedExhibition[exhibition.exhibitionId]).length;
      }, [exhibitionState?.userFollowsExhibitionPreviews, exhibitionState.userViewedExhibition]);
    
      return (
        <Badge
          size={12}
          visible={unviewedCount > 0}
          style={{backgroundColor: Colors.PRIMARY_600}}        
          >
            {unviewedCount}
        </Badge>
      );
    };

        
  return (
    <ExhibitionHomeTopTab.Navigator screenOptions={{...tabBarScreenOptions}}>
      <ExhibitionHomeTopTab.Group>
      <ExhibitionHomeTopTab.Screen
            name={ExhibitionPreviewEnum.onView}
            component={ExhibitionPreviewScreen}
            options={{ title: 'Open now' }}
          />
          {showUpcomingExhibitionPreviews && (
            <ExhibitionHomeTopTab.Screen
              name={ExhibitionPreviewEnum.forthcoming}
              component={ExhibitionPreviewScreen}
              options={{ title: 'Upcoming' }}
              initialParams={{type: "Upcoming"}}
            />
          )}
          {showFollowingExhibitionPreviews && (
            <ExhibitionHomeTopTab.Screen
            name={ExhibitionPreviewEnum.following}
            component={ExhibitionPreviewScreen}
            options={{ title: 'Following',  tabBarBadge: () => <FollowingBadge/> }}
          />
          )}
        </ExhibitionHomeTopTab.Group>
    </ExhibitionHomeTopTab.Navigator>
  );
}
