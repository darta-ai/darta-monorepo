import React from 'react';
import {StyleSheet, View, Animated, Pressable, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Platform, Linking} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
// import FastImage from 'react-native-fast-image'

import {Artwork, ExhibitionForList, GalleryForList, USER_ARTWORK_EDGE_RELATIONSHIP} from '@darta-types';
import * as Colors from '@darta-styles'
import {TextElement} from '../Elements/_index';
import {globalTextStyles} from '../../styles/styles';
import { UserETypes, UserStoreContext } from '../../state';
import { deleteArtworkRelationshipAPI } from '../../utils/apiCalls';
import * as SVGs from '../../assets/SVGs/index';
import { DartaIconButtonWithText } from '../Darta/DartaIconButtonWithText';
import { customLocalDateStringEnd, customLocalDateStringStart, simplifyAddressCity, simplifyAddressMailing } from '../../utils/functions';
import { Swipeable } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import { DartaImageComponent } from '../Images/DartaImageComponent';

export const currencyConverter = {
  USD: '$',
  EUR: '€',
  GBP: '£',
};
type ButtonGeneratorProps = {
  displayText: string, 
  iconComponent: React.ElementType; // Use a more descriptive prop name
  onPress: any,
  textColor: string,
  buttonColor: string,
};


const SSTombstonePortrait = StyleSheet.create({
  mainContainer: {
    height: hp("80%"), 
    // borderWidth: 1, 
    backgroundColor: Colors.PRIMARY_50
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignContent: 'center',
    // width: wp('100%'),
  },
  imageContainer: {
    alignSelf: 'center',
    justifyContent: 'center',
    width: '100%',
    height: hp('35%'),
  },
  image: {
    height: '100%',
    width: '100%',
    alignSelf: 'center',
  },
  textContainer: {
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    gap: hp('1%'),
  },
  textRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  priceRow: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'flex-end',
  },
  inquireButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: hp('3%'),
    padding: 8,
    gap: 8,
    alignSelf: 'flex-end',
  },
  subHeaderTitle:{
    ...globalTextStyles.subHeaderTitle,
    // fontSize: hp('2%'),
  },
  sectionHeaderTitle:{
    ...globalTextStyles.sectionHeaderTitle,
    // fontSize: hp('3%')
  },
  artworkTitle:{
    ...globalTextStyles.sectionHeaderTitle,
    // fontSize: hp('2.3%'),
    fontSize: 20,
    marginBottom: hp('2.3%')
  }
});


const ButtonGenerator: React.FC<ButtonGeneratorProps> = ({displayText, iconComponent: Icon, onPress, textColor, buttonColor}) => {
  const buttonStyle = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      height: 38,
      // width: 100,
      borderRadius: 19,
      paddingTop: 8, 
      paddingBottom: 8, 
      paddingLeft: hp('1%'),
      paddingRight: hp('1%'),
      gap: 8,
    }
  })
  return(
    <Pressable onPress={onPress} style={{...buttonStyle.container, backgroundColor: buttonColor}}>
      <Icon />
      <TextElement style={{color: textColor, fontSize: 16, fontFamily: 'DMSans_400Regular' }}>
        {displayText}
      </TextElement>
    </Pressable>
  )
}


export function ArtworkListView({
  artwork,
  gallery, 
  exhibition,
  inquireAlert,
  onDelete,
  navigation,
  navigateToGalleryParams
}: {
  artwork: Artwork,
  gallery: GalleryForList,
  exhibition: ExhibitionForList,
  inquireAlert: ({artwork, gallery, exhibition} : {artwork: Artwork, gallery: GalleryForList, exhibition: ExhibitionForList}) => void,
  onDelete: ({artworkId} : {artworkId: string}) => Promise<boolean>,
  navigation: any,
  navigateToGalleryParams: string
}) {

  const {userState, userDispatch} = React.useContext(UserStoreContext)
  
  const [isInquired, setIsInquired] = React.useState(false);
  const [canInquire, setCanInquire] = React.useState(true);

  const [exhibitionStartDate, setExhibitionStartDate] = React.useState<string>();
  const [exhibitionEndDate, setExhibitionEndDate] = React.useState<string>(new Date().toLocaleDateString());
  const [showSwipeActions, setShowSwipeActions] = React.useState(false);

  React.useEffect(()=> {
    if (exhibition?.exhibitionDates?.exhibitionStartDate.value && exhibition?.exhibitionDates?.exhibitionEndDate.value) {
      setExhibitionStartDate(customLocalDateStringStart({date: new Date(exhibition?.exhibitionDates?.exhibitionStartDate.value), isUpperCase: false}))
      setExhibitionEndDate(customLocalDateStringEnd({date: new Date(exhibition?.exhibitionDates.exhibitionEndDate.value), isUpperCase: false}));

    }
  }, [])

  const opacityInquiredButton = React.useRef(new Animated.Value(1)).current; 

  React.useEffect(() => {
    opacityInquiredButton.addListener(() => {return})
  }, [])

  const [loadingDelete, setLoadingDelete] = React.useState<boolean>(false);

  const handleDelete = async () => {
    setLoadingDelete(true)
    await onDelete({artworkId: artwork._id!})
    setLoadingDelete(false)
    setShowSwipeActions(false)
  }

  React.useEffect(() => {
    setShowSwipeActions(true)
  },[showSwipeActions])

  const handleInquire = () => {
    if (!artwork?._id || !gallery || !exhibition) return;
    inquireAlert({artwork, gallery, exhibition})
  }

  const toggleButtons = ({buttonRef, callback} : {buttonRef: any, callback?: () => void}) => {
    // Animate Out
    Animated.parallel([
      Animated.timing(buttonRef, {
        toValue: 0,  // Fade out
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(async () => {
      if (callback) {
        await callback();
      }
      // Animate In
      Animated.parallel([
        Animated.timing(buttonRef, {
          toValue: 1,  // Fade in
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
};


  React.useEffect(() => {
    const artworkId = artwork?._id!;
    if (userState.userInquiredArtwork?.[artworkId]){
      setIsInquired(true)
    }
    if(artwork?.canInquire?.value === "No"){
      setCanInquire(false)
    }
    
  }, [userState.userInquiredArtwork]);


  const removeInquiredRating = async () => {
    userDispatch({
      type: UserETypes.removeUserInquiredArtwork,
      artworkId: artwork._id!,
    })
    setIsInquired(false)
    await deleteArtworkRelationshipAPI({artworkId: artwork._id!, action: USER_ARTWORK_EDGE_RELATIONSHIP.SAVE})
  }


  const renderRightActions = () => {
    if (!showSwipeActions) {
      return null;
    }
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('20%'),  // Adjust as needed
        height: '100%',
        // backgroundColor: Colors.PRIMARY_400,
      },
      buttonWidth: {
        width: wp('20%'), // Adjust as needed
        height: '20%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      textColor: {
        color: Colors.PRIMARY_50,  // Ensure good contrast
      }
    });

    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.buttonWidth} onPress={handleDelete}>
            {loadingDelete ? (
              <ActivityIndicator size="small"/>
            ) : (
              <Icon reverse raised name="delete" solid={true}/>
            )}
        </TouchableOpacity>
      </View>
    );
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

  const navigateToGallery = () => {
    if (!gallery?.galleryId && navigateToGalleryParams) return;
    navigation.navigate(navigateToGalleryParams, {galleryId: gallery.galleryId})
  }

  return (
        <View style={SSTombstonePortrait.mainContainer}>
          <View style={SSTombstonePortrait.container}>
            <View style={SSTombstonePortrait.textContainer}>
              <View>
                <TextElement
                  style={SSTombstonePortrait.sectionHeaderTitle}>
                  {artwork?.artistName?.value}
                </TextElement>
              </View>
              <View>
                <TextElement
                  style={SSTombstonePortrait.artworkTitle}
                  numberOfLines={5}>
                  {artwork?.artworkTitle?.value}          
                </TextElement>
              </View>
            </View>
          <Swipeable renderRightActions={renderRightActions} friction={3}>
              <ScrollView
                scrollEventThrottle={7}
                maximumZoomScale={6}
                minimumZoomScale={1}
                scrollToOverflowEnabled={false}
                centerContent>
                <View style={SSTombstonePortrait.imageContainer}>
                  <DartaImageComponent
                    uri= {artwork?.artworkImage}
                    size={"largeImage"}
                    priority={"normal"}
                    style={SSTombstonePortrait.image}
                  />
                </View>
              </ScrollView>
            </Swipeable>
          </View>
          <View>
          <View style={{...SSTombstonePortrait.textContainer, marginTop: 12}}>
              <View>
                <TextElement style={SSTombstonePortrait.subHeaderTitle}>
                  Exhibition
                </TextElement>
                <TextElement
                  style={SSTombstonePortrait.sectionHeaderTitle}>
                  {exhibition?.exhibitionTitle?.value }
                </TextElement>
              </View>
              <TouchableOpacity onPress={navigateToGallery}>
                <TextElement style={SSTombstonePortrait.subHeaderTitle}>
                  Gallery
                </TextElement>
                <TextElement
                  style={{...SSTombstonePortrait.artworkTitle, marginBottom: hp('1%')}}
                  numberOfLines={5}>
                  {gallery?.galleryName?.value}          
                </TextElement>
              </TouchableOpacity>
              <DartaIconButtonWithText 
              text={`${simplifyAddressMailing(exhibition?.exhibitionLocationString?.value)} ${simplifyAddressCity(exhibition?.exhibitionLocationString?.value)}` as string}
              iconComponent={SVGs.BlackPinIcon}
              onPress={() => openInMaps(exhibition?.exhibitionLocationString?.value!)}
              />
              <DartaIconButtonWithText 
              text={`${exhibitionStartDate && exhibitionStartDate} - ${exhibitionEndDate && exhibitionEndDate}` as string}
              iconComponent={SVGs.CalendarBasicIcon}
              onPress={() => {}}
            />
          </View>
          </View>
            <View style={SSTombstonePortrait.inquireButton}>
              <Animated.View style={{opacity: opacityInquiredButton, flex: 1}}>
                {isInquired && ( 
                <ButtonGenerator 
                  displayText="Inquired"
                  iconComponent={SVGs.EmailWhiteFillIcon}
                  onPress={() => toggleButtons({buttonRef: opacityInquiredButton, callback: () => removeInquiredRating()})}
                  textColor={Colors.PRIMARY_50}
                  buttonColor={Colors.PRIMARY_950}
                />
              )} 
              {!isInquired && canInquire && (
                <ButtonGenerator 
                displayText="Inquire"
                iconComponent={SVGs.EmailWhiteFillIcon}
                onPress={() => toggleButtons({buttonRef: opacityInquiredButton, callback: () => handleInquire()})}
                textColor={Colors.PRIMARY_50}
                buttonColor={Colors.PRIMARY_950}
              />
              )} 
              </Animated.View>
            </View>
        {/* </Swipeable> */}
      </View>
  );
}


export const ArtworkListMemo = React.memo(ArtworkListView, (prevProps, nextProps) => {
  return prevProps.artwork._id === nextProps.artwork._id;
});