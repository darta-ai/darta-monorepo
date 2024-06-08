import React, { useState } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { StyleSheet, Animated } from 'react-native';

import { TextElement, TextElementMultiLine } from '../Elements/TextElement';

import { getStoreHours, simplifyAddress } from '../../utils/functions';

import { ExhibitionMapPin } from '@darta-types';
import { ExhibitionStoreContext, UIStoreContext, UiETypes } from '../../state';
import { ExploreMapRootEnum } from '../../typing/routes';
import { NewMapPin, NewMapPinRed } from '../../assets/SVGs';
import { Easing } from 'react-native-reanimated';

const customMarker = StyleSheet.create({
  galleryContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: "row",
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 12
  },
  galleryNameContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  subheaderInformation: {
    fontSize: 16,
    fontFamily: 'DMSans_700Bold',
  }
});

const CustomMarkerMini = React.memo(({
  coordinate,
  mapPin,
  navigation,
  isOpeningUpcoming,
}: {
  coordinate: any,
  mapPin: ExhibitionMapPin,
  navigation: any,
  isOpeningUpcoming: boolean,
}) => {
  const { exhibitionState } = React.useContext(ExhibitionStoreContext);
  const { uiDispatch } = React.useContext(UIStoreContext);

  const [showCallout, setShowCallout] = useState(true);

  const navigateToExhibitionScreens = async () => {
    if (!mapPin.exhibitionId || !mapPin.galleryId) {
      return;
    }
    if (exhibitionState.exhibitionData && exhibitionState.exhibitionData[mapPin.exhibitionId]) {
      const exhibition = exhibitionState.exhibitionData[mapPin.exhibitionId];
      uiDispatch({
        type: UiETypes.setCurrentHeader,
        currentExhibitionHeader: exhibition.exhibitionTitle.value!,
      });
    }
    navigation.navigate(ExploreMapRootEnum.TopTabExhibition, { galleryId: mapPin.galleryId, exhibitionId: mapPin._id, internalAppRoute: true });
  };

  const navigateToGalleryScreen = async () => {
    if (!mapPin.galleryId) {
      return;
    }
    navigation.navigate(ExploreMapRootEnum.exploreMapGallery, { galleryId: mapPin.galleryId });
  };

  const [hasUpcomingOpening, setHasUpcomingOpening] = React.useState<boolean>(isOpeningUpcoming);
  const [hasCurrentShow, setHasCurrentOpening] = React.useState<boolean>(false);

  const simplifiedAddress = React.useMemo(
    () => `${simplifyAddress(mapPin?.exhibitionLocation?.locationString?.value)}`,
    [mapPin?.exhibitionLocation?.locationString?.value]
  );

  const storeHours = React.useMemo(
    () => getStoreHours(mapPin?.exhibitionLocation?.businessHours?.hoursOfOperation),
    [mapPin?.exhibitionLocation?.businessHours?.hoursOfOperation]
  );

  React.useEffect(() => {
    let hasOpening = false;
    if (mapPin.receptionDates?.receptionStartTime?.value && mapPin.receptionDates?.receptionEndTime.value) {
      const receptionEndDate = new Date(mapPin.receptionDates?.receptionEndTime?.value);
      const isOpeningUpcoming = (receptionEndDate >= new Date());
      setHasUpcomingOpening(isOpeningUpcoming);
    }
  }, []);

  React.useEffect(() => {
    if (hasUpcomingOpening) {
      handleWiggle();
    }
  }, [hasUpcomingOpening]);

  const chooseRouteAndNavigate = () => {
    if (hasCurrentShow) {
      navigateToExhibitionScreens();
    } else {
      navigateToGalleryScreen();
    }
  };

  const wiggleAnim = React.useRef(new Animated.Value(0)).current;

  const handleWiggle = () => {
    const wiggleSequence = Animated.sequence([
      Animated.timing(wiggleAnim, {
        toValue: 0.25,
        duration: 500,
        easing: Easing.elastic(4),
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.elastic(4),
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: -0.25,
        duration: 500,
        easing: Easing.elastic(4),
        useNativeDriver: true,
      }),
      Animated.timing(wiggleAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.elastic(4),
        useNativeDriver: true,
      }),
    ]);

    // Start the animation sequence
    wiggleSequence.start();
  };

  const rotate = wiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-15deg', '15deg'],
  });

  const customMarkerDynamic = StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: 75,
      width: 250,
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      padding: 6,
      gap: 6,
    },
    wiggleFriend: {
      transform: [{ rotate }]
    }
  });

  return (
    <Marker
      coordinate={coordinate}
      onTouchEnd={() => setShowCallout(true)}
    >
      <Animated.View style={customMarkerDynamic.wiggleFriend}>
        {hasUpcomingOpening ? <NewMapPinRed /> : <NewMapPin />}
      </Animated.View>
      {showCallout && (
        <Callout
          style={customMarkerDynamic.container}
          onTouchStart={() => setShowCallout(false)}
          onPress={chooseRouteAndNavigate}
        >
          <TextElementMultiLine style={customMarker.subheaderInformation}>{mapPin.galleryName?.value}</TextElementMultiLine>
          <TextElement style={{ fontSize: 12 }}>
            {simplifiedAddress}
          </TextElement>
          <TextElement
            style={{
              fontSize: 12,
              fontFamily: 'DMSans_700Bold',
            }}
          >
            {storeHours}
          </TextElement>
        </Callout>
      )}
    </Marker>
  );
});

export default CustomMarkerMini;