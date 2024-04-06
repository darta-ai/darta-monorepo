import { ExhibitionMapPin } from '@darta-types/dist';
import * as React from 'react';
import { Switch } from 'react-native-paper';
import { StyleSheet, View } from 'react-native';
import { DartaImageComponent } from '../Images/DartaImageComponent';
import FastImage from 'react-native-fast-image';
import { TextElement, TextElementMultiLine } from '../Elements/TextElement';
import * as Colors from '@darta-styles';
import { ETypes, StoreContext } from '../../state';
import { getStoreHours, simplifyAddressMailing } from '../../utils/functions';
import { widthPercentageToDP } from 'react-native-responsive-screen';

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

const GallerySwitchComponent = ({ galleryData, activeArrayLength }: { galleryData: ExhibitionMapPin, activeArrayLength: number }) => {
    const { state, dispatch } = React.useContext(StoreContext);
    const [isSwitchOn, setIsSwitchOn] = React.useState<boolean>(
      state?.mapPinStatus?.[state.currentlyViewingCity]?.[state.currentlyViewingMapView][galleryData?.locationId] ?? false
    );

    const onToggleSwitch = () => {
      if (activeArrayLength !== 10) {
        setIsSwitchOn(!isSwitchOn);
        dispatch({
          type: ETypes.setPinStatus,
          locationId: galleryData?.locationId,
          pinStatus: !isSwitchOn,
        });
      } else {
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

    return (
      <View style={styles.container}>
        <View style={{ width: widthPercentageToDP('25%'), display: 'flex', flexDirection: 'column', gap: 8}}>
          <TextElementMultiLine style={{ color: isSwitchOn ? 'black' : 'grey', fontSize: 14}}>
            {galleryData?.galleryName?.value}
          </TextElementMultiLine>
        </View>
        <View style={styles.textContainer}>
          <TextElement style={{ color: isSwitchOn ? 'black' : 'grey' }}>
            {isExhibitionCurrent ? galleryData?.exhibitionArtist?.value ? galleryData?.exhibitionArtist?.value.trim() : 'Group Show' : ''}
          </TextElement>
          {isExhibitionCurrent && (
          <TextElement style={{ fontSize: 12, color: isSwitchOn ? Colors.PRIMARY_950 : Colors.PRIMARY_600 }}>
            {galleryData?.exhibitionTitle?.value?.trim()}
          </TextElement>
          )}
          <TextElement style={{ fontSize: 10, color: isSwitchOn ? Colors.PRIMARY_950 : Colors.PRIMARY_600 }}>
            {simplifiedAddress}
          </TextElement>
          <TextElement
            style={{
              fontSize: 10,
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
      prevProps.galleryData.exhibitionId === nextProps.galleryData.exhibitionId &&
      prevProps.galleryData.galleryLogo === nextProps.galleryData.galleryLogo &&
      prevProps.galleryData.exhibitionArtist?.value === nextProps.galleryData.exhibitionArtist?.value &&
      prevProps.galleryData.exhibitionTitle?.value === nextProps.galleryData.exhibitionTitle?.value &&
      prevProps.galleryData.exhibitionLocation?.locationString?.value === nextProps.galleryData.exhibitionLocation?.locationString?.value &&
      prevProps.galleryData.exhibitionLocation?.businessHours?.hoursOfOperation === nextProps.galleryData.exhibitionLocation?.businessHours?.hoursOfOperation &&
      prevProps.activeArrayLength === nextProps.activeArrayLength
    );
  };
  
  const MemoizedGallerySwitchComponent = React.memo(GallerySwitchComponent, areEqual);
  
  export default MemoizedGallerySwitchComponent;