import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useNavigation } from '@react-navigation/native';
import { Input } from '../Components/Input';
import { Botao } from '../Components/Botao';
import { useState } from 'react';

export default function App() {
    const navigation = useNavigation()

    const url = process.env.EXPO_PUBLIC_API_URL

    function FazerLogin() {
        navigation.navigate("LoginScreen")
    }

    const [selectedImage, setSelectedImage] = useState("");

    const [usuario, setUsuario] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [palavra_chave, setpalavra_chave] = useState("")

    const pickImageAsync = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setSelectedImage(result.assets[0].uri);
        } else {
            Alert.alert("Atenção", 'Você não selecionou nenhuma imagem');
        }
    };

    async function CriarCadastro() {
        const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

        if (usuario.length < 3 || palavra_chave.length < 3) {
            return Alert.alert("Atenção", "O nome de usuário/palavra-chave deve conter no mínimo 3 caracteres")
        }
        if (!emailValido) {
            return Alert.alert(
                "Atenção",
                "Digite um e-mail válido. Exemplo: usuario@domínio.com"
            )
        }

        if (senha.length < 5) {
            return Alert.alert("Atenção", "A senha deve conter no mínimo 6 caracteres")
        }

        try {
            console.log("URL DO BACK:", url)

            const formulario = new FormData()

            formulario.append('nome_usuario', usuario)
            formulario.append('email', email)
            formulario.append('senha', senha)
            formulario.append('palavra_chave', palavra_chave)

            if (selectedImage) {
                formulario.append('foto', {
                    uri: selectedImage,
                    name: 'foto_perfil.jpg',
                    type: 'image/jpeg'
                })
            }

            const resposta = await fetch(`${url}/cadastro`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json'
                },
                body: formulario
            })

            const resultado = await resposta.json()

            alert(resultado.resposta)

            if (resultado.status === "true") {
                navigation.navigate("LoginScreen")
            }

        } catch (error) {
            console.log(error)
        }
    }

    function Voltar() {
        navigation.goBack()
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
                            source={{ uri: selectedImage }}
                            style={styles.imagem}
                        />

                        <TouchableOpacity onPress={pickImageAsync}>
                            <Text style={styles.foto}>
                                Escolher foto de perfil
                            </Text>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.buttonContainer}>

                        <Input
                            texto={"NOME DE USUÁRIO"}
                            seguro={false}
                            set={setUsuario}
                            value={usuario}
                        />

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

                        <Input
                            texto={"PALAVRA CHAVE"}
                            seguro={false}
                            set={setpalavra_chave}
                            value={palavra_chave}
                            placeholder={"cidade onde nasceu?"}
                        />

                        <Botao
                            texto={"CADASTRAR"}
                            acao={CriarCadastro}
                        />

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
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 60,
    },

    topContainer: {
        alignItems: 'center',
        marginTop: 40
    },

    imagem: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: '#5f7f95',
    },

    buttonContainer: {
        width: '80%'
    },

    foto: {
        color: '#3b5b7a',
        fontSize: 13,
        marginTop: 12,
        textDecorationLine: 'underline',
    }
});