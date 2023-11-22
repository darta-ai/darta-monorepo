import React from 'react';
import {View, StyleSheet, FlatList,
  RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';


import * as Colors from '@darta-styles';
import {Artwork} from '@darta-types'
import ArtworkCard from '../../components/Artwork/ArtworkCard'


const artworkDetailsStyles = StyleSheet.create({
  container: {
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: Colors.PRIMARY_50,
      width: '100%',
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
    gap: 24,
    alignContent: 'center',
  },
})

export function ArtworkList({
    refreshing,
    onRefresh,
    evenArtwork,
    oddArtwork,
    navigation,
    navigateTo,
    navigateToParams,
}: {
    refreshing: boolean,
    onRefresh: () => void,
    evenArtwork: Artwork[],
    oddArtwork: Artwork[],
    navigation: any
    navigateTo: string
    navigateToParams: string
}) {

  return (
    <>
      <View style={artworkDetailsStyles.container}>
        <FlatList
          data={[0]}
          keyExtractor={item => item.toString()}
          refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}
          renderItem={() => (
            <View style={artworkDetailsStyles.flexContainer}>
                {evenArtwork && (
                  <FlatList
                    nestedScrollEnabled={false}
                    data={evenArtwork}
                    initialNumToRender={evenArtwork.length}
                    keyExtractor={item => item._id?.toString() ?? "654321"}
                    renderItem={({item}) => (
                      <ArtworkCard
                        artwork={item}
                        navigation={navigation}
                        navigateTo={navigateTo}
                        navigateToParams={navigateToParams}
                      />
                    )}
                  />
                )}
                {oddArtwork && (
                  <FlatList
                    nestedScrollEnabled={false}
                    data={oddArtwork}
                    initialNumToRender={oddArtwork.length}
                    keyExtractor={item => item.artworkId?.toString() ?? "123456"}
                    renderItem={({item}) => (
                      <ArtworkCard
                        artwork={item}
                        navigation={navigation}
                        navigateTo={navigateTo}
                        navigateToParams={navigateToParams}
                      />
                    )}
                  />
                )}
              </View>
          )}
        />
        </View>
    </>
  );
}
