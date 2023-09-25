import React, {useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

import {MILK} from '@darta-styles';
import {Artwork} from '@darta-types';
import {ArtworkCard} from '../Artwork/ArtworkCard';
import {StoreContext} from '../../state/Store';

export const SSUserinquiredArtwork = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignContent: 'center',
    justifyContent: 'space-around',
    alignSelf: 'center',
    width: wp('100%'),
    height: hp('95%'),
    paddingBottom: hp('95%'),
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

export function UserInquiredArtwork({navigation}: {navigation: any}) {
  const {state} = useContext(StoreContext);

  const [inquiredGallery, setInquiredGallery] = useState<Artwork[] | null>();
  const [indexes, setIndexes] = useState();
  const [odds, setOdds] = useState<number[] | null>();
  const [evens, setEvens] = useState<number[] | null>();

  useEffect(() => {
    const gal = Object.values(
      state.dartaData.inquiredArtwork.fullDGallery,
    ).sort((a, b) => b?.inquiredAt - a?.inquiredAt);
    const index = Array.from(Array(gal.length).keys());
    setIndexes(indexes);
    const odd = index.filter(index => index % 2 !== 0);
    setOdds(odd);
    const even = index.filter(index => index % 2 === 0);
    setEvens(even);

    setInquiredGallery(gal);
  }, [state]);

  return (
    <View style={SSUserinquiredArtwork.container}>
      {inquiredGallery && (
        <FlatList
          data={[0]}
          keyExtractor={item => item.toString()}
          style={{marginBottom: hp('10%'), marginTop: hp('2.5%')}}
          renderItem={() => (
            <View style={SSUserinquiredArtwork.flexContainer}>
              <View style={SSUserinquiredArtwork.flex1}>
                {evens && (
                  <FlatList
                    nestedScrollEnabled={false}
                    data={evens}
                    keyExtractor={item => item.toString()}
                    renderItem={({item}) => (
                      <ArtworkCard
                        artwork={inquiredGallery[item]}
                        displayLeft={item % 2 === 0}
                        navigation={navigation}
                      />
                    )}
                  />
                )}
              </View>
              <View style={SSUserinquiredArtwork.flex1}>
                {odds && (
                  <FlatList
                    nestedScrollEnabled={false}
                    data={odds}
                    keyExtractor={item => item.toString()}
                    renderItem={({item}) => (
                      <ArtworkCard
                        artwork={inquiredGallery[item]}
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
