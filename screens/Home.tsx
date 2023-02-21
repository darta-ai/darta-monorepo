import React, { useState, useEffect } from 'react';
import { View, ImageBackground, Image } from 'react-native';
// import CardStack, { Card } from "react-native-card-stack-swiper";
// import {getImageCollection} from '../firebase/firebase'
import {
  ImageCollection,
} from '../firebase/hooks';
import { City, CardItem } from '../components';
import styles from '../assets/styles';
import Gallery from '../components/Gallery';

// import DeviceInfo from "react-native-device-info";

const images = [
  '4d8b94774eb68a1b2c002a78',
  '50be685e5d3885e229000f9a',
  '59be75c17622dd4d773dc693',
  '52da700d139b21128d0001a6',
  '5408bb247261694c85c50100',
  '5423431772616939790c0000',
  '5a68f131c9dc244a228b9f93',
  '5f91fe21039c9f000e65e13a',
  '5e5b44ff20f5f40012bb46cd',
  '5ebbb639d4cd3c0012b99f39',
  '5228ef09139b210c7200054e',
  '5277d439c9dc241f1e00008f',
  '52bc7bdac9dc24c90d00004c',
  '52da700d139b21128d0001a6',
  '52e98d277622ddc978000097',
  '52e98d3e9c18db46da0000b6',
  '52eac9b1139b21c2bb0002ea',
  '52f40809139b2143b7000020',
  '52fe954e7622dd4cd20001a4',
  '53177a3b9c18db88a20003cf',
  '5398aa6a1a1e86781f000219',
  '53d7b53a7261692d5a560000',
  '5408bb237261691407060200',
  '5408bb2372616941e2d10100',
  '5408bb237261695a25da0100',
  '5408bb2372616964fecf0100',
  '5408bb2472616921b2b60100',
];

const images2 = [
  '4d8b94774eb68a1b2c002a78',
  '50be685e5d3885e229000f9a',
  '52da700d139b21128d0001a6',
  '5398aa6a1a1e86781f000219',
  '5408bb247261694c85c50100',
  '5423431772616939790c0000',
  '544949e072616938d3531400',
  '544949e37261692d60ec0200',
  '55846e6f72616943da0000b0',
  '55846ebd7261690c170000d9',
  '55846ec572616918230000b8',
  '55a3bb6a7261694214000580',
  '55ad4d3772616972f1000027',
  '55f2ffc97261696610000113',
  '55f2ffcc72616966bd0000f4',
  '55f87d667261691783000109',
  '55f87d697261690f2d0000ee',
  '55f87d6a72616905100000f0',
  '55f87d6b72616950010000bc',
  '5628e6ec72616978130004d6',
  '563b882772616952c8000501',
  '5650bf66258faf48f300057f',
  '565de2309acc8a7721000086',
  '56e8952f9c18db74180001a2',
  '57609fda139b2169c700028d',
  '5762cd33cd530e65e9000487',
  '57e59a54cd530e44a60001ee',
  '57ea0527275b2405a700031b',
  '57f662f3a09a67387f000937',
  '580e62df8b3b817eba0000e0',
  '58a72baf7622dd1b4ec98f7a',
  '58a72bafa09a676b405edf32',
  '5a287782a09a67123d2210db',
  '5a4e9010c9dc2406f90b6341',
  '5a628f7d139b210c2f2c03ea',
];

function Home() {
  const [fullGallery, setFullGallery] = useState<any[]>([]);

  const getImages = async (docIds:string[]) => {
    const results: any[] = await Promise.all(docIds.map(async (docID:string): Promise<any> => {
      let artwork;
      await ImageCollection.doc(docID).get().then((doc) => {
        if (doc.exists) {
          ({ artwork } = doc.data());
        }
      }).catch((e) => {
        console.log('!!!! error', { e });
        throw new Error(`No image exists for id ${docID}`);
      });
      return artwork;
    }));
    setFullGallery(results);
  };

  useEffect(() => {
    const asyncGetImages = async () => {
      await getImages(images2);
    };
    asyncGetImages();
  }, []);
  return (
    <ImageBackground
      source={require('../assets/images/bg.png')}
      style={styles.bg}
    >
      <View style={styles.containerHome}>
        {fullGallery.length
          ? (
            <Gallery
              galleryImages={fullGallery}
            />
          ) : null}
      </View>
    </ImageBackground>
  );
}

export default Home;
