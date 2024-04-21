import React from 'react';
import * as Colors from '@darta-styles';
import * as SVGs from '../../assets/SVGs';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { TextElement } from './TextElement';


// Path: packages/darta/src/components/Previews/CustomMarker.tsx
// Compare this snippet from packages/darta/src/screens/ExploreMap/ExploreMapHomeScreen.tsx:


const styles = StyleSheet.create({
    container: {
        width: 65,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer:{
      width: 50,
      borderColor: Colors.PRIMARY_300,
    }
});

export const DropDownToggle: React.FC<{
    inUse: boolean;
    onPress: () => void;
    text?: string;
}> = ({ inUse, onPress }) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={styles.iconContainer}
            onPress={onPress}>
            {inUse ? <SVGs.ChevronUp/> : <SVGs.ChevronDown />}
        </TouchableOpacity>
      </View>
    );
};
