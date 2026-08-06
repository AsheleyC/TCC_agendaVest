import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

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
        if (usuario.length < 3) {
            return Alert.alert("Atenção", "Preencha o campo nome corretamennte")
        }
        if (email.length < 5) {
            return Alert.alert("Atenção", "Preencha o campo e-mail corretamente")
        }
        if (senha.length < 5) {
            return Alert.alert("Atenção", "Preencha o campo senha corretamente")
        }
        try {
            console.log("URL DO BACK:", url)
            
            const resposta = await fetch(`${url}/cadastro`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    }, body: JSON.stringify({
                        "nome_usuario": usuario,
                        "email": email,
                        "senha": senha,
                        "foto_perfil": selectedImage || null
                    })
                }
            )

            const resultado = await resposta.json()

            alert(resultado.resposta)

        } catch (error) {
            console.log(error)
        }
    }

    function FazerLogin() {
        navigation.navigate("LoginScreen")
    }
    function Voltar() {
        navigation.goBack()
    }

    return (
        <ImageBackground source={require("../../assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

            <View style={styles.topContainer}>
                <Image source={{ uri: selectedImage }} style={styles.imagem} />
                <TouchableOpacity
                    onPress={pickImageAsync}>
                    <Text style={styles.foto}>Escolher foto de perfil</Text>
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

                <Botao texto={"CADASTRAR"} acao={CriarCadastro} />

                <Botao texto={"FAZER LOGIN"} acao={FazerLogin} />

                <Botao texto={"VOLTAR"} acao={Voltar} />
            </View>

        </ImageBackground >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        paddingVertical: 60
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
