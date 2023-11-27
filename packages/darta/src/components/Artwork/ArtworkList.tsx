import React from 'react';
import {View, StyleSheet, FlatList, RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { RecyclerListView, LayoutProvider, DataProvider } from 'recyclerlistview';


import * as Colors from '@darta-styles';
import {Artwork} from '@darta-types'
import ArtworkCard from '../../components/Artwork/ArtworkCard'


const artworkDetailsStyles = StyleSheet.create({
  container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: Colors.PRIMARY_50,
      width: wp('100%'),
      height: '100%',
      padding: 24,
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
}: {
    refreshing: boolean,
    onRefresh: () => void,
    artworkData: Artwork[],
    navigation: any
    navigateTo: string
    navigateToParams: string
}) {

  const renderItem = React.useCallback((_, data) => {
    return (
      <ArtworkCard
        artwork={data}
        navigation={navigation}
        navigateTo={navigateTo}
        navigateToParams={navigateToParams}
      />
    );
  }, [navigation, navigateTo, navigateToParams]);
  

  // const renderItemCallback = React.useCallback(
  //   renderItem(navigation, navigateTo, navigateToParams),
  //   [navigation, navigateTo, navigateToParams]
  // );
  
  const dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows([...artworkData]);

  const layoutProvider = new LayoutProvider(
    index => {
      return 'NORMAL'; // If you have multiple types of items, you can differentiate here using the index
    },
    (_, dim) => {
      dim.width = wp('50%') - 24;
      dim.height = 240 + 36;
    }
  );
  

  return (
    <>
      <View style={artworkDetailsStyles.container}>
        <View style={artworkDetailsStyles.flexContainer}>
          <RecyclerListView
            layoutProvider={layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={renderItem}
            onRefresh={onRefresh}
            refreshing={refreshing}
            initialNumToRender={5}
            updateCellsBatchingPeriod={100}
            maxToRenderPerBatch={5}
            keyExtractor={item => item._id?.toString() ?? "654321"}
            decelerationRate={0.5}
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

export const ArtworkList =  React.memo(ArtworkListComponent, (prevProps, nextProps) => {
  // Implement a comparison function if necessary
  return (
    prevProps.refreshing === nextProps.refreshing &&
    prevProps.onRefresh === nextProps.onRefresh &&
    prevProps.artworkData === nextProps.artworkData &&
    prevProps.navigation === nextProps.navigation &&
    prevProps.navigateTo === nextProps.navigateTo &&
    prevProps.navigateToParams === nextProps.navigateToParams
  );
});