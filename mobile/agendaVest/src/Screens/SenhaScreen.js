import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground, KeyboardAvoidingView } from 'react-native';

import { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Input } from '../Components/Input';

export default function App() {

    const navigation = useNavigation()

    function voltarLog(){
        navigation.goBack()
    }

    return (
        <ImageBackground source={require("../../assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

            <View style={styles.topContainer}>
                <Image src='' style={styles.imagem} />
            </View>

            <View style={styles.bottomContainer}>

                <Input
                    texto={"NOVA SENHA"}
                    seguro={false}
    
                />
                <Input
                    texto={"CONFIRMAR SENHA"}
                    seguro={true}
         
                />

                <TouchableOpacity  style={styles.button}>
                    <Text style={styles.buttonText}>SALVAR SENHA</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={voltarLog}>
                    <Text style={styles.buttonText}>VOLTAR</Text>
                </TouchableOpacity>

            </View>


        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 60,
    },

    topContainer: {
        alignItems: 'center',
        marginTop: 40,
    },

    imagem: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: '#5f7f95',
    },

    bottomContainer: {
        width: '80%',
    },

    forgot: {
        alignSelf: 'flex-end',
        color: '#3b5b7a',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 30,
        textDecorationLine: 'underline',
    },

    button: {
        width: '60%',
        alignSelf: 'center',
        backgroundColor: 'rgba(200, 210, 220, 0.7)',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
    },

    buttonText: {
        color: '#3b5b7a',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});