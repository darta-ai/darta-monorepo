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
    switchContainerActive:{
      margin: 5, // Add some margin if needed to avoid it sticking to the very edge
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      width: 50,
      borderColor: Colors.PRIMARY_300, // Customize as needed
    },
    switchContainerInactive:{
      margin: 5, // Add some margin if needed to avoid it sticking to the very edge
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      width: 50,
      borderColor: Colors.PRIMARY_50, // Customize as needed
      backgroundColor: Colors.PRIMARY_950,
    },
});

// A memoized button called IconButtonElement that takes in the parameters of 'inUse : boolean', iconInUse : JSX.Element, iconNotInUse : JSX.Element, and onPress : () => void. This component is used to create a button that can be toggled on and off.
export const IconButtonElement: React.FC<{
    inUse: boolean;
    IconInUse: JSX.Element;
    IconNotInUse: JSX.Element;
    onPress: () => void;
    text?: string;
}> = ({ inUse, IconInUse, IconNotInUse, onPress, text }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={inUse ? styles.switchContainerActive : styles.switchContainerInactive}
            onPress={onPress}>
            {inUse ? IconInUse : IconNotInUse}
        </TouchableOpacity>
        <TextElement style={{fontFamily: inUse ? "DMSans_400Regular" : "DMSans_500Medium"}}>{text}</TextElement>
      </View>
    );
};
