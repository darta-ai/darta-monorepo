import * as React from 'react';
import { View, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image'
import {
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import * as Colors from '@darta-styles';
import { Surface } from 'react-native-paper';
import { DartaImageComponent } from '../Images/DartaImageComponent';

  const image404 = require('../../assets/image404.png');
  

const carouselStyle = StyleSheet.create({
    heroImage: {
      width: '95%',
      height: '95%',
      marginTop: 7, 
      resizeMode: 'contain',
      alignSelf: 'center',
      shadowOpacity: 1,
      shadowRadius: 3.03,
      shadowColor: Colors.PRIMARY_300,
      shadowOffset: {height: 3.03, width: 0},
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
})

const WIDTH = wp('90%');


// Define the CustomItem component
const CustomItemComponent = ({ item, index }) => {
  const image = item?.imageUrl ? { uri: item.imageUrl } : image404;

  const priority = index === 0 ? FastImage.priority.high : FastImage.priority.normal;

  return (
    <View style={{ flex: 1,  width: '100%'}} key={image}>
        <Surface style={{backgroundColor: 'transparent'}} elevation={2}>
          <DartaImageComponent
            uri = {item?.imageUrl ?? ""} 
            priority={FastImage.priority.normal}
            source={{ ...image, priority}}
            style={carouselStyle.heroImage} 
            resizeMode={FastImage.resizeMode.contain}
          />
        </Surface>
    </View>
  );
};

const CustomItem = React.memo(CustomItemComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item;
});

const PaginationDots = ({ currentIndex, itemCount }) => {
  return (
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
  );
};


// The ExhibitionCarousel component
function ExhibitionCarouselComponent({ images }) {
  const carouselRef = React.useRef<any>(null);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const onSnapToItem = (index) => {
    setCurrentIndex(index);
  };

  const multipleImages = images.length > 1;

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
        renderItem={({ item, index }) => (
          <CustomItem
            item={item}
            index={index}
          />
        )}
      />
      {multipleImages && (<PaginationDots currentIndex={currentIndex} itemCount={images.length} />)}
    </View>
  );
}

export const ExhibitionCarousel = React.memo(ExhibitionCarouselComponent, (prevProps, nextProps) => {
  return prevProps.images === nextProps.images;
});
