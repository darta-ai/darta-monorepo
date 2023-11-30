import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

const addToListStyles = StyleSheet.create({
    container: {
        height: '95%',
        width: '100%',
        backgroundColor: 'white',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    }
})


export function AddToListScreen({
    navigation,
}: {
    navigation?: any;
}) {
    return (
        <View style={addToListStyles.container}>
            <Text>Add to list</Text>
        </View>
    )
}