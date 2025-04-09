import * as React from 'react';
import { View, StyleSheet, ActivityIndicator} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
// import FastImage from 'react-native-fast-image'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';
import * as Colors from '@darta-styles';
import { Surface } from 'react-native-paper';
import { DartaImageComponent } from '../Images/DartaImageComponent';
import { Image } from 'expo-image';

const carouselStyle = StyleSheet.create({
    heroImage: {
      width: wp('90%'),
      height: hp('30%'),
      marginTop: 7, 
      alignSelf: 'center',
      zIndex: 2,
      // shadowOpacity: 1,
      // shadowRadius: 3.03,
      // shadowColor: Colors.PRIMARY_300,
      // shadowOffset: {height: 3.03, width: 0},
    },
    paginationContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationDot: {
      width: 4,
      height: 4,
      borderRadius: 4,
      marginHorizontal: 2,
    },
    paginationDotActive: {
      backgroundColor: Colors.PRIMARY_950,
    },
    paginationDotInactive: {
      backgroundColor: Colors.PRIMARY_200,
    },
    activityIndicator: {
      position: 'absolute',
      zIndex: 1,
    },
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      elevation: 5,
    },
})

const WIDTH = wp('90%');

interface ImageItem {
  imageData: {
    value: string;
  };
}

interface CustomItemProps {
  item: ImageItem;
  index: number;
}

const CustomItemComponent: React.FC<CustomItemProps> = React.memo(({ item, index }) => {
  const image = item?.imageData.value;
  const priority = index === 0 ? "high" : "normal";

  const [isLoading, setIsLoading] = React.useState(true);

  const handleLoadStart = React.useCallback(() => setIsLoading(true), []);
  const handleLoadEnd = React.useCallback(() => setIsLoading(false), []);

  return (
    <View style={{ flex: 1, width: '100%' }} key={image}>
      <Surface style={{ backgroundColor: 'transparent' }} elevation={2}>
        <View style={carouselStyle.container}>
          <Image
            source={{ uri: image ?? null }}
            priority={priority}
            style={carouselStyle.heroImage}
            contentFit="contain"
            transition={100}
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
          />
          {isLoading && (
            <ActivityIndicator
              style={carouselStyle.activityIndicator}
              size="small"
              color={Colors.PRIMARY_950}
            />
          )}
        </View>
      </Surface>
    </View>
  );
});

CustomItemComponent.displayName = 'CustomItemComponent';

interface PaginationDotsProps {
  currentIndex: number;
  itemCount: number;
}

const PaginationDots: React.FC<PaginationDotsProps> = React.memo(({ currentIndex, itemCount }) => (
  <View style={carouselStyle.paginationContainer}>
    {Array.from({ length: itemCount }, (_, index) => (
      <View
        key={index}
        style={[
          carouselStyle.paginationDot,
          currentIndex === index ? carouselStyle.paginationDotActive : carouselStyle.paginationDotInactive,
        ]}
      />
    ))}
  </View>
));

PaginationDots.displayName = 'PaginationDots';

interface ExhibitionCarouselProps {
  images: ImageItem[];
}

function ExhibitionCarouselComponent({ images }: ExhibitionCarouselProps) {
  const carouselRef = React.useRef<any>(null);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const onSnapToItem = React.useCallback((index: number) => setCurrentIndex(index), []);

  const multipleImages = images.length > 1;

  const renderItem = React.useCallback(({ item, index }: { item: ImageItem; index: number }) => (
    <CustomItemComponent item={item} index={index} />
  ), []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Carousel
        ref={carouselRef}
        loop={true}
        autoPlay={false}
        width={WIDTH}
        onSnapToItem={onSnapToItem}
        data={images}
        enabled={multipleImages}
        panGestureHandlerProps={{
          activeOffsetX: [-10, 10],
        }}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        scrollAnimationDuration={100}
        renderItem={renderItem}
      />
      {multipleImages && <PaginationDots currentIndex={currentIndex} itemCount={images.length} />}
    </View>
  );
}

export const ExhibitionCarousel = React.memo(ExhibitionCarouselComponent, (prevProps, nextProps) => 
  prevProps.images === nextProps.images
);

ExhibitionCarousel.displayName = 'ExhibitionCarousel';