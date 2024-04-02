import React from 'react';
import {View, StyleSheet, RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';
import { useFocusEffect } from '@react-navigation/native';


import * as Colors from '@darta-styles';
import {Artwork} from '@darta-types'
import ArtworkCard from '../../components/Artwork/ArtworkCard'
import { TextElement } from '../Elements/TextElement';
import { UIStoreContext, UiETypes } from '../../state';


const artworkDetailsStyles = StyleSheet.create({
  container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: Colors.PRIMARY_50,
      width: wp('100%'),
      height: '100%',
      paddingLeft: 24,
      paddingRight: 24,
      paddingBottom: 24,
  },
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp('10%'),
    width: '100%',
    height: '100%',
    backgroundColor: Colors.PRIMARY_50,
},
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    flex: 1
  },
})

export function ArtworkListComponent({
    refreshing,
    onRefresh,
    artworkData,
    navigation,
    navigateTo,
    navigateToParams,
    route
}: {
    refreshing: boolean,
    onRefresh: () => void,
    artworkData: Artwork[],
    navigation: any
    navigateTo: string
    navigateToParams: string,
    route?: any
}) {
  const {uiDispatch} = React.useContext(UIStoreContext);

  const navigateToTombstone = (artwork: Artwork) => {
    uiDispatch({
      type: UiETypes.setTombstoneHeader,
      currentArtworkHeader: artwork?.artworkTitle?.value ?? "",
    });
    navigation.navigate(navigateTo, {
      artOnDisplay: artwork,
      navigateToParams
    });
  };


  const renderItem = React.useCallback((index: any, data: Artwork) => {
    return (
      <ArtworkCard
        artwork={data}
        navigateToTombstone={navigateToTombstone}
      />
    );
  }, [navigation, navigateTo, navigateToParams]);
  

  const dataProvider = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows([...artworkData]);


  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.artworkTitle){
        uiDispatch({
          type: UiETypes.setTombstoneHeader,
          currentArtworkHeader: route.params.artworkTitle,
        })
    }
    }, [route?.params])
  )



  const layoutProvider = new LayoutProvider(
    index => {
      return index; 
    },
    (_, dim) => {
      dim.width = wp('50%') - 24;
      dim.height = 240 + 24;
    }
  );

  layoutProvider.shouldRefreshWithAnchoring = false;
  
  if (!artworkData){
    return (
    <View style= {{backgroundColor: Colors.PRIMARY_50, alignItems: 'center', justifyContent: 'center', gap: 24, height: '100%'}}>
        <TextElement style={{ fontFamily: 'DMSans_700Bold', fontSize: 24 }}>
          Preview unavailable 
        </TextElement>
        <TextElement style={{fontSize: 16, fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_950}}>Please check back soon</TextElement>
      </View>
  )
  }
  else if (artworkData.length !== 0){
  return (
    <>
      <View style={artworkDetailsStyles.container}>
        <View style={artworkDetailsStyles.flexContainer}>
          <RecyclerListView
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={renderItem}
            // keyExtractor={(item: Artwork) => item._id?.toString() ?? "654321"}
            decelerationRate={0.5}
            onEndReachedThreshold={0.1}
            scrollViewProps={{
              refreshControl: (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={Colors.PRIMARY_600}
                />
                )
              }}
          />
          </View>
      </View>
    </>
  );
            }
}

export const ArtworkList = React.memo(ArtworkListComponent, (prevProps, nextProps) => {
  // Implement a comparison function if necessary
  return (
    prevProps.refreshing === nextProps.refreshing &&
    prevProps.onRefresh === nextProps.onRefresh &&
    prevProps.artworkData === nextProps.artworkData &&
    prevProps.navigation === nextProps.navigation &&
    prevProps.navigateTo === nextProps.navigateTo &&
    prevProps.navigateToParams === nextProps.navigateToParams
  );
})