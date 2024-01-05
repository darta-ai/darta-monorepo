import React from 'react';
import {StyleSheet, View, Animated, Pressable, ActivityIndicator, TouchableOpacity} from 'react-native';
import {Platform, Linking} from 'react-native';

import {ScrollView} from 'react-native-gesture-handler';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import FastImage from 'react-native-fast-image'

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
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  textContainer: {
    width: "100%",
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignSelf: 'flex-start',
    alignItems: 'flex-start',
    gap: 12,
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
  artTitle: {fontSize: 16, fontFamily: 'DMSans_400Regular_Italic', color: Colors.PRIMARY_950},
  artYear: {fontSize: 16, fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_950},
  artPrice: {fontSize: 16, fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_950},
  artDimensions: {fontSize: 16, fontFamily: 'DMSans_400Regular', color: Colors.PRIMARY_400},
  artMedium: {
    fontSize: 16,
    fontFamily: 'DMSans_400Regular',
    color: Colors.PRIMARY_400,
  },
  inquireButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    padding: 8,
    gap: 8,
  },
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
      paddingLeft: 16,
      paddingRight: 16,
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
}: {
  artwork: Artwork,
  gallery: GalleryForList,
  exhibition: ExhibitionForList,
  inquireAlert: ({artwork, gallery, exhibition} : {artwork: Artwork, gallery: GalleryForList, exhibition: ExhibitionForList}) => void,
  onDelete: ({artworkId} : {artworkId: string}) => Promise<boolean>,
}) {

  const {userState, userDispatch} = React.useContext(UserStoreContext)
  
  const [isInquired, setIsInquired] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [canInquire, setCanInquire] = React.useState(true);

  const [exhibitionStartDate, setExhibitionStartDate] = React.useState<string>();
  const [exhibitionEndDate, setExhibitionEndDate] = React.useState<string>(new Date().toLocaleDateString());
  const [showSwipeActions, setShowSwipeActions] = React.useState(true);

  React.useEffect(()=> {
    if (exhibition?.exhibitionDates?.exhibitionStartDate.value && exhibition?.exhibitionDates?.exhibitionEndDate.value) {
      console.log(exhibition?.exhibitionDates?.exhibitionStartDate.value)
      setExhibitionStartDate(customLocalDateStringStart({date: new Date(exhibition?.exhibitionDates?.exhibitionStartDate.value), isUpperCase: false}))
      setExhibitionEndDate(customLocalDateStringEnd({date: new Date(exhibition?.exhibitionDates.exhibitionEndDate.value), isUpperCase: false}));

    }
  }, [])

  const opacityInquiredButton = React.useRef(new Animated.Value(1)).current; 

  React.useEffect(() => {
    opacityInquiredButton.addListener(() => {})
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


  const renderRightActions = (_, dragX) => {
    if (!showSwipeActions) {
      return null;
    }
  
    const trans = dragX.interpolate({
      inputRange: [-50, 0],  // Start from -100 (fully swiped to the right) to 0 (no swipe)
      outputRange: [0, 0], // Corresponding translation: start off-screen and move to fully visible
      extrapolate: 'clamp',   // Clamps the output to the specified range
    });
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('20%'),  // Adjust as needed
        height: '100%',
        backgroundColor: Colors.PRIMARY_400,
        transform: [{ translateX: trans }],  // Ensure this moves as expected
      },
      buttonWidth: {
        width: '100%',  // Adjust as needed
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
      },
      textColor: {
        color: Colors.PRIMARY_50,  // Ensure good contrast
      }
    });

    return (
      <Animated.View style={styles.container}>
        <TouchableOpacity style={styles.buttonWidth} onPress={handleDelete}>
            {loadingDelete ? (
              <ActivityIndicator size="small"/>
            ) : (
              <Icon name="delete" solid={false}/>
            )}
        </TouchableOpacity>
      </Animated.View>
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


  return (
  <View style={{height: hp("90%")}}>
    <Swipeable renderRightActions={renderRightActions}>
          <View style={SSTombstonePortrait.container}>
            <View style={SSTombstonePortrait.textContainer}>
              <View>
                <TextElement
                  style={globalTextStyles.sectionHeaderTitle}>
                  {artwork?.artistName?.value}
                </TextElement>
              </View>
              <View>
                <TextElement
                  style={{...globalTextStyles.sectionHeaderTitle, fontSize: 18, marginBottom: 24}}
                  numberOfLines={5}>
                  {artwork?.artworkTitle?.value}          
                </TextElement>
              </View>
          </View>
            <ScrollView
              scrollEventThrottle={7}
              maximumZoomScale={6}
              minimumZoomScale={1}
              scrollToOverflowEnabled={false}
              centerContent>
              <View style={SSTombstonePortrait.imageContainer}>
                <DartaImageComponent
                  uri= {artwork?.artworkImage?.value!}
                  priority={FastImage.priority.normal}
                  style={SSTombstonePortrait.image}
                  resizeMode={FastImage.resizeMode.contain}
                  onLoadStart={() => setIsLoading(true)}
                  onLoadEnd={() => setIsLoading(false)}
                />
                {isLoading && (
                  <ActivityIndicator size="small"/> 
                )}
              </View>
            </ScrollView>
          </View>
          <View>
          <View style={SSTombstonePortrait.textContainer}>
              <View>
                <TextElement style={globalTextStyles.subHeaderTitle}>
                  Exhibition
                </TextElement>
                <TextElement
                  style={globalTextStyles.sectionHeaderTitle}>
                  {exhibition?.exhibitionTitle?.value }
                </TextElement>
              </View>
              <View>
                <TextElement style={globalTextStyles.subHeaderTitle}>
                  Gallery
                </TextElement>
                <TextElement
                  style={{...globalTextStyles.sectionHeaderTitle, fontSize: 18}}
                  numberOfLines={5}>
                  {gallery?.galleryName?.value}          
                </TextElement>
              </View>
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
        </Swipeable>
      </View>
  );
}
