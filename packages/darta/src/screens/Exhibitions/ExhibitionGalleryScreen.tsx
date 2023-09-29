import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View, StyleSheet, Linking, ScrollView} from 'react-native';
import { Divider } from 'react-native-paper'
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { globalTextStyles } from '../../styles/styles';
import {TextElement} from '../../components/Elements/_index';
import {PRIMARY_50, PRIMARY_950, PRIMARY_300, PRIMARY_100, PRIMARY_200, PRIMARY_900, PRIMARY_800} from '@darta-styles';
import { ExhibitionPreview } from '../../components/Previews/ExhibitionPreview';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import { Text, Button} from 'react-native-paper'
import { Image } from 'react-native-elements';
import {StoreContext} from '../../state/Store';
import {icons} from '../../utils/constants';
import { Exhibition, IGalleryProfileData } from '@darta-types';
import { formatUSPhoneNumber } from '../../utils/functions';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/ExhibitionTopTabNavigator';


type ExhibitionHomeScreenNavigationProp = StackNavigationProp<
ExhibitionNavigatorParamList,
ExhibitionRootEnum.exhibitionHome
>;


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
      maxHeight: hp('15%'),
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
  addressContainer: {
    width: '85%',
    height: hp('15%'),
    margin: 10, 
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  hoursContainer: {
    width: '100%',
    height: hp('20%'),
    margin: 10, 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  hourRow: {
    width: '100%',
    height: hp('3%'),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  hour: {
    flex: 1,
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
}: {
  route: ExhibitionGalleryRouteProp;
}) {
  const {state} = useContext(StoreContext);

  let galleryId;
  if (route?.params?.galleryId){
    galleryId = route.params.galleryId;
  } else{
    return (
        <View style={galleryDetailsStyles.container}>
            <TextElement>hey something went wrong, please go back and try again</TextElement>
        </View>
    )
  }

  let gallery : IGalleryProfileData = {} as IGalleryProfileData;
  if (state?.galleryData && state.galleryData[galleryId]){
    gallery = state.galleryData[galleryId]
  }

  const mapRegion = {
    latitudeDelta: 0.02,
    longitudeDelta: 0.0421,
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
  

  let hoursOfOperation;

  if (gallery.galleryLocation0?.businessHours?.hoursOfOperation){
    hoursOfOperation = gallery.galleryLocation0.businessHours.hoursOfOperation
  }

  let previousExhibitions;
  if (gallery?.galleryExhibitions){
    previousExhibitions = Object.values(gallery.galleryExhibitions)
    previousExhibitions.sort((a: Exhibition, b: Exhibition) => { 
      return new Date(b.exhibitionDates.exhibitionStartDate.value as any).getTime() - new Date(a.exhibitionDates.exhibitionStartDate.value as any).getTime()
    })
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
    <ScrollView>
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
        <View style={galleryDetailsStyles.addressContainer}>
          {hoursOfOperation && (
          <View style={galleryDetailsStyles.hoursContainer}>
            <View style={galleryDetailsStyles.hourRow}>
              <TextElement style={galleryDetailsStyles.hour}> Mon </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> Tue </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> Wen </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> Thu </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> Fri </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> Sat </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> Sun </TextElement>
            </View>
            <View style={galleryDetailsStyles.hourRow}>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Monday.open.value === "Closed" ? "-" : hoursOfOperation.Monday.open.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Tuesday.open.value === "Closed" ? "-" : hoursOfOperation.Tuesday.open.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Wednesday.open.value === "Closed" ? "-" : hoursOfOperation.Wednesday.open.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Thursday.open.value === "Closed" ? "-" : hoursOfOperation.Thursday.open.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Friday.open.value === "Closed" ? "-" : hoursOfOperation.Friday.open.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Saturday.open.value === "Closed" ? "-" : hoursOfOperation.Saturday.open.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Sunday.open.value === "Closed" ? "-" : hoursOfOperation.Sunday.open.value} </TextElement>
            </View>
            <View style={galleryDetailsStyles.hourRow}>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Monday.close.value === "Closed" ? "-" : hoursOfOperation.Monday.close.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Tuesday.close.value === "Closed" ? "-" : hoursOfOperation.Tuesday.close.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Wednesday.close.value === "Closed" ? "-" : hoursOfOperation.Wednesday.close.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Thursday.close.value === "Closed" ? "-" : hoursOfOperation.Thursday.close.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Friday.close.value === "Closed" ? "-" : hoursOfOperation.Friday.close.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Saturday.close.value === "Closed" ? "-" : hoursOfOperation.Saturday.close.value} </TextElement>
              <TextElement style={galleryDetailsStyles.hour}> {hoursOfOperation.Sunday.close.value === "Closed" ? "-" : hoursOfOperation.Sunday.close.value} </TextElement>
            </View>
          </View>
          )}
        </View>
        <View>
          <TextElement style={galleryDetailsStyles.descriptionText}>Shows</TextElement>
          <Divider style={galleryDetailsStyles.divider}/>
        </View>
        <View style={galleryDetailsStyles.previousShowContainer}>
          {previousExhibitions && previousExhibitions.map((previousExhibition : Exhibition, index : number) => {
            return (
              <View key={index}>
                <ExhibitionPreview 
                  exhibitionHeroImage={previousExhibition.exhibitionPrimaryImage?.value as string}
                  exhibitionTitle={previousExhibition.exhibitionTitle?.value as string}
                  exhibitionGallery={gallery.galleryName?.value as string}
                  exhibitionArtist={previousExhibition.exhibitionArtist?.value as string}
                  exhibitionDates={previousExhibition.exhibitionDates}
                  galleryLogoLink={gallery.galleryLogo?.value as string}
                />
              </View>
            )
          })}
        </View>
      </View>
    </ScrollView>
  );
}
