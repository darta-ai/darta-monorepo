import {PRIMARY_800} from '@darta-styles';
import React, {useContext} from 'react';

import {ExhibitionGalleryScreen} from '../../screens/_index';
import {StoreContext} from '../../state/Store';
import {headerOptions, modalHeaderOptions, viewOptionsStyles} from '../../styles/styles';
import {ExhibitionRootEnum, PreviousExhibitionRootEnum} from '../../typing/routes';
import {ExhibitionTopTabNavigator} from './ExhibitionTopTabNavigator'
import {ArtworkScreen} from '../../screens/Artwork/ArtworkScreen';
import { PastExhibitionTopTabNavigator } from './PastExhibitionTopTabNavigator';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useDeepLinking } from '../../components/LinkingAndNavigation/deepLinking';
import { View, Pressable, StyleSheet} from 'react-native';  
import { HeaderBackButton } from '@react-navigation/elements';
import { CommonActions } from '@react-navigation/native';
import { IconButton } from 'react-native-paper';
import Share from 'react-native-share'
import { ExhibitionHomeTopTabNavigator } from './ExhibitionHomeTopTabNavigator';
import { GenericLoadingScreen } from '../../screens/Loading/GenericLoading';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';
import * as Colors from '@darta-styles'

export const ExhibitionStack = createStackNavigator();


export function ExhibitionStackNavigator() {
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

  const styles = StyleSheet.create({ 
    backButton: {
      marginLeft: 24,
      marginTop: 10, 
      marginBottom: 10
    }
  });


  return (
      <ExhibitionStack.Navigator screenOptions={{
        headerTintColor: PRIMARY_800,
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, 
        headerBackImage: () => (
        <View style={styles.backButton}>
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
            options={{...headerOptions, headerTitle: state.currentExhibitionHeader ?? "",
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
            options={{...headerOptions, headerTitle: state.previousExhibitionHeader ?? "", 
            // headerLeft: () => ( 
            //   <View>
            //     <HeaderBackButton 
            //       backImage={() => <BackButtonIcon />}
            //       labelVisible={false}
            //       style={styles.backButton}
            //       onPress={() => {
            //         navigation.dispatch(
            //           CommonActions.reset({
            //             routes: [
            //               { name: ExhibitionRootEnum.TopTab }, // the only route in the stack after reset
            //             ],
            //           })
            //         );
            //       }}
            //       tintColor={PRIMARY_800}
            //     />
            //   </View>
            // )
            }}
            initialParams={{navigateTo: ExhibitionRootEnum.individualArtwork}}
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
                iconColor={Colors.PRIMARY_950}
                style={viewOptionsStyles.viewOptionsButtonStyle}
                onPress={() => shareExhibition()}
              />
            ),
            headerLeft: () => ( 
              <Pressable
              style={styles.backButton}
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
              <View style={styles.backButton}>
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
      </ExhibitionStack.Navigator>
  );
}
