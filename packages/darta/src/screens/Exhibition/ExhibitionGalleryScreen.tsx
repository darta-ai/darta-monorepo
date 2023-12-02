import React, {useContext} from 'react';
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
import {ETypes, StoreContext} from '../../state/Store';
import { BusinessHours, Exhibition, IGalleryProfileData } from '@darta-types';
import { formatUSPhoneNumber, modifyHoursOfOperation, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import { listGalleryExhibitionPreviewForUser, readGallery } from '../../api/galleryRoutes';
import {readExhibition} from '../../api/exhibitionRoutes';
import { mapStylesJson } from '../../utils/mapStylesJson';
import { DartaIconButtonWithText } from '../../components/Darta/DartaIconButtonWithText';
import * as SVGs from '../../assets/SVGs';

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
    gap: 24,
    paddingLeft: 24,
    paddingRight: 24,
  },
  galleryTitleContainer: {
    width: wp('100%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
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
    width: 123,
    height: 38,
    backgroundColor: Colors.PRIMARY_100,
    borderRadius: 19,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
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
  const {state, dispatch} = useContext(StoreContext);
  const [galleryId, setGalleryId] = React.useState<string>("")
  const [errorText, setErrorText] = React.useState<string>("");
  const [isGalleryLoaded, setIsGalleryLoaded] = React.useState<boolean>(false);
  const [gallery, setGallery] = React.useState<IGalleryProfileData>({} as IGalleryProfileData)

  const [mapRegion, setMapRegion] = React.useState<any>({
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
    latitude: 0, 
    longitude: 0,
  })
  const [mapMarkers, setMapMarkers] = React.useState<any[]>([]); 
  const [galleryAddresses, setGalleryAddresses] = React.useState<string[]>([])

  const [galleryName, setGalleryName] = React.useState<string>("")

  const [hoursOfOperation, setHoursOfOperation] = React.useState<BusinessHours>({} as BusinessHours);
  const [hoursOfOperationArray, setHoursOfOperationArray] = React.useState<{day: string, open: string, close: string}[]>([]);
  
  const [previousExhibitions, setPreviousExhibitions] = React.useState<Exhibition[]>([])
  const [upcomingExhibitions, setUpComingExhibitions] = React.useState<Exhibition[]>([])


  const setGalleryData = ({inputGallery}: {inputGallery: IGalleryProfileData}) => {
    if (inputGallery?.galleryLocation0?.coordinates) {
      setMapRegion({
          ...mapRegion, 
          latitude: inputGallery.galleryLocation0?.coordinates.latitude.value! as unknown as number,
          longitude: inputGallery.galleryLocation0?.coordinates.longitude.value! as unknown as number,
      })
      const mapMarkers: any[] = [];
      const galleryAddresses: string[] = []

      Object.keys(inputGallery).forEach((key: string) => {
        if (inputGallery[key].coordinates){
          mapMarkers.push({
            latitude: inputGallery[key]?.coordinates?.latitude.value! as unknown as number,
            longitude: inputGallery[key]?.coordinates?.longitude.value! as unknown as number,
            title: inputGallery[key]?.locationString?.value! as string,
            description: inputGallery[key]?.locationString?.value! as string,
            })
          }
        if (inputGallery[key].locationString){
          galleryAddresses.push(inputGallery[key]?.locationString?.value! as string)
        }
        })
        setMapMarkers(mapMarkers)
        setGalleryAddresses(galleryAddresses)
    }
    if (inputGallery?.galleryName && inputGallery.galleryName.value){
      setGalleryName(inputGallery.galleryName.value)
    }

  const daysOrder = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  if (inputGallery.galleryLocation0?.businessHours?.hoursOfOperation){
    setHoursOfOperation(inputGallery.galleryLocation0.businessHours.hoursOfOperation)
    const hoursArr = Object.entries(inputGallery.galleryLocation0.businessHours.hoursOfOperation).map(([day, hours]) => ({
      day: day,
      open: modifyHoursOfOperation(hours.open.value),
      close: modifyHoursOfOperation(hours.close.value)
    })).sort((a, b) => {
      return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
    });
    setHoursOfOperationArray(hoursArr)
  }

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
  }



  React.useEffect(() => {
    const setState = async () => {
      if (route?.params?.galleryId && state.galleryData && state.galleryData[route.params.galleryId]){
        const gal = state.galleryData[route.params.galleryId]
        setGalleryId(route.params.galleryId);
        setGalleryData({inputGallery: gal})
        setGallery(gal)
        dispatch({
          type: ETypes.setGalleryHeader,
          galleryHeader: gal.galleryName.value ?? "",
        })
      } else if (state.qrCodeGalleryId && state.galleryData){
        setGalleryId(state.qrCodeGalleryId);
        setGalleryData({inputGallery: state.galleryData[state.qrCodeGalleryId]})
        setGallery(state.galleryData[state.qrCodeGalleryId])
      } else if (route?.params?.galleryId && !route.params?.exhibitionId) { 
        let galleryData: IGalleryProfileData = {} as IGalleryProfileData
        try{
          const gal = await readGallery({galleryId: route?.params?.galleryId})
          const supplementalExhibitions = await listGalleryExhibitionPreviewForUser({galleryId: gal._id!})
          galleryData = {...gal, galleryExhibitions: supplementalExhibitions}
        } catch(error){
          console.log(error)
          //TO-DO: error
        }
        if (galleryData?._id){
          setGalleryId(galleryData._id);
          setGalleryData({inputGallery: galleryData})
          setGallery(galleryData)
          dispatch({
            type: ETypes.saveGallery,
            galleryData: galleryData,
          })
          dispatch({
            type: ETypes.setGalleryHeader,
            galleryHeader: galleryData.galleryName.value ?? "",
          })
        }
      }else {
        setErrorText("hey something went wrong, please refresh and try again")
      }
    }

    setState()
  }, [state.galleryData, galleryId, state.qrCodeGalleryId])

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async ({galleryId} : {galleryId: string}) => {
    setRefreshing(true);
    try{
        const newGallery = await readGallery({galleryId});
        setGalleryData({inputGallery: newGallery})
        dispatch({
            type: ETypes.saveGallery,
            exhibitionData: newGallery,
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
      dispatch({
        type: ETypes.setUserFollowGalleries,
        galleryId,
      })
      setFollowsGallery(true)
      dispatch({
        type: ETypes.setUserFollowGalleries,
        galleryId,
      })
    } catch {
      throw new Error("Something went wrong, please try again")
    }
  }

  const unFollowGallery = async () => { 
    try{
      await deleteGalleryRelationshipAPI({galleryId})
      dispatch({
        type: ETypes.removeUserFollowGalleries,
        galleryId,
      })
      setFollowsGallery(false)
    } catch {
      throw new Error("Something went wrong, please try again")
    }
  }

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
    if (state.userGalleryFollowed && state.userGalleryFollowed[galleryId]){
      setFollowsGallery(true)
    } else {
      setFollowsGallery(false)
    }
  }, [galleryId])

  React.useEffect(() => {
    toggleButtons()
  }, [followsGallery])


  const handleExhibitionPress = async ({exhibitionId} : {exhibitionId: string}) => {
    if (!exhibitionId) return
    let exhibitionTitle: string = ""

    if (state.exhibitionData && state.exhibitionData[exhibitionId]){
      const results = await readExhibition({exhibitionId});
      exhibitionTitle = results.exhibitionTitle?.value as string
      await Promise.resolve(() => {
        dispatch({
          type: ETypes.setPreviousExhibitionHeader,
          previousExhibitionHeader: exhibitionTitle,
        })
        dispatch({
          type: ETypes.setUserExhibitionHeader,
          userExhibitionHeader: exhibitionTitle,
        })
        dispatch({
          type: ETypes.saveExhibition,
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
              <FastImage 
              source={{uri: gallery?.galleryLogo?.value ?? ""}}
              style={galleryDetailsStyles.heroImage}
              resizeMode={FastImage.resizeMode.contain}
              />
            </View>
            )}
          <View style={galleryDetailsStyles.galleryBioContainer}>
            <Text style={globalTextStyles.paragraphText}>
              {gallery?.galleryBio?.value}
            </Text>
          </View>
            {!followsGallery && (
          <Animated.View style={{opacity: opacitySetOne, transform: [{ translateX: translateX }] }}>
              <Pressable style={{...galleryDetailsStyles.pressableStyle, backgroundColor: Colors.PRIMARY_950}} onPress={() => followGallery()}>
                <SVGs.PlusIcon />
                <TextElement style={{...globalTextStyles.boldTitleText, color: Colors.PRIMARY_50}}>Follow</TextElement>
              </Pressable>
          </Animated.View>
            )}
          {followsGallery && (
          <Animated.View style={{opacity: opacitySetTwo, transform: [{ translateX: Animated.subtract(100, translateX) }]}}>
            <Pressable style={galleryDetailsStyles.pressableStyle} onPress={() => unFollowGallery()}>
              <SVGs.MinusIcon />
              <TextElement style={globalTextStyles.boldTitleText}>Unfollow</TextElement>
            </Pressable>
          </Animated.View>
            )} 
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
        <View >
          <TextElement style={globalTextStyles.sectionHeaderTitle}>
                Location
            </TextElement>
          </View>
        <View style={galleryDetailsStyles.locationContainer}>
            {galleryAddresses.map((address) => {
              const city = simplifyAddressCity(address)
              const mailing = simplifyAddressMailing(address)
              return (
              <View key={address}>
                <DartaIconButtonWithText 
                text={`${mailing} ${city}`}
                iconComponent={SVGs.BlackPinIcon}
                onPress={() => openInMaps(address)}
                />
              </View>
              )
            })}
        </View>
        <View style={galleryDetailsStyles.mapContainer}>
          <MapView  
            provider={PROVIDER_GOOGLE}
            style={galleryDetailsStyles.map}
            region={mapRegion} 
            scrollEnabled={false}
            customMapStyle={mapStylesJson}
            >
              {mapMarkers && Object.values(mapMarkers).length > 0 && Object.values(mapMarkers).map((marker: any) => (
                  <Marker
                  key={marker.description}
                  coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                  description={marker.title ?? "Gallery"}
                  >
                    <SVGs.GoogleMapsPinIcon />
                  </Marker>
              ))}
            </MapView>
          </View>
         </View>
        <View style={galleryDetailsStyles.contactContainer}>
          <View>
            <TextElement style={globalTextStyles.sectionHeaderTitle}>Hours</TextElement>
          </View>
          {hoursOfOperationArray.length > 0 && (
        <View style={galleryDetailsStyles.hoursContainer}>
          {hoursOfOperationArray.map((day, index) => (
            <View key={`${day.day}-${day.open}-${day.close}-${index}`}>
            {day.open !== "Closed" ?
            (
            <View style={galleryDetailsStyles.hoursRow}>
              <TextElement style={galleryDetailsStyles.dayOpen}>{day.day}</TextElement>
              <TextElement style={galleryDetailsStyles.hoursOpen}>{day.open} - {day.close}</TextElement>
            </View>
            ) : (
            <View style={galleryDetailsStyles.hoursRow}>
              <TextElement style={galleryDetailsStyles.dayClosed}>{day.day}</TextElement>
              <TextElement style={galleryDetailsStyles.hoursClosed}>Closed</TextElement>
            </View>
              )}
            </View>
          ))}
        </View>
        )}
        </View>
        {upcomingExhibitions.length > 0 && (
         <View style={galleryDetailsStyles.contactContainer}>
          <View>
            <TextElement style={globalTextStyles.sectionHeaderTitle}>Upcoming Exhibitions</TextElement>
          </View>
          <View>
            {upcomingExhibitions.map((previousExhibition : Exhibition, index : number) => {
              return (
                <View key={`${index}-${previousExhibition.exhibitionId}`} style={galleryDetailsStyles.exhibitionPreviewContainer}>
                  <ExhibitionPreviewMini 
                    exhibitionHeroImage={previousExhibition.exhibitionPrimaryImage?.value as string}
                    exhibitionId={previousExhibition._id!}
                    exhibitionTitle={previousExhibition.exhibitionTitle?.value as string}
                    exhibitionGallery={gallery.galleryName?.value as string}
                    exhibitionArtist={previousExhibition.exhibitionArtist?.value === "" ? "Group Show" : previousExhibition.exhibitionArtist?.value as string}
                    exhibitionDates={previousExhibition?.exhibitionDates}
                    galleryLogoLink={gallery.galleryLogo?.value as string}
                    onPress={handleExhibitionPress}
                  />
                </View>
              )
            })}
            </View>
          </View>
            )}
        {route?.params?.showPastExhibitions && previousExhibitions.length > 0 && (
         <View style={galleryDetailsStyles.contactContainer}>
          <View>
            <TextElement style={globalTextStyles.sectionHeaderTitle}>Exhibitions</TextElement>
            </View>
          <View>
            {previousExhibitions.map((previousExhibition : Exhibition, index : number) => {
                return (
                  <View key={`${index}-${previousExhibition.exhibitionId}`} style={galleryDetailsStyles.exhibitionPreviewContainer}>
                    <ExhibitionPreviewMini 
                      exhibitionHeroImage={previousExhibition.exhibitionPrimaryImage?.value as string}
                      exhibitionId={previousExhibition._id!}
                      exhibitionTitle={previousExhibition.exhibitionTitle?.value as string}
                      exhibitionGallery={gallery.galleryName?.value as string}
                      exhibitionArtist={previousExhibition.exhibitionArtist?.value === "" ? "Group Show" : previousExhibition.exhibitionArtist?.value as string}
                      exhibitionDates={previousExhibition?.exhibitionDates}
                      galleryLogoLink={gallery.galleryLogo?.value as string}
                      onPress={handleExhibitionPress}
                    />
                  </View>
                )
              })}
            </View>
          </View>
            )}
      </View>
    </ScrollView>
    )}
    </>
  );
}
