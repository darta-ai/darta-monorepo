import React from 'react';
import * as Colors from '@darta-styles';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { TextElement } from './TextElement';


const isAndroid = Platform.OS === 'android';
// const isAndroid = false;

// Path: packages/darta/src/components/Previews/CustomMarker.tsx
// Compare this snippet from packages/darta/src/screens/ExploreMap/ExploreMapHomeScreen.tsx:

const baseStyle = StyleSheet.create({
  switchContainer: {
    height: isAndroid ? 50 : 32,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    alignItems: 'center',
    paddingRight: 12,
    paddingLeft: 8,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.PRIMARY_300,
  },
})


const styles = StyleSheet.create({
    container: {
        // width: '100%',
        height: isAndroid ? 50 : 32,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 6,
    },
    switchContainerActive:{
      ...baseStyle.switchContainer,
      backgroundColor: Colors.PRIMARY_900,
    }, 
    switchContainerInactive:{
      ...baseStyle.switchContainer,
      backgroundColor: Colors.PRIMARY_50,
    },
});

// A memoized button called IconButtonElement that takes in the parameters of 'inUse : boolean', iconInUse : JSX.Element, iconNotInUse : JSX.Element, and onPress : () => void. This component is used to create a button that can be toggled on and off.
export const FilterBannerButton: React.FC<{
    inUse: boolean;
    IconInUse: JSX.Element;
    IconNotInUse: JSX.Element;
    onPress: () => void;
    text: string;
}> = ({ inUse, IconInUse, IconNotInUse, onPress, text }) => {

  const interactiveStyles = StyleSheet.create({
    textElement: {
      fontFamily: "DMSans_700Bold" ,
      fontSize: 14,
      // height: 20,
      alignContent: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      display: 'flex',
      color: inUse ? Colors.PRIMARY_50 : Colors.PRIMARY_900,
    },
  });
    return (
        <View style={styles.container}>
            <TouchableOpacity
            style={inUse ? styles.switchContainerActive : styles.switchContainerInactive}
            onPress={onPress}>
              <View>
                {inUse ? IconInUse : IconNotInUse}
              </View>
              <View>
                <TextElement style={interactiveStyles.textElement}>{text}</TextElement>
              </View>
            </TouchableOpacity>
      </View>
    );
};
