import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView, Platform, Linking, RefreshControl, PixelRatio} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { Button, Divider, Text} from 'react-native-paper';
import FastImage from 'react-native-fast-image'

import * as Colors from '@darta-styles';
import { ETypes } from '../../state/Store';
import {TextElement} from '../../components/Elements/_index';
import {customLocalDateString, customFormatTimeString, simplifyAddress} from '../../utils/functions';
import { ActivityIndicator } from 'react-native-paper';
import {readMostRecentGalleryExhibitionForUser} from '../../api/exhibitionRoutes';
import { listGalleryExhibitionPreviewForUser } from '../../api/galleryRoutes';
import {
  ExhibitionRootEnum
} from '../../typing/routes';
import {StoreContext} from '../../state/Store';
import {Exhibition, IGalleryProfileData} from '@darta-types'
import {globalTextStyles} from '../../styles/styles'
import * as Calendar from 'expo-calendar';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import { readExhibition } from '../../api/exhibitionRoutes';
import { mapStylesJson } from '../../utils/mapStylesJson';
import { readGallery } from '../../api/galleryRoutes';

const exhibitionDetailsStyles = StyleSheet.create({
    exhibitionTitleContainer: {
        width: wp('100%'),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp('3%'),
        marginBottom: hp('1%'),
    },
    container: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: Colors.PRIMARY_50,
        width: '100%',
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
        justifyContent: 'center',
        width: wp('100%'),
        height: hp('40%'),
      },
    heroImage: {
        height: hp('35%'),
        width: wp('100%'),
        resizeMode: 'contain',
        backgroundColor: 'transparent'
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
        width: '90%',
        borderWidth: 1,
        borderColor: 'black',
        height: hp('25%'),
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

  const {state, dispatch} = useContext(StoreContext);
  const [exhibitionId, setExhibitionId] = React.useState<string>("")
  const [errorText, setErrorText] = React.useState<string>("");
  const [isGalleryLoaded, setIsGalleryLoaded] = React.useState<boolean>(false);

  const [currentExhibition, setCurrentExhibition] = React.useState<Exhibition | null>(null);

  const [exhibitionStartDate, setExhibitionStartDate] = React.useState<string>(new Date().toLocaleDateString());
  const [exhibitionEndDate, setExhibitionEndDate] = React.useState<string>(new Date().toLocaleDateString());
  const [isTemporaryExhibition, setIsTemporaryExhibition] = React.useState<boolean>(false);
  
  const [receptionOpeningDay, setReceptionOpeningDay ] = React.useState<string>(new Date().toLocaleDateString())
  const [receptionCloseDay, setReceptionCloseDay ] = React.useState<string>(new Date().toLocaleDateString())
  const [isReceptionMultipleDays, setIsReceptionMultipleDays ] = React.useState<boolean>(false)
  const [hasReception, setHasReception ] = React.useState<boolean>(false)
  const [isReceptionInPast, setIsReceptionInPast ] = React.useState<boolean>(true);
  const [receptionOpenFullDate, setReceptionOpenFullDate ] = React.useState<Date>(new Date())
  const [receptionCloseFullDate, setReceptionCloseFullDate ] = React.useState<Date>(new Date())

  const [receptionDateString, setReceptionDateString] = React.useState<string>("")
  const [receptionTimeString, setReceptionTimeString] = React.useState<string>("")
  
  const [mapRegion, setMapRegion] = React.useState<any>({
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    latitude: 0, 
    longitude: 0,
  })

  const [galleryName, setGalleryName] = React.useState<string>("")

  const setExhibitionData = ({currentExhibition, currentGallery} : {currentExhibition: Exhibition, currentGallery: IGalleryProfileData}) => {
    if (currentExhibition._id){
        setExhibitionId(currentExhibition._id)
    }
    if (currentExhibition?.exhibitionDates 
        && currentExhibition.exhibitionDates?.exhibitionStartDate 
        && currentExhibition.exhibitionDates?.exhibitionEndDate
        && currentExhibition.exhibitionDates?.exhibitionDuration
        && currentExhibition.exhibitionDates?.exhibitionStartDate.value
        && currentExhibition.exhibitionDates?.exhibitionEndDate.value
        && currentExhibition.exhibitionDates?.exhibitionDuration.value 
        ) {
        setExhibitionStartDate(customLocalDateString(new Date(currentExhibition.exhibitionDates.exhibitionStartDate.value)));
        setExhibitionEndDate(customLocalDateString(new Date(currentExhibition?.exhibitionDates.exhibitionEndDate.value)));
        setIsTemporaryExhibition(currentExhibition.exhibitionDates.exhibitionDuration.value === "Temporary");
      }
    

    if (currentExhibition?.receptionDates 
        && currentExhibition.receptionDates?.receptionStartTime
        && currentExhibition.receptionDates?.receptionEndTime
        && currentExhibition.receptionDates?.hasReception
        && currentExhibition.receptionDates.receptionStartTime.value
        && currentExhibition.receptionDates.receptionEndTime.value){
            const receptionStartDay = customLocalDateString(new Date(currentExhibition.receptionDates.receptionEndTime.value))
            const receptionEndDay = customLocalDateString(new Date(currentExhibition.receptionDates.receptionEndTime.value))

            setReceptionOpeningDay(receptionStartDay)
            setReceptionCloseDay(receptionEndDay)
            setIsReceptionMultipleDays(receptionCloseDay !== receptionOpeningDay);
            const receptionInPast = new Date(currentExhibition.receptionDates.receptionEndTime.value) > new Date()
            setIsReceptionInPast(receptionInPast)
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
    const startDate = currentExhibition.exhibitionDates.exhibitionStartDate.value && customLocalDateString(new Date(currentExhibition.exhibitionDates.exhibitionStartDate.value))
    const endDate = currentExhibition?.exhibitionDates.exhibitionEndDate.value && customLocalDateString(new Date(currentExhibition?.exhibitionDates.exhibitionEndDate.value))

    const shareString1 = `Check out this show: ${currentExhibition.exhibitionTitle.value} at ${currentGallery.galleryName.value}. `
    const shareString2 = `It's on display ${startDate} - ${endDate} at ${simplifyAddress(currentExhibition?.exhibitionLocation?.locationString?.value)}`
    const shareURLMessage = startDate && endDate ? shareString1 + shareString2 : shareString1

    const shareURL = `https://darta.art/exhibition?exhibitionId=${currentExhibition._id}&galleryId=${currentGallery._id}`
    dispatch({
        type: ETypes.setExhibitionShareURL,
        exhibitionShareDetails: {shareURL, shareURLMessage},
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
            dispatch({
                type: ETypes.saveGallery,
                galleryData: galleryData,
            })
            dispatch({
                type: ETypes.setCurrentHeader,
                currentExhibitionHeader: exhibition.exhibitionTitle.value!,
              })
            dispatch({
                type: ETypes.saveExhibition,
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
            state?.exhibitionData &&
            state?.galleryData &&
            state.exhibitionData[exhibitionId] &&
            state.galleryData[galleryId]){
                const exhibition = state.exhibitionData[exhibitionId]
                const gallery = state.galleryData[galleryId]
                setCurrentExhibition(exhibition);
                setExhibitionData({currentExhibition: exhibition, currentGallery: gallery})
                setIsGalleryLoaded(true);
            }   
            else if (route?.params?.galleryId && state?.exhibitionData && state.exhibitionData[exhibitionId] 
                && state.galleryData 
                && state.galleryData[route?.params?.galleryId]
                ) {
                    const exhibition = state.exhibitionData[exhibitionId]
                    setCurrentExhibition(exhibition);
                    setExhibitionData({currentExhibition: state.exhibitionData[exhibitionId], currentGallery: state.galleryData[route?.params?.galleryId]})
                    setIsGalleryLoaded(true);
            } else if (exhibitionId && galleryId){
                setExhibitionDataInState()
            } else {
                setErrorText('something went wrong, please refresh and try again')
            }
            if (currentExhibition?.exhibitionTitle?.value){
                dispatch({
                    type: ETypes.setCurrentHeader,
                    currentExhibitionHeader: currentExhibition.exhibitionTitle.value!
                })
            }
        }
        handleExhibitionData()
    
    }, []);


    React.useEffect(() => {
        if (currentExhibition){
            dispatch({
                type: ETypes.setCurrentHeader,
                currentExhibitionHeader: currentExhibition.exhibitionTitle.value!
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
        dispatch({
            type: ETypes.saveExhibition,
            exhibitionData: newExhibition,
        })
        dispatch({
            type: ETypes.setFullyLoadedExhibitions,
            fullyLoadedExhibitions: {[newExhibition.exhibitionId] : true},
        })
        dispatch({
            type: ETypes.setCurrentHeader,
            currentExhibitionHeader: newExhibition.exhibitionTitle.value!
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
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>
        <View style={exhibitionDetailsStyles.container}>
            <View>
                <View style={exhibitionDetailsStyles.exhibitionTitleContainer}>
                    <TextElement style={{...globalTextStyles.boldTitleText, fontSize: 22}}>
                        {currentExhibition?.exhibitionTitle?.value}
                    </TextElement>
                </View>
                <View style={exhibitionDetailsStyles.heroImageContainer}>
                    <FastImage 
                    source={{uri: currentExhibition?.exhibitionPrimaryImage?.value!}}
                    style={exhibitionDetailsStyles.heroImage}
                    resizeMode={FastImage.resizeMode.contain}
                    />
                </View>
            </View>
        <View style={{...exhibitionDetailsStyles.textContainer, height: hasReception && isReceptionInPast ? hp('100%') : hp('80%')}}>
            <View>
                <TextElement style={exhibitionDetailsStyles.descriptionText}>Artist</TextElement>
                <Divider style={exhibitionDetailsStyles.divider}/>
                <TextElement style={{...globalTextStyles.italicTitleText, fontSize: 20, marginTop: hp('1%')}}>
                    {currentExhibition?.exhibitionArtist?.value ?? "Group Show"}
                </TextElement>
            </View>
            <View>
            {isTemporaryExhibition ? (
            <View>
            <TextElement style={exhibitionDetailsStyles.descriptionText}>On View</TextElement>
            <Divider style={exhibitionDetailsStyles.divider}/>
            <TextElement style={{...globalTextStyles.centeredText, fontSize: 18, marginTop: hp('1%')}}>
                {exhibitionStartDate} {" - "} {exhibitionEndDate}
            </TextElement>
            </View>
            )
            :
            (
            <TextElement style={{...globalTextStyles.centeredText}}>Ongoing</TextElement>
            )
            }
            </View>
            <View>
            <TextElement style={exhibitionDetailsStyles.descriptionText}>
                Location
            </TextElement>
            <Divider style={exhibitionDetailsStyles.divider}/>
                <TextElement ></TextElement>
                <Button
                icon={"map"}
                labelStyle={{color: Colors.PRIMARY_950}}
                mode="text"
                onPress={() => openInMaps(currentExhibition?.exhibitionLocation?.locationString?.value!)}
                >                
                <TextElement style={{...globalTextStyles.centeredText, fontSize: 18, marginTop: hp('1%'), textDecorationLine: 'underline'}}>{simplifyAddress(currentExhibition?.exhibitionLocation?.locationString?.value)}</TextElement>
                </Button>
            </View>
            <View style={exhibitionDetailsStyles.mapContainer}>
                <MapView  
                customMapStyle={mapStylesJson}
                provider={PROVIDER_GOOGLE}
                style={{ alignSelf: 'stretch', height: '100%', width: '100%'}}
                region={mapRegion} 
                >
                    <Marker
                    key={"12345"}
                    coordinate={{latitude: mapRegion.latitude, longitude: mapRegion.longitude}}
                    title={galleryName ?? "Gallery"}
                    description={currentExhibition?.exhibitionLocation?.locationString?.value!}
                    />
                </MapView>
            </View>
            <View style={{margin: hp('2%')}}>
            {hasReception && isReceptionInPast && (
                <>
                <View>
                    <TextElement style={exhibitionDetailsStyles.descriptionText}>
                        Reception
                    </TextElement>
                    <Divider style={exhibitionDetailsStyles.divider}/>
                    <TextElement style={{...globalTextStyles.centeredText, fontSize: 20, marginTop: hp('1%')}}>
                        {receptionDateString}
                    </TextElement>
                    <TextElement style={{...globalTextStyles.centeredText, fontSize: 20}}>
                        {receptionTimeString}
                    </TextElement>
                </View>
                {!isReceptionInPast && (
                    <Button 
                    icon={!isCalendarSuccess ? "calendar" : ""}
                    textColor={Colors.PRIMARY_900}
                    mode="text"
                    disabled={isCalendarSuccess}
                    compact={true}
                    labelStyle={{color: Colors.PRIMARY_950}}
                    onPress={() => saveExhibitionToCalendar()}
                    >   
                        {!isCalendarSuccess ?
                        (
                            <TextElement style={{...globalTextStyles.centeredText, textDecorationLine: 'underline'}}>Add Reception to Calendar</TextElement>
                        )
                        :
                        (
                            <TextElement style={{...globalTextStyles.centeredText, textDecorationLine: 'underline' }}>Added to Calendar</TextElement>
                        )
                        }
                    </Button>
                )}
                </>
            )}

            {isCalendarFailure && (
            <TextElement sx={{color: Colors.PRIMARY_900}}>error occurred adding event</TextElement>
            )}
        </View>
        </View>
            {currentExhibition?.exhibitionPressRelease?.value && (
                <View style={exhibitionDetailsStyles.pressReleaseContainer}>
                    <TextElement style={exhibitionDetailsStyles.descriptionText}>
                        Press Release
                    </TextElement>
                    <Divider style={exhibitionDetailsStyles.divider}/>
                    <Text style={{...globalTextStyles.baseText, fontSize: 15, color: Colors.PRIMARY_950, marginTop: hp('1%')}}>
                        {currentExhibition?.exhibitionPressRelease?.value}
                    </Text>
                </View>
            )}
            {currentExhibition?.exhibitionArtistStatement?.value && (
                <View style={exhibitionDetailsStyles.pressReleaseContainer}>
                    <TextElement style={exhibitionDetailsStyles.descriptionText}>
                        Artist Statement
                    </TextElement>
                    <Divider style={exhibitionDetailsStyles.divider}/>
                    <Text style={{...globalTextStyles.baseText, fontSize: 15, color: Colors.PRIMARY_950, marginTop: hp('1%')}}>
                        {currentExhibition?.exhibitionArtistStatement?.value}
                    </Text>
                </View>
            )}
        </View>
        </ScrollView>
        )}
    </>
  );
}
