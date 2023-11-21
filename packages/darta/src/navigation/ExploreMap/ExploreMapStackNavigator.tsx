import {PRIMARY_800} from '@darta-styles';
import React, {useContext} from 'react';

import {StoreContext} from '../../state/Store';
import {headerOptions, modalHeaderOptions} from '../../styles/styles';
import { ExploreMapRootEnum} from '../../typing/routes';
import { ExploreMapHomeScreen } from '../../screens/ExploreMap/ExploreMapHomeScreen';
import {createStackNavigator, CardStyleInterpolators} from '@react-navigation/stack';
import { ExhibitionTopTabNavigator } from '../Exhibition/ExhibitionTopTabNavigator';
import { ExhibitionGalleryScreen } from '../../screens/Exhibition';
import { ArtworkScreen } from '../../screens/Artwork/ArtworkScreen';
import { Pressable, StyleSheet, View} from 'react-native';  
import { useNavigation } from '@react-navigation/native';
import { BackButtonIcon } from '../../assets/SVGs/BackButtonIcon';


export const ExploreMapStack = createStackNavigator();
const styles = StyleSheet.create({ 
  backButton: {
    marginLeft: 24,
    marginTop: 10, 
    marginBottom: 10
  }
});



export function ExploreMapStackNavigator({route} : {route: any}) {
  const {state} = useContext(StoreContext);
  const navigation = useNavigation();
  return (
    <ExploreMapStack.Navigator screenOptions={{
      headerTintColor: PRIMARY_800,
      cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS, 
      headerBackImage: () => (
        <View style={styles.backButton}>
          <BackButtonIcon />
        </View>
        ),
        headerBackTitleVisible: false,
      }}>
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.exploreMapHome}
          component={ExploreMapHomeScreen}
          options={{...headerOptions, headerTitle: 'Visit'}}
        />
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.TopTabExhibition}
          component={ExhibitionTopTabNavigator}
          initialParams={{navigationRoute: ExploreMapRootEnum.explorePastNavigator, navigateTo: ExploreMapRootEnum.individualArtwork}}
          options={{...headerOptions, headerTitle: state.currentExhibitionHeader ?? "",
          headerLeft: () => ( 
            <Pressable
            style={styles.backButton}
            onPress={() => {navigation.navigate(ExploreMapRootEnum.exploreMapHome as never)}}>
              <BackButtonIcon />
            </Pressable>
          )}}
        />
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.explorePastNavigator}
          component={ExhibitionTopTabNavigator}
          initialParams={{navigationRoute: ExploreMapRootEnum.explorePastNavigator, navigateTo: ExploreMapRootEnum.individualArtwork }}
          options={{...headerOptions, headerTitle: state.userExhibitionHeader ?? ""}}
        />
        <ExploreMapStack.Screen
          name={ExploreMapRootEnum.exploreMapGallery}
          component={ExhibitionGalleryScreen}
          initialParams={{galleryId: route.params?.galleryId, showPastExhibitions: true, navigationRoute: ExploreMapRootEnum.explorePastNavigator, navigateTo: ExploreMapRootEnum.individualArtwork}}
          options={{...headerOptions, headerTitle: state.galleryHeader ?? ""}}
        />
        <ExploreMapStack.Screen
            name={ExploreMapRootEnum.individualArtwork}
            component={ArtworkScreen}
            options={{...modalHeaderOptions, headerTitle: state.currentArtworkTombstoneHeader ?? ""}}
          />
    </ExploreMapStack.Navigator>
  );
}
