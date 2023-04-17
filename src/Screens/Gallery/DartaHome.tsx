import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';

import {PRIMARY_BLUE, PRIMARY_MILK} from '../../../assets/styles';
import {getImages, imagePrefetch} from '../../../functions/galleryFunctions';
import {DataT} from '../../../types';
import {GlobalText} from '../../GlobalElements/index';
import {days, DEFAULT_Gallery_Image, today} from '../../globalVariables';
import {ETypes, StoreContext} from '../../State/Store';
import {globalTextStyles} from '../../styles';
import {GalleryPreview} from './GalleryComponents';
import {
  GalleryNavigatorEnum,
  GalleryRootStackParamList,
} from './galleryRoutes.d';

type ProfileScreenNavigationProp = StackNavigationProp<
  GalleryRootStackParamList,
  GalleryNavigatorEnum.galleryHome
>;

export function DartaHome({
  navigation,
  route,
}: {
  navigation: ProfileScreenNavigationProp;
  route: any;
}) {
  const {galleryInfo} = route.params;
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

  const {state, dispatch} = useContext(StoreContext);
  const [isLoadingDict, setIsLoadingDict] = useState<LoadingStatusMap>(
    otherGalleryIds
      .concat(personalGalleryId)
      .reduce((acc, el) => ({...acc, [el]: {isLoading: false}}), {}),
  );

  useEffect(() => {
    if (!state.galleryOnDisplayId) {
      dispatch({
        type: ETypes.preLoadState,
        galleryLandingPageData: galleryInfo,
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
    const gallery = state.globalGallery[galleryId];
    let fullImages: DataT[];
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
        fullImages = await getImages(gallery.artworkIds);
        dispatch({
          type: ETypes.loadArt,
          loadedDGallery: fullImages,
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
          <GlobalText
            style={[
              globalTextStyles.boldTitleText,
              {alignSelf: 'center', fontSize: 20, margin: hp('0.5%')},
            ]}>
            {days[today]}
            {`'`}s opening
          </GlobalText>
        </View>
        <View>
          <GlobalText
            style={[
              globalTextStyles.centeredText,
              {alignSelf: 'center', margin: hp('0.5%')},
            ]}>
            curated by d | a r t | ai
          </GlobalText>
        </View>
        <View>
          <GlobalText
            style={[
              globalTextStyles.centeredText,
              {alignSelf: 'center', fontSize: 15, padding: hp('5%')},
            ]}>
            {personalGallery.tombstone}
          </GlobalText>
        </View>
        <View>
          <GlobalText
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
          </GlobalText>
          <GlobalText
            style={[
              globalTextStyles.centeredText,
              {fontWeight: 'bold', alignSelf: 'center', color: PRIMARY_BLUE},
            ]}>
            teach your digital art advisor your tastes
          </GlobalText>
        </View>
      </View>

      {/* <Divider
          style={{
            backgroundColor: PRIMARY_BLUE,
            paddingVertical: 5,
            margin: 10,
          }}
        /> */}
      {/* <View style={{height: hp('45%'), marginTop: 10, paddingBottom: 30}}>
          <GlobalText
            style={[globalTextStyles.titleText, globalTextStyles.centeredText]}>
            r e c o m m e n d a t i o n s
          </GlobalText>
          <SafeAreaView style={{flexDirection: 'row'}}>
            <FlatList
              data={otherGalleries}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={async () => {
                    await showGallery(item.galleryId);
                  }}
                  style={{margin: hp('1%')}}>
                  <GalleryPreview
                    body={item.body}
                    preview={item.preview}
                    isLoading={isLoadingDict[item.galleryId].isLoading}
                    numberOfArtworks={
                      state?.globalGallery[item.galleryId]?.numberOfArtworks ??
                      1
                    }
                    numberOfRatedWorks={
                      state?.globalGallery[item.galleryId]
                        ?.numberOfRatedWorks ?? 0
                    }
                    text={item.text}
                  />
                </TouchableOpacity>
              )}
              keyExtractor={item => item.galleryId}
            />
          </SafeAreaView>
        </View> */}
    </View>
  );
}
