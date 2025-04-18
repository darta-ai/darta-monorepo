import React, { useState } from 'react';
import { Marker, Callout } from 'react-native-maps';
import { StyleSheet, View } from 'react-native';

import { TextElement, TextElementMultiLine } from '../Elements/TextElement';

import { getStoreHours, simplifyAddress } from '../../utils/functions';

import { ExhibitionMapPin } from '@darta-types';
import { ExhibitionStoreContext, UIStoreContext, UiETypes } from '../../state';
import { ExploreMapRootEnum } from '../../typing/routes';
import { NewMapPin, NewMapPinRed } from '../../assets/SVGs';

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
    if (mapPin.receptionDates?.receptionStartTime?.value && mapPin.receptionDates?.receptionEndTime.value) {
      const receptionEndDate = new Date(mapPin.receptionDates?.receptionEndTime?.value);
      const isOpeningUpcoming = (receptionEndDate >= new Date());
      setHasUpcomingOpening(isOpeningUpcoming);
    }
  }, []);

  const chooseRouteAndNavigate = () => {
    if (hasCurrentShow) {
      navigateToExhibitionScreens();
    } else {
      navigateToGalleryScreen();
    }
  };

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
    }
  });

  return (
    <Marker
      coordinate={coordinate}
      onTouchEnd={() => setShowCallout(true)}
    >
      <View>
        {hasUpcomingOpening ? <NewMapPinRed /> : <NewMapPin />}
      </View>
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