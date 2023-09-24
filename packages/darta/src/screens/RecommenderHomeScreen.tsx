import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {PRIMARY_BLUE, PRIMARY_MILK} from '@darta/styles';
import {imagePrefetch} from '../utils/functions';
import {GalleryPreview} from '../components/Previews/GalleryPreview';
import {TextElement} from '../components/Elements/_index';
import {days, DEFAULT_Gallery_Image, today} from '../utils/constants';
import {
  GalleryNavigatorEnum,
  GalleryRootStackParamList,
} from '../typing/routes';
import {ETypes, StoreContext} from '../state/Store';
import {globalTextStyles} from '../styles/styles';

type ProfileScreenNavigationProp = StackNavigationProp<
  GalleryRootStackParamList,
  GalleryNavigatorEnum.galleryHome
>;

export function RecommenderHomeScreen({
  navigation,
}: {
  navigation: ProfileScreenNavigationProp;
}) {
  const {state, dispatch} = useContext(StoreContext);
  const galleryInfo = state.artworkData;
  const personalGalleryId = Object.keys(galleryInfo).filter(
    (id: string) => galleryInfo[id].type === 'privateGallery',
  )[0];
  const personalGallery = galleryInfo[personalGalleryId];

  const otherGalleryIds = Object.keys(galleryInfo).filter(
    (id: string) => galleryInfo[id].type !== 'privateGallery',
  );
  // const otherGalleries = otherGalleryIds.map(id => (id = {...galleryInfo[id]}));

  type LoadingStatus = {
    isLoading: boolean;
  };

  type LoadingStatusMap = {
    [key: string]: LoadingStatus;
  };

  const [isLoadingDict, setIsLoadingDict] = useState<LoadingStatusMap>(
    otherGalleryIds
      .concat(personalGalleryId)
      .reduce((acc, el) => ({...acc, [el]: {isLoading: false}}), {}),
  );

  useEffect(() => {
    if (!state.galleryOnDisplayId) {
      dispatch({
        type: ETypes.preLoadState,
      });
    }
    imagePrefetch([DEFAULT_Gallery_Image]);
  }, [dispatch, galleryInfo, state.galleryOnDisplayId]);

  const updateLoadingStatus = (galleryId: string, isLoading: boolean) => {
    setIsLoadingDict((prevState: LoadingStatusMap) => ({
      ...prevState,
      [galleryId]: {
        ...prevState[galleryId],
        isLoading,
      },
    }));
  };

  const showGallery = async (galleryId: string): Promise<void> => {
    const gallery = state.dartaData[galleryId];
    dispatch({
      type: ETypes.setGalleryId,
      galleryId,
    });
    dispatch({
      type: ETypes.setTitle,
      galleryTitle: galleryInfo[galleryId].text,
    });
    if (!gallery?.fullDGallery) {
      updateLoadingStatus(galleryId, true);
      try {
        // fullImages = await getImages(gallery.artworkIds);
        dispatch({
          type: ETypes.loadArt,
          loadedDGallery: [],
          galleryId,
        });
        dispatch({
          type: ETypes.indexArt,
          currentIndex: 0,
          galleryId,
        });
        updateLoadingStatus(galleryId, false);
        return navigation.navigate(GalleryNavigatorEnum.gallery);
      } catch (e) {
        Alert.alert('Unable to load gallery 🧑‍💻🤦');
      }
    }
    updateLoadingStatus(galleryId, false);
    return navigation.navigate(GalleryNavigatorEnum.gallery);
  };

  const SSDartaHome = StyleSheet.create({
    container: {
      backgroundColor: PRIMARY_MILK,
      height: hp('85%'),
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
  });

  return (
    <View style={SSDartaHome.container}>
      <View>
        <TouchableOpacity
          onPress={async () => {
            updateLoadingStatus(personalGalleryId, true);
            await showGallery(personalGalleryId);
          }}
          style={{marginLeft: hp('1%'), marginRight: hp('1%')}}>
          <GalleryPreview
            body=""
            preview={personalGallery.preview}
            isLoading={isLoadingDict[personalGalleryId].isLoading}
            text={personalGallery.text}
            personalGalleryId={personalGalleryId}
            showGallery={showGallery}
          />
        </TouchableOpacity>
        <View>
          <TextElement
            style={[
              globalTextStyles.boldTitleText,
              {alignSelf: 'center', fontSize: 20, margin: hp('0.5%')},
            ]}>
            {days[today]}
            {`'`}s opening
          </TextElement>
        </View>
        <View>
          <TextElement
            style={[
              globalTextStyles.centeredText,
              {alignSelf: 'center', margin: hp('0.5%')},
            ]}>
            curated by d | a r t | ai
          </TextElement>
        </View>
        <View>
          <TextElement
            style={[
              globalTextStyles.centeredText,
              {alignSelf: 'center', fontSize: 15, padding: hp('5%')},
            ]}>
            {personalGallery.tombstone}
          </TextElement>
        </View>
        <View>
          <TextElement
            style={[
              globalTextStyles.centeredText,
              {
                fontWeight: 'bold',
                alignSelf: 'center',
                color: PRIMARY_BLUE,
                paddingTop: hp('5%'),
              },
            ]}>
            like, dislike, and save:
          </TextElement>
          <TextElement
            style={[
              globalTextStyles.centeredText,
              {fontWeight: 'bold', alignSelf: 'center', color: PRIMARY_BLUE},
            ]}>
            teach your digital art advisor your tastes
          </TextElement>
        </View>
      </View>
    </View>
  );
}
