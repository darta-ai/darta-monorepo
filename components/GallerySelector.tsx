import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  Alert,
  SafeAreaView,
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Divider } from 'react-native-elements';
import { GlobalText } from './GlobalElements/index';
import { GalleryPreview } from './Gallery/GalleryComponents';
import { globalTextStyles } from './styles';
import { DataT } from '../types';
import { getImages } from '../functions/galleryFunctions';
import { images1, images2, timWilson } from './globalVariables';
import { Gallery } from './Gallery/Gallery';

// Mock Data
interface GalleryIds {
    [key : string] : {
        type: string,
        galleryId: string,
        artworkIds: string[],
        text: string,
        body: string
    }
}

const galleryInfo: GalleryIds = {
  '01a5ac40-bc52-11ed-afa1-0242ac120002': {
    type: 'privateGallery',
    galleryId: '01a5ac40-bc52-11ed-afa1-0242ac120002',
    artworkIds: images1,
    text: 'Private Opening',
    body: 'Your Daily Opening',
  },
  '1d2091ce-bc52-11ed-afa1-0242ac120002': {
    type: 'groupShow',
    galleryId: '1d2091ce-bc52-11ed-afa1-0242ac120002',
    artworkIds: images2,
    text: 'A Group Show',
    body: 'Curated By Gallerina Delvey',
  },
  '645d3af4-565e-4edd-9d61-e7dd0c7a26ba': {
    type: 'galleryOpening',
    galleryId: '645d3af4-565e-4edd-9d61-e7dd0c7a26ba',
    artworkIds: timWilson,
    text: 'Tim Wilson Opening',
    body: 'Artwork by Tim Wilson',
  },
};

