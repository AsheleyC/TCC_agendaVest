import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Botao } from '../Components/Botao';
import { Input } from '../Components/Input';

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function App() {

    const url_back = process.env.EXPO_PUBLIC_API_URL

    const navigation = useNavigation()
    const logo = require('../../assets/logo.png')


    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [palavra_chave, setPalavra_chave] = useState("")
    const [senhaconfirm, setSenhaconfirm] = useState("")

    function voltarLog() {
        navigation.goBack()
    }

    async function salvarSenha() {
        try {
            if (email.length == 0) {
                return alert("Adicione um email no campo")
            }
            if (senha.length < 6) {
                return alert("A senha deve conter no mínimo 6 caracteres")
            }
            if (senha != senhaconfirm) {
                return alert("As senhas não coincidem")
            }

            const resposta = await fetch(`${url_back}/atualizarSenha`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        "email": email,
                        "senha_nova": senha,
                        "palavra_chave": palavra_chave
                    })
                }
            )

            const resultado = await resposta.json()

            if (resultado.status == "true") {
                alert("Senha alterada com sucesso")
                navigation.goBack()
            } else if (resultado.status == "false") {
                return alert(resultado.mensagem)
            }

        } catch (error) {
            console.log(error)
        }
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
                            texto={"EMAIL"}
                            seguro={false}
                            set={setEmail}
                            value={email}
                        />

                        <Input
                            texto={"NOVA SENHA"}
                            seguro={true}
                            set={setSenha}
                            value={senha}
                        />

                        <Input
                            texto={"CONFIRMAR SENHA"}
                            seguro={true}
                            set={setSenhaconfirm}
                            value={senhaconfirm}
                        />

                        <Input
                            texto={"PALAVRA CHAVE"}
                            seguro={false}
                            set={setPalavra_chave}
                            value={palavra_chave}
                        />

                        <Botao
                            texto={"SALVAR SENHA"}
                            acao={salvarSenha}
                        />

                        <Botao
                            texto={"VOLTAR"}
                            acao={voltarLog}
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