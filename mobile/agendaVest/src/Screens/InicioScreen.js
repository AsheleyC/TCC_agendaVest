import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function App() {

    const navigation = useNavigation()
    function irLog() {
        navigation.navigate("LoginScreen")
    }
    function irCad() {
        navigation.navigate("CadastroScreen")
    }


    return (
        <ImageBackground source={require("../../assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

            <Image src='' style={styles.imagem} />

            <View style={styles.bottomContainer}>
                <TouchableOpacity style={styles.button} onPress={irLog}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={irCad}>
                    <Text style={styles.buttonText}>CADASTRO</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>VISITANTE</Text>
                </TouchableOpacity>
            </View>

        </ImageBackground >
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
        width: '100%',
        alignItems: 'center',
        marginBottom: 40,
    },

    button: {
        width: '70%',
        backgroundColor: 'rgba(200, 210, 220, 0.6)',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 10,
    },

    buttonText: {
        color: '#3b5b7a',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});
