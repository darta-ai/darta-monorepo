import React, { useState, useEffect } from 'react';
import { View, ImageBackground } from 'react-native';
// import CardStack, { Card } from "react-native-card-stack-swiper";
// import {getImageCollection} from '../firebase/firebase'
import {
  ImageCollection,
} from '../firebase/hooks';
import styles from '../assets/styles';
import { Gallery } from '../components/Gallery';

const images2 = [
  '4d8b94774eb68a1b2c002a78',
  '50be685e5d3885e229000f9a',
  '52da700d139b21128d0001a6',
  '5c4cd3477cda7f02e87f8adc',
  '5408bb247261694c85c50100',
  '5423431772616939790c0000',
  '544949e072616938d3531400',
  '544949e37261692d60ec0200',
  '55846e6f72616943da0000b0',
  // '55846ebd7261690c170000d9',
  // '55846ec572616918230000b8',
  // '55a3bb6a7261694214000580',
  // '55ad4d3772616972f1000027',
  '55f2ffc97261696610000113',
  // '55f2ffcc72616966bd0000f4',
  // '55f87d667261691783000109',
  // '55f87d697261690f2d0000ee',
  // '55f87d6a72616905100000f0',
  // '55f87d6b72616950010000bc',
  // '5628e6ec72616978130004d6',
  // '563b882772616952c8000501',
  // '5650bf66258faf48f300057f',
  // '565de2309acc8a7721000086',
  // '56e8952f9c18db74180001a2',
  // '57609fda139b2169c700028d',
  // '5762cd33cd530e65e9000487',
  '57e59a54cd530e44a60001ee',
  // '57ea0527275b2405a700031b',
  // '57f662f3a09a67387f000937',
  // '580e62df8b3b817eba0000e0',
  '58a72baf7622dd1b4ec98f7a',
  // '58a72bafa09a676b405edf32',
  // '5a287782a09a67123d2210db',
  // '5a4e9010c9dc2406f90b6341',
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
