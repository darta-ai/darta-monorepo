import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Button } from 'react-native-paper'
import * as Colors from '@darta-styles'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import { TextElement } from '../Elements/TextElement';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HAS_ONBOARD_DARTA_PART_2 } from '../../utils/constants';
import * as SVGs from '../../assets/SVGs';

const onboardStyles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: hp('15%'),
        width: wp('90%'),
        height: hp('30%'),
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
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
            </View>
        )}
        {step === 1 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Tap and swipe this screen</TextElement>
                <SVGs.SwipeIcon />
                <TextElement style={onboardStyles.bodyTextElement}>Swipe right and left to browse artwork</TextElement>
                <TextElement style={onboardStyles.bodyTextElement}>Long press on the artwork for more details</TextElement>
                <View style={onboardStyles.buttonContainer}>
                    <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                    <Button style={onboardStyles.buttonStyles} onPress={() => handleClose()}><TextElement style={onboardStyles.buttonTextColor}>Done</TextElement></Button>
                </View>
            </View>
        )}
        </>
    )
}