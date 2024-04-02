import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import * as Colors from '@darta-styles';
import * as SVGs from '../../assets/SVGs';
import { ETypes, StoreContext } from '../../state';
import { currentlyViewingMapView } from '../../state/Store';
import { FilterBannerButton } from '../Elements/FilterBannerButton';


const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 12,
    // height: screenHeight * 0.2,
    // backgroundColor: Colors.PRIMARY_950,
    justifyContent: 'flex-end',
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
    gap: 4
  }
});

export const FilterBanner = () => {
  const { state, dispatch } = React.useContext(StoreContext);

  const handleShowRoute = () => {
    if (state.isViewingWalkingRoute === true) {
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
    }
    // if (state.isViewingWalkingRoute) {
    //   dispatch({
    //     type: ETypes.setIsViewingWalkingRoute,
    //     isViewingWalkingRoute: false
    //   })
    // }
  } 

  const handleShowSaved = () => {
    if (state.currentlyViewingMapView === currentlyViewingMapView.savedGalleries) {
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
        {
          <FilterBannerButton 
            inUse={state.isViewingWalkingRoute === true}
            IconInUse={<SVGs.FigureWalkingLogoWhite20 />}
            IconNotInUse={<SVGs.FigureWalkingLogoBlack20 />}
            onPress={handleShowRoute}
            text={"Your Route"}
          />
        }
        <FilterBannerButton 
          inUse={(state.currentlyViewingMapView === currentlyViewingMapView.savedGalleries)}
          IconInUse={<SVGs.HeartEmpty20 />}
          IconNotInUse={<SVGs.HeartFill20 />}
          onPress={handleShowSaved}
          text={"Following"}
        />
        <FilterBannerButton 
            inUse={(state.currentlyViewingMapView === currentlyViewingMapView.openingTonight)}
            IconInUse={<SVGs.DoorsOpenWhite />}
            IconNotInUse={<SVGs.DoorsOpenBlack />}
            onPress={handleShowOpeningTonight}
            text={"Opening Tonight"}
          />
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
