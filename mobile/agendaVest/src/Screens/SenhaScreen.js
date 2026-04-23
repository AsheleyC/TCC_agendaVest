import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground, KeyboardAvoidingView } from 'react-native';

import { Botao } from '../Components/Botao';
import { Input } from '../Components/Input';

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function App() {

    const navigation = useNavigation()

    const {email, setEmail} = useState("")
    const {senha, setSenha} = useState("")
    const {senhaconfirm, setSenhaconfirm} = useState("")

    function voltarLog() {
        navigation.goBack()
    }

    async function salvarSenha(){
        try {
            if (senha.length < 6) {
                return alert("A senha deve conter no Mínimo 6 caracteres")
            }
            if (senha != senhaconfirm) {
                return alert("Confirme corretamente a senha")
            }

            const resposta = await fetch(`${url_back}/login`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "email": email,
                        "senha_nova": senha
                    })
                }
            )

            const resultado = await resposta.json()

            if (resultado.status == true) {
                navigation.navigate("LoginScreen")
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

                <Botao texto={"SALVAR SENHA"} acao={salvarSenha} />
                <Botao texto={"VOLTAR"} acao={voltarLog} />

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