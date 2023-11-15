import * as React from 'react';
import { View, StyleSheet} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import FastImage from 'react-native-fast-image'
import {
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';

import Animated, {
    interpolate,
    interpolateColor,
    useAnimatedStyle,
  } from "react-native-reanimated";
  
  import { SBItem } from "./ExhibitionCarousel/SBItem";
  import * as Colors from '@darta-styles';
import { Surface } from 'react-native-paper';

  const image404 = require('../../assets/image404.png');
  

const carouselStyle = StyleSheet.create({
    heroImage: {
      width: '85%',
      height: '85%',
      marginTop: 10,
      resizeMode: 'contain',
      alignSelf: 'center',
      // backgroundColor: Colors.PRIMARY_50, // Set this to the color of your choice
      shadowOpacity: 1,
      shadowRadius: 3.03,
      shadowColor: Colors.PRIMARY_300,
      shadowOffset: {height: 3.03, width: 0},
      // Important: on Android, elevation is used to create shadows
      elevation: 4,
    },
    paginationContainer: {
      position: 'absolute',
      bottom: 10,
      left: 0,
      right: 0,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    paginationDot: {
      width: 8,
      height: 8,
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
const CustomItemComponent = ({ item, animationValue }) => {
  const image = item?.imageUrl ? { uri: item.imageUrl } : image404;
  const maskStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animationValue.value,
      [-1, 0, 1],
      [Colors.PRIMARY_100, Colors.PRIMARY_50, Colors.PRIMARY_100],
    ),
  }));

  return (
    <View style={{ flex: 1 }}>
      <SBItem style={{ borderRadius: 0 }} />
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          },
          maskStyle,
        ]}
      >
        <FastImage 
          source={{ ...image, priority: FastImage.priority.normal }}
          style={carouselStyle.heroImage} 
          resizeMode={FastImage.resizeMode.contain}
        />
      </Animated.View>
    </View>
  );
};

const CustomItem = React.memo(CustomItemComponent, (prevProps, nextProps) => {
  return prevProps.item === nextProps.item;
});

const animationStyle = (value) => {
  "worklet";
  const zIndex = interpolate(value, [-1, 0, 1], [10, 20, 30]);
  const translateX = interpolate(value, [-2, 0, 1], [-WIDTH, 0, WIDTH]);
  return {
    transform: [{ translateX }],
    zIndex,
  };
};

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
export function ExhibitionCarousel({ images }) {
  const carouselRef = React.useRef<any>(null);

  const [currentIndex, setCurrentIndex] = React.useState(0);

  const onSnapToItem = (index) => {
    setCurrentIndex(index);
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Carousel
        ref={carouselRef}
        loop={true}
        autoPlay={false}
        width={WIDTH}
        onSnapToItem={onSnapToItem}
        data={images}
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        scrollAnimationDuration={100}
        renderItem={({ item, animationValue }) => (
          <CustomItem
            item={item}
            animationValue={animationValue}
          />
        )}
        customAnimation={animationStyle}
      />
      <PaginationDots currentIndex={currentIndex} itemCount={images.length} />
    </View>
  );
}

