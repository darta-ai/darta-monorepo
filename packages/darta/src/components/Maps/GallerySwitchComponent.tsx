import { ExhibitionMapPin } from '@darta-types/dist';
import * as React from 'react';
import { Switch } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { TextElement, TextElementMultiLine } from '../Elements/TextElement';
import * as Colors from '@darta-styles';
import { ETypes, StoreContext } from '../../state';
import { getStoreHours, simplifyAddressMailing } from '../../utils/functions';
import { widthPercentageToDP } from 'react-native-responsive-screen';
import _ from 'lodash';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 120,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  logoStyle: {
    width: '20%',
    height: '70%',
    borderRadius: 50,
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    alignContent: 'center',
    alignSelf: 'center',
    height: 60,
    width: widthPercentageToDP('40%'),
    gap: 4,
  },
});

const GallerySwitchComponent = ({ 
    galleryData, 
    activeArrayLength,
    addLocationIdToMapPins,
    removeLocationIdFromMapPins
   }: { 
    galleryData: ExhibitionMapPin, 
    activeArrayLength: number,
    addLocationIdToMapPins: (locationId: string) => void,
    removeLocationIdFromMapPins: (locationId: string) => void
  }) => {
    const { state, dispatch } = React.useContext(StoreContext);
    const [isSwitchOn, setIsSwitchOn] = React.useState<boolean>(
      state?.mapPinStatus?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView][galleryData?.locationId] ?? false
    );

    const onToggleSwitch = () => {
      if (activeArrayLength <= 10) {
        if (isSwitchOn) {
          removeLocationIdFromMapPins(galleryData?.locationId)
        } else {
          addLocationIdToMapPins(galleryData?.locationId);
        }
        setIsSwitchOn(!isSwitchOn);
        dispatch({
          type: ETypes.setPinStatus,
          locationId: galleryData?.locationId,
          pinStatus: !isSwitchOn,
        });
      } else {
        removeLocationIdFromMapPins(galleryData?.locationId);
        setIsSwitchOn(false);
        dispatch({
          type: ETypes.setPinStatus,
          locationId: galleryData?.locationId,
          pinStatus: false,
        });
      }
    };

    const isExhibitionCurrent = React.useMemo(() => {
      if (!galleryData.exhibitionDates.exhibitionEndDate.value) return false;
      return new Date(galleryData.exhibitionDates.exhibitionEndDate.value) > new Date();
    }, []);

    const simplifiedAddress = React.useMemo(
        () => simplifyAddressMailing(galleryData?.exhibitionLocation?.locationString?.value),
        [galleryData?.exhibitionLocation?.locationString?.value]
      );
      
    const storeHours = React.useMemo(
    () => getStoreHours(galleryData?.exhibitionLocation?.businessHours?.hoursOfOperation),
    [galleryData?.exhibitionLocation?.businessHours?.hoursOfOperation]
    );

    const fontSize = isExhibitionCurrent ? 10 : 12;
    return (
      <View style={styles.container}>
        <View style={{ width: widthPercentageToDP('25%'), display: 'flex', flexDirection: 'column', gap: 8}}>
          <TextElementMultiLine style={{ color: isSwitchOn ? 'black' : 'grey', fontSize: 14}}>
            {galleryData?.galleryName?.value}
          </TextElementMultiLine>
        </View>
        <View style={styles.textContainer}>
          {isExhibitionCurrent && (
            <>
            <TextElement style={{ color: isSwitchOn ? 'black' : 'grey' }}>
              {isExhibitionCurrent ? galleryData?.exhibitionArtist?.value ? galleryData?.exhibitionArtist?.value.trim() : 'Group Show' : ''}
            </TextElement>
            <TextElement style={{ fontSize: 12, color: isSwitchOn ? Colors.PRIMARY_950 : Colors.PRIMARY_600 }}>
              {galleryData?.exhibitionTitle?.value?.trim()}
            </TextElement>
            </>
        )}
          <TextElement style={{ fontSize, color: isSwitchOn ? Colors.PRIMARY_950 : Colors.PRIMARY_600 }}>
            {simplifiedAddress}
          </TextElement>
          <TextElement
            style={{
              fontSize: fontSize,
              fontFamily: 'DMSans_700Bold',
              color: isSwitchOn ? Colors.PRIMARY_950 : Colors.PRIMARY_600,
            }}
            >
            {storeHours}
          </TextElement>
        </View>
        <Switch
          value={isSwitchOn}
          trackColor={{ true: Colors.PRIMARY_950, false: Colors.PRIMARY_600 }}
          onValueChange={onToggleSwitch}
        />
      </View>
    );
  };


const areEqual = (prevProps, nextProps) => {
    return (
      _.isEqual(prevProps.galleryData, nextProps.galleryData) &&
      _.isEqual(prevProps.activeArrayLength, nextProps.activeArrayLength) &&
      _.isEqual(prevProps.addLocationIdToMapPins, nextProps.addLocationIdToMapPins) &&
      _.isEqual(prevProps.removeLocationIdFromMapPins, nextProps.removeLocationIdFromMapPins)
    );
  };
  
const MemoizedGallerySwitchComponent = React.memo(GallerySwitchComponent, areEqual);

export default MemoizedGallerySwitchComponent;