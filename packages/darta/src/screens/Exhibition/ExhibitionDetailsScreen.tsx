import React from 'react';
import {View, StyleSheet, ScrollView, Platform, Linking, RefreshControl, Text, Alert} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'

import * as Colors from '@darta-styles';
import { UIStoreContext, UiETypes, GalleryStoreContext, GalleryETypes, ExhibitionStoreContext, ExhibitionETypes} from '../../state';
import {TextElement} from '../../components/Elements/_index';
import {customFormatTimeString, customLocalDateStringStart, customLocalDateStringEnd, simplifyAddressCity, simplifyAddressMailing} from '../../utils/functions';
import { ActivityIndicator, Surface } from 'react-native-paper';
import { listGalleryExhibitionPreviewForUser } from '../../api/galleryRoutes';
import {
  ExhibitionRootEnum
} from '../../typing/routes';
import {Exhibition, IGalleryProfileData} from '@darta-types'
import {globalTextStyles} from '../../styles/styles'
import * as Calendar from 'expo-calendar';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import { readExhibition } from '../../api/exhibitionRoutes';
import { mapStylesJson } from '../../utils/mapStylesJson';
import { readGallery } from '../../api/galleryRoutes';
import { TextElementMultiLine } from '../../components/Elements/TextElement';
import { DartaIconButtonWithText } from '../../components/Darta/DartaIconButtonWithText';
import * as SVGs from '../../assets/SVGs';

const exhibitionDetailsStyles = StyleSheet.create({
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
    informationContainer: { 
        width: wp('100%'),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 24,
        paddingRight: 24,
    },
    informationTitleContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 24,
    },
    subInformationContainer: {
        minHeight: 44, 
        width: '100%',
        marginTop: 24,
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
    heroImageContainer: {
        alignSelf: 'center',
        display:'flex',
        justifyContent: 'center',
        height: 350,
        width: 345,
      },
    heroImage: {
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
        backgroundColor: 'transparent',
    },
    textContainer: {
        height: hp('80%'),
        width: wp('100%'),
        display: 'flex',
        gap: wp('10%'),
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    shareContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: wp('100%'),
        height: hp('12%'),
        marginTop: hp('2%'),
      },
    openingContainer: {
        height: hp('10%'),
        width: wp('95%'),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }, 
    divider: {
        width: wp('20%'),
        alignSelf: 'center',
        color: Colors.PRIMARY_950
    },
    descriptionText: {
        ...globalTextStyles.centeredText,
        fontSize: 12,
        color: Colors.PRIMARY_950
    },
    mapContainer: {
        width: 345,
        height: 345,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressReleaseContainer: {
        marginTop: hp('2%'),
        width: '85%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

type ExhibitionDetailsRouteProp = RouteProp<ExhibitionStackParamList, ExhibitionRootEnum.exhibitionDetails>;

export function ExhibitionDetailsScreen({
    route,
    navigation,
}: {
    route?: ExhibitionDetailsRouteProp;
    navigation?: any;
}) {

  const {exhibitionState, exhibitionDispatch} = React.useContext(ExhibitionStoreContext);

  const {uiDispatch} = React.useContext(UIStoreContext);
  const {galleryState, galleryDispatch} = React.useContext(GalleryStoreContext);
  const [exhibitionId, setExhibitionId] = React.useState<string>("")
  const [errorText, setErrorText] = React.useState<string>("");
  const [isGalleryLoaded, setIsGalleryLoaded] = React.useState<boolean>(false);
  const [vimeoURL, setVimeoURL] = React.useState<string>("");


  const [currentExhibition, setCurrentExhibition] = React.useState<Exhibition | null>(null);

  const [exhibitionStartDate, setExhibitionStartDate] = React.useState<string>(new Date().toLocaleDateString());
  const [exhibitionEndDate, setExhibitionEndDate] = React.useState<string>(new Date().toLocaleDateString());
  
  const [receptionOpeningDay, setReceptionOpeningDay ] = React.useState<string>(new Date().toLocaleDateString())
  const [receptionCloseDay, setReceptionCloseDay ] = React.useState<string>(new Date().toLocaleDateString())
  const [isReceptionMultipleDays, setIsReceptionMultipleDays ] = React.useState<boolean>(false)
  const [hasReception, setHasReception ] = React.useState<boolean>(false)
  const [receptionOpenFullDate, setReceptionOpenFullDate ] = React.useState<Date>(new Date())
  const [receptionCloseFullDate, setReceptionCloseFullDate ] = React.useState<Date>(new Date())

  const [receptionDateString, setReceptionDateString] = React.useState<string>("")
  const [receptionTimeString, setReceptionTimeString] = React.useState<string>("")
  const [exhibitionLocation, setExhibitionLocation] = React.useState<string>("")
  
  const [mapRegion, setMapRegion] = React.useState<any>({
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    latitude: 0, 
    longitude: 0,
  })

  const [galleryName, setGalleryName] = React.useState<string>("")
  const [isGroupShow, setIsGroupShow] = React.useState<boolean>(false)
  const [artistName, setArtistName] = React.useState<string>("")

  const setExhibitionData = ({currentExhibition, currentGallery} : {currentExhibition: Exhibition, currentGallery: IGalleryProfileData}) => {

    if (currentExhibition?.videoLink?.value){
        const url = currentExhibition.videoLink.value
        if (url.includes('https://player.vimeo.com/video/')){
            setVimeoURL(url)
            return
        }
        const vimeoId = url.split('/').pop()
        const vimeoUrl = `https://player.vimeo.com/video/${vimeoId}`
        setVimeoURL(vimeoUrl)
    }

    if (currentExhibition._id){
        setExhibitionId(currentExhibition._id)
    }
    if (currentExhibition?.exhibitionType?.value === "Group Show"){
        setIsGroupShow(true)
        if (currentExhibition?.artworks){
            const {artworks} = currentExhibition
            const artists = Object.values(artworks).map((artwork) => artwork.artistName?.value?.trim())
            const uniqueArray = [...new Set(artists)];
            const uniqueString = uniqueArray.join(', ');
            setArtistName(uniqueString)
        }
    } else {
        setArtistName(currentExhibition?.exhibitionArtist?.value ?? "")
    }

    if(currentExhibition?.exhibitionLocation?.locationString?.value){
        const city = simplifyAddressCity(currentExhibition?.exhibitionLocation?.locationString?.value)
        const mailing = simplifyAddressMailing(currentExhibition?.exhibitionLocation?.locationString?.value)
        setExhibitionLocation(`${mailing} ${city}`)
    }
    if (currentExhibition?.exhibitionDates 
        && currentExhibition.exhibitionDates?.exhibitionStartDate 
        && currentExhibition.exhibitionDates?.exhibitionEndDate
        && currentExhibition.exhibitionDates?.exhibitionDuration
        && currentExhibition.exhibitionDates.exhibitionStartDate?.value
        && currentExhibition.exhibitionDates.exhibitionEndDate?.value
        && currentExhibition.exhibitionDates.exhibitionDuration?.value 
        ) {
        setExhibitionStartDate(customLocalDateStringStart({date: new Date(currentExhibition.exhibitionDates.exhibitionStartDate.value), isUpperCase: false}));
        setExhibitionEndDate(customLocalDateStringEnd({date: new Date(currentExhibition?.exhibitionDates.exhibitionEndDate.value), isUpperCase: false}));
      }
    

    if (currentExhibition?.receptionDates 
        && currentExhibition.receptionDates?.receptionStartTime
        && currentExhibition.receptionDates?.receptionEndTime
        && currentExhibition.receptionDates?.hasReception
        && currentExhibition.receptionDates.receptionStartTime?.value
        && currentExhibition.receptionDates.receptionEndTime?.value){
            const receptionStartDay = customLocalDateStringStart({date: new Date(currentExhibition.receptionDates.receptionEndTime.value), isUpperCase: false})
            const receptionEndDay = customLocalDateStringStart({date: new Date(currentExhibition.receptionDates.receptionEndTime.value), isUpperCase: false})

            setReceptionOpeningDay(receptionStartDay)
            setReceptionCloseDay(receptionEndDay)
            setIsReceptionMultipleDays(receptionCloseDay !== receptionOpeningDay);
            const receptionInPast = new Date(currentExhibition.receptionDates.receptionEndTime.value) > new Date()
            setHasReception(currentExhibition.receptionDates.hasReception.value === "Yes");
            setReceptionOpenFullDate(new Date(currentExhibition.receptionDates.receptionStartTime.value));
            setReceptionCloseFullDate(new Date(currentExhibition.receptionDates.receptionEndTime.value));

            if(isReceptionMultipleDays){
                setReceptionDateString(`${receptionStartDay} - ${receptionEndDay}`)
                setReceptionTimeString(`${customFormatTimeString(new Date(currentExhibition.receptionDates.receptionStartTime.value))} - ${customFormatTimeString(new Date(currentExhibition.receptionDates.receptionEndTime.value))}`)
            } else{
                setReceptionDateString(receptionStartDay)
                setReceptionTimeString(`${customFormatTimeString(new Date(currentExhibition.receptionDates.receptionStartTime.value))} - ${customFormatTimeString(new Date(currentExhibition.receptionDates.receptionEndTime.value))}`)
            }
    }



    if (currentExhibition?.exhibitionLocation?.coordinates) {
        setMapRegion({
            ...mapRegion, 
            latitude: currentExhibition.exhibitionLocation.coordinates.latitude.value! as unknown as number,
            longitude: currentExhibition.exhibitionLocation.coordinates.longitude.value! as unknown as number,
        })
    }
    if (currentGallery?.galleryName && currentGallery.galleryName.value){
        setGalleryName(currentGallery.galleryName.value);
    }

    const shareURL = `https://darta.art/exhibition?exhibitionId=${currentExhibition._id}&galleryId=${currentGallery._id}`
    uiDispatch({
        type: UiETypes.setExhibitionShareURL,
        exhibitionShareDetails: {shareURL, shareURLMessage: ''},
    })
  }


    async function fetchExhibitionById(): Promise<{exhibition: Exhibition, galleryData: IGalleryProfileData} | void> {
        if (!route?.params?.galleryId || !route.params.exhibitionId) return
        try {
            const {galleryId, exhibitionId} = route.params
            const [gallery, supplementalExhibitions, exhibition] = await Promise.all([
                readGallery({ galleryId }),
                listGalleryExhibitionPreviewForUser({ galleryId }),
                readExhibition({ exhibitionId })
            ])

            const galleryData = { ...gallery, galleryExhibitions: supplementalExhibitions };

            setCurrentExhibition(exhibition);
            setExhibitionData({currentExhibition: exhibition, currentGallery: galleryData})
            setIsGalleryLoaded(true);


            return {exhibition, galleryData}

        } catch (error: any){
            // TO-DO: error handling
        }
    }

    const setExhibitionDataInState = async () => {
        const data = await fetchExhibitionById()
        if (!data) return
        const {exhibition, galleryData} = data
        Promise.resolve().then(() =>{
            galleryDispatch({
                type: GalleryETypes.saveGallery,
                galleryData: galleryData,
            })
            // dispatch({
            //     type: ETypes.setCurrentHeader,
            //     currentExhibitionHeader: exhibition.exhibitionTitle.value!,
            //   })
            exhibitionDispatch({
                type: ExhibitionETypes.saveExhibition,
                exhibitionData: exhibition,
            })
        })
    }

  React.useEffect(() => {
    function handleExhibitionData() {
        let galleryId = ""
        let exhibitionId = ""
        if (route?.params?.exhibitionId){
            exhibitionId = route.params.exhibitionId
          }
        if (route?.params?.galleryId){
            galleryId = route.params.galleryId
        }
        // If already loaded
        if (exhibitionId && 
            galleryId && 
            exhibitionState?.exhibitionData &&
            galleryState?.galleryData &&
            exhibitionState.exhibitionData[exhibitionId] &&
            galleryState.galleryData[galleryId]){
                const exhibition = exhibitionState.exhibitionData[exhibitionId]
                const gallery = galleryState.galleryData[galleryId]
                setCurrentExhibition(exhibition);
                setExhibitionData({currentExhibition: exhibition, currentGallery: gallery})
                setIsGalleryLoaded(true);
            }   
            else if (route?.params?.galleryId && exhibitionState?.exhibitionData && exhibitionState.exhibitionData[exhibitionId] 
                && galleryState.galleryData 
                && galleryState.galleryData[route?.params?.galleryId]
                ) {
                    const exhibition = exhibitionState.exhibitionData[exhibitionId]
                    setCurrentExhibition(exhibition);
                    setExhibitionData({currentExhibition: exhibitionState.exhibitionData[exhibitionId], currentGallery: galleryState.galleryData[route?.params?.galleryId]})
                    setIsGalleryLoaded(true);
            } else if (exhibitionId && galleryId){
                setExhibitionDataInState()
            } else {
                setErrorText('something went wrong, please refresh and try again')
            }
            if (currentExhibition?.exhibitionTitle?.value){
                uiDispatch({
                    type: UiETypes.setCurrentHeader,
                    currentExhibitionHeader: currentExhibition.exhibitionTitle.value!,
                  })
            }
        }
        handleExhibitionData()
    
    }, []);


    React.useEffect(() => {
        if (currentExhibition){
            uiDispatch({
                type: UiETypes.setCurrentHeader,
                currentExhibitionHeader: currentExhibition.exhibitionTitle.value!,
              })
        }
    }, [currentExhibition])


  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
        if (!exhibitionId) {
            return setRefreshing(false);
        }
        const newExhibition = await readExhibition({exhibitionId});
        exhibitionDispatch({
            type: ExhibitionETypes.saveExhibition,
            exhibitionData: newExhibition,
        })
        // dispatch({
        //     type: ETypes.setFullyLoadedExhibitions,
        //     fullyLoadedExhibitions: {[newExhibition.exhibitionId] : true},
        // })
        uiDispatch({
            type: UiETypes.setCurrentHeader,
            currentExhibitionHeader: newExhibition.exhibitionTitle.value!,
          })
        navigation.navigate(ExhibitionRootEnum.TopTab, {galleryId: newExhibition.galleryId, exhibitionId: newExhibition.exhibitionId});
    } catch {
        setRefreshing(false);
    }
        setTimeout(() => {
            setRefreshing(false);
        }, 500)  }, []);


    const [isCalendarFailure, setFailure] = React.useState<boolean>(false);
    const [isCalendarSuccess, setSuccess] = React.useState<boolean>(false);

    const saveExhibitionToCalendar = async () => {
        // add an event to the calendar using the Calendar api from expo
        const { status } = await Calendar.requestCalendarPermissionsAsync();
          if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

            const defaultCalendars = calendars.filter(
                (each) => each.source.name === 'Default',
              )
            if (defaultCalendars.length === 0 || !defaultCalendars[0].id){
                setFailure(true)
                return
            }
            try{
                await Calendar.createEventAsync(defaultCalendars[0].id, {
                    title: `${currentExhibition?.exhibitionTitle?.value} at ${galleryName}`,
                    startDate: receptionOpenFullDate as Date,
                    endDate: receptionCloseFullDate as Date,
                    location: currentExhibition?.exhibitionLocation?.locationString?.value!,
                    notes: 'Reception added to calendar by darta'
                  })
                  setSuccess(true)
            } catch(error){
                setFailure(true)
            }
        }
    }

    const alertCalendar = () => {
        if(receptionOpenFullDate <= new Date()) {
            Alert.alert(`The ${currentExhibition?.exhibitionTitle.value} is in the past`, ``, [
                {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'destructive',
                },
            ])
        } else {
        Alert.alert(`Save the reception for ${currentExhibition?.exhibitionTitle.value} to your calendar?`, ``, [
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'destructive',
            },
            {
              text: `Yes`,
              onPress: () => saveExhibitionToCalendar(),
            },
          ])
        }
    }

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
        <View style={exhibitionDetailsStyles.spinnerContainer}>
            <ActivityIndicator animating={true} size={35} color={Colors.PRIMARY_800} />
            {errorText && (<TextElement>{errorText}</TextElement>)}
        </View>
        )
        : (
        <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>
            <View style={exhibitionDetailsStyles.container}>
                <View style={exhibitionDetailsStyles.informationContainer}>
                    <View style={exhibitionDetailsStyles.informationTitleContainer}>
                        <TextElement style={globalTextStyles.sectionHeaderTitle}>
                            {currentExhibition?.exhibitionTitle?.value}
                        </TextElement>
                    </View>
                    <View style={exhibitionDetailsStyles.heroImageContainer}>
                        <Surface elevation={2} style={{backgroundColor: 'transparent'}}>
                            <FastImage 
                            source={{uri: currentExhibition?.exhibitionPrimaryImage?.value!}}
                            style={exhibitionDetailsStyles.heroImage}
                            resizeMode={FastImage.resizeMode.contain}
                            />
                        </Surface>
                    </View>
                    <View style={exhibitionDetailsStyles.subInformationContainer}>
                        <TextElement style={globalTextStyles.subHeaderTitle}>
                            {isGroupShow ? "Artists" : "Artist"}
                        </TextElement>
                        {isGroupShow ? (
                        <TextElementMultiLine style={{...globalTextStyles.subHeaderInformation}}>
                            {artistName ?? "Group Show"}
                            </TextElementMultiLine>
                        ) : (
                            <TextElement style={globalTextStyles.subHeaderInformation}>
                            {artistName ?? "Artist"}
                            </TextElement>
                        )} 
                    </View>
                    <View style={exhibitionDetailsStyles.subInformationContainer}>
                        <TextElement style={globalTextStyles.subHeaderTitle}>
                            On view from
                        </TextElement>
                        <TextElement style={globalTextStyles.subHeaderInformation}>
                            {exhibitionStartDate} {" - "} {exhibitionEndDate}
                        </TextElement>
                    </View>
                </View>
                <View style={{...exhibitionDetailsStyles.informationContainer}}>
                    <View style={exhibitionDetailsStyles.informationTitleContainer}>
                        <TextElement style={globalTextStyles.sectionHeaderTitle}>
                            Location
                        </TextElement>
                    </View>
                    <View style={{marginBottom: 24}}>
                        <DartaIconButtonWithText 
                        text={exhibitionLocation}
                        iconComponent={SVGs.BlackPinIcon}
                        onPress={() => openInMaps(currentExhibition?.exhibitionLocation?.locationString?.value!)} 
                        />
                    </View>
                    {hasReception && receptionOpenFullDate >= new Date() && (
                    <View style={{marginBottom: 24}}>
                        <DartaIconButtonWithText 
                            text={`Reception: ${receptionDateString} ${receptionTimeString}`}
                            iconComponent={SVGs.CalendarIcon}
                            onPress={() => alertCalendar()}
                        />
                    </View>
                    )}
                    <View style={{height: hp('30%'), width: wp('90%')}}>
                        <MapView  
                        customMapStyle={mapStylesJson}
                        provider={PROVIDER_GOOGLE}
                        scrollEnabled={false}
                        style={{ alignSelf: 'stretch', height: '100%'}}
                        region={mapRegion} 
                        >
                            <Marker
                            key={"12345"}
                            coordinate={{latitude: mapRegion.latitude, longitude: mapRegion.longitude}}
                            title={galleryName ?? "Gallery"}
                            description={currentExhibition?.exhibitionLocation?.locationString?.value!}
                            >
                                <SVGs.GoogleMapsPinIcon />
                            </Marker>
                        </MapView>
                    </View>
                </View>
                <View style={{...exhibitionDetailsStyles.informationContainer}}>
                    <View style={{marginBottom: 24}}>
                        <TextElement style={globalTextStyles.sectionHeaderTitle}>
                            Press Release
                        </TextElement>
                    </View>
                    <View>
                        <Text style={globalTextStyles.paragraphText}>
                        {currentExhibition?.exhibitionPressRelease?.value}
                        </Text>
                    </View>
                </View>
                {currentExhibition?.exhibitionArtistStatement?.value && (
                    <View style={{...exhibitionDetailsStyles.informationContainer}}>
                        <View style={{marginBottom: 24}}>
                            <TextElement style={globalTextStyles.sectionHeaderTitle}>
                                Artist
                            </TextElement>
                        </View>
                        <View>
                            <Text style={globalTextStyles.paragraphText}>
                            {currentExhibition?.exhibitionArtistStatement?.value}
                            </Text>
                        </View>
                    </View>
                )}
            </View>
        </ScrollView>
        )}
    </>
  );
}
