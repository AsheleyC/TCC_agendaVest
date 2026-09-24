import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Dialog, Portal, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
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
    const [cadastrando, setCadastrando] = useState(false);

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

    async function pickImageAsync() {
        try {
            const permissao =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (!permissao.granted) {
                mostrarDialog(
                    'Permissão necessária',
                    'Permita o acesso às suas fotos para escolher uma foto de perfil.'
                );

                return;
            }

            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ['images'],
                    allowsEditing: true,
                    aspect: [1, 1],
                    quality: 0.8
                });

            if (result.canceled) {
                return;
            }

            setSelectedImage(
                result.assets[0].uri
            );
        } catch (error) {
            mostrarDialog(
                'Erro',
                'Não foi possível selecionar a imagem.'
            );
        }
    }

    async function CriarCadastro() {
        const nomeUsuario =
            usuario.trim();

        const emailFormatado =
            email.trim().toLowerCase();

        const palavraChave =
            palavra_chave.trim();

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                emailFormatado
            );

        if (
            !nomeUsuario ||
            !emailFormatado ||
            !senha ||
            !palavraChave
        ) {
            mostrarDialog(
                'Atenção',
                'Preencha todos os campos.'
            );

            return;
        }

        if (nomeUsuario.length < 3) {
            mostrarDialog(
                'Atenção',
                'O nome de usuário deve conter no mínimo 3 caracteres.'
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

        if (palavraChave.length < 3) {
            mostrarDialog(
                'Atenção',
                'A palavra-chave deve conter no mínimo 3 caracteres.'
            );

            return;
        }

        try {
            setCadastrando(true);

            const formulario = new FormData();

            formulario.append(
                'nome_usuario',
                nomeUsuario
            );

            formulario.append(
                'email',
                emailFormatado
            );

            formulario.append(
                'senha',
                senha
            );

            formulario.append(
                'palavra_chave',
                palavraChave
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

            const resultado =
                await resposta.json();

            if (
                resposta.ok &&
                resultado.status === 'true'
            ) {
                mostrarDialog(
                    'Cadastro realizado',
                    resultado.resposta ||
                    'Sua conta foi criada com sucesso.',
                    () => {
                        navigation.replace(
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
            mostrarDialog(
                'Erro',
                'Não foi possível conectar ao servidor.'
            );
        } finally {
            setCadastrando(false);
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
                        contentContainerStyle={styles.scrollContainer}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            style={styles.voltarContainer}
                            onPress={Voltar}
                        >
                            <Text style={styles.voltar}>
                                ← Voltar
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.topContainer}>
                            {selectedImage ? (
                                <Image
                                    source={{
                                        uri: selectedImage
                                    }}
                                    style={styles.imagem}
                                />
                            ) : (
                                <View style={styles.imagemPadrao}>
                                    <Ionicons
                                        name="person-outline"
                                        size={55}
                                        color="#FFFFFF"
                                    />
                                </View>
                            )}

                            <TouchableOpacity
                                style={styles.areaFoto}
                                onPress={pickImageAsync}
                                disabled={cadastrando}
                            >
                                <Ionicons
                                    name="camera-outline"
                                    size={15}
                                    color="#3b5b7a"
                                />

                                <Text style={styles.foto}>
                                    {selectedImage
                                        ? 'Trocar foto de perfil'
                                        : 'Escolher foto de perfil'}
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.buttonContainer}>
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
                                placeholder="Ex.: Qual cidade você nasceu?"
                            />

                            {cadastrando ? (
                                <View style={styles.botaoCarregando}>
                                    <ActivityIndicator
                                        size="small"
                                        color="#FFFFFF"
                                    />

                                    <Text style={styles.textoCarregando}>
                                        CADASTRANDO...
                                    </Text>
                                </View>
                            ) : (
                                <Botao
                                    texto="CADASTRAR"
                                    acao={CriarCadastro}
                                />
                            )}
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
                    <Dialog.Title style={styles.dialogTitulo}>
                        {dialog.titulo}
                    </Dialog.Title>

                    <Dialog.Content>
                        <Text style={styles.dialogTexto}>
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
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingVertical: 60
    },

    voltarContainer: {
        position: 'absolute',
        top: 65,
        left: 20,
        zIndex: 10
    },

    voltar: {
        color: '#285E73',
        fontSize: 16,
        fontWeight: '500'
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

    imagemPadrao: {
        width: 150,
        height: 150,
        borderRadius: 100,
        backgroundColor: '#5f7f95',
        alignItems: 'center',
        justifyContent: 'center'
    },

    areaFoto: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        marginTop: 12
    },

    foto: {
        color: '#3b5b7a',
        fontSize: 13,
        textDecorationLine: 'underline'
    },

    buttonContainer: {
        width: '80%'
    },

    botaoCarregando: {
        backgroundColor: '#285E73',
        borderRadius: 25,
        paddingVertical: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 8,
        marginVertical: 8
    },

    textoCarregando: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold'
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