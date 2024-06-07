import {PRIMARY_800} from '@darta-styles';
import React from 'react';

import {ExhibitionGalleryScreen} from '../../screens/_index';
import {UIStoreContext} from '../../state';
import {backButtonStyles, headerOptions, viewOptionsStyles} from '../../styles/styles';
import {ExhibitionRootEnum, PreviousExhibitionRootEnum} from '../../typing/routes';
import {ExhibitionTopTabNavigator} from './ExhibitionTopTabNavigator'
import {ArtworkScreen} from '../../screens/Artwork/ArtworkScreen';
import { PastExhibitionTopTabNavigator } from './PastExhibitionTopTabNavigator';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useDeepLinking } from '../../components/LinkingAndNavigation/deepLinking';
import { View, Pressable, Share } from 'react-native';  
import { HeaderBackButton } from '@react-navigation/elements';
import { CommonActions } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import { ExhibitionHomeTopTabNavigator } from './ExhibitionHomeTopTabNavigator';
import { GenericLoadingScreen } from '../../screens/Loading/GenericLoading';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';
import * as Colors from '@darta-styles'
import { TextElement } from '../../components/Elements/TextElement';
import { AddToListScreen } from '../../screens/Lists/AddToList';

export const ExhibitionStack = createStackNavigator();


export function ExhibitionStackNavigator() {
  const {uiState} = React.useContext(UIStoreContext);


  const navigation = useNavigation();
  useDeepLinking(navigation);

  const shareExhibition = async () => {
    if (!uiState.exhibitionShareDetails) return;
    const canShare = await Sharing.isAvailableAsync();
    try {
      const shareOptions = {
        mimeType: 'text/plain',
        dialogTitle: 'Share Exhibition',
        UTI: 'public.plain-text',
      };
  
      const canShare = await Sharing.isAvailableAsync();
      if (canShare) {
        // await Sharing.shareAsync(uiState.exhibitionShareDetails.shareURL ?? '', shareOptions);
        await Share.share({
          url: uiState.exhibitionShareDetails.shareURL ?? '',
          message: uiState.exhibitionShareDetails.shareURL ?? '',
        });
      } else {
        // console.log('Sharing is not available on this device');
        // Handle the case when sharing is not available
      }
    } catch (error) {
    }
  }

  return (
      <ExhibitionStack.Navigator screenOptions={{
        headerTintColor: PRIMARY_800,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, 
        headerBackImage: () => (
        <View style={backButtonStyles.backButton}>
          <BackButtonIcon />
        </View>
        ),
        headerBackTitleVisible: false,
      }}
      >
        <ExhibitionStack.Screen
          name={ExhibitionRootEnum.exhibitionHome}
          component={ExhibitionHomeTopTabNavigator}
          options={{...headerOptions, headerTitle: 'Exhibitions'}}
        />
        <ExhibitionStack.Screen
            name={ExhibitionRootEnum.TopTab}
            component={ExhibitionTopTabNavigator}
            options={{...headerOptions, headerTitle: uiState.currentExhibitionHeader ?? "",
            headerRight: () => (
              <IconButton 
                icon={"export-variant"}
                iconColor={Colors.PRIMARY_950}
                style={viewOptionsStyles.viewOptionsButtonStyle}
                onPress={() => shareExhibition()}
              />
            )
            }}
            initialParams={{navigateTo: ExhibitionRootEnum.individualArtwork}}
          />
          <ExhibitionStack.Screen
            name={PreviousExhibitionRootEnum.navigatorScreen}
            component={PastExhibitionTopTabNavigator}
            options={{...headerOptions, headerTitle: uiState.previousExhibitionHeader ?? "", 
            }}
            initialParams={{navigateTo: ExhibitionRootEnum.individualArtwork}}
            />
          <ExhibitionStack.Screen
            name={ExhibitionRootEnum.individualArtwork}
            component={ArtworkScreen} 
            options={{...headerOptions, headerTitle: uiState.currentArtworkTombstoneHeader ? uiState.currentArtworkTombstoneHeader.slice(0, 30) : ""}}
            initialParams={{saveRoute: ExhibitionRootEnum.exhibitionListAdd, addPaddingTop: true}}
          />
          <ExhibitionStack.Screen
          name={ExhibitionRootEnum.showGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: ""}}
          options={{...headerOptions, headerTitle: uiState.galleryHeader ?? "" }}
          />
          <ExhibitionStack.Screen
            name={ExhibitionRootEnum.qrRouter}
            component={ExhibitionTopTabNavigator}
            options={{...headerOptions, headerTitle: uiState.currentExhibitionHeader ?? "", 
            headerRight: () => (
              <IconButton 
                icon={"export-variant"}
                iconColor={Colors.PRIMARY_950}
                style={viewOptionsStyles.viewOptionsButtonStyle}
                onPress={() => shareExhibition()}
              />
            ),
            headerLeft: () => ( 
              <Pressable
              style={backButtonStyles.backButton}
              onPress={() => {
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0, // sets the active route index
                    routes: [
                      { name: ExhibitionRootEnum.exhibitionHome }, // the only route in the stack after reset
                    ],
                  })
                );
              }}>
                <BackButtonIcon />
              </Pressable>
            )
            }}
          />
          <ExhibitionStack.Screen
            name={ExhibitionRootEnum.genericLoading}
            component={GenericLoadingScreen}
            options={{...headerOptions, 
            headerLeft: () => ( 
              <View style={backButtonStyles.backButton}>
                <HeaderBackButton 
                  backImage={() => <BackButtonIcon />}
                  labelVisible={false}
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
          <ExhibitionStack.Group screenOptions={{
              presentation: 'transparentModal',
              cardStyle: {backgroundColor: 'transparent'},
              cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {
                    duration: 550, // Duration in milliseconds, adjust as needed
                  },
                },
                close: {
                  animation: 'timing',
                  config: {
                    duration: 550, // Duration in milliseconds, adjust as needed
                  },
                },
              },
            }}>
            <ExhibitionStack.Screen
              name={ExhibitionRootEnum.exhibitionListAdd}
              component={AddToListScreen}
              options={{ 
                headerMode: 'float', 
                cardStyle: {opacity: 1, margin:0, backgroundColor: 'transparent', width: '100%'}, 
                headerTitle: 'Add to list',
                headerTintColor: Colors.PRIMARY_50,
                headerStyle: {
                  backgroundColor: Colors.PRIMARY_950, 
                  opacity: 0.9,
                },
                headerBackImage: () => (
                  <View style={backButtonStyles.backButton}>
                    <TextElement style={{color: Colors.PRIMARY_50}}>Cancel</TextElement>
                  </View>
              ), 
            }}/>
          </ExhibitionStack.Group>
      </ExhibitionStack.Navigator>
  );
}
