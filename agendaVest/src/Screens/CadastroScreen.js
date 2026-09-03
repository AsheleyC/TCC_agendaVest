import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';

import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { Input } from '../Components/Input';
import { Botao } from '../Components/Botao';
import { useState } from 'react';

export default function CadastroScreen() {
    const navigation = useNavigation();
    const url = process.env.EXPO_PUBLIC_API_URL;

    const [selectedImage, setSelectedImage] = useState('');
    const [usuario, setUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [palavra_chave, setPalavra_chave] = useState('');

    const [dialog, setDialog] = useState({
        visible: false,
        titulo: '',
        mensagem: '',
        acaoDepois: null
    });

    function mostrarDialog(
        titulo,
        mensagem,
        acaoDepois = null
    ) {
        setDialog({
            visible: true,
            titulo,
            mensagem,
            acaoDepois
        });
    }

    function fecharDialog() {
        const acao = dialog.acaoDepois;

        setDialog({
            visible: false,
            titulo: '',
            mensagem: '',
            acaoDepois: null
        });

        if (acao) {
            acao();
        }
    }

    const pickImageAsync = async () => {
        try {
            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    quality: 1
                });

            if (!result.canceled) {
                setSelectedImage(result.assets[0].uri);
            } else {
                mostrarDialog(
                    'Atenção',
                    'Você não selecionou nenhuma imagem.'
                );
            }
        } catch (error) {
            console.log(
                'Erro ao selecionar imagem:',
                error
            );

            mostrarDialog(
                'Erro',
                'Não foi possível selecionar a imagem.'
            );
        }
    };

    async function CriarCadastro() {
        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

        if (
            usuario.trim().length < 3 ||
            palavra_chave.trim().length < 3
        ) {
            mostrarDialog(
                'Atenção',
                'O nome de usuário e a palavra-chave devem conter no mínimo 3 caracteres.'
            );
            return;
        }

        if (!emailValido) {
            mostrarDialog(
                'Atenção',
                'Digite um e-mail válido. Exemplo: usuario@dominio.com'
            );
            return;
        }

        if (senha.length < 6) {
            mostrarDialog(
                'Atenção',
                'A senha deve conter no mínimo 6 caracteres.'
            );
            return;
        }

        try {
            console.log('URL DO BACK:', url);

            const formulario = new FormData();

            formulario.append(
                'nome_usuario',
                usuario.trim()
            );

            formulario.append(
                'email',
                email.trim()
            );

            formulario.append(
                'senha',
                senha
            );

            formulario.append(
                'palavra_chave',
                palavra_chave.trim()
            );

            if (selectedImage) {
                formulario.append('foto', {
                    uri: selectedImage,
                    name: 'foto_perfil.jpg',
                    type: 'image/jpeg'
                });
            }

            const resposta = await fetch(
                `${url}/cadastro`,
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json'
                    },
                    body: formulario
                }
            );

            const resultado = await resposta.json();

            if (
                resposta.ok &&
                resultado.status === 'true'
            ) {
                mostrarDialog(
                    'Cadastro realizado',
                    resultado.resposta ||
                    'Sua conta foi criada com sucesso.',
                    () => {
                        navigation.navigate(
                            'LoginScreen'
                        );
                    }
                );

                return;
            }

            mostrarDialog(
                'Atenção',
                resultado.resposta ||
                resultado.mensagem ||
                'Não foi possível realizar o cadastro.'
            );
        } catch (error) {
            console.log(
                'Erro ao realizar cadastro:',
                error
            );

            mostrarDialog(
                'Erro',
                'Não foi possível conectar ao servidor.'
            );
        }
    }

    function Voltar() {
        navigation.goBack();
    }

    return (
        <>
            <ImageBackground
                source={require('../../assets/fundo1.jpg')}
                resizeMode="cover"
                style={styles.container}
            >
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        width: '100%'
                    }}
                    behavior={
                        Platform.OS === 'ios'
                            ? 'padding'
                            : 'height'
                    }
                >
                    <ScrollView
                        contentContainerStyle={
                            styles.scrollContainer
                        }
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <View
                            style={styles.topContainer}
                        >
                            <Image
                                source={
                                    selectedImage
                                        ? {
                                            uri: selectedImage
                                        }
                                        : undefined
                                }
                                style={styles.imagem}
                            />

                            <TouchableOpacity
                                onPress={pickImageAsync}
                            >
                                <Text
                                    style={styles.foto}
                                >
                                    Escolher foto de perfil
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View
                            style={styles.buttonContainer}
                        >
                            <Input
                                texto="NOME DE USUÁRIO"
                                seguro={false}
                                set={setUsuario}
                                value={usuario}
                            />

                            <Input
                                texto="E-MAIL"
                                seguro={false}
                                set={setEmail}
                                value={email}
                            />

                            <Input
                                texto="SENHA"
                                seguro={true}
                                set={setSenha}
                                value={senha}
                            />

                            <Input
                                texto="PALAVRA CHAVE"
                                seguro={false}
                                set={setPalavra_chave}
                                value={palavra_chave}
                                placeholder="cidade onde nasceu?"
                            />

                            <Botao
                                texto="CADASTRAR"
                                acao={CriarCadastro}
                            />

                            <Botao
                                texto="VOLTAR"
                                acao={Voltar}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>

            <Portal>
                <Dialog
                    visible={dialog.visible}
                    onDismiss={fecharDialog}
                    style={styles.dialog}
                >
                    <Dialog.Title
                        style={styles.dialogTitulo}
                    >
                        {dialog.titulo}
                    </Dialog.Title>

                    <Dialog.Content>
                        <Text
                            style={styles.dialogTexto}
                        >
                            {dialog.mensagem}
                        </Text>
                    </Dialog.Content>

                    <Dialog.Actions>
                        <Button
                            onPress={fecharDialog}
                            textColor="#285E73"
                        >
                            OK
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },

    scrollContainer: {
        flexGrow: 1,
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
        backgroundColor: '#5f7f95'
    },

    buttonContainer: {
        width: '80%'
    },

    foto: {
        color: '#3b5b7a',
        fontSize: 13,
        marginTop: 12,
        textDecorationLine: 'underline'
    },

    dialog: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16
    },

    dialogTitulo: {
        color: '#285E73',
        fontWeight: 'bold'
    },

    dialogTexto: {
        color: '#5C6B73',
        fontSize: 14,
        lineHeight: 20
    }
});