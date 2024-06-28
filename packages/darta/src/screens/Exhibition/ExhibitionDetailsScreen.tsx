import React from 'react';
import {View, StyleSheet, ScrollView, Platform, Linking, RefreshControl, Text, Alert, Animated, TouchableOpacity } from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { format } from 'date-fns';
// import FastImage from 'react-native-fast-image'

import * as Colors from '@darta-styles';
import { UIStoreContext, UiETypes, GalleryStoreContext, GalleryETypes, ExhibitionStoreContext, ExhibitionETypes, StoreContext, ETypes} from '../../state';
import {TextElement} from '../../components/Elements/_index';
import {customFormatTimeString, customLocalDateStringStart, customLocalDateStringEnd} from '../../utils/functions';
import * as Calendar from 'expo-calendar';
import { ActivityIndicator, Surface } from 'react-native-paper';
import { listGalleryExhibitionPreviewForUser } from '../../api/galleryRoutes';
import {
  ExhibitionRootEnum
} from '../../typing/routes';
import {Exhibition, IGalleryProfileData, USER_EXHIBITION_RATINGS} from '@darta-types'
import {globalTextStyles} from '../../styles/styles'
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import { readExhibition, setUserViewedExhibition, addExhibitionToUserSaved, removeExhibitionFromUserSaved, dartaUserExhibitionRating } from '../../api/exhibitionRoutes';
import { readGallery } from '../../api/galleryRoutes';
import { TextElementMultiLine } from '../../components/Elements/TextElement';
import { DartaIconButtonWithText } from '../../components/Darta/DartaIconButtonWithText';
import * as SVGs from '../../assets/SVGs';
import { DartaImageComponent } from '../../components/Images/DartaImageComponent';
import GalleryLocation from '../../components/Gallery/GalleryLocation';
import * as Haptics from 'expo-haptics';


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
    pressableStyle: {
        width: 250,
        height: 38,
        backgroundColor: Colors.PRIMARY_950,
        borderRadius: 20,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4,
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
  const {dispatch} = React.useContext(StoreContext);
  const [exhibitionId, setExhibitionId] = React.useState<string>("")
  const [galleryId, setGalleryId] = React.useState<string | undefined>("")
  const [errorText, setErrorText] = React.useState<string>("");
  const [isGalleryLoaded, setIsGalleryLoaded] = React.useState<boolean>(false);

  const [currentExhibition, setCurrentExhibition] = React.useState<Exhibition | null>(null);

  const [exhibitionStartDate, setExhibitionStartDate] = React.useState<string>(new Date().toLocaleDateString());
  const [exhibitionEndDate, setExhibitionEndDate] = React.useState<string>(new Date().toLocaleDateString());
  
  const [receptionOpeningDay, setReceptionOpeningDay ] = React.useState<string>(new Date().toLocaleDateString())
  const [receptionCloseDay, setReceptionCloseDay ] = React.useState<string>(new Date().toLocaleDateString())
  const [isReceptionMultipleDays, setIsReceptionMultipleDays ] = React.useState<boolean>(false)
  const [hasReception, setHasReception ] = React.useState<boolean>(false)
  const [receptionOpenFullDate, setReceptionOpenFullDate ] = React.useState<Date>(new Date())

  const [receptionDateString, setReceptionDateString] = React.useState<string>("")
  const [receptionTimeString, setReceptionTimeString] = React.useState<string>("")
  
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
            setHasReception(currentExhibition.receptionDates.hasReception.value === "Yes");
            setReceptionOpenFullDate(new Date(currentExhibition.receptionDates.receptionStartTime.value));

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

 const setViewedInDB = async ({exhibitionId} : {exhibitionId: string}): Promise<void> => {
    if (exhibitionId){
            if (exhibitionState?.userViewedExhibition && !exhibitionState.userViewedExhibition[exhibitionId]){         
                const setSuccessfully = await setUserViewedExhibition({exhibitionId})
                if (setSuccessfully){
                    exhibitionDispatch({
                        type: ExhibitionETypes.setUserViewedExhibition,
                        userViewedExhibitionId: exhibitionId,
                        galleryId,
                    })
                }
            }
        }
    }

  React.useEffect(() => {
    
    async function handleExhibitionData() {
        let galleryId = ""
        let exhibitionId = ""
        if (route?.params?.exhibitionId){
            exhibitionId = route.params.exhibitionId
          }
        if (route?.params?.galleryId){
            galleryId = route.params.galleryId
            setGalleryId(galleryId)
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
                setViewedInDB({exhibitionId})
            }   
            else if (route?.params?.galleryId && exhibitionState?.exhibitionData && exhibitionState.exhibitionData[exhibitionId] 
                && galleryState.galleryData 
                && galleryState.galleryData[route?.params?.galleryId]
                ) {
                    const exhibition = exhibitionState.exhibitionData[exhibitionId]
                    setCurrentExhibition(exhibition);
                    setExhibitionData({currentExhibition: exhibitionState.exhibitionData[exhibitionId], currentGallery: galleryState.galleryData[route?.params?.galleryId]})
                    setIsGalleryLoaded(true);
                    setViewedInDB({exhibitionId})
            } else if (exhibitionId && galleryId){
                setExhibitionDataInState()
                setViewedInDB({exhibitionId})
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

  const onRefresh = async () => {
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
        }, 500)  
    }


    // const [isCalendarFailure, setFailure] = React.useState<boolean>(false);

    const saveExhibitionToCalendar = async () => {
        try {
            // Request calendar permissions
            const { status } = await Calendar.requestCalendarPermissionsAsync();
            if (status === 'granted') {
              // Get all calendars
              const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
        
              let targetCalendar: Calendar.Calendar | undefined;
        
              if (Platform.OS === 'ios') {
                // Find the default calendar on iOS
                targetCalendar = calendars.find(calendar => calendar.source.name === 'Default');
              } else {
                // Find the first available calendar on Android
                targetCalendar = calendars.find(calendar => calendar.allowsModifications);
              }
        
              if (targetCalendar) {
                // Create a new calendar event
                const eventId = await Calendar.createEventAsync(targetCalendar.id, {
                title: `${currentExhibition?.exhibitionTitle?.value} at ${galleryName}`,
                // startDate: receptionOpenFullDate as Date,
                // endDate: receptionCloseFullDate as Date,
                location: currentExhibition?.exhibitionLocation?.locationString?.value!,
                  alarms: [
                    {
                      relativeOffset: -60, // Remind 15 minutes before the event starts
                    },
                  ],
                });
        
                // console.log(`Event created with ID: ${eventId}`);
                // Show a success message to the user or perform any other action
              } else {
                // console.log('No suitable calendar found');
                // Handle the case when no suitable calendar is found
              }
            }
          } catch (error) {
            // console.log('Error adding event to calendar:', error);
            // Handle the error appropriately (e.g., show an error message to the user)
          }
        console.log('!')
    }

    const openCalendar = async () => {
        try {
          const title = currentExhibition?.exhibitionTitle?.value;
          const location = currentExhibition?.exhibitionLocation?.locationString?.value;
          const startDate = new Date(currentExhibition?.exhibitionDates.exhibitionStartDate.value!);
          const endDate = new Date(currentExhibition?.exhibitionDates.exhibitionEndDate.value!);
      
          if (!title || !location || !startDate || !endDate) {
            // console.log('Error: Missing event details');
            return;
          }
      
          const eventData = {
            title,
            location,
            startDate,
            endDate,
          };
      
        //   console.log('Event Data:', eventData);
      
          // Request permission to access the calendar
          const { status } = await Calendar.requestCalendarPermissionsAsync();
      
          if (status === 'granted') {
            // Create a new calendar event
            const event = {
              title: eventData.title,
              startDate: eventData.startDate,
              endDate: eventData.endDate,
              location: eventData.location,
            };
      
            // Save the event to the default calendar
            const eventId = await Calendar.createEventAsync('DEFAULT', event);
      
            // console.log('Event created with ID:', eventId);
      
            // Open the Calendar app to the newly created event
            Calendar.openEventInCalendar(eventId);
          } else {
            // console.log('Calendar permission not granted');
            // Handle the case when calendar permission is not granted
            Alert.alert('Calendar Permission', 'Please grant permission to access the calendar.');
          }
        } catch (error) {
        //   console.log('Error creating calendar event:', error);
          // Handle the error appropriately (e.g., show an error message to the user)
        }
      };
    // const alertCalendar = () => {
    //     if(receptionOpenFullDate <= new Date()) {
    //         Alert.alert(`The ${currentExhibition?.exhibitionTitle.value} is in the past`, ``, [
    //             {
    //                 text: 'Cancel',
    //                 onPress: () => {},
    //                 style: 'destructive',
    //             },
    //         ])
    //     } else {
    //     Alert.alert(`Save the reception for ${currentExhibition?.exhibitionTitle.value} to your calendar?`, ``, [
    //         {
    //           text: 'Cancel',
    //           onPress: () => {},
    //           style: 'destructive',
    //         },
    //         {
    //           text: `Yes`,
    //           onPress: () => saveExhibitionToCalendar(),
    //         },
    //       ])
    //     }
    // }

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

    
    const [addedExhibition, setAddedExhibition] = React.useState<boolean>(false);
    const isOpenExhibition = currentExhibition?.exhibitionDates?.exhibitionEndDate.value && new Date(currentExhibition?.exhibitionDates?.exhibitionEndDate.value) >= new Date();
    const [isSetOneVisible, setIsSetOneVisible] = React.useState(true);
    const [loadingFollow, setLoadingFollow] = React.useState(false);


    const opacitySetOne = React.useRef(new Animated.Value(1)).current; 
    const opacitySetTwo = React.useRef(new Animated.Value(0)).current;
    const translateX = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        opacitySetOne.addListener(() => {return})
        opacitySetTwo.addListener(() => {return})
        translateX.addListener(() => {return})
        setAddedExhibition(exhibitionState.userSavedExhibitions[exhibitionId])
    }, [])

    React.useEffect(() =>{
        if (exhibitionState.userSavedExhibitions && exhibitionState.userSavedExhibitions[exhibitionId]){
            setAddedExhibition(true)
        } else {
            setAddedExhibition(false)
        }
      }, [exhibitionId, exhibitionState.userSavedExhibitions])

    React.useEffect(() => {
        toggleButtons()
      }, [addedExhibition])

    opacitySetOne.removeAllListeners();
    opacitySetTwo.removeAllListeners();
    translateX.removeAllListeners();

    const toggleButtons = () => {
        Animated.parallel([
        Animated.timing(opacitySetOne, {
            toValue: addedExhibition ? 0 : 1,
            duration: 400,
            useNativeDriver: true,
        }),
        Animated.timing(opacitySetTwo, {
            toValue: addedExhibition ? 1 : 0,
            duration: 400,
            useNativeDriver: true,
        }),
        Animated.timing(translateX, {
            toValue: addedExhibition ? 100 : 0,
            duration: 400,
            useNativeDriver: true,
        }),
        ]).start(() => {
        setIsSetOneVisible(!isSetOneVisible);
        });
    };

    const addExhibitionToList = async () => {
        try{
            setLoadingFollow(true)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            await addExhibitionToUserSaved({exhibitionId})
            exhibitionDispatch({
                type: ExhibitionETypes.saveUserSavedExhibitions,
                exhibitionIds: [exhibitionId],
            })
            dispatch({
                type: ETypes.addExhibitionToSavedExhibitions,
                locationId: currentExhibition?.exhibitionLocation.googleMapsPlaceId?.value!,
            })
            toggleButtons();
            setAddedExhibition(true)
            setLoadingFollow(false)
          
        } catch(e) {
          // console.log('error', e)
          // throw new Error("Something went wrong, please try again")
          setLoadingFollow(false)
        }
    }

    const userViewedExhibitionAlert = () => {
        if (currentExhibition?.exhibitionTitle?.value){
            Alert.alert(`Did you go to ${currentExhibition?.exhibitionTitle?.value}?`, `Letting us know will improve your recommended exhibitions`, [
                {
                    text: 'Yes',
                    onPress: () => {rateExhibitionAlert()},
                    style: 'default',
                },
                {
                    text: 'No',
                    onPress: () => {removeExhibitionFromList()},
                    style: 'default',
                },
            ])
        }
    } 


    const rateExhibitionAlert = () => {
        if (currentExhibition?.exhibitionTitle?.value){
            Alert.alert(`How would you rate this exhibition?`, `Letting us know will improve your recommended exhibitions`, [
                {
                    text: 'Loved It',
                    onPress: () => {removeExhibitionFromList(USER_EXHIBITION_RATINGS.LOVED)},
                    style: 'default',
                },
                {
                    text: 'Liked It',
                    onPress: () => {removeExhibitionFromList(USER_EXHIBITION_RATINGS.LIKE)},
                    style: 'default',
                },
                {
                    text: 'Disliked It',
                    onPress: () => {removeExhibitionFromList(USER_EXHIBITION_RATINGS.DISLIKE)},
                    style: 'default',
                },
                {
                    text: 'Hated It',
                    onPress: () => {removeExhibitionFromList(USER_EXHIBITION_RATINGS.HATED)},
                    style: 'default',
                },
                {
                    text: 'No Opinion',
                    onPress: () => {removeExhibitionFromList(USER_EXHIBITION_RATINGS.UNRATED)},
                    style: 'destructive',
                },
            ])
        }
    } 
    
    const removeExhibitionFromList = async (rating?: string) => { 
        try{
            setLoadingFollow(true)
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            await removeExhibitionFromUserSaved({exhibitionId})
            if (rating){
                await dartaUserExhibitionRating({exhibitionId, rating})
                exhibitionDispatch({
                    type: ExhibitionETypes.setUserViewedExhibition,
                    userViewedExhibitionId: exhibitionId,
                    galleryId,
                })
            }
            exhibitionDispatch({
                type: ExhibitionETypes.removeUserSavedExhibitions,
                exhibitionIds: [exhibitionId],
            })
            dispatch({
                type: ETypes.removeExhibitionFromSavedExhibitions,
                locationId: currentExhibition?.exhibitionLocation.googleMapsPlaceId?.value!,
            })
            toggleButtons();
            setAddedExhibition(false)
            setLoadingFollow(false)
        } catch {
            // throw new Error("Something went wrong, please try again")
            setLoadingFollow(false)
        }
    }


    const dynamicStyles = StyleSheet.create({
        followContainer: {
            height: isOpenExhibition? 38 : 0 ,
            marginBottom: 24,
            width: 160,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
          },
    });


  return (
    <>
        {!isGalleryLoaded ? ( 
        <View style={exhibitionDetailsStyles.spinnerContainer}>
            <ActivityIndicator size={35} color={Colors.PRIMARY_800} />
            {errorText && (<TextElement>{errorText}</TextElement>)}
        </View>
        )
        : (
        <ScrollView  refreshControl={<RefreshControl refreshing={refreshing} tintColor={Colors.PRIMARY_600} onRefresh={onRefresh} />}>
            <View style={exhibitionDetailsStyles.container}>
                <View style={exhibitionDetailsStyles.informationContainer}>
                    <View style={dynamicStyles.followContainer}>
                        {!addedExhibition && isOpenExhibition && (
                            <Animated.View style={{opacity: opacitySetOne, transform: [{ translateX: translateX }] }}>
                                <TouchableOpacity style={{...exhibitionDetailsStyles.pressableStyle, backgroundColor: Colors.PRIMARY_50, borderColor: Colors.PRIMARY_500, borderWidth: 1}} onPress={() => addExhibitionToList()}>
                                    <View style={{width: 30}}>
                                    {loadingFollow && <ActivityIndicator size={20} color={Colors.PRIMARY_950} />}
                                    {!loadingFollow && <SVGs.NewMapPinSmall />}
                                    </View>
                                    <View style={{width: 170}}>
                                    <TextElement style={{...globalTextStyles.boldTitleText, color: Colors.PRIMARY_950}}>Add To My List</TextElement>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                            )}
                        {addedExhibition && isOpenExhibition && (
                            <Animated.View style={{opacity: opacitySetTwo, transform: [{ translateX: Animated.subtract(100, translateX) }]}}>
                                <TouchableOpacity style={exhibitionDetailsStyles.pressableStyle} onPress={() => userViewedExhibitionAlert()}>
                                    <View style={{width: 30}}>
                                    {loadingFollow && <ActivityIndicator size={20} color={Colors.PRIMARY_50} />}
                                    {!loadingFollow && <SVGs.NewMapPinSmallWhite />}
                                    </View>
                                    <View style={{width: 170}}>
                                    <TextElement style={{...globalTextStyles.boldTitleText, color: Colors.PRIMARY_50}}>Remove From My List</TextElement>
                                    </View>
                                </TouchableOpacity>
                            </Animated.View>
                        )} 
                    </View>
                    <View style={exhibitionDetailsStyles.informationTitleContainer}>
                        <TextElement style={globalTextStyles.sectionHeaderTitle}>
                            {currentExhibition?.exhibitionTitle?.value}
                        </TextElement>
                    </View>
                    <View style={exhibitionDetailsStyles.heroImageContainer}>
                        <Surface elevation={2} style={{backgroundColor: 'transparent'}}>
                            <DartaImageComponent 
                            uri={currentExhibition?.exhibitionPrimaryImage ?? null}
                            priority="normal"
                            style={exhibitionDetailsStyles.heroImage}
                            size={"largeImage"}
                            />
                        </Surface>
                    </View>
                    {artistName && (
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
                    )}
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
                    {hasReception && receptionOpenFullDate >= new Date() && (
                        <View style={{marginBottom: 12}}>
                            <DartaIconButtonWithText 
                                text={`Reception: ${receptionDateString} ${receptionTimeString}`}
                                iconComponent={SVGs.CalendarIcon}
                                onPress={() => () => {}}
                            />
                        </View>
                    )}
                        <GalleryLocation
                            galleryLocationData={currentExhibition?.exhibitionLocation!}
                            key={currentExhibition?.exhibitionLocation.googleMapsPlaceId?.value!}
                            galleryName={galleryName}
                            openInMaps={openInMaps}
                        />
                    {/* <View style={{marginBottom: 24}}>
                        <DartaIconButtonWithText 
                        text={exhibitionLocation}
                        iconComponent={SVGs.BlackPinIcon}
                        onPress={() => openInMaps(currentExhibition?.exhibitionLocation?.locationString?.value!)} 
                        />
                    </View> */}
                    {/* 
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
                    </View> */}
                </View>
                {/* TO-DO: Fix */}
                {/* <View style={exhibitionDetailsStyles.informationContainer}>
                    <TextElement style={globalTextStyles.sectionHeaderTitle}>
                        Add to Calendar
                    </TextElement>
                    <View style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 12}}>
                    {hasReception && receptionOpenFullDate >= new Date() && (
                        <View style={{marginBottom: 12}}>
                            <DartaIconButtonWithText 
                                text={`Add Reception: ${receptionDateString} ${receptionTimeString}`}
                                iconComponent={SVGs.CalendarIcon}
                                onPress={() => () => {}}
                            />
                        </View>
                        )}
                        <View style={{marginBottom: 12, marginTop: 12}}>
                            <DartaIconButtonWithText 
                                text={`Create Calendar Event`}
                                iconComponent={SVGs.CalendarIcon}
                                onPress={openCalendar}
                            />
                        </View>
                    </View>
                </View> */}
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
