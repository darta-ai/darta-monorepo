import React from 'react';
import {View, StyleSheet, Linking, Platform, ScrollView, RefreshControl, Animated, Pressable} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { globalTextStyles } from '../../styles/styles';
import {TextElement} from '../../components/Elements/_index';
import * as Colors from '@darta-styles';
import  ExhibitionPreviewMini from '../../components/Previews/ExhibitionPreviewMini';
import FastImage from 'react-native-fast-image'
import { createGalleryRelationshipAPI, deleteGalleryRelationshipAPI } from '../../utils/apiCalls';
import {
  ExhibitionRootEnum,
  PreviousExhibitionRootEnum
} from '../../typing/routes';
import { ActivityIndicator } from 'react-native-paper';

import { Text } from 'react-native-paper'
import { ArtworkPreview, Exhibition, GalleryPreview, IBusinessLocationData, IGalleryProfileData, Images, PublicFields } from '@darta-types';
import { formatUSPhoneNumber } from '../../utils/functions';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import { listGalleryExhibitionPreviewForUser, readGallery } from '../../api/galleryRoutes';
import {readExhibition} from '../../api/exhibitionRoutes';
import { DartaIconButtonWithText } from '../../components/Darta/DartaIconButtonWithText';
import * as SVGs from '../../assets/SVGs';
import { UIStoreContext, UiETypes, GalleryStoreContext,StoreContext, GalleryETypes, ExhibitionStoreContext, ExhibitionETypes } from '../../state';
import { UserETypes, UserStoreContext } from '../../state/UserStore';
import { DartaImageComponent } from '../../components/Images/DartaImageComponent';
import GalleryLocation from '../../components/Gallery/GalleryLocation';


const galleryDetailsStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    backgroundColor: Colors.PRIMARY_50,
    width: wp('100%'),
    height: '100%',
    justifyContent: 'flex-start', 
    alignItems: 'center',
    paddingTop: 24,
    gap: 48,
    paddingBottom: 24,
  },
  bioContainer: {
    width: wp('100%'),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    gap: 48,
    paddingLeft: 24,
    paddingRight: 24,
  },
  galleryTitleContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
},
headerContainer: {
  width: wp('100%'),
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},
followContainer: {
  width: 200,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
},
  galleryLogoContainer: {
    display:'flex', 
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    height: 100,
  },
  heroImage: {
    height: 100,
    resizeMode: 'contain',
  },
  contactContainer: {
    width: wp('100%'),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 24,
    paddingLeft: 24,
    paddingRight: 24,
  },
  galleryContactButtonsContainer: {
    width: wp('100%'),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 16,
  },
  spinnerContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: hp('10%'),
    width: '100%',
    height: '100%',
    backgroundColor: Colors.PRIMARY_50,
  },
  galleryBioContainer: {
      height: "auto",
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
  },
  locationContainer: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      gap: 16,
  },
  hoursContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'flex-start',
    gap: 13
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
  },
  dayOpen: {
    fontSize: 16,
    color: '#333',
    fontFamily: 'DMSans_400Regular',
  },
  hoursOpen: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
    color: Colors.PRIMARY_900,
  },
  dayClosed: {
    fontSize: 16,
    color: Colors.PRIMARY_200,
    fontFamily: 'DMSans_400Regular',
  },
  hoursClosed: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular_Italic',
    color: Colors.PRIMARY_200,
    fontStyle: 'italic'
  },
  addressContainer: {
    width: '85%',
    height: hp('15%'),
    margin: 10, 
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  hour: {
    flex: 1,
    margin: 2,
    width: wp('20%'),
    color: Colors.PRIMARY_900
  },
  exhibitionPreviewContainer: {
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 24,
  },
  pressableStyle: {
    width: 130,
    height: 38,
    backgroundColor: Colors.PRIMARY_950,
    borderRadius: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  }, 
  mapContainer: {
    height: hp('30%'), 
    width: wp('90%')
  },
  map: {
    alignSelf: 'stretch', 
    height: '100%' 
  }
})

type ExhibitionGalleryRouteProp = RouteProp<ExhibitionStackParamList, ExhibitionRootEnum.exhibitionGallery>;


