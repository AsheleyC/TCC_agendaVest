import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function App() {

    const navigation = useNavigation()
    function irLog(){
        navigation.navigate("LoginScreen")
    }


    return (
        <ImageBackground source={require("../../assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

            <TouchableOpacity style={styles.button} onPress={irLog}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>CADASTRO</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>VISITANTE</Text>
            </TouchableOpacity>

        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        alignItems: 'center',
        marginTop: 40,
    },
    button: {
        width: '70%',
        backgroundColor: 'rgba(200, 210, 220, 0.6)',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
    },

    buttonText: {
        color: '#3b5b7a',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
