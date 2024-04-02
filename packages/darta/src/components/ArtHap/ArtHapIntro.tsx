import React from 'react'
import { Linking, StyleSheet, View } from 'react-native'
import { TextElement } from '../Elements/TextElement'
import FastImage from 'react-native-fast-image';
import {FastImageProps, Priority} from 'react-native-fast-image'
import { DartaIconButtonWithText } from '../Darta/DartaIconButtonWithText';
import * as SVGs from '../../assets/SVGs';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignContent: 'flex-start',
        alignSelf: 'flex-start',
        gap: 12,
        width: wp('90%'),
    }, 
    image: {
        width: 60,
        height: 60,
        borderRadius: 50,
        alignSelf: 'center',
    },
    bioRow: {
        flexDirection: 'column',
        alignContent: 'center',
        justifyContent: 'center',
        gap: 8,
    }
})

export function ArtHapIntro(){


  const sendEmail = () => {
    const url = `mailto:collaborate@darta.art`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log(`Can't handle URL: ${url}`);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error('An error occurred', err));
  };


    return(
        <View style={styles.container}>
            <View style={styles.bioRow}>
                <TextElement style={{alignSelf: 'flex-start', fontSize: 18}}>ArtHap</TextElement>
                <DartaIconButtonWithText 
                    text={"info@arthap.com"}
                    iconComponent={SVGs.EmailIcon}
                    onPress={() => sendEmail()}
                />
            </View>
            <View style={{flexDirection: 'row', justifyContent: "flex-end", width: '50%'}}>
                <View style={{...styles.bioRow, }}>
                    <FastImage
                        style={styles.image}
                        source={{
                            uri: 'https://media.licdn.com/dms/image/C4E03AQHd79iVhV3wcw/profile-displayphoto-shrink_800_800/0/1635434086351?e=1717027200&v=beta&t=EZi2qe-keH82ejTa5vvMBCSbBSRfhPY06g2PT6J4rJ0',
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <TextElement>Morgan</TextElement>
                </View>
                <View style={{...styles.bioRow, alignSelf: 'flex-end'}}>
                    <FastImage
                        style={styles.image}
                        source={{
                            uri: 'https://media.licdn.com/dms/image/C4E03AQH18qhmLJ_Yrg/profile-displayphoto-shrink_400_400/0/1534348693840?e=1717027200&v=beta&t=jpSDX0j5vH5bMnFY-kFmDDEQKaLdiNjwIV__704DxtY',
                            priority: FastImage.priority.normal,
                        }}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                    <TextElement>Alex</TextElement>

                </View>
            </View>
        </View>
    )
}