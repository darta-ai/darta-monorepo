import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {Button} from 'react-native-paper'
import * as Colors from '@darta-styles'
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
  } from 'react-native-responsive-screen';
import { TextElement } from '../Elements/TextElement';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HAS_ONBOARD_DARTA, icons } from '../../utils/constants';

const onboardStyles = StyleSheet.create({
    overlay: {
        position: "absolute",
        top: hp('50%'),
        width: wp('90%'),
        height: hp('20%'),
        display: "flex",
        flexDirection: "column",
        gap: hp('2%'),
        alignSelf: "center",
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.PRIMARY_50, 
        zIndex: 1000,
        transform: [{translateY: -hp('5%')}],
        opacity: 0.75,
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
    const [step, setStep] = React.useState<number>(7)

    const handleClose = async () => {
        setStep(step => step + 1)
        await AsyncStorage.setItem(HAS_ONBOARD_DARTA, 'true')
    }

    React.useEffect(() => {
        const getStorage = async () => {
            const hasSeenOnboard = await AsyncStorage.getItem(HAS_ONBOARD_DARTA)
            if (!hasSeenOnboard) setStep(0)
        }
        getStorage()
    }, [])


    return(
        <>
        {step === 0 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Hi, welcome to darta!</TextElement>
                <TextElement style={onboardStyles.bodyTextElement}>Let's get started</TextElement>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
            </View>
        )}
        {step === 1 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Swipe Up <TextElement>Once</TextElement> To Like Artwork</TextElement>
                <TextElement style={onboardStyles.bodyTextElement}>👆</TextElement>
                <View style={onboardStyles.buttonContainer}>
                    <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                    <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
                </View>
            </View>
        )}
        {step === 2 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Swipe Up <TextElement>Twice</TextElement> To Save Artwork</TextElement>
                <TextElement style={onboardStyles.bodyTextElement}>👆👆</TextElement>
                <View style={onboardStyles.buttonContainer}>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
                </View>
            </View>
        )}
        {step === 3 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Swipe Down To Dislike Artwork</TextElement>
                <TextElement style={onboardStyles.bodyTextElement}>👇</TextElement>
                <View style={onboardStyles.buttonContainer}>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
                </View>
            </View>
        )}
        {step === 4 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Swipe Left To View Next Artwork</TextElement>
                <TextElement style={onboardStyles.bodyTextElement}>👈</TextElement>
                <View style={onboardStyles.buttonContainer}>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
                </View>
            </View>
        )}
        {step === 5 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Swipe Right To View Last Artwork</TextElement>
                <TextElement style={onboardStyles.bodyTextElement}>👉</TextElement>
                <View style={onboardStyles.buttonContainer}>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step + 1)}><TextElement style={onboardStyles.buttonTextColor}>Next</TextElement></Button>
                </View>
            </View>
        )}
        {step === 6 && (
            <View style={onboardStyles.overlay}>
                <TextElement style={onboardStyles.headerTextElement}>Press <Icon name="info"/> to view artwork</TextElement>
                <TextElement style={onboardStyles.bodyTextElement}>{"(top right)"}</TextElement>
                <View style={onboardStyles.buttonContainer}>
                <Button style={onboardStyles.buttonStyles} onPress={() => setStep(step => step - 1)}><TextElement style={onboardStyles.buttonTextColor}>Back</TextElement></Button>
                <Button style={onboardStyles.buttonStyles} onPress={() => handleClose()}><TextElement style={onboardStyles.buttonTextColor}>Done</TextElement></Button>
                </View>
            </View>
        )}

        </>
    )
}