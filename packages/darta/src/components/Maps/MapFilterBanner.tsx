import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView, Alert } from 'react-native';
import * as Colors from '@darta-styles';
import * as SVGs from '../../assets/SVGs';
import * as Haptics from 'expo-haptics';
import { ETypes, ExhibitionStoreContext, StoreContext } from '../../state';
import { currentlyViewingMapView } from '../../state/Store';
import { FilterBannerButton } from '../Elements/FilterBannerButton';
import { ExploreMapRootEnum } from '../../typing/routes';


const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    height: 50,
    justifyContent: 'center',
    flexDirection: 'row',
    alignContent: 'center',
    alignItems: 'center',
  },
  blackTab: {
    backgroundColor: Colors.PRIMARY_950,
    height: 5,
    width: '90%',
    borderRadius: 10,
    alignSelf: 'center',
    opacity: 0.5,
  },
  bottomSheet: {
    backgroundColor: Colors.PRIMARY_50,
    height: screenHeight,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    paddingLeft: 24,
    paddingRight: 24,
    paddingTop: 10,
    gap: 10,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 8,
  }
});

export const FilterBanner = ({ navigation } : {navigation : any}) => {
  const { state, dispatch } = React.useContext(StoreContext);
  const { exhibitionState } = React.useContext(ExhibitionStoreContext);

  const handleShowRoute = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (state.mapPinIds?.[state.currentlyViewingCity]?.walkingRoute.length === 0){
      navigation.navigate(ExploreMapRootEnum.bottomSheetOptions)
    } else if (state.currentlyViewingMapView === currentlyViewingMapView.walkingRoute) {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: false,
      })
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.all
      })
    } else {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: true,
      })
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.walkingRoute
      })
    }
  } 

  const handleShowYourList = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (state.mapPinIds?.[state.currentlyViewingCity]?.[currentlyViewingMapView.userSavedExhibitions].length === 0){
      Alert.alert("No open exhibitions on your list.")
    } else if (state.currentlyViewingMapView === currentlyViewingMapView.userSavedExhibitions) {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: false,
      })
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.all
      })
    } else {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: false,
      })
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.userSavedExhibitions
      })
    }
  } 


  const handleShowSaved = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (state.mapPinIds?.[state.currentlyViewingCity]?.[currentlyViewingMapView.savedGalleries].length === 0){
      Alert.alert("You are not following any galleries with shows open.", "Follow more galleries by pressing the heart on the gallery's page.")
    } else if (state.currentlyViewingMapView === currentlyViewingMapView.savedGalleries) {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.all
      })
    } else {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.savedGalleries
      })
    }
    if (state.isViewingWalkingRoute) {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: false
      })
    }
  } 

  const handleShowNew = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (state.currentlyViewingMapView === currentlyViewingMapView.newOpenings) {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.all
      })
    } else {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.newOpenings
      })
    }
    if (state.isViewingWalkingRoute) {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: false
      })
    }
  } 

  const handleShowClosing = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (state.currentlyViewingMapView === currentlyViewingMapView.newClosing) {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.all
      })
    } else {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.newClosing
      })
    }
    if (state.isViewingWalkingRoute) {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: false
      })
    }
  } 
  const handleShowOpeningTonight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (state.currentlyViewingMapView === currentlyViewingMapView.openingTonight) {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.all
      })
    } else {
      dispatch({
        type: ETypes.setCurrentViewingMapView,
        currentlyViewingMapView: currentlyViewingMapView.openingTonight
      })
    }
    if (state.isViewingWalkingRoute) {
      dispatch({
        type: ETypes.setIsViewingWalkingRoute,
        isViewingWalkingRoute: false
      })
    }
  } 
  
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        contentContainerStyle={styles.optionsContainer}
      >
          <FilterBannerButton 
            inUse={state.currentlyViewingMapView === currentlyViewingMapView.walkingRoute}
            IconInUse={<SVGs.FigureWalkingLogoWhite20 />}
            IconNotInUse={<SVGs.FigureWalkingLogoBlack20 />}
            onPress={handleShowRoute}
            text={"Your Route"}
          />
          {exhibitionState.userSavedExhibitions && Object.keys(exhibitionState.userSavedExhibitions).length > 0 && ( 
            <FilterBannerButton 
                inUse={state.currentlyViewingMapView === currentlyViewingMapView.userSavedExhibitions}
                IconInUse={<SVGs.NewMapPinSmallWhite />}
                IconNotInUse={<SVGs.NewMapPinSmall />}
                onPress={handleShowYourList}
                text={"Your List"}
            />
          )}
            <FilterBannerButton 
              inUse={(state.currentlyViewingMapView === currentlyViewingMapView.savedGalleries)}
              IconInUse={<SVGs.HeartEmpty20 />}
              IconNotInUse={<SVGs.HeartFill20 />}
              onPress={handleShowSaved}
              text={"Following"}
            />
         {state.mapPinIds?.[state.currentlyViewingCity]?.[currentlyViewingMapView.openingTonight]?.length > 0 && ( 
          <FilterBannerButton 
              inUse={(state.currentlyViewingMapView === currentlyViewingMapView.openingTonight)}
              IconInUse={<SVGs.DoorsOpenWhite />}
              IconNotInUse={<SVGs.DoorsOpenBlack />}
              onPress={handleShowOpeningTonight}
              text={"Reception Tonight"}
            />
          )}
          <FilterBannerButton 
            inUse={(state.currentlyViewingMapView === currentlyViewingMapView.newOpenings)}
            IconInUse={<SVGs.NewBellWhite20 />}
            IconNotInUse={<SVGs.NewBellBlack20 />}
            onPress={handleShowNew}
            text={"Opened This Week"}
          />
          <FilterBannerButton 
            inUse={(state.currentlyViewingMapView === currentlyViewingMapView.newClosing)}
            IconInUse={<SVGs.EyeClosedWhite20 />}
            IconNotInUse={<SVGs.EyeClosedBlack20 />}
            onPress={handleShowClosing}
            text={"Closing This Week"}
          />
      </ScrollView>
    </View>
  );
};