export function ExhibitionGalleryScreen({
  route,
  navigation
}: {
  route?: ExhibitionGalleryRouteProp;
  navigation?: any;
}) {
  const {state} = React.useContext(StoreContext);
  const {uiDispatch} = React.useContext(UIStoreContext);
  const {userState,userDispatch} = React.useContext(UserStoreContext);
  const {exhibitionState, exhibitionDispatch} = React.useContext(ExhibitionStoreContext);
  const {galleryState, galleryDispatch} = React.useContext(GalleryStoreContext)
  const [galleryId, setGalleryId] = React.useState<string>("")
  const [isGalleryLoaded, setIsGalleryLoaded] = React.useState<boolean>(false);
  const [gallery, setGallery] = React.useState<IGalleryProfileData>({} as IGalleryProfileData)

  const [mapRegion, setMapRegion] = React.useState<any>({
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    latitude: 0, 
    longitude: 0,
  })

  const [galleryName, setGalleryName] = React.useState<string>("")

  const [galleryLocations, setGalleryLocations] = React.useState<IBusinessLocationData[]>([])
  
  const [previousExhibitions, setPreviousExhibitions] = React.useState<Exhibition[]>([])
  const [upcomingExhibitions, setUpComingExhibitions] = React.useState<Exhibition[]>([])


  const setGalleryData = React.useCallback(({inputGallery}: {inputGallery: IGalleryProfileData}) => {
    if (inputGallery?.galleryLocation0?.coordinates) {
      setMapRegion({
          ...mapRegion, 
          latitude: inputGallery.galleryLocation0?.coordinates.latitude.value! as unknown as number,
          longitude: inputGallery.galleryLocation0?.coordinates.longitude.value! as unknown as number,
      })
      // const mapMarkers: any[] = [];
      // const galleryAddresses: string[] = []

      // Object.keys(inputGallery).forEach((key: string) => {
      //   if (inputGallery[key].coordinates){
      //     mapMarkers.push({
      //       latitude: inputGallery[key]?.coordinates?.latitude.value! as unknown as number,
      //       longitude: inputGallery[key]?.coordinates?.longitude.value! as unknown as number,
      //       title: inputGallery[key]?.locationString?.value! as string,
      //       description: inputGallery[key]?.locationString?.value! as string,
      //       })
      //     }
      //   if (inputGallery[key].locationString){
      //     galleryAddresses.push(inputGallery[key]?.locationString?.value! as string)
      //   }
      //   })
        // setMapMarkers(mapMarkers)
        // setGalleryAddresses(galleryAddresses)
    }
    if (inputGallery?.galleryName && inputGallery.galleryName.value){
      setGalleryName(inputGallery.galleryName.value)
    }



  const locations: IBusinessLocationData[] = [
    inputGallery.galleryLocation0,
    inputGallery.galleryLocation1,
    inputGallery.galleryLocation2,
    inputGallery.galleryLocation3,
    inputGallery.galleryLocation4,
  ].filter((location): location is IBusinessLocationData => location !== undefined) as IBusinessLocationData[];
  
  setGalleryLocations(locations);

  if (inputGallery?.galleryExhibitions){
    const strippedExhibitionId = route?.params?.exhibitionId?.replace("Exhibitions/", "")
    const exhibitions = Object.values(inputGallery.galleryExhibitions).filter((exhibition: Exhibition) => exhibition.exhibitionId !== strippedExhibitionId)
    exhibitions.sort((a: Exhibition, b: Exhibition) => { 
      return new Date(b?.exhibitionDates?.exhibitionStartDate?.value as any).getTime() - new Date(a?.exhibitionDates?.exhibitionStartDate?.value as any).getTime()
    })

    const upcoming = exhibitions.filter((exhibition: Exhibition) => {
      return new Date(exhibition?.exhibitionDates?.exhibitionStartDate?.value as any) >= new Date()
    })

    const previous = exhibitions.filter((exhibition: Exhibition) => {
      return new Date(exhibition?.exhibitionDates?.exhibitionStartDate?.value as any) < new Date()
    })

    setUpComingExhibitions(upcoming)
    setPreviousExhibitions(previous)
  }
    setIsGalleryLoaded(true)
  }, [galleryState.galleryData])



  React.useEffect(() => {
    const setState = async () => {
      if (route?.params?.galleryId && galleryState.galleryData && galleryState.galleryData[route.params.galleryId]){
        const gal = galleryState.galleryData[route.params.galleryId]
        setGalleryId(route.params.galleryId);
        setGalleryData({inputGallery: gal})
        setGallery(gal)
        uiDispatch({
          type: UiETypes.setGalleryHeader,
          galleryHeader: gal.galleryName.value ?? "",
        })
      } else if (state.qrCodeGalleryId && galleryState.galleryData){
        setGalleryId(state.qrCodeGalleryId);
        setGalleryData({inputGallery: galleryState.galleryData[state.qrCodeGalleryId]})
        setGallery(galleryState.galleryData[state.qrCodeGalleryId])
      } else if (route?.params?.galleryId && !route.params?.exhibitionId) { 
        let galleryData: IGalleryProfileData = {} as IGalleryProfileData
        try{
          const gal = await readGallery({galleryId: route?.params?.galleryId})
          const supplementalExhibitions = await listGalleryExhibitionPreviewForUser({galleryId: gal._id!})
          galleryData = {...gal, galleryExhibitions: supplementalExhibitions}
        } catch(error){
          
          //TO-DO: error
        }
        if (galleryData?._id){
          setGalleryId(galleryData._id);
          setGalleryData({inputGallery: galleryData})
          setGallery(galleryData)
          galleryDispatch({
            type: GalleryETypes.saveGallery,
            galleryData: galleryData,
          })
          uiDispatch({
            type: UiETypes.setGalleryHeader,
            galleryHeader: galleryData.galleryName.value ?? "",
          })
        }
      }else {
       
      }
    }

    setState()
  }, [galleryState.galleryData, galleryId, state.qrCodeGalleryId])

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async ({galleryId} : {galleryId: string}) => {
    setRefreshing(true);
    try{
        const newGallery = await readGallery({galleryId});
        setGalleryData({inputGallery: newGallery})
        galleryDispatch({
            type: GalleryETypes.saveGallery,
            galleryData: newGallery,
        })
        setGallery(newGallery)
    } catch {
        setRefreshing(false);
    }
    setTimeout(() => {
      setRefreshing(false);
    }, 500)
  }, []);

  const followGallery = async () => {
    try{
      await createGalleryRelationshipAPI({galleryId})
      userDispatch({
        type: UserETypes.setUserFollowGalleries,
        galleryId,
      })
      
      if (route?.params?.exhibitionId && exhibitionState.exhibitionData){
        let exhibitionPreview: any = {}
        const fullExhibition = exhibitionState.exhibitionData[route.params?.exhibitionId]
        let artworkPreviews: {[key: string]: ArtworkPreview} = {}
        if (fullExhibition?.artworks){
          artworkPreviews = Object.values(fullExhibition?.artworks).slice(0, 4).reduce((acc: any, el: any) => ({...acc, [el._id]: el}), {})
        }
        exhibitionPreview = {
          [route.params?.exhibitionId]: {
            artworkPreviews: artworkPreviews,
            exhibitionId: fullExhibition?._id as string,
            galleryId: galleryId,
            openingDate: fullExhibition?.exhibitionDates?.exhibitionStartDate,
            closingDate: fullExhibition?.exhibitionDates?.exhibitionEndDate,
            exhibitionDuration: fullExhibition?.exhibitionDates?.exhibitionDuration!,
            galleryLogo: gallery?.galleryLogo as Images,
            galleryName: gallery?.galleryName,
            exhibitionArtist: fullExhibition?.exhibitionArtist!,
            exhibitionTitle: fullExhibition?.exhibitionTitle,
            exhibitionLocation: {
              exhibitionLocationString: fullExhibition?.exhibitionLocation?.locationString,
              coordinates: fullExhibition?.exhibitionLocation?.coordinates 
            },
            exhibitionPrimaryImage: fullExhibition.exhibitionPrimaryImage! as Images,
            exhibitionDates: fullExhibition.exhibitionDates,
            receptionDates: fullExhibition.receptionDates,
            userViewed: true
          }
        }
        exhibitionDispatch({
          type: ExhibitionETypes.saveUserFollowsExhibitionPreviews,
          exhibitionPreviews: exhibitionPreview,
        })

        const galleryPreviews: {[key: string] : GalleryPreview} = {
          [galleryId]: {
            _id: galleryId,
            galleryName: gallery?.galleryName as PublicFields,
            galleryLogo: gallery?.galleryLogo as Images,
          }
        }
        galleryDispatch({
          type: GalleryETypes.setGalleryPreviewMulti,
          galleryPreviews
        });
        userDispatch({
          type: UserETypes.setUserFollowGalleriesMulti,
          galleryFollowIds: {[galleryId]: true}
        });
      }

      setFollowsGallery(true)
    } catch(e) {
      console.log('error', e)
      throw new Error("Something went wrong, please try again")
    }
  }

  const unFollowGallery = async () => { 
    try{
      await deleteGalleryRelationshipAPI({galleryId})
      userDispatch({
        type: UserETypes.removeUserFollowGalleries,
        galleryId,
      })
      exhibitionDispatch({
        type: ExhibitionETypes.removeUserFollowsExhibitionPreviews,
        removeUserFollowsExhibitionPreviewsByGalleryId: galleryId
      })
      setFollowsGallery(false)
    } catch {
      throw new Error("Something went wrong, please try again")
    }
  }

  React.useEffect(()=>{

  }, [galleryState.galleryData, galleryId])

  const [followsGallery, setFollowsGallery] = React.useState<boolean>(false)
  const [isSetOneVisible, setIsSetOneVisible] = React.useState(true);

  const opacitySetOne = React.useRef(new Animated.Value(1)).current; 
  const opacitySetTwo = React.useRef(new Animated.Value(0)).current;
  const translateX = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    opacitySetOne.addListener(() => {})
    opacitySetTwo.addListener(() => {})
    translateX.addListener(() => {})
  }, [])

  const toggleButtons = () => {
    Animated.parallel([
      Animated.timing(opacitySetOne, {
        toValue: followsGallery ? 0 : 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(opacitySetTwo, {
        toValue: followsGallery ? 1 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: followsGallery ? 100 : 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsSetOneVisible(!isSetOneVisible);
    });
  };

  React.useEffect(() =>{
    if (userState.userGalleryFollowed && userState.userGalleryFollowed[galleryId]){
      setFollowsGallery(true)
    } else {
      setFollowsGallery(false)
    }
  }, [galleryId, userState.userGalleryFollowed])

  React.useEffect(() => {
    toggleButtons()
  }, [followsGallery])


  const handleExhibitionPress = async ({exhibitionId} : {exhibitionId: string}) => {
    if (!exhibitionId) return
    let exhibitionTitle: string = ""

    if (exhibitionState.exhibitionData && exhibitionState.exhibitionData[exhibitionId]){
      const results = await readExhibition({exhibitionId});
      exhibitionTitle = results.exhibitionTitle?.value as string
      await Promise.resolve(() => {
        uiDispatch({
          type: UiETypes.setPreviousExhibitionHeader,
          previousExhibitionHeader: exhibitionTitle,
        })
        uiDispatch({
          type: UiETypes.setUserExhibitionHeader,
          userExhibitionHeader: exhibitionTitle,
        })
        exhibitionDispatch({
          type: ExhibitionETypes.saveExhibition,
          exhibitionData: results,
        })
      })
    }
      if (route?.params.navigationRoute) {
        navigation.navigate(route?.params.navigationRoute, {exhibitionId, galleryId})
      } else{
        navigation.navigate(PreviousExhibitionRootEnum.navigatorScreen, {exhibitionId, galleryId})
      }

  }

  const sendToInstagram = () => {
    if (!gallery?.galleryInstagram?.value) return
    const instaHandle = gallery.galleryInstagram.value.replace('@', '')
    Linking.canOpenURL('instagram://app').then((supported) => {
    if (supported) {
        Linking.openURL(`instagram://user?username=${instaHandle}`);
    } else {
        Linking.openURL(`https://www.instagram.com/${instaHandle}/`);
    }
  });
  }

  const dialNumber = () => {
    if (!gallery?.galleryPhone?.value) return
    const phoneNumber = gallery.galleryPhone.value
    const url = `tel:${phoneNumber}`;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log(`Can't handle URL: ${url}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const sendEmail = () => {
    if (!gallery?.primaryContact?.value) return;
  
    const emailAddress = gallery.primaryContact.value;
    const url = `mailto:${emailAddress}`;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log(`Can't handle URL: ${url}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };

  const visitWebsite = (url: string) => {
    if (!url) return;
  
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log(`Can't handle URL: ${url}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };  

  const openInMaps = (address: string) => {
    if (!address) return;

    const formattedAddress = encodeURIComponent(address);
    const scheme = Platform.OS === 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
    const url = scheme + formattedAddress;
  
  
    Linking.canOpenURL(url)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(url);
      } else {
        const browserUrl = 'https://www.google.com/maps/search/?api=1&query=' + formattedAddress;
        return Linking.openURL(browserUrl);
      }
    })
    .catch((err) => console.error('Error opening maps app:', err));
  };  

  return (
    <>
    {!isGalleryLoaded ? ( 
    <View style={galleryDetailsStyles.spinnerContainer}>
        <ActivityIndicator animating={true} size={35} color={Colors.PRIMARY_800} />
    </View>
    )
    : (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={() => onRefresh({galleryId: gallery?._id!})} />}>      
      <View style={galleryDetailsStyles.container}>
        <View style={galleryDetailsStyles.bioContainer}>
          <View style={galleryDetailsStyles.galleryTitleContainer}>
              <TextElement style={globalTextStyles.sectionHeaderTitle}>
                  {galleryName}
              </TextElement>
          </View>
          {gallery?.galleryLogo?.value && (
            <View style={galleryDetailsStyles.galleryLogoContainer}>
              <DartaImageComponent 
              uri={gallery?.galleryLogo}
              priority={FastImage.priority.normal}
              style={galleryDetailsStyles.heroImage}
              resizeMode={FastImage.resizeMode.contain}
              size={"smallImage"}
              />
            </View>
            )}
            <View style={galleryDetailsStyles.followContainer}>
            {!followsGallery && (
            <Animated.View style={{opacity: opacitySetOne, transform: [{ translateX: translateX }] }}>
                <Pressable style={{...galleryDetailsStyles.pressableStyle, backgroundColor: Colors.PRIMARY_50, borderColor: Colors.PRIMARY_500, borderWidth: 1}} onPress={() => followGallery()}>
                  <View style={{width: 30}}>
                    <SVGs.HeartFill />
                  </View>
                  <View style={{width: 80}}>
                    <TextElement style={{...globalTextStyles.boldTitleText, color: Colors.PRIMARY_950}}>Follow</TextElement>
                  </View>
                </Pressable>
            </Animated.View>
              )}
            {followsGallery && (
            <Animated.View style={{opacity: opacitySetTwo, transform: [{ translateX: Animated.subtract(100, translateX) }]}}>
              <Pressable style={galleryDetailsStyles.pressableStyle} onPress={() => unFollowGallery()}>
                <View style={{width: 30}}>
                  <SVGs.HeartEmpty />
                </View>
                <View style={{width: 80}}>
                  <TextElement style={{...globalTextStyles.boldTitleText, color: Colors.PRIMARY_50}}>Following</TextElement>
                </View>
              </Pressable>
            </Animated.View>
              )} 
          </View>
          <View style={galleryDetailsStyles.galleryBioContainer}>
            <Text style={globalTextStyles.paragraphText}>
              {gallery?.galleryBio?.value}
            </Text>
          </View>
        </View>
      <View style={galleryDetailsStyles.contactContainer}>
        <View>
          <TextElement style={globalTextStyles.sectionHeaderTitle}>
                Contact
            </TextElement>
          </View>
        <View style={galleryDetailsStyles.galleryContactButtonsContainer}>
            {gallery?.galleryPhone?.value && (
              <DartaIconButtonWithText
              text={formatUSPhoneNumber(gallery?.galleryPhone?.value) as string}
              iconComponent={SVGs.PhoneIcon}
              onPress={() => dialNumber()}
              />
            )}
            {gallery?.galleryInstagram?.value &&(
            <DartaIconButtonWithText 
              text={gallery?.galleryInstagram?.value ?? ""}
              iconComponent={SVGs.InstagramIcon}
              onPress={() => sendToInstagram()}
              />
            )}
            {gallery.galleryWebsite?.value &&(
            <DartaIconButtonWithText 
              text={gallery.galleryWebsite.value.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')}
              iconComponent={SVGs.WebIcon}
              onPress={() => visitWebsite(gallery.galleryWebsite?.value!)}
              />
            )}
            {gallery?.primaryContact?.value &&(
            <DartaIconButtonWithText 
              text={gallery?.primaryContact?.value}
              iconComponent={SVGs.EmailIcon}
              onPress={() => sendEmail()}
              />
            )}
          </View>
        </View>
        <View style={galleryDetailsStyles.contactContainer}>
          <TextElement style={globalTextStyles.sectionHeaderTitle}>
                Location{galleryLocations.length > 1 && "s"}
            </TextElement>
          {galleryLocations.map((location, index) => {
            return(
              <GalleryLocation
              galleryLocationData={location}
              key={`${index}-${location.locationString?.value}`}
              galleryName={galleryName}
              openInMaps={openInMaps}
              />
            )
          }
          )}
        </View>
        {upcomingExhibitions.length > 0 && (
         <View style={galleryDetailsStyles.contactContainer}>
          <View>
            <TextElement style={globalTextStyles.sectionHeaderTitle}>Upcoming Exhibitions</TextElement>
          </View>
          <View>
            {upcomingExhibitions.map((previousExhibition : Exhibition, index : number) => (
                <View key={`${index}-${previousExhibition.exhibitionId}`} style={galleryDetailsStyles.exhibitionPreviewContainer}>
                  <ExhibitionPreviewMini 
                    exhibitionHeroImage={previousExhibition.exhibitionPrimaryImage}
                    exhibitionId={previousExhibition._id!}
                    exhibitionTitle={previousExhibition.exhibitionTitle?.value as string}
                    exhibitionGallery={gallery.galleryName?.value as string}
                    exhibitionArtist={previousExhibition.exhibitionArtist?.value === "" ? "Group Show" : previousExhibition.exhibitionArtist?.value as string}
                    exhibitionDates={previousExhibition?.exhibitionDates}
                    galleryLogoLink={gallery.galleryLogo?.value as string}
                    exhibitionLocation={previousExhibition.exhibitionLocation?.locationString?.value as string}
                    onPress={handleExhibitionPress}
                  />
                </View>
              )
            )}
            </View>
          </View>
            )}
        {route?.params?.showPastExhibitions && previousExhibitions.length > 0 && (
         <View style={galleryDetailsStyles.contactContainer}>
          <View>
            <TextElement style={globalTextStyles.sectionHeaderTitle}>Exhibitions</TextElement>
            </View>
          <View>
            {previousExhibitions.map((previousExhibition : Exhibition, index : number) => (
                  <View key={`${index}-${previousExhibition.exhibitionId}`} style={galleryDetailsStyles.exhibitionPreviewContainer}>
                    <ExhibitionPreviewMini 
                      exhibitionHeroImage={previousExhibition.exhibitionPrimaryImage}
                      exhibitionId={previousExhibition._id!}
                      exhibitionTitle={previousExhibition.exhibitionTitle?.value as string}
                      exhibitionGallery={gallery.galleryName?.value as string}
                      exhibitionArtist={previousExhibition.exhibitionArtist?.value === "" ? "Group Show" : previousExhibition.exhibitionArtist?.value as string}
                      exhibitionDates={previousExhibition?.exhibitionDates}
                      galleryLogoLink={gallery.galleryLogo?.value as string}
                      exhibitionLocation={previousExhibition.exhibitionLocation?.locationString?.value as string}
                      onPress={handleExhibitionPress}
                    />
                  </View>
                )
              )}
            </View>
          </View>
            )}
      </View>
    </ScrollView>
    )}
    </>
  );
}
