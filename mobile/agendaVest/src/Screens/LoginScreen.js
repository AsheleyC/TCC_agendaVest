import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground, KeyboardAvoidingView } from 'react-native';

import { useState } from 'react';

import { useNavigation } from '@react-navigation/native';
import { Input } from '../Components/Input';

export default function App() {

    const url_back = process.env.EXPO_PUBLIC_API_URL

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    const navigation = useNavigation()

    async function logar() {
        try {
            console.log("URL:", url_back)
            if (email.length < 6) {
                return alert("Preencha um email válido!!")
            } else if (senha.length < 6) {
                return alert("Preencha uma senha válida!!")
            }

            const resposta = await fetch(`${url_back}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "email": email,
                        "senha": senha
                    })
                }
            )

            const resultado = await resposta.json()

            if (resultado.status == "true") {
                navigation.navigate("HomeScreen")
            } else if (resultado.status == "false") {
                return alert(resultado.mensagem)
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ImageBackground source={require("../../assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

            <View style={styles.topContainer}>
                <Image src='' style={styles.imagem} />
            </View>

            <View style={styles.bottomContainer}>

                <Input
                    texto={"E-MAIL"}
                    seguro={false}
                    set={setEmail}
                    value={email}
                />
                <Input
                    texto={"SENHA"}
                    seguro={true}
                    set={setSenha}
                    value={senha}
                />


                <Text style={styles.forgot}>Esqueceu a senha?</Text>

                <TouchableOpacity style={styles.button} onPress={logar}>
                    <Text style={styles.buttonText}>LOGIN</Text>
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