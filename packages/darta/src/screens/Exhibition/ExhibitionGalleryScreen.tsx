import React, {useContext} from 'react';
import {View, StyleSheet, Linking, Platform, ScrollView, RefreshControl, Animated} from 'react-native';
import { Divider } from 'react-native-paper'
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { globalTextStyles } from '../../styles/styles';
import {TextElement} from '../../components/Elements/_index';
import * as Colors from '@darta-styles';
import { ExhibitionPreviewMini } from '../../components/Previews/ExhibitionPreviewMini';
import FastImage from 'react-native-fast-image'
import { createGalleryRelationshipAPI, deleteGalleryRelationshipAPI } from '../../utils/apiCalls';
import {
  ExhibitionRootEnum,
  PreviousExhibitionRootEnum
} from '../../typing/routes';
import { ActivityIndicator } from 'react-native-paper';
import auth from '@react-native-firebase/auth';

import { Text, Button} from 'react-native-paper'
import {ETypes, StoreContext} from '../../state/Store';
import {icons} from '../../utils/constants';
import { BusinessHours, Exhibition, IGalleryProfileData } from '@darta-types';
import { formatUSPhoneNumber, simplifyAddress } from '../../utils/functions';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import { listGalleryExhibitionPreviewForUser, readGallery } from '../../api/galleryRoutes';
import {readExhibition} from '../../api/exhibitionRoutes';
import { mapStylesJson } from '../../utils/mapStylesJson';
import { NeedAccountDialog } from '../../components/Dialog/NeedAccountDialog';

const galleryDetailsStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: Colors.PRIMARY_50,
    width: '100%',
    gap: hp("3%"),
    paddingBottom: hp('5%'),
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
  galleryTitleContainer: {
      width: wp('100%'),
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: hp('3%'),
      marginBottom: hp('1%'),
  },
  galleryLogoContainer: {
      alignSelf: 'center',
      justifyContent: 'center',
      width: wp('90%'),
      height: hp('20%'),
    },
  heroImage: {
      maxHeight: hp('25%'),
      minHeight: hp('20%'),
      width: wp('90%'),
      resizeMode: 'contain',
  },
  galleryBioContainer: {
      minHeight: hp('10%'),
      height: "auto",
      width: wp('90%'),
      display: 'flex',
      gap: wp('10%'),
      marginTop: hp('3%'),
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
  },
  galleryFollowContainer: {
    minHeight: hp('10%'),
},
  contactButtonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('5%'),
    height: hp('20%'),
    width: wp('100%'),
    borderRadius: 8,
    shadowColor: Colors.PRIMARY_950,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  rowButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: '100%',
    gap: wp('2%'),
  },
  fontStyleButtons:{
    color: Colors.PRIMARY_950, 
    fontSize: 13,
    width: wp('25%'),
  },
  divider: {
      width: wp('20%'),
      alignSelf: 'center',
      color: Colors.PRIMARY_950
  },
  descriptionText: {
      ...globalTextStyles.centeredText,
      fontSize: 15,
      color: Colors.PRIMARY_950,
      height: hp('3%'),
      
  }, 
  locationContainer: {
      width: '85%',
      height: hp('35%'),
      margin: 10, 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: wp('5%'),
  },
  hoursContainer: {
    backgroundColor: Colors.PRIMARY_50,
    width: wp('85%'),
    borderRadius: 8,
    padding: 10,
    shadowColor: Colors.PRIMARY_950,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
  },
  day: {
    fontSize: 16,
    color: '#333',
  },
  hours: {
    fontSize: 16,
    color: Colors.PRIMARY_900,
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
  previousShowContainer: {
    width: '85%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
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

  const daysOrder = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (inputGallery.galleryLocation0?.businessHours?.hoursOfOperation){
    setHoursOfOperation(inputGallery.galleryLocation0.businessHours.hoursOfOperation)
    const hoursArr = Object.entries(inputGallery.galleryLocation0.businessHours.hoursOfOperation).map(([day, hours]) => ({
      day: day.slice(0, 3),
      open: hours.open.value ?? "",
      close: hours.close.value ?? ""
    })).sort((a, b) => {
      return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
    });
    setHoursOfOperationArray(hoursArr)
  }

  if (inputGallery?.galleryExhibitions){
    const strippedExhibitionId = route?.params?.exhibitionId?.replace("Exhibitions/", "")
    const previous = Object.values(inputGallery.galleryExhibitions).filter((exhibition: Exhibition) => exhibition.exhibitionId !== strippedExhibitionId)
    previous.sort((a: Exhibition, b: Exhibition) => { 
      return new Date(b.exhibitionDates.exhibitionStartDate.value as any).getTime() - new Date(a.exhibitionDates.exhibitionStartDate.value as any).getTime()
    })
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

  const onRefresh = React.useCallback(async () => {
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
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacitySetTwo, {
        toValue: followsGallery ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: followsGallery ? 100 : 0,
        duration: 300,
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
      <RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>      
      <View style={galleryDetailsStyles.container}>
        <View style={galleryDetailsStyles.galleryTitleContainer}>
            <TextElement style={{...globalTextStyles.boldTitleText, fontSize: 20, color: Colors.PRIMARY_950}}>
                {galleryName}
            </TextElement>
        </View>
        <View style={galleryDetailsStyles.galleryLogoContainer}>
          {gallery?.galleryLogo?.value && (
          <FastImage 
          source={{uri: gallery?.galleryLogo?.value ?? ""}}
          style={galleryDetailsStyles.heroImage}
          resizeMode={FastImage.resizeMode.contain}
          />
          )}
        </View>
        <View style={galleryDetailsStyles.galleryBioContainer}>
          <Text style={{fontSize: 15, color: Colors.PRIMARY_950}}>
            {gallery?.galleryBio?.value}
          </Text>
        </View>
        <View style={galleryDetailsStyles.galleryFollowContainer}>
        <Animated.View style={{opacity: opacitySetOne, transform: [{ translateX: translateX }] }}>
          {!followsGallery && (
            <Button
            icon={"plus-box"}
            labelStyle={{color: Colors.PRIMARY_100}}
            style={{backgroundColor: Colors.PRIMARY_950}}
            mode="contained"
            onPress={() => followGallery()}
            >Follow Gallery</Button>
          )}
        </Animated.View>
        <Animated.View style={{opacity: opacitySetTwo, transform: [{ translateX: Animated.subtract(100, translateX) }]}}>
        {followsGallery && (
            <Button
            icon={"minus-box"}
            labelStyle={{color: Colors.PRIMARY_950}}
            style={{backgroundColor: Colors.PRIMARY_100}}
            mode="contained"
            onPress={() => unFollowGallery()}
            >Unfollow Gallery</Button>
          )}
        </Animated.View>

        </View>
        <View>
          <TextElement style={galleryDetailsStyles.descriptionText}>
              Contact
          </TextElement>
          <Divider style={galleryDetailsStyles.divider}/>
        </View>

        <View style={galleryDetailsStyles.contactButtonContainer}>
          <View style={galleryDetailsStyles.rowButtonContainer}>
          {gallery?.galleryInstagram?.value &&(
            <Button
            icon={icons.instagram}
            labelStyle={galleryDetailsStyles.fontStyleButtons}
            style={{backgroundColor: Colors.PRIMARY_100}}
            mode="contained"
            onPress={() => sendToInstagram()}
            >
            <TextElement>{gallery.galleryInstagram.value}</TextElement>
            </Button>
          )}
          {gallery?.galleryPhone?.value && (
            <Button
            icon={icons.phone}
            labelStyle={galleryDetailsStyles.fontStyleButtons}
            style={{backgroundColor: Colors.PRIMARY_100}}
            mode="contained"
            onPress={() => dialNumber()}
            >
            <TextElement>{formatUSPhoneNumber(gallery?.galleryPhone?.value)}</TextElement>
            </Button>
            )}
          </View>
          <View style={galleryDetailsStyles.rowButtonContainer}>
            {gallery?.primaryContact?.value && (            
              <Button
                icon={icons.email}
                labelStyle={galleryDetailsStyles.fontStyleButtons}
                style={{backgroundColor: Colors.PRIMARY_100}}
                mode="contained"
                onPress={() => sendEmail()}
              >
                <TextElement>{gallery?.primaryContact?.value}</TextElement>
              </Button>
            )}
            {gallery?.galleryWebsite?.value && (
            <Button
              icon={icons.website}
              labelStyle={galleryDetailsStyles.fontStyleButtons}
              style={{backgroundColor: Colors.PRIMARY_100}}
              mode="contained"
                onPress={() => visitWebsite(gallery.galleryWebsite?.value!)}
            >
              <TextElement>{gallery.galleryWebsite.value.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')}</TextElement>
            </Button>
            )}
          </View>
        </View>
        <View>
          <TextElement style={galleryDetailsStyles.descriptionText}>Location{galleryAddresses.length > 1 && "s"}</TextElement>
          <Divider style={galleryDetailsStyles.divider}/>
        </View>
        <View style={{...galleryDetailsStyles.locationContainer, height: galleryAddresses.length >= 2 ? hp('10%') : hp('5%')}}>
            {galleryAddresses.map((address) => {
              return (
                <View style={{marginBottom: 3}} key={address}>
                  <Button
                    icon={"map"}
                    labelStyle={{color: Colors.PRIMARY_950}}
                    mode="text"
                    onPress={() => openInMaps(address)}
                    >                
                    <TextElement style={{...globalTextStyles.centeredText, textDecorationLine: 'underline', marginTop: hp('1%')}}>{simplifyAddress(address)}</TextElement>
                    </Button>
                </View>
              )
            })}
        </View>
        <View>
          <TextElement style={galleryDetailsStyles.descriptionText}>
              Map
          </TextElement>
          <Divider style={galleryDetailsStyles.divider}/>
        </View>
        <View style={{height: hp('30%'), width: wp('90%')}}>
          <MapView  
            provider={PROVIDER_GOOGLE}
            style={{ alignSelf: 'stretch', height: '100%' }}
            region={mapRegion} 
            customMapStyle={mapStylesJson}
            >
              {mapMarkers && Object.values(mapMarkers).length > 0 && Object.values(mapMarkers).map((marker: any) => (
                  <Marker
                  key={marker.description}
                  coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                  description={marker.title ?? "Gallery"}
                  />
              ))}
            </MapView>
          </View>
        <View>
          <TextElement style={galleryDetailsStyles.descriptionText}>Hours</TextElement>
          <Divider style={galleryDetailsStyles.divider}/>
        </View>
        <View >
          {hoursOfOperationArray.length > 0 && (
        <View style={galleryDetailsStyles.hoursContainer}>
          {hoursOfOperationArray.map((day, index) => (
            <View key={`${day.day}-${day.open}-${day.close}-${index}`}>
            {day.open !== "Closed" && (
            <View style={galleryDetailsStyles.hoursRow}>
            <TextElement style={galleryDetailsStyles.day}>{day.day}</TextElement>
              <TextElement style={galleryDetailsStyles.hours}>{day.open} - {day.close}</TextElement>
              </View>
              )}
            </View>
          ))}
        </View>
          )}
        </View>
        {route?.params?.showPastExhibitions && (
          <>
        <View>
          <TextElement style={galleryDetailsStyles.descriptionText}>Past Shows</TextElement>
          <Divider style={galleryDetailsStyles.divider}/>
        </View>
        <View style={galleryDetailsStyles.previousShowContainer}>
          {previousExhibitions && previousExhibitions.map((previousExhibition : Exhibition, index : number) => {
              return (
                <View key={`${index}-${previousExhibition.exhibitionId}`}>
                  <ExhibitionPreviewMini 
                    exhibitionHeroImage={previousExhibition.exhibitionPrimaryImage?.value as string}
                    exhibitionId={previousExhibition._id!}
                    exhibitionTitle={previousExhibition.exhibitionTitle?.value as string}
                    exhibitionGallery={gallery.galleryName?.value as string}
                    exhibitionArtist={previousExhibition.exhibitionArtist?.value as string}
                    exhibitionDates={previousExhibition.exhibitionDates}
                    galleryLogoLink={gallery.galleryLogo?.value as string}
                    onPress={handleExhibitionPress}
                  />
                </View>
              )
            })}
          </View>
          </>
            )}
      </View>
    </ScrollView>
    )}
    </>
  );
}
