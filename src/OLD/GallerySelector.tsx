import React, {useContext, useState} from 'react';
import {Alert, FlatList, SafeAreaView, View} from 'react-native';
import {Divider} from 'react-native-elements';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {getImages} from '../../functions/galleryFunctions';
import {DataT} from '../../types';
import {GlobalText} from '../GlobalElements/index';
import * as globals from '../globalVariables';
import {GalleryPreview} from '../Screens/Gallery/GalleryComponents';
import {globalTextStyles} from '../styles';
import {Gallery} from './Gallery_DEP';
import {StoreContext} from './Store';

const galleryInfo = globals.galleryDummyData;

export function GallerySelector() {
  const {state} = useContext(StoreContext);
  const emptyGalleryList = Object.keys(galleryInfo).reduce(
    (obj, id) => ({
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
    }),
    {},
  );

  const personalGalleryId = Object.keys(galleryInfo).filter(
    (id: string) => galleryInfo[id].type === 'privateGallery',
  )[0];
  const personalGallery = galleryInfo[personalGalleryId];

  const otherGalleryIds = Object.keys(galleryInfo).filter(
    (id: string) => galleryInfo[id].type !== 'privateGallery',
  );
  const otherGalleries = otherGalleryIds.map(
    // eslint-disable-next-line no-return-assign, no-param-reassign
    id => (id = {...galleryInfo[id]}),
  );

  const [isGalleryDisplayed, setIsGalleryDisplayed] = useState<boolean>(false);
  const [galleryOnDisplayId, setGalleryOnDisplayId] =
    useState<string>(personalGalleryId);
  const [globalGallery, setGlobalGallery] = useState<any>(emptyGalleryList);
  const [isPortrait, setIsPortrait] = useState(true);

  const showGallery = async (galleryId: string, currentIndex?: number) => {
    if (isGalleryDisplayed) {
      const currentGallery = globalGallery[galleryOnDisplayId];
      currentGallery.galleryIndex = currentIndex;
      setGlobalGallery({...globalGallery, ...currentGallery});
      setIsGalleryDisplayed(false);
    } else {
      setGalleryOnDisplayId(galleryId);
      const gallery = globalGallery[galleryId];
      let fullImages: DataT[] = gallery?.fullDGallery ?? null;
      if (!gallery.fullDGallery) {
        try {
          fullImages = await getImages(gallery.artworkIds);
          gallery.fullDGallery = fullImages;
          setGlobalGallery({...globalGallery, ...gallery});
        } catch (e) {
          Alert.alert('Unable to load gallery 🧑‍💻🤦');
        }
      }
      if (!gallery?.userArtworkRankings && gallery.artworkIds) {
        const {artworkIds} = gallery;
        const userRatingsEmpty = artworkIds.reduce(
          (obj: {}, id: string) => ({
            ...obj,
            [id]: {},
          }),
          {},
        );
        gallery.userArtworkRankings = userRatingsEmpty;
        setGlobalGallery({...globalGallery, ...gallery});
      }
      setIsGalleryDisplayed(true);
    }
  };

  const isUserResettingRating = (userArtworkRatings: any, userRating: any) =>
    (userArtworkRatings?.like && userRating?.like) ||
    (userArtworkRatings?.save && userRating?.save) ||
    (userArtworkRatings?.dislike && userRating?.dislike);

  const setUserArtworkRatings = (
    galleryId: string,
    artOnDisplayId: string,
    updatedRatings: any,
  ) => {
    const fullUserGallery = globalGallery[galleryId];
    const userArtworkRatings =
      fullUserGallery.userArtworkRankings[artOnDisplayId];
    const userRating = updatedRatings[artOnDisplayId];
    const isResettingRating = isUserResettingRating(
      userRating,
      userArtworkRatings,
    );
    if (isResettingRating) {
      fullUserGallery.numberOfRatedWorks -= 1;
      fullUserGallery.userArtworkRankings[artOnDisplayId] = {};
    } else {
      if (
        !userArtworkRatings?.like &&
        !userArtworkRatings?.save &&
        !userArtworkRatings?.dislike
      ) {
        fullUserGallery.numberOfRatedWorks += 1;
      }
      fullUserGallery.userArtworkRankings[artOnDisplayId] =
        updatedRatings[artOnDisplayId];
    }
    setGlobalGallery({
      ...globalGallery,
      ...fullUserGallery,
    });
  };

  return (
    <View>
      {isGalleryDisplayed ? (
        <Gallery
          fullDGallery={globalGallery[galleryOnDisplayId].fullDGallery}
          resumedDisplayIndex={globalGallery[galleryOnDisplayId].galleryIndex}
          galleryId={galleryOnDisplayId}
          numberOfRatedWorks={
            globalGallery[galleryOnDisplayId].numberOfRatedWorks
          }
          numberOfArtworks={globalGallery[galleryOnDisplayId].numberOfArtworks}
          userArtworkRatings={
            globalGallery[galleryOnDisplayId].userArtworkRankings
          }
          isPortrait={isPortrait}
          setIsPortrait={setIsPortrait}
          setUserArtworkRatings={setUserArtworkRatings}
          showGallery={showGallery}
        />
      ) : (
        <>
          <View
            style={{
              height: hp('30%'),
              width: '100%',
            }}>
            <GlobalText
              style={[
                globalTextStyles.titleText,
                globalTextStyles.centeredText,
              ]}>
              d a r t a
            </GlobalText>
            <GalleryPreview
              body={personalGallery.body}
              galleryId={personalGallery.galleryId}
              preview={personalGallery.preview}
              numberOfArtworks={
                globalGallery[personalGallery.galleryId]?.numberOfArtworks
              }
              numberOfRatedWorks={
                globalGallery[personalGallery.galleryId]?.numberOfRatedWorks
              }
              text={personalGallery.text}
              showGallery={showGallery}
            />
          </View>
          <Divider
            style={{
              backgroundColor: '#D3D3D3',
              paddingVertical: 5,
              margin: 10,
            }}
          />
          <View style={{height: hp('45%'), marginTop: 10, paddingBottom: 30}}>
            <GlobalText
              style={[
                globalTextStyles.titleText,
                globalTextStyles.centeredText,
              ]}>
              r e c o m m e n d a t i o n s
            </GlobalText>
            <SafeAreaView style={{flexDirection: 'row'}}>
              <FlatList
                data={otherGalleries}
                renderItem={({item}) => (
                  <GalleryPreview
                    galleryId={item.galleryId}
                    text={item.text}
                    preview={item.preview}
                    body={item.body}
                    numberOfArtworks={
                      globalGallery[item.galleryId]?.numberOfArtworks
                    }
                    numberOfRatedWorks={
                      globalGallery[item.galleryId]?.numberOfRatedWorks
                    }
                    showGallery={showGallery}
                  />
                )}
                keyExtractor={item => item.galleryId}
              />
            </SafeAreaView>
          </View>
        </>
      )}
    </View>
  );
}
