import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Dialog, Portal, Button } from 'react-native-paper';

import { Input } from '../Components/Input';
import { Botao } from '../Components/Botao';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
    const navigation = useNavigation();
    const { login } = useContext(AuthContext);
    const logo = require('../../assets/logo.png');
    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [carregando, setCarregando] = useState(false);

    const [dialog, setDialog] = useState({
        visible: false,
        titulo: '',
        mensagem: ''
    });

    function mostrarDialog(titulo, mensagem) {
        setDialog({
            visible: true,
            titulo,
            mensagem
        });
    }

    function fecharDialog() {
        setDialog(prev => ({
            ...prev,
            visible: false
        }));
    }

    function Voltar() {
        navigation.goBack();
    }

    async function logar() {
        if (email.trim().length < 6) {
            mostrarDialog(
                'Atenção',
                'Preencha um e-mail válido.'
            );
            return;
        }

        if (senha.length < 6) {
            mostrarDialog(
                'Atenção',
                'Preencha uma senha válida.'
            );
            return;
        }

        try {
            setCarregando(true);

            const resposta = await fetch(`${url_back}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email.trim(),
                    senha
                })
            });

            const resultado = await resposta.json();

            if (resultado.status === 'true') {
                await login(
                    resultado.usuario,
                    resultado.token
                );

                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeScreen' }]
                });
            } else {
                mostrarDialog(
                    'Erro',
                    resultado.mensagem ||
                    'E-mail ou senha inválidos.'
                );
            }
        } catch (error) {
            mostrarDialog(
                'Erro',
                'Não foi possível conectar ao servidor.'
            );
        } finally {
            setCarregando(false);
        }
    }

    function esqueciSenha() {
        navigation.navigate('SenhaScreen');
    }

    return (
        <>
            <ImageBackground
                source={require('../../assets/fundo1.jpg')}
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

                            <TouchableOpacity onPress={esqueciSenha}>
                                <Text style={styles.forgot}>
                                    Esqueceu a senha?
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.button}
                                onPress={logar}
                                disabled={carregando}
                            >
                                {carregando ? (
                                    <ActivityIndicator
                                        size="small"
                                        color="#3b5b7a"
                                    />
                                ) : (
                                    <Text style={styles.buttonText}>
                                        LOGIN
                                    </Text>
                                )}
                            </TouchableOpacity>

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

    topContainer: {
        alignItems: 'center',
        marginTop: 40
    },

    imagem: {
        width: 150,
        height: 150
    },

    bottomContainer: {
        width: '80%'
    },

    forgot: {
        alignSelf: 'flex-end',
        color: '#3b5b7a',
        fontSize: 12,
        marginTop: -10,
        marginBottom: 30,
        textDecorationLine: 'underline'
    },

    button: {
        width: '60%',
        alignSelf: 'center',
        backgroundColor: 'rgba(200, 210, 220, 0.7)',
        paddingVertical: 12,
        borderRadius: 25,
        alignItems: 'center'
    },

    buttonText: {
        color: '#3b5b7a',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1
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