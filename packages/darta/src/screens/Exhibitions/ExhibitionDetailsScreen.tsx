import {StackNavigationProp} from '@react-navigation/stack';
import React, {useContext} from 'react';
import {View, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import { Button, Divider, Text} from 'react-native-paper';

import {PRIMARY_600, PRIMARY_50, MILK, PRIMARY_950, PRIMARY_900, PRIMARY_800} from '@darta-styles';
import { ETypes } from '../../state/Store';
import {TextElement} from '../../components/Elements/_index';
import {customLocalDateString, customFormatTimeString} from '../../utils/functions';
import {
  ExhibitionNavigatorParamList,
  ExhibitionRootEnum
} from '../../typing/routes';
import {StoreContext} from '../../state/Store';
import {Exhibition, IGalleryProfileData} from '@darta-types'
import { Image } from 'react-native-elements';
import {globalTextStyles} from '../../styles/styles'
import * as Calendar from 'expo-calendar';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionStackParamList } from '../../navigation/ExhibitionTopTabNavigator';
import { readExhibition } from '../../api/exhibitionRoutes';


type ExhibitionDetailsScreenNavigationProp = StackNavigationProp<
ExhibitionNavigatorParamList,
ExhibitionRootEnum.exhibitionDetails
>;

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
        backgroundColor: PRIMARY_50,
        width: '100%',
        // height: hp('100%'),

    },
    heroImageContainer: {
        alignSelf: 'center',
        justifyContent: 'center',
        width: wp('90%'),
        height: hp('30%'),
      },
    heroImage: {
        maxHeight: hp('30%'),
        height: hp('25%'),
        width: wp('90%'),
        resizeMode: 'contain',
    },
    textContainer: {
        height: hp('25%'),
        width: wp('90%'),
        display: 'flex',
        gap: wp('10%'),
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    openingContainer: {
        height: hp('10%'),
        width: wp('90%'),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    }, 
    divider: {
        width: wp('20%'),
        alignSelf: 'center',
        color: PRIMARY_950
    },
    descriptionText: {
        ...globalTextStyles.centeredText,
        fontSize: 12,
        color: PRIMARY_950
    },
    mapContainer: {
        width: '80%',
        borderWidth: 1,
        borderColor: 'black',
        height: hp('30%'),
        display: 'flex',
        margin: wp('5%'),
        justifyContent: 'center',
        alignItems: 'center',
    },
    pressReleaseContainer: {
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
  let exhibitionId = "";
  let galleryId = "";
  if (route?.params?.exhibitionId && route?.params?.galleryId){
    exhibitionId = route.params.exhibitionId;
    galleryId = route.params.galleryId;
  } else{
    return (
        <View style={exhibitionDetailsStyles.container}>
            <TextElement>hey something went wrong, please refresh and try again</TextElement>
        </View>
    )
  }
  
  let currentExhibition: Exhibition = {} as Exhibition;
  let currentGallery: IGalleryProfileData = {} as IGalleryProfileData;
  if (state?.exhibitionData && state.exhibitionData[exhibitionId] && state.galleryData && state.galleryData[galleryId]) {
    currentExhibition = state.exhibitionData[exhibitionId];
    currentGallery = state.galleryData[galleryId];
  }

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try{
        const newExhibition = await readExhibition({exhibitionId: exhibitionId});
        dispatch({
            type: ETypes.saveExhibition,
            exhibitionData: newExhibition,
        })
        navigation.navigate(ExhibitionRootEnum.TopTab, {galleryId: newExhibition.galleryId, exhibitionId: newExhibition.exhibitionId});
    } catch {
        setRefreshing(false);
    }
    setTimeout(() => {
        setRefreshing(false);
      }, 500)  }, []);

  let exhibitionStartDate = new Date().toLocaleDateString();
  let exhibitionEndDate = new Date().toLocaleDateString();
  let isTemporaryExhibition = false;
  if (currentExhibition?.exhibitionDates 
    && currentExhibition.exhibitionDates?.exhibitionStartDate 
    && currentExhibition.exhibitionDates?.exhibitionEndDate
    && currentExhibition.exhibitionDates?.exhibitionDuration
    && currentExhibition.exhibitionDates?.exhibitionStartDate.value
    && currentExhibition.exhibitionDates?.exhibitionEndDate.value
    && currentExhibition.exhibitionDates?.exhibitionDuration.value 
    ) {
    exhibitionStartDate = customLocalDateString(new Date(currentExhibition.exhibitionDates.exhibitionStartDate.value));
    exhibitionEndDate = customLocalDateString(new Date(currentExhibition?.exhibitionDates.exhibitionEndDate.value));
    isTemporaryExhibition = currentExhibition.exhibitionDates.exhibitionDuration.value === "Temporary";
  }

  let receptionStartTime: string = new Date().toLocaleDateString()
  let receptionEndTime: string = new Date().toLocaleDateString()
  let receptionOpeningDay: string = new Date().toLocaleDateString()
  let receptionCloseDay: string = new Date().toLocaleDateString()
  let isReceptionMultipleDays: boolean = false;
  let hasReception: boolean = false
  let isReceptionInPast: boolean = true;
  let receptionOpenFullDate = new Date()
  let receptionCloseFullDate = new Date()

  if (currentExhibition?.receptionDates 
    && currentExhibition.receptionDates?.receptionStartTime
    && currentExhibition.receptionDates?.receptionEndTime
    && currentExhibition.receptionDates?.hasReception
    && currentExhibition.receptionDates.receptionStartTime.value
    && currentExhibition.receptionDates.receptionEndTime.value){
        receptionStartTime = customFormatTimeString(new Date(currentExhibition.receptionDates.receptionStartTime.value));
        receptionEndTime = customFormatTimeString(new Date(currentExhibition.receptionDates.receptionEndTime.value));
        receptionOpeningDay = customLocalDateString(new Date(currentExhibition.receptionDates.receptionEndTime.value));
        receptionCloseDay = customLocalDateString(
            new Date(currentExhibition.receptionDates.receptionEndTime.value)
        );
        isReceptionMultipleDays = receptionCloseDay !== receptionOpeningDay;
        isReceptionInPast = new Date(currentExhibition.receptionDates.receptionEndTime.value) < new Date();
        hasReception = currentExhibition.receptionDates.hasReception.value === "Yes";
        receptionOpenFullDate = new Date(currentExhibition.receptionDates.receptionStartTime.value);
        receptionCloseFullDate = new Date(currentExhibition.receptionDates.receptionEndTime.value);
    }

    let receptionDateString: string = ""
    let receptionTimeString: string = ""

    if(isReceptionMultipleDays){
        receptionDateString = `${receptionOpeningDay} - ${receptionCloseDay}`
        receptionTimeString = `${receptionStartTime} - ${receptionEndTime}`
    } else{
        receptionDateString = receptionOpeningDay
        receptionTimeString = `${receptionStartTime} - ${receptionEndTime}`
    }


    const mapRegion = {
        latitudeDelta: 0.02,
        longitudeDelta: 0.0421,
        latitude: 0, 
        longitude: 0,
    }
    let hasCoordinates = false;

    if (currentExhibition?.exhibitionLocation?.coordinates) {
        hasCoordinates = true;
        mapRegion.latitude = currentExhibition.exhibitionLocation.coordinates.latitude.value! as unknown as number;
        mapRegion.longitude = currentExhibition.exhibitionLocation.coordinates.longitude.value! as unknown as number;
    }

    let galleryName: any;
    if (currentGallery.galleryName){
        galleryName = currentGallery.galleryName.value;
    }

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

  return (
    <ScrollView refreshControl={
        <RefreshControl refreshing={refreshing} tintColor={PRIMARY_600} onRefresh={onRefresh} />}
    >
        <View style={exhibitionDetailsStyles.container}>
            <View style={exhibitionDetailsStyles.exhibitionTitleContainer}>
                <TextElement style={{...globalTextStyles.boldTitleText, fontSize: 20}}>
                    {currentExhibition?.exhibitionTitle?.value}
                </TextElement>
            </View>
        <View style={exhibitionDetailsStyles.heroImageContainer}>
            <Image 
            source={{uri: currentExhibition?.exhibitionPrimaryImage?.value!}}
            style={exhibitionDetailsStyles.heroImage}
            />
            </View>
            <View style={exhibitionDetailsStyles.textContainer}>

                <View>
                <TextElement style={exhibitionDetailsStyles.descriptionText}>Artist</TextElement>
                <Divider style={exhibitionDetailsStyles.divider}/>
                <TextElement style={{...globalTextStyles.italicTitleText, fontSize: 15}}>
                    {currentExhibition?.exhibitionArtist?.value ?? "Group Show"}
                </TextElement>
                </View>
                <View>
                {isTemporaryExhibition ? (
                    <>
                <TextElement style={exhibitionDetailsStyles.descriptionText}>Dates</TextElement>
                <Divider style={exhibitionDetailsStyles.divider}/>
                <TextElement style={{...globalTextStyles.centeredText, fontSize: 15}}>
                    {exhibitionStartDate} {" - "} {exhibitionEndDate}
                </TextElement>
                </>
                )
                :
                (
                <TextElement style={{...globalTextStyles.centeredText}}>Ongoing</TextElement>
                )
                }
                </View>
                {hasReception && (
                    <>
                    <View>
                        <TextElement style={exhibitionDetailsStyles.descriptionText}>
                            Reception
                        </TextElement>
                        <Divider style={exhibitionDetailsStyles.divider}/>
                        <TextElement style={{...globalTextStyles.centeredText, fontSize: 15}}>
                            {receptionDateString}
                        </TextElement>
                        <TextElement style={{...globalTextStyles.centeredText, fontSize: 15}}>
                            {receptionTimeString}
                        </TextElement>
                    </View>
                    </>
                )}
            </View>
            <View style={exhibitionDetailsStyles.mapContainer}>
                <MapView  provider={PROVIDER_GOOGLE}
                style={{ alignSelf: 'stretch', height: '100%' }}
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
            <View style={{marginBottom: hp('5%')}}>
                {!isReceptionInPast && (

                
                <Button 
                icon={!isCalendarSuccess ? "calendar" : ""}
                buttonColor={PRIMARY_600}
                textColor={MILK}
                mode="contained"
                disabled={isCalendarSuccess}
                compact={true}
                onPress={() => saveExhibitionToCalendar()}
                >   
                {!isCalendarSuccess ?
                (
                    <TextElement style={{...globalTextStyles.centeredText, color: PRIMARY_50}}>Add Reception to Calendar</TextElement>
                )
                :
                (
                    <TextElement style={{...globalTextStyles.centeredText, color: PRIMARY_900}}>Added to Calendar</TextElement>
                )
                }
                </Button>
                )}
                {isCalendarFailure && (
                <TextElement sx={{color: {PRIMARY_900}}}>error occurred adding event</TextElement>
                )}
            </View>
            <View style={exhibitionDetailsStyles.pressReleaseContainer}>
            <TextElement style={exhibitionDetailsStyles.descriptionText}>
                Press Release
            </TextElement>
            <Divider style={exhibitionDetailsStyles.divider}/>
            <Text style={{...globalTextStyles.baseText, fontSize: 15, color: PRIMARY_950}}>
                {currentExhibition.exhibitionPressRelease.value}
            </Text>
            </View>
        </View>
    </ScrollView>
  );
}