export function GallerySelector() {
  const emptyGalleryList = Object.keys(galleryInfo).reduce((obj, id) => ({
    ...obj,
    [id]: {
      id,
      fullDGallery: false,
      numberOfRatedWorks: 0,
      artworkIds: galleryInfo[id].artworkIds,
      numberOfArtworks: galleryInfo[id].artworkIds.length,
      userArtworkRankings: false,
      galleryIndex: 0,
    },
  }), {});

  const personalGalleryId = Object.keys(galleryInfo).filter((id : string) => galleryInfo[id].type === 'privateGallery')[0];
  const personalGallery = galleryInfo[personalGalleryId];

  const otherGalleryIds = Object.keys(galleryInfo).filter((id : string) => galleryInfo[id].type !== 'privateGallery');
  const otherGalleries = otherGalleryIds.map(
    (id: string) => id = { ...galleryInfo[id] },
  );

  const [isGalleryDisplayed, setIsGalleryDisplayed] = useState<boolean>(false);
  const [galleryOnDisplayId, setGalleryOnDisplayId] = useState<string>(personalGalleryId);
  const [globalGallery, setGlobalGallery] = useState<any>(emptyGalleryList);
  const [isPortrait, setIsPortrait] = useState(true);

  const showGallery = async (galleryId: string, currentIndex?: number) => {
    if (isGalleryDisplayed) {
      const currentGallery = globalGallery[galleryOnDisplayId];
      currentGallery.galleryIndex = currentIndex;
      setGlobalGallery({ ...globalGallery, ...currentGallery });
      setIsGalleryDisplayed(false);
    } else {
      setGalleryOnDisplayId(galleryId);
      const gallery = globalGallery[galleryId];
      let fullImages:DataT[] = gallery?.fullDGallery ?? null;
      if (!gallery.fullDGallery) {
        try {
          fullImages = await getImages(gallery.artworkIds);
          gallery.fullDGallery = fullImages;
          setGlobalGallery({ ...globalGallery, ...gallery });
        } catch (e) {
          Alert.alert('Unable to load gallery 🧑‍💻🤦');
        }
      }
      if (!gallery?.userArtworkRankings && gallery.artworkIds) {
        const { artworkIds } = gallery;
        const userRatingsEmpty = artworkIds.reduce((obj, id) => ({
          ...obj,
          [id]: {},
        }), {});
        gallery.userArtworkRankings = userRatingsEmpty;
        setGlobalGallery({ ...globalGallery, ...gallery });
      }
      setIsGalleryDisplayed(true);
    }
  };

  const isUserResettingRating = (
    userArtworkRatings: any,
    userRating: any,
  ) => (userArtworkRatings?.like && userRating?.like)
    || (userArtworkRatings?.save && userRating?.save)
    || (userArtworkRatings?.dislike && userRating?.dislike);

  const setUserArtworkRatings = (
    galleryId: string,
    artOnDisplayId: string,
    updatedRatings: any,
  ) => {
    const fullUserGallery = globalGallery[galleryId];
    const userArtworkRatings = fullUserGallery.userArtworkRankings[artOnDisplayId];
    const userRating = updatedRatings[artOnDisplayId];
    const isResettingRating = isUserResettingRating(userRating, userArtworkRatings);
    if (isResettingRating) {
      fullUserGallery.numberOfRatedWorks -= 1;
      fullUserGallery.userArtworkRankings[artOnDisplayId] = {};
    } else {
      if (
        !userArtworkRatings?.like
        && !userArtworkRatings?.save
        && !userArtworkRatings?.dislike
      ) {
        fullUserGallery.numberOfRatedWorks += 1;
      }
      fullUserGallery.userArtworkRankings[artOnDisplayId] = updatedRatings[artOnDisplayId];
    }
    setGlobalGallery({
      ...globalGallery,
      ...fullUserGallery,
    });
  };

  return (
    <View>
      {isGalleryDisplayed
        ? (
          <Gallery
            fullDGallery={globalGallery[galleryOnDisplayId].fullDGallery}
            resumedDisplayIndex={globalGallery[galleryOnDisplayId].galleryIndex}
            galleryId={galleryOnDisplayId}
            numberOfRatedWorks={globalGallery[galleryOnDisplayId].numberOfRatedWorks}
            numberOfArtworks={globalGallery[galleryOnDisplayId].numberOfArtworks}
            userArtworkRatings={globalGallery[galleryOnDisplayId].userArtworkRankings}
            isPortrait={isPortrait}
            setIsPortrait={setIsPortrait}
            setUserArtworkRatings={setUserArtworkRatings}
            showGallery={showGallery}
          />
        )
        : (
          <>
            <View style={{
              height: hp('25%'), width: '100%',
            }}
            >
              <GlobalText style={[globalTextStyles.titleText,
                globalTextStyles.centeredText]}
              >
                d a r t a
              </GlobalText>
              <GalleryPreview
                galleryId={personalGallery.galleryId}
                text={personalGallery.text}
                body={personalGallery.body}
                numberOfArtworks={globalGallery[personalGallery.galleryId]?.numberOfArtworks}
                numberOfRatedWorks={globalGallery[personalGallery.galleryId]?.numberOfRatedWorks}
                isPortrait={isPortrait}
                showGallery={showGallery}
              />
            </View>
            <Divider style={{
              backgroundColor: '#D3D3D3',
              paddingVertical: 5,
              margin: 10,
            }}
            />
            <View style={{ height: hp('50%'), marginTop: 10 }}>
              <SafeAreaView style={{ flex: 1 }}>
                <FlatList
                  data={otherGalleries}
                  renderItem={({ item }) => (
                    <GalleryPreview
                      galleryId={item.galleryId}
                      text={item.text}
                      body={item.body}
                      numberOfArtworks={globalGallery[item.galleryId]?.numberOfArtworks}
                      numberOfRatedWorks={globalGallery[item.galleryId]?.numberOfRatedWorks}
                      isPortrait={isPortrait}
                      showGallery={showGallery}
                    />
                  )}
                  keyExtractor={(item) => item.galleryId}
                />
              </SafeAreaView>
            </View>
          </>
        )}
    </View>
  );
}
