import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext, useEffect, useState} from 'react';
import {Alert, FlatList, SafeAreaView, View, StatusBar} from 'react-native';
import {Divider} from 'react-native-elements';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import ProgressBar from 'react-native-progress/Bar';

import {getImages, imagePrefetch} from '../../functions/galleryFunctions';
import {DataT} from '../../types';
import {GlobalText} from '../GlobalElements/index';
import {globalTextStyles} from '../styles';
import {GalleryPreview} from './GalleryComponents';
import {
  GalleryRootStackParamList,
  GalleryNavigatorEnum,
} from './galleryRoutes.d';
import {ETypes, StoreContext} from './galleryStore';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  PRIMARY_BLUE,
  PRIMARY_MILK,
  PRIMARY_PROGRESS,
} from '../../assets/styles';
import { DEFAULT_Gallery_Image } from '../globalVariables';

type ProfileScreenNavigationProp = StackNavigationProp<
  GalleryRootStackParamList,
  GalleryNavigatorEnum.galleryHome
>;

export function GalleryHome({
  navigation,
  route,
}: {
  navigation: ProfileScreenNavigationProp;
  route: any;
}) {
  const insets = useSafeAreaInsets();

  const {galleryInfo} = route.params;
  const personalGalleryId = Object.keys(galleryInfo).filter(
    (id: string) => galleryInfo[id].type === 'privateGallery',
  )[0];
  const personalGallery = galleryInfo[personalGalleryId];

  const otherGalleryIds = Object.keys(galleryInfo).filter(
    (id: string) => galleryInfo[id].type !== 'privateGallery',
  );
  const otherGalleries = otherGalleryIds.map(id => (id = {...galleryInfo[id]}));

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
  }, []);

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

  return (
    <>
      <View
        style={{
          backgroundColor: PRIMARY_MILK,
          paddingTop: hp('2%'),
          height: hp('100%'),
          flexDirection: 'column',
          justifyContent: 'space-around',
        }}>
        <StatusBar barStyle="light-content" backgroundColor="#ecf0f1" />
        <View
          style={{
            height: hp('70%'),
          }}>
          {/* <GlobalText
            style={[globalTextStyles.titleText, globalTextStyles.centeredText]}>
            d | a r t | a
          </GlobalText> */}
          <TouchableOpacity
            onPress={async () => {
              updateLoadingStatus(personalGalleryId, true);
              await showGallery(personalGalleryId);
            }}
            style={{marginLeft: hp('1%'), marginRight: hp('1%')}}>
            <GalleryPreview
              body={personalGallery.body}
              preview={personalGallery.preview}
              numberOfArtworks={
                state?.globalGallery[personalGalleryId]?.numberOfArtworks ?? 1
              }
              numberOfRatedWorks={
                state?.globalGallery[personalGalleryId]?.numberOfRatedWorks ?? 0
              }
              isLoading={isLoadingDict[personalGalleryId].isLoading}
              text={personalGallery.text}
            />
          </TouchableOpacity>
          <View style={{alignSelf: 'center'}}>
            <ProgressBar
              progress={
                (state?.globalGallery[personalGalleryId]?.numberOfArtworks ??
                  0) /
                (state?.globalGallery[personalGalleryId]?.numberOfRatedWorks ??
                  1)
              }
              borderRadius={20}
              backgroundColor={PRIMARY_PROGRESS}
              color={PRIMARY_MILK}
              width={wp('85%')}
              useNativeDriver
              animated
            />
          </View>
          <View>
            <GlobalText>Heyyy</GlobalText>
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
    </>
  );
}
