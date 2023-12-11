import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {Button, IconButton} from 'react-native-paper'
import * as Colors from '@darta-styles'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import { TextElement } from '../Elements/TextElement';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HAS_ONBOARD_DARTA_PART_2, icons } from '../../utils/constants';
import * as SVGs from '../../assets/SVGs';

const onboardStyles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: hp('15%'),
        width: wp('90%'),
        height: hp('25%'),
        display: "flex",
        flexDirection: "column",
        gap: hp('2%'),
        alignSelf: "center",
        borderRadius: 20,
        justifyContent: "space-around",
        alignItems: "center",
        backgroundColor: Colors.PRIMARY_50, 
        zIndex: 1000,
        transform: [{translateY: -hp('5%')}],
        opacity: 0.75,
        flex: 2,
    },
    headerTextElement: {
        fontSize: 20,
        fontWeight: "bold",
    },
    bodyTextElement: {
        fontSize: 15,
        fontWeight: "normal",
    },
    buttonContainer: {
        display: "flex",
        flexDirection: "row",
        gap: wp('2%'),
    },
    buttonStyles: {
        width: wp('20%'),
        height: hp('6%'),
        backgroundColor: Colors.PRIMARY_950,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonTextColor: {
        color: Colors.PRIMARY_50,
    }
})



export const Onboard = () => {
    const [step, setStep] = React.useState<number>(4)

    const handleClose = async () => {
        setStep(step => step + 1)
        await AsyncStorage.setItem(HAS_ONBOARD_DARTA_PART_2, 'true')
    }

    React.useEffect(() => {
        const getStorage = async () => {
            const hasSeenOnboard = await AsyncStorage.getItem(HAS_ONBOARD_DARTA_PART_2)
            if (!hasSeenOnboard) setStep(0)
        }
        getStorage()
    }, [])


    return(
        <>
        {step === 0 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Hi, welcome to darta!</TextElement>
                <SVGs.HandsAndSparklesIcon />
                <TextElement style={onboardStyles.bodyTextElement}>We've got a new look!</TextElement>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
            </View>
        )}
        {step === 1 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Pinch, tap, and swipe this screen</TextElement>
                <SVGs.SwipeIcon />
                <TextElement style={onboardStyles.bodyTextElement}>Swipe right and left to browse artwork</TextElement>
                <View style={onboardStyles.buttonContainer}>
                    <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                    <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
                </View>
            </View>
        )}
        {step === 2 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Like what you like</TextElement>
                <View style={{transform: [{rotate: '180deg'}]}}><SVGs.ThumbsDownIntroSizeIcon /></View>
                <TextElement style={onboardStyles.bodyTextElement}>This helps us understand your tastes</TextElement>
                <View style={onboardStyles.buttonContainer}>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
                </View>
            </View>
        )}
        {step === 3 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>See something you love? </TextElement>
                <SVGs.BookmarkIcon />
                <TextElement style={onboardStyles.bodyTextElement}>Save it for later. You'll find it on your profile tab</TextElement>
                <View style={onboardStyles.buttonContainer}>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                <Button style={onboardStyles.buttonStyles} onPress={() => handleClose()}><TextElement style={onboardStyles.buttonTextColor}>Done</TextElement></Button>
                </View>
            </View>
        )}
        </>
    )
}