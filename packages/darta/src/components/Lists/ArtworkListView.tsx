import React from 'react';
import {StyleSheet, View, Animated, Pressable, TouchableOpacity} from 'react-native';
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
import { Button } from 'react-native-paper';

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
    height: hp('40%'),
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
  navigation,
  onDelete,
  onMoveUp,
  onMoveDown,
}: {
  artwork: Artwork,
  gallery: GalleryForList,
  exhibition: ExhibitionForList,
  inquireAlert: ({artworkId} : {artworkId: string}) => void,
  navigation: any,
  onDelete: ({artworkId} : {artworkId: string}) => Promise<boolean>,
  onMoveUp: ({artworkId} : {artworkId: string}) => void,
  onMoveDown: ({artworkId} : {artworkId: string}) => void,
}) {

  const {userState, userDispatch} = React.useContext(UserStoreContext)
  
  const [isInquired, setIsInquired] = React.useState(false);
  const [canInquire, setCanInquire] = React.useState(true);

  const [exhibitionStartDate, setExhibitionStartDate] = React.useState<string>();
  const [exhibitionEndDate, setExhibitionEndDate] = React.useState<string>(new Date().toLocaleDateString());
  const [showSwipeActions, setShowSwipeActions] = React.useState(true);

  React.useEffect(()=> {
    if (exhibition?.exhibitionDates?.exhibitionStartDate.value && exhibition?.exhibitionDates?.exhibitionEndDate.value) {
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
      inputRange: [-100, 0],
      outputRange: [0, 100],
      extrapolate: 'clamp',
    });

    const styles = StyleSheet.create({
      container: {
        transform: [{ translateX: trans }], 
        flexDirection: 'column', 
        alignItems: 'flex-start', 
        justifyContent: 'space-between', 
        paddingTop: 128, 
        paddingBottom: 128, 
        backgroundColor: Colors.PRIMARY_100
      },
      movementContainer: {
        gap: 8,
        flexDirection: 'column',
      }, 
      buttonWidth: {
        width: wp('35%')
      }, 
      textColor: {
        color: Colors.PRIMARY_50
      }
    })

    return (
        <Animated.View style={styles.container}>
          <View style={styles.movementContainer}>
            <Button 
                onPress={() => onMoveUp({artworkId: artwork.artworkId!})}
                icon={"chevron-up"}
                mode={"text"}
                textColor={Colors.PRIMARY_50}
                buttonColor={Colors.PRIMARY_700}
                style={styles.buttonWidth}
                >
                <TextElement style={{ color: Colors.PRIMARY_50 }}>Move Up</TextElement>
              </Button>
              <Button 
                onPress={() => onMoveDown({artworkId: artwork.artworkId!})}
                icon={"chevron-down"}
                mode={"text"}
                textColor={Colors.PRIMARY_50}
                buttonColor={Colors.PRIMARY_700}
                style={styles.buttonWidth}
                >
                <TextElement style={{ color: Colors.PRIMARY_50 }}>Move Down</TextElement>
              </Button>
            </View>
          <View>
            <Button 
              onPress={handleDelete}
              icon={"delete"}
              mode={"text"}
              loading={loadingDelete}
              textColor={Colors.PRIMARY_50}
              buttonColor={Colors.PRIMARY_950}
              style={styles.buttonWidth}
              >
              <TextElement style={styles.textColor}>Delete</TextElement>
            </Button>
          </View>
        </Animated.View>
    );
  };

  return (
  <View style={{height: hp("85%")}}>
    <Swipeable renderRightActions={renderRightActions}>
          <View style={SSTombstonePortrait.container}>
            <View style={SSTombstonePortrait.textContainer}>
              <View>
                <TextElement style={globalTextStyles.subHeaderTitle}>
                  Artist
                </TextElement>
                <TextElement
                  style={globalTextStyles.sectionHeaderTitle}>
                  {artwork?.artistName?.value}
                </TextElement>
              </View>
              <View>
                <TextElement style={globalTextStyles.subHeaderTitle}>
                  Artwork Title
                </TextElement>
                <TextElement
                  style={{...globalTextStyles.sectionHeaderTitle, fontSize: 18}}
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
                <FastImage
                  source={{uri: artwork?.artworkImage?.value!}}
                  style={SSTombstonePortrait.image}
                  resizeMode={FastImage.resizeMode.contain}
                />
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
              onPress={() => {}}
              />
              <DartaIconButtonWithText 
              text={`${exhibitionStartDate} - ${exhibitionEndDate}` as string}
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
                onPress={() => toggleButtons({buttonRef: opacityInquiredButton, callback: () => inquireAlert({artworkId: artwork._id!})})}
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
