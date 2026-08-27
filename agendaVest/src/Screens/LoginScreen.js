import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useState, useContext} from 'react';
import { useNavigation } from '@react-navigation/native';

import { Input } from '../Components/Input';
import { Botao } from '../Components/Botao';
import{AuthContext} from '../context/AuthContext';

export default function App() {

    const navigation = useNavigation()
    const {login} = useContext(AuthContext)
    const logo = require('../../assets/logo.png')

    function Voltar() {
        navigation.goBack("InicioScreen")
    }

    const url_back = process.env.EXPO_PUBLIC_API_URL

    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")

    async function logar() {
        try {
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
                login(resultado.usuario)
                console.log('USUÁRIO LOGADO:', resultado.usuario);
                navigation.navigate("HomeScreen")
            } else if (resultado.status == "false") {
                return alert(resultado.mensagem)
            }

        } catch (error) {
            console.log(error)
        }
    }

    function esqueciSenha() {
        navigation.navigate("SenhaScreen")
    }

    return (
        <ImageBackground
            source={require("../../assets/fundo1.jpg")}
            resizeMode="cover"
            style={styles.container}
        >

            <KeyboardAvoidingView
                style={{ flex: 1, width: '100%' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >

                <ScrollView
                    contentContainerStyle={styles.scrollContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >

                    <View style={styles.topContainer}>
                        <Image
                            source={logo}
                            style={styles.imagem}
                        />
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

                        <TouchableOpacity onPress={esqueciSenha}>
                            <Text style={styles.forgot}>
                                Esqueceu a senha?
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.button}
                            onPress={logar}
                        >
                            <Text style={styles.buttonText}>
                                LOGIN
                            </Text>
                        </TouchableOpacity>

                        <Botao
                            texto={"VOLTAR"}
                            acao={Voltar}
                        />

                    </View>

                </ScrollView>

            </KeyboardAvoidingView>

        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    scrollContainer: {
        flexGrow: 1,
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