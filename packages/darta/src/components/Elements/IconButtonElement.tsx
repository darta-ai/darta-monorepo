import React from 'react';
import * as Colors from '@darta-styles';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { TextElement } from './TextElement';


// Path: packages/darta/src/components/Previews/CustomMarker.tsx
// Compare this snippet from packages/darta/src/screens/ExploreMap/ExploreMapHomeScreen.tsx:


const styles = StyleSheet.create({
    container: {
        width: 58,
        height: 58,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    switchContainerActive:{
      margin: 5, // Add some margin if needed to avoid it sticking to the very edge
      padding: 10,
      borderRadius: 44,
      borderWidth: 1,
      width: 50,
      borderColor: Colors.PRIMARY_950, // Customize as needed
      backgroundColor: Colors.PRIMARY_50,
    },
    switchContainerInactive:{
      margin: 5,
      padding: 10,
      borderRadius: 44,
      borderWidth: 1,
      width: 50,
      borderColor: Colors.PRIMARY_50, // Customize as needed
      backgroundColor: Colors.PRIMARY_900,
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

  const interactiveStyles = StyleSheet.create({
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: 50,
    },
    textElement: {
      fontFamily: inUse ? "DMSans_400Regular" : "DMSans_500Medium",
      fontSize: 12,
      alignContent: 'center',
      color: inUse ? Colors.PRIMARY_900 : Colors.PRIMARY_950,
    },
  });
    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={inUse ? styles.switchContainerActive : styles.switchContainerInactive}
            onPress={onPress}>
            {inUse ? IconInUse : IconNotInUse}
        </TouchableOpacity>
        <View style={interactiveStyles.textContainer}>
          <TextElement style={interactiveStyles.textElement}>{text}</TextElement>
        </View>
      </View>
    );
};
