import React from 'react';
import { View, ScrollView, RefreshControl, Text, Alert, StyleSheet, Pressable } from 'react-native';
import { ActivityIndicator, Surface } from 'react-native-paper';
import {heightPercentageToDP as hp, widthPercentageToDP as wp,} from 'react-native-responsive-screen';
import * as Haptics from 'expo-haptics';

import * as Colors from '@darta-styles';
import { UIStoreContext, UiETypes, GalleryStoreContext, GalleryETypes, ExhibitionStoreContext, ExhibitionETypes, StoreContext, ETypes} from '../../state';


import { ExhibitionStackParamList } from '../../navigation/Exhibition/ExhibitionTopTabNavigator';
import { RouteProp } from '@react-navigation/native';
import { ExhibitionRootEnum } from '../../typing/routes';

import { DartaIconButtonWithText } from '../../components/Darta/DartaIconButtonWithText';
import { DartaImageComponent } from '../../components/Images/DartaImageComponent';
import GalleryLocation from '../../components/Gallery/GalleryLocation';
import * as SVGs from '../../assets/SVGs';

import { readExhibition, setUserViewedExhibition, addExhibitionToUserSaved, removeExhibitionFromUserSaved, dartaUserExhibitionRating } from '../../api/exhibitionRoutes';
import { readGallery, listGalleryExhibitionPreviewForUser } from '../../api/galleryRoutes';
import { customFormatTimeString, customLocalDateStringStart, customLocalDateStringEnd, openInMaps } from '../../utils/functions';
import { globalTextStyles } from '../../styles/styles';
import { Exhibition, GalleryBase, USER_EXHIBITION_RATINGS } from '@darta-types';
import { TextElement, TextElementMultiLine } from '../../components/Elements/TextElement';

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
        backgroundColor: Colors.PRIMARY_50
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
        width: 225,
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

