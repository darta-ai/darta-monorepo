import React, {useContext} from 'react';
import {View, StyleSheet, Linking, ScrollView, RefreshControl} from 'react-native';
import { Divider } from 'react-native-paper'
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { globalTextStyles } from '../../styles/styles';
import {TextElement} from '../../components/Elements/_index';
import { PRIMARY_50, PRIMARY_950, PRIMARY_600, PRIMARY_900, PRIMARY_500 } from '@darta-styles';
import { ExhibitionPreviewMini } from '../../components/Previews/ExhibitionPreviewMini';
import {
  ExhibitionRootEnum,
  PreviousExhibitionRootEnum
} from '../../typing/routes';
import { Text, Button} from 'react-native-paper'
import { Image } from 'react-native-elements';
import {ETypes, StoreContext} from '../../state/Store';
import {icons} from '../../utils/constants';
import { BusinessHours, Exhibition, IGalleryProfileData } from '@darta-types';
import { formatUSPhoneNumber } from '../../utils/functions';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import { readGallery } from '../../api/galleryRoutes';
import {readExhibition} from '../../api/exhibitionRoutes';
import { mapStylesJson } from '../../utils/mapStylesJson';

const galleryDetailsStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: PRIMARY_50,
    width: '100%',
    gap: hp("3%")
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
      minHeight: hp('15%'),
      height: "auto",
      width: wp('90%'),
      display: 'flex',
      gap: wp('10%'),
      marginTop: hp('3%'),
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
  },
  contactButtonContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: wp('5%'),
    height: hp('13%'),
    borderRadius: 8,
    shadowColor: PRIMARY_950,
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
    gap: wp('5%'),
  },
  divider: {
      width: wp('20%'),
      alignSelf: 'center',
      color: PRIMARY_950
  },
  descriptionText: {
      ...globalTextStyles.centeredText,
      fontSize: 15,
      color: PRIMARY_950,
      height: hp('3%'),
      
  }, 
  locationContainer: {
      width: '85%',
      height: hp('30%'),
      margin: 10, 
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: wp('5%'),
  },
  hoursContainer: {
    backgroundColor: PRIMARY_50,
    width: wp('85%'),
    borderRadius: 8,
    padding: 10,
    shadowColor: PRIMARY_950,
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
    color: PRIMARY_900,
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
    color: PRIMARY_900
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

  let galleryId = "";
  if (route?.params?.galleryId){
    galleryId = route.params.galleryId;
  } else{
    return (
        <View style={galleryDetailsStyles.container}>
            <TextElement>hey something went wrong, please go back and try again</TextElement>
        </View>
    )
  }

  const [gallery, setGallery] = React.useState<IGalleryProfileData>({} as IGalleryProfileData)

  React.useEffect(() => {
    if (state?.galleryData && state.galleryData[galleryId]){
      setGallery(state.galleryData[galleryId])
    }
  }, [state.galleryData, galleryId])

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
        const newGallery = await readGallery({galleryId});
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

  const mapRegion = {
    latitudeDelta: 0.004,
    longitudeDelta: 0.004,
    latitude: 0, 
    longitude: 0,
  }
  let hasCoordinates = false;

  if (gallery.galleryLocation0?.coordinates) {
      hasCoordinates = true;
      mapRegion.latitude = gallery.galleryLocation0?.coordinates.latitude.value! as unknown as number;
      mapRegion.longitude = gallery.galleryLocation0?.coordinates.longitude.value! as unknown as number;
  }

  let galleryName: any;
  if (gallery?.galleryName){
      galleryName = gallery.galleryName.value;
  }
  

  let hoursOfOperation: BusinessHours = {} as BusinessHours;
  let hoursOfOperationArray: {day: string, open: string, close: string}[] = [];
  const daysOrder = [ "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  if (gallery.galleryLocation0?.businessHours?.hoursOfOperation){
    hoursOfOperation = gallery.galleryLocation0.businessHours.hoursOfOperation
    hoursOfOperationArray = Object.entries(hoursOfOperation).map(([day, hours]) => ({
      day: day.slice(0, 3),
      open: hours.open.value ?? "",
      close: hours.close.value ?? ""
    })).sort((a, b) => {
      return daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day);
    });
  }

  let previousExhibitions: Exhibition[] = [];
  if (gallery?.galleryExhibitions){
    previousExhibitions = Object.values(gallery.galleryExhibitions).filter((exhibition: Exhibition) => exhibition.exhibitionId !== route?.params?.exhibitionId)
    previousExhibitions.sort((a: Exhibition, b: Exhibition) => { 
      return new Date(b.exhibitionDates.exhibitionStartDate.value as any).getTime() - new Date(a.exhibitionDates.exhibitionStartDate.value as any).getTime()
    })
  }


  const handleExhibitionPress = async ({exhibitionId} : {exhibitionId: string}) => {
    if (!exhibitionId) return
    let exhibitionTitle: string = ""

      const results = await readExhibition({exhibitionId});
      exhibitionTitle = results.exhibitionTitle?.value as string
      dispatch({
        type: ETypes.setPreviousExhibitionHeader,
        previousExhibitionHeader: exhibitionTitle,
      })
      dispatch({
        type: ETypes.saveExhibition,
        exhibitionData: results,
      })
      navigation.navigate(PreviousExhibitionRootEnum.navigatorScreen, {exhibitionId, galleryId})

  }

  const sendToInstagram = () => {
    if (!gallery?.galleryInstagram?.value) return
    const instaHandle = gallery.galleryInstagram.value.replace('@', '')
    Linking.canOpenURL('instagram://app').then((supported) => {
      console.log('can open instagram', supported)
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

  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} tintColor={PRIMARY_600} onRefresh={onRefresh} />}
      >      
      <View style={galleryDetailsStyles.container}>
        <View style={galleryDetailsStyles.galleryTitleContainer}>
            <TextElement style={{...globalTextStyles.boldTitleText, fontSize: 20, color: PRIMARY_950}}>
                {gallery?.galleryName?.value}
            </TextElement>
        </View>
        <View style={galleryDetailsStyles.galleryLogoContainer}>
          {gallery?.galleryLogo?.value && (
          <Image 
          source={{uri: gallery?.galleryLogo?.value ?? ""}}
          style={galleryDetailsStyles.heroImage}
          />
          )}
        </View>
        <View style={galleryDetailsStyles.galleryBioContainer}>
          <Text style={{fontSize: 15, color: PRIMARY_950}}>
            {gallery?.galleryBio?.value}
          </Text>
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
            labelStyle={{color: PRIMARY_950}}
            mode="text"
            onPress={() => sendToInstagram()}
            >
            <TextElement>{gallery.galleryInstagram.value}</TextElement>
            </Button>
          )}
          {gallery?.galleryPhone?.value && (
            <Button
            icon={icons.phone}
            labelStyle={{color: PRIMARY_950}}
            mode="text"
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
                labelStyle={{color: PRIMARY_950}}
                mode="text"
                onPress={() => sendEmail()}
              >
                <TextElement>{gallery?.primaryContact?.value}</TextElement>
              </Button>
            )}
            {gallery?.galleryWebsite?.value && (
            <Button
              icon={icons.website}
              labelStyle={{color: PRIMARY_950}}
              mode="text"
              onPress={() => visitWebsite(gallery.galleryWebsite?.value!)}
            >
              <TextElement>{gallery.galleryWebsite.value.replace(/^(https?:\/\/)?(www\.)?/, '').replace(/\/$/, '')}</TextElement>
            </Button>
            )}
          </View>
        </View>
        <View>
          <TextElement style={galleryDetailsStyles.descriptionText}>Location</TextElement>
          <Divider style={galleryDetailsStyles.divider}/>
        </View>
        <View style={galleryDetailsStyles.locationContainer}>
          <View>
            <TextElement style={{fontSize: 15, color: PRIMARY_900}}>{gallery?.galleryLocation0?.locationString?.value}</TextElement>
          </View>
          <MapView  
            provider={PROVIDER_GOOGLE}
            style={{ alignSelf: 'stretch', height: '80%' }}
            region={mapRegion} 
            customMapStyle={mapStylesJson}
            >
              <Marker
              key={"12345"}
              coordinate={{latitude: mapRegion.latitude, longitude: mapRegion.longitude}}
              title={galleryName ?? "Gallery"}
              description={gallery?.galleryLocation0?.locationString?.value!}
              />
            </MapView>
        </View>
        <View>
          <TextElement style={galleryDetailsStyles.descriptionText}>Hours</TextElement>
          <Divider style={galleryDetailsStyles.divider}/>
        </View>
        <View >
          {hoursOfOperationArray.length > 0 && (
        <View style={galleryDetailsStyles.hoursContainer}>
          {hoursOfOperationArray.map((day) => (
            <>
            {day.open !== "Closed" && (
            <View key={day.day} style={galleryDetailsStyles.hoursRow}>
              <TextElement style={galleryDetailsStyles.day}>{day.day}</TextElement>
                <TextElement style={galleryDetailsStyles.hours}>{day.open} - {day.close}</TextElement>
            </View>
            )}
            </>
          ))}
        </View>
          )}
        </View>
        <View>
          <TextElement style={galleryDetailsStyles.descriptionText}>Past Shows</TextElement>
          <Divider style={galleryDetailsStyles.divider}/>
        </View>
        <View style={galleryDetailsStyles.previousShowContainer}>
          {previousExhibitions && previousExhibitions.map((previousExhibition : Exhibition, index : number) => {
            return (
              <View key={index}>
                <ExhibitionPreviewMini 
                  exhibitionHeroImage={previousExhibition.exhibitionPrimaryImage?.value as string}
                  exhibitionId={previousExhibition.exhibitionId}
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
      </View>
    </ScrollView>
  );
}
