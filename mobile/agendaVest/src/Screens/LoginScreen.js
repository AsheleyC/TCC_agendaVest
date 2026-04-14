import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground, KeyboardAvoidingView, Button } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { Input } from '../Components/Input';
import { Botao } from '../Components/Botao';

export default function App() {

    const navigation = useNavigation()

    function Voltar(){
        navigation.goBack("InicioScreen")}

    return (
        <ImageBackground source={require("../../assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

            <View style={styles.topContainer}>
                <Image src='' style={styles.imagem} />
            </View>

            <View style={styles.bottomContainer}>

                <Input texto={"E-MAIL"} seguro={false} />

                <Input texto={"SENHA"} seguro={true} />

                <Text style={styles.forgot}>Esqueceu a senha?</Text>

                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>LOGIN</Text>
                </TouchableOpacity>
                
               <Botao texto={"VOLTAR"} acao={Voltar} />
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