import React from 'react';
import {View} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';

import {CarouselCardItem} from './CarouselCardItem';

const SLIDER_WIDTH = wp('120%');
const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);

export function ExploreCarouselCards({data}: {data: any}) {
  const isCarousel = React.useRef(null);
  const arrayData = Object.values(data);
  return (
    <View>
      <Carousel
        layout="default"
        layoutCardOffset={9}
        ref={isCarousel}
        data={arrayData}
        renderItem={CarouselCardItem}
        sliderWidth={SLIDER_WIDTH}
        itemWidth={ITEM_WIDTH}
        inactiveSlideShift={0}
        useScrollView={true}
      />
    </View>
  );
}
