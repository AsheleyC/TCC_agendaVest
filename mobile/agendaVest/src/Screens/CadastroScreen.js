import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image, ImageBackground } from 'react-native';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { useNavigation } from '@react-navigation/native';
import { Input } from '../Components/Input';
import { Botao } from '../Components/Botao';
import { useState } from 'react';

export default function App() {
    const navigation = useNavigation()

    function FazerLogin() {
        navigation.navigate("LoginScreen")
    }

    const [selectedImage, setSelectedImage] = useState("");

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
        if (nome_usuario.lenght > 3){
            return Alert.alert("Atenção", "Preencha corretamente o campo nome corretamnente")
        }
        if (email.lenght > 5){
            return Alert.alert("Atenção", "Preencha corretamente o campo e-mail corretamente")
        }
        if (email.lenght > 5){
            return Alert.alert("Atenção", "Preencha corretamente o campo senha corretamente")
        }
        try {
            const resposta = await fetch(`http://10.111.9.30:3003/cadastro`,
                {
                    method: "POST",
                    headers:{
                        "Content-Type":"application/json"
                    }, body: JSON.stringify({
                        "nome_usuario":nome_usuario,
                        "email":email,
                        "senha":senha
                    })
                }
            )

            const resultado = await resposta.json()
            alert(resultado.resposta)

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <ImageBackground source={require("../../assets/fundo1.jpg")} resizeMode="cover" style={styles.container}>

            <View style={styles.topContainer}>
                <Image src={selectedImage} style={styles.imagem} />
                <TouchableOpacity
                    onPress={pickImageAsync}>
                    <Text style={styles.foto}>Escolher foto de perfil</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <Input texto={"NOME DE USUÁRIO"} seguro={false} />

                <Input texto={"E-MAIL"} seguro={false} />

                <Input texto={"SENHA"} seguro={true} />

                <Botao texto={"CADASTRAR"} acao={CriarCadastro} />

                <Botao texto={"FAZER LOGIN"} acao={FazerLogin} />
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

    foto:{
        color: '#3b5b7a',
        fontSize: 13,
        marginTop: 12,
        textDecorationLine: 'underline',
    }



});
