import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {MILK} from '../../../assets/styles';
import {DataT} from '../../../types';
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
  flex1: {
    flex: 1,
  },
});

export function UserSavedArtwork({navigation}: {navigation: any}) {
  const {state} = useContext(StoreContext);

  const [savedGallery, setSavedGallery] = useState<DataT[] | null>();
  const [indexes, setIndexes] = useState();
  const [odds, setOdds] = useState<number[] | null>();
  const [evens, setEvens] = useState<number[] | null>();

  useEffect(() => {
    const gal = Object.values(
      state.globalGallery.savedArtwork.fullDGallery,
    ).sort((a, b) => b?.savedAt - a?.savedAt);
    const index = Array.from(Array(gal.length).keys());
    setIndexes(indexes);
    const odd = index.filter(index => index % 2 !== 0);
    setOdds(odd);
    const even = index.filter(index => index % 2 === 0);
    setEvens(even);

    setSavedGallery(gal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return (
    <View style={SSUserSavedArtwork.container}>
      {savedGallery && (
        <FlatList
          data={[0]}
          keyExtractor={item => item.toString()}
          style={{marginBottom: hp('10%'), marginTop: hp('2.5%')}}
          renderItem={() => (
            <View style={SSUserSavedArtwork.flexContainer}>
              <View style={SSUserSavedArtwork.flex1}>
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
              <View style={SSUserSavedArtwork.flex1}>
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
      )}
    </View>
    // </View>
  );
}
