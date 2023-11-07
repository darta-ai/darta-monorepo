import {PRIMARY_800} from '@darta-styles';
import React, {useContext} from 'react';

import {ExhibitionGalleryScreen, ExhibitionsHomeScreen} from '../../screens/_index';
import {StoreContext} from '../../state/Store';
import {headerOptions, modalHeaderOptions} from '../../styles/styles';
import {ExhibitionRootEnum, PreviousExhibitionRootEnum} from '../../typing/routes';
import {ExhibitionTopTabNavigator} from './ExhibitionTopTabNavigator'
import {ArtworkScreen} from '../../screens/Artwork/ArtworkScreen';
import { PastExhibitionTopTabNavigator } from './PastExhibitionTopTabNavigator';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useDeepLinking } from '../../components/LinkingAndNavigation/deepLinking';
import { View } from 'react-native';  
import { HeaderBackButton } from '@react-navigation/elements';
import { CommonActions } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import { Linking, Platform } from 'react-native';
import { captureRef } from 'react-native-view-shot';
import Share from 'react-native-share'
import { ExhibitionHomeTopTabNavigator } from './ExhibitionHomeTopTabNavigator';

export const ExhibitionStack = createStackNavigator();


export function ExhibitionStackNavigator({route} : {route: any}) {
  const {state} = useContext(StoreContext);

  const navigation = useNavigation();
  useDeepLinking(navigation);

  const shareExhibition = async () => {
    if (!state.exhibitionShareDetails) return;
    try {
      await Share.open({
        url: state.exhibitionShareDetails.shareURL ?? "",
        // message: state.exhibitionShareDetails.shareURLMessage ?? "",
      });
    } catch (error) {

    }

  }

  return (
      <ExhibitionStack.Navigator screenOptions={{
        headerTintColor: PRIMARY_800,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS
      }}
      >
        <ExhibitionStack.Screen
          name={ExhibitionRootEnum.exhibitionHome}
          component={ExhibitionHomeTopTabNavigator}
          options={{...headerOptions, headerTitle: 'exhibitions'}}
        />
        <ExhibitionStack.Screen
            name={ExhibitionRootEnum.TopTab}
            component={ExhibitionTopTabNavigator}
            options={{...headerOptions, headerTitle: state.currentExhibitionHeader ?? "",
            headerRight: () => (
              <IconButton 
                icon={"export-variant"}
                onPress={() => shareExhibition()}
              />
          )}}
          />
          <ExhibitionStack.Screen
            name={PreviousExhibitionRootEnum.navigatorScreen}
            component={PastExhibitionTopTabNavigator}
            options={{...headerOptions, headerTitle: state.previousExhibitionHeader ?? ""}}
            />
          <ExhibitionStack.Screen
            name={ExhibitionRootEnum.individualArtwork}
            component={ArtworkScreen}
            options={{...modalHeaderOptions, presentation: 'modal', headerTitle: state.currentArtworkTombstoneHeader ?? ""}}
          />
          <ExhibitionStack.Screen
          name={ExhibitionRootEnum.showGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: ""}}
          options={{...headerOptions, headerTitle: state.galleryHeader ?? "" }}
          />
          <ExhibitionStack.Screen
            name={ExhibitionRootEnum.qrRouter}
            component={ExhibitionTopTabNavigator}
            options={{...headerOptions, headerTitle: state.currentExhibitionHeader ?? "", 
            headerRight: () => (
              <IconButton 
                icon={"export-variant"}
                onPress={() => shareExhibition()}
              />
            ),
            headerLeft: () => ( 
              <View>
                <HeaderBackButton 
                  onPress={() => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0, // sets the active route index
                        routes: [
                          { name: ExhibitionRootEnum.exhibitionHome }, // the only route in the stack after reset
                        ],
                      })
                    );
                  }}
                  tintColor={PRIMARY_800}
                />
              </View>
            )
            }}
          />
      </ExhibitionStack.Navigator>
  );
}
