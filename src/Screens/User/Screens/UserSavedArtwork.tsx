import React, {useContext} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {MILK} from '../../../../assets/styles';
import {SAFE_AREA_PADDING} from '../../../Camera/Constants';
// import {GlobalText} from '../../../GlobalElements';
import {StoreContext} from '../../../State/Store';
import {ArtworkSelectorCard} from '../UserComponents/UserArtworkDisplay/ArtworkSelectorCard';

export const SSUserSavedArtwork = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: wp('100%'),
    height: hp('95%'),
    paddingBottom: SAFE_AREA_PADDING.paddingBottom,
    backgroundColor: MILK,
  },
  flexContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export function UserSavedArtwork({navigation}: {navigation: any}) {
  const {state} = useContext(StoreContext);

  // TODO: fix this
  const gallery = state.globalGallery.savedArtwork?.fullDGallery;

  const indexes = Array.from(Array(gallery.length).keys());
  const odds = indexes.filter(index => index % 2 !== 0);
  const evens = indexes.filter(index => index % 2 === 0);

  return (
    <View style={SSUserSavedArtwork.container}>
      <FlatList
        data={[0]}
        keyExtractor={item => item.toString()}
        style={{marginBottom: hp('10%'), marginTop: hp('2.5%')}}
        renderItem={() => (
          <View style={SSUserSavedArtwork.flexContainer}>
            <View style={{flex: 1}}>
              <FlatList
                nestedScrollEnabled={false}
                data={evens}
                keyExtractor={item => item.toString()}
                renderItem={({item}) => (
                  <ArtworkSelectorCard
                    artwork={gallery[item]}
                    displayLeft={item % 2 === 0}
                    navigation={navigation}
                  />
                )}
              />
            </View>
            <View style={{flex: 1}}>
              <FlatList
                nestedScrollEnabled={false}
                data={odds}
                keyExtractor={item => item.toString()}
                renderItem={({item}) => (
                  <ArtworkSelectorCard
                    artwork={gallery[item]}
                    displayLeft={item % 2 === 0}
                    navigation={navigation}
                  />
                )}
              />
            </View>
          </View>
        )}
      />
    </View>
    // </View>
  );
}
