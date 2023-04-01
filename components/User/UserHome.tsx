import React, {useContext, useEffect, useState} from 'react';
import {SafeAreaView, View, ScrollView, Image} from 'react-native';
import {UserScreenSelector} from './UserComponents/UserScreenSelector';
import {UserProfile} from './UserComponents/UserProfile';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {getButtonSizes} from '../../functions/galleryFunctions';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {ExploreArtworks} from './UserComponents/ExploreArtworks';
import {MILK} from '../../assets/styles';

const exploreData = {
  '0': {
    name: 'Liliane Tomasko',
    details: 'los angeles based artist',
    id: '506b34324466170002001bef',
    type: 'artist',
  },
  '1': {
    name: 'All Street',
    details: 'LES gallery',
    id: '5a74ae26c9dc246d3cec9b16',
    preview:
      'https://d32dm0rphc51dk.cloudfront.net/8_wVaGb1c3Il5x_cpbzZRw/larger.jpg',
    type: 'gallery',
    logo: 'https://images.squarespace-cdn.com/content/v1/62337b61c3a3126b7627f968/b811248e-cf21-4c2c-a1e8-80252fc99a6a/favicon.ico?format=100w',
  },
  '2': {
    name: 'Deathly Still',
    details: 'curated works by amy curation',
    id: '60b26fc611c5550012ddfec9',
    preview:
      'https://d32dm0rphc51dk.cloudfront.net/V3-CQH0rCzu-K_BY1RDUyw/larger.jpg',
    type: 'curator',
    logo: 'https://s3.amazonaws.com/files.collageplatform.com.prod/image_cache/favicon/application/599f12405a4091c6048b4568/17a4320352e109937d45258c89ac8a91.png',
  },
  '3': {
    name: 'Simon Ko',
    details: 'new york based artist',
    id: '60b8ed5ce542ef000f5f55e8',
    preview:
      'https://d32dm0rphc51dk.cloudfront.net/LL1Rsz2uFtNduINKDxeEMA/larger.jpg',
    type: 'artist',
  },
};

function UserHome() {
  const insets = useSafeAreaInsets();
  const localButtonSizes = getButtonSizes(hp('100%'));
  return (
    <View
      style={{
        backgroundColor: MILK,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        flex: 1,
        flexDirection: 'column',
        alignContent: 'center',
      }}>
      <ScrollView style={{flexDirection: 'column'}}>
        <View>
          <View>
            <UserProfile localButtonSizes={localButtonSizes} />
          </View>
          <ScrollView>
            <View>
              <UserScreenSelector
                headline={'| y o u'}
                localButtonSizes={localButtonSizes}
              />
            </View>
            <View>
              <ExploreArtworks
                headline={'| e x p l o r e'}
                localButtonSizes={localButtonSizes}
                exploreData={exploreData}
              />
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

export default UserHome;
