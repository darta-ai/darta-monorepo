import { ExhibitionMapPin } from '@darta-types/dist';
import * as React from 'react';
import { FlatList, View } from 'react-native';
import GallerySwitchComponent from './GallerySwitchComponent';
import { heightPercentageToDP } from 'react-native-responsive-screen';



export const GallerySwitchContainer = ({ mapPins, activeArrayLength } : {mapPins: ExhibitionMapPin[], activeArrayLength: number}) => {
    const sortedMapPins = [...mapPins].sort((a, b) => {
        if (!a.galleryName?.value || !b.galleryName?.value) return 0;
        return a.galleryName?.value.localeCompare(b.galleryName?.value);
    });

    return (
        <View style={{ height: heightPercentageToDP('35%'), width: '100%'}}>
            <FlatList
                data={sortedMapPins}
                renderItem={({ item }) => <GallerySwitchComponent galleryData={item} activeArrayLength={activeArrayLength}/>}
                keyExtractor={(item) => item?.exhibitionId.toString()}
                getItemLayout={(_, index) => ({ length: 75, offset: 75 * index, index })}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                updateCellsBatchingPeriod={100}
                windowSize={11}
                removeClippedSubviews={false}
                showsVerticalScrollIndicator={false} // Add this prop to hide the vertical scroll bar
            />
        </View>
    );
}
