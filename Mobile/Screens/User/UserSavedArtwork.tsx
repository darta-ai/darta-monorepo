import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {MILK} from '../../../assets/styles';
import {SAFE_AREA_PADDING} from '../../Camera/Constants';
import {ArtworkSelectorCard} from '../../Components/User/UserArtworkDisplay/ArtworkSelectorCard';
// import {GlobalText} from '../../../GlobalElements';
import {StoreContext} from '../../State/Store';

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
  console.log('rendered');

  // TODO: fix this
  const gallery = Object.values(
    state.globalGallery.savedArtwork?.fullDGallery,
  ).sort((a, b) => b?.savedAt - a?.savedAt);

  console.log(Object.keys(state.globalGallery.savedArtwork.fullDGallery));

  const [savedGallery, setSavedGallery] = useState(gallery);
  const [indexes, setIndexes] = useState(
    Array.from(Array(savedGallery.length).keys()),
  );
  const [odds, setOdds] = useState(indexes.filter(index => index % 2 !== 0));
  const [evens, setEvens] = useState(indexes.filter(index => index % 2 === 0));

  // console.log({gallery});

  useEffect(() => {
    console.log('triggered use effect');
    const gal = Object.values(
      state.globalGallery.savedArtwork.fullDGallery,
    ).sort((a, b) => b?.savedAt - a?.savedAt);
    setIndexes(Array.from(Array(savedGallery.length).keys()));
    setOdds(indexes.filter(index => index % 2 !== 0));
    setEvens(indexes.filter(index => index % 2 === 0));

    setSavedGallery(gal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <View style={SSUserSavedArtwork.container}>
      <FlatList
        data={[0]}
        keyExtractor={item => item.toString()}
        style={{marginBottom: hp('10%'), marginTop: hp('2.5%')}}
        renderItem={() => (
          <View style={SSUserSavedArtwork.flexContainer}>
            <View style={{flex: 1}}>
              {evens && (
                <FlatList
                  nestedScrollEnabled={false}
                  data={evens}
                  keyExtractor={item => item.toString()}
                  renderItem={({item}) => (
                    <ArtworkSelectorCard
                      artwork={savedGallery[item]}
                      displayLeft={item % 2 === 0}
                      navigation={navigation}
                    />
                  )}
                />
              )}
            </View>
            <View style={{flex: 1}}>
              {odds && (
                <FlatList
                  nestedScrollEnabled={false}
                  data={odds}
                  keyExtractor={item => item.toString()}
                  renderItem={({item}) => (
                    <ArtworkSelectorCard
                      artwork={savedGallery[item]}
                      displayLeft={item % 2 === 0}
                      navigation={navigation}
                    />
                  )}
                />
              )}
            </View>
          </View>
        )}
      />
    </View>
    // </View>
  );
}