function ExhibitionDetailsScreen({
    route,
    // navigation,
}: {
    route?: ExhibitionDetailsRouteProp;
    // navigation?: any;
}) {
    const {exhibitionState, exhibitionDispatch} = React.useContext(ExhibitionStoreContext);
    const {uiDispatch} = React.useContext(UIStoreContext);
    const { galleryDispatch} = React.useContext(GalleryStoreContext);
    const {dispatch} = React.useContext(StoreContext);
    const memoizedExhibitionState = React.useMemo(() => exhibitionState, [exhibitionState]);

    const [isLoading, setIsLoading] = React.useState(true);
    const [errorText, setErrorText] = React.useState('');
    const [exhibitionData, setExhibitionData] = React.useState<Exhibition>();
    const [galleryData, setGalleryData] = React.useState<GalleryBase>();
    const [isAddedToList, setIsAddedToList] = React.useState(false);
    const [isLoadingAction, setIsLoadingAction] = React.useState(false);
    const [refreshing, setRefreshing] = React.useState(false);

    const { exhibitionId, galleryId } = route ? route.params as { exhibitionId: string, galleryId: string } : { exhibitionId: '', galleryId: ''};

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

    const isOpenExhibition = React.useMemo(() => {
        const endDate = exhibitionData?.exhibitionDates?.exhibitionEndDate?.value;
        return endDate && new Date(endDate) >= new Date();
    }, [exhibitionData?.exhibitionDates?.exhibitionEndDate?.value]);

    const fetchExhibitionData = React.useCallback(async () => {
        if (!exhibitionId || !galleryId) {
        setErrorText('Invalid exhibition or gallery ID');
        setIsLoading(false);
        return;
        }

        try {
        const [gallery, supplementalExhibitions, exhibition] = await Promise.all([
            readGallery({ galleryId }),
            listGalleryExhibitionPreviewForUser({ galleryId }),
            readExhibition({ exhibitionId })
        ]);

        const fullGalleryData = { ...gallery, galleryExhibitions: supplementalExhibitions };
        
        setExhibitionData(exhibition);
        setGalleryData(fullGalleryData);

 
        galleryDispatch({ type: GalleryETypes.saveGallery, galleryData: fullGalleryData });
        exhibitionDispatch({ type: ExhibitionETypes.saveExhibition, exhibitionData: exhibition });
        uiDispatch({ type: UiETypes.setCurrentHeader, currentExhibitionHeader: exhibition.exhibitionTitle.value });

        const shareURL = `https://darta.art/exhibition?exhibitionId=${exhibition._id}&galleryId=${gallery._id}`;
        uiDispatch({
            type: UiETypes.setExhibitionShareURL,
            exhibitionShareDetails: {shareURL, shareURLMessage: ''},
        });
      

        await setViewedInDB({ exhibitionId });
        } catch (error) {
        setErrorText('Failed to load exhibition data');
        } finally {
        setIsLoading(false);
        }
    }, [exhibitionId, galleryId]);

    React.useEffect(() => {
        fetchExhibitionData();
    }, [fetchExhibitionData]);

    React.useEffect(() => {
        if (exhibitionData && exhibitionState.userSavedExhibitions) {
        setIsAddedToList(!!exhibitionState.userSavedExhibitions[exhibitionId]);
        }
    }, [exhibitionData, memoizedExhibitionState.userSavedExhibitions, exhibitionId]);

    const handleRefresh = React.useCallback(async () => {
        setRefreshing(true);
        if (!exhibitionId || !galleryId) {
            setErrorText('Invalid exhibition or gallery ID');
            setIsLoading(false);
            return;
        }
    
        try {
            const [gallery, supplementalExhibitions, exhibition] = await Promise.all([
                readGallery({ galleryId }),
                listGalleryExhibitionPreviewForUser({ galleryId }),
                readExhibition({ exhibitionId })
            ]);
    
            const fullGalleryData = { ...gallery, galleryExhibitions: supplementalExhibitions };
            
            setExhibitionData(exhibition);
            setGalleryData(fullGalleryData);
    
     
            galleryDispatch({ type: GalleryETypes.refreshGallery, galleryData: fullGalleryData });
            exhibitionDispatch({ type: ExhibitionETypes.refreshExhibition, exhibitionData: exhibition });
            uiDispatch({ type: UiETypes.setCurrentHeader, currentExhibitionHeader: exhibition.exhibitionTitle.value });
          
    
            await setUserViewedExhibition({ exhibitionId });
        } catch (error) {
            setErrorText('Failed to load exhibition data');
        } finally {
            setRefreshing(false);
        }
    }, [fetchExhibitionData]);

    const handleAddToList = React.useCallback(async () => {
        setIsLoadingAction(true);
        try {
        await addExhibitionToUserSaved({ exhibitionId });
        exhibitionDispatch({ type: ExhibitionETypes.saveUserSavedExhibitions, exhibitionIds: [exhibitionId] });
        if (exhibitionData && exhibitionData.exhibitionLocation.googleMapsPlaceId) {
            dispatch({ type: ETypes.addExhibitionToSavedExhibitions, locationId: exhibitionData.exhibitionLocation.googleMapsPlaceId.value! });
        }
        setIsAddedToList(true);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
        Alert.alert('Error', 'Failed to add exhibition to your list');
        } finally {
        setIsLoadingAction(false);
        }
    }, [exhibitionId, exhibitionData, exhibitionDispatch]);

    const handleRemoveFromList = React.useCallback(async (rating) => {
        setIsLoadingAction(true);
        try {
            await removeExhibitionFromUserSaved({ exhibitionId });
            if (rating) {
                await dartaUserExhibitionRating({ exhibitionId, rating });
            }
            exhibitionDispatch({ type: ExhibitionETypes.removeUserSavedExhibitions, exhibitionIds: [exhibitionId] });
            if (exhibitionData && exhibitionData.exhibitionLocation.googleMapsPlaceId){
                dispatch({ type: ETypes.removeExhibitionFromSavedExhibitions, locationId: exhibitionData.exhibitionLocation.googleMapsPlaceId.value! });
            }
            setIsAddedToList(false);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } catch (error) {
            Alert.alert('Error', 'Failed to remove exhibition from your list');
        } finally {
            setIsLoadingAction(false);
        }
    }, [exhibitionId, exhibitionData, exhibitionDispatch]);

    const showRatingAlert = React.useCallback(() => {
        Alert.alert(
        'Rate this exhibition',
        'Your rating helps improve our recommendations',
        [
            { text: 'Loved It', onPress: () => handleRemoveFromList(USER_EXHIBITION_RATINGS.LOVED) },
            { text: 'Liked It', onPress: () => handleRemoveFromList(USER_EXHIBITION_RATINGS.LIKE) },
            { text: 'Disliked It', onPress: () => handleRemoveFromList(USER_EXHIBITION_RATINGS.DISLIKE) },
            { text: 'Hated It', onPress: () => handleRemoveFromList(USER_EXHIBITION_RATINGS.HATED) },
            { text: 'No Opinion', onPress: () => handleRemoveFromList(USER_EXHIBITION_RATINGS.UNRATED) },
        ]
        );
    }, [handleRemoveFromList]);


    if (!exhibitionData) {
        return (
        <View style={exhibitionDetailsStyles.spinnerContainer}>
            <ActivityIndicator size={35} color={Colors.PRIMARY_800} />
            {errorText && <TextElement>{errorText}</TextElement>}
        </View>
        );
    }

    const getDynamicStyles = StyleSheet.create({
        followContainer: {
            height: isOpenExhibition ? 38 : 0,
            marginBottom: 24,
            width: wp('90%'),
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
        },
    });

    return (
        <ScrollView
        refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.PRIMARY_600} />
        }
        >
        <View style={exhibitionDetailsStyles.container}>
            {/* Add/Remove from list button */}
            <View style={exhibitionDetailsStyles.informationContainer}>
                <View style={getDynamicStyles.followContainer}>
                {isOpenExhibition && (
                    <Pressable
                        style={[
                        exhibitionDetailsStyles.pressableStyle,
                        !isAddedToList && { backgroundColor: Colors.PRIMARY_50, borderColor: Colors.PRIMARY_500, borderWidth: 1 }
                        ]}
                        onPress={isAddedToList ? showRatingAlert : handleAddToList}
                    >
                        <View style={{ width: 30, alignItems: 'center' }}>
                        {isLoadingAction ? (
                            <ActivityIndicator size={20} color={isAddedToList ? Colors.PRIMARY_50 : Colors.PRIMARY_950} />
                        ) : (
                            isAddedToList ? <SVGs.NewMapPinSmallWhite /> : <SVGs.NewMapPinSmall />
                        )}
                        </View>
                        <TextElement style={[globalTextStyles.boldTitleText, { color: isAddedToList ? Colors.PRIMARY_50 : Colors.PRIMARY_950,  width: 150 }]}>
                        {isAddedToList ? 'Added To Your List' : 'Add To Your List'}
                        </TextElement>
                    </Pressable>
                )}
                </View>
                <View style={exhibitionDetailsStyles.informationTitleContainer}>
                {/* Exhibition Title */}
                    <TextElement style={globalTextStyles.sectionHeaderTitle}>
                        {exhibitionData.exhibitionTitle.value}
                    </TextElement>
                </View>
                {/* Exhibition Image */}
                <Surface elevation={2} style={exhibitionDetailsStyles.heroImageContainer}>
                <DartaImageComponent
                    uri={exhibitionData.exhibitionPrimaryImage}
                    priority="normal"
                    style={exhibitionDetailsStyles.heroImage}
                    size="largeImage"
                />
                </Surface>

                {/* Artist Information */}
                {exhibitionData.exhibitionArtist && (
                <View style={exhibitionDetailsStyles.subInformationContainer}>
                    <TextElement style={globalTextStyles.subHeaderTitle}>
                    {exhibitionData.exhibitionType?.value === "Group Show" ? "Artists" : "Artist"}
                    </TextElement>
                    <TextElementMultiLine style={globalTextStyles.subHeaderInformation}>
                    {exhibitionData.exhibitionArtist.value}
                    </TextElementMultiLine>
                </View>
                )}

                {/* Exhibition Dates */}
                <View style={exhibitionDetailsStyles.subInformationContainer}>
                <TextElement style={globalTextStyles.subHeaderTitle}>On view from</TextElement>
                <TextElement style={globalTextStyles.subHeaderInformation}>
                    {customLocalDateStringStart({ date: new Date(exhibitionData.exhibitionDates?.exhibitionStartDate.value!), isUpperCase: false })}
                    {" - "}
                    {customLocalDateStringEnd({ date: new Date(exhibitionData.exhibitionDates.exhibitionEndDate.value!), isUpperCase: false })}
                </TextElement>
                </View>
            </View>
            {/* Location Information */}
            <View style={exhibitionDetailsStyles.informationContainer}>
            <TextElement style={globalTextStyles.sectionHeaderTitle}>Location</TextElement>
            
            {/* Reception Information */}
            {exhibitionData.receptionDates?.hasReception?.value === "Yes" && new Date(exhibitionData.receptionDates.receptionStartTime.value!) >= new Date() && (
                <DartaIconButtonWithText
                text={`Reception: ${customLocalDateStringStart({ date: new Date(exhibitionData.receptionDates.receptionStartTime.value!), isUpperCase: false })} ${customFormatTimeString(new Date(exhibitionData.receptionDates.receptionStartTime.value!))}`}
                iconComponent={SVGs.CalendarIcon}
                onPress={() => {}}
                />
            )}

            {/* Gallery Location */}
            <GalleryLocation
                galleryLocationData={exhibitionData.exhibitionLocation}
                galleryName={galleryData && galleryData.galleryName.value ? galleryData.galleryName.value : "Gallery"}
                openInMaps={openInMaps}
            />
            </View>

            {/* Press Release */}
            <View style={exhibitionDetailsStyles.informationContainer}>
            <TextElement style={globalTextStyles.sectionHeaderTitle}>Press Release</TextElement>
            <Text style={globalTextStyles.paragraphText}>
                {exhibitionData.exhibitionPressRelease.value}
            </Text>
            </View>

            {/* Artist Statement */}
            {exhibitionData.exhibitionArtistStatement?.value && (
            <View style={exhibitionDetailsStyles.informationContainer}>
                <TextElement style={globalTextStyles.sectionHeaderTitle}>Artist</TextElement>
                <Text style={globalTextStyles.paragraphText}>
                {exhibitionData.exhibitionArtistStatement.value}
                </Text>
            </View>
            )}
        </View>
        </ScrollView>
    );
}

export {ExhibitionDetailsScreen};