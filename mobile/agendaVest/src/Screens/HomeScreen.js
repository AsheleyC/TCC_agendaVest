import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground, KeyboardAvoidingView } from 'react-native';

import { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Input } from '../Components/Input';

export default function App() {
    return (
        <View style={styles.container}>

            <Text>HOME</Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 60,
    },
});