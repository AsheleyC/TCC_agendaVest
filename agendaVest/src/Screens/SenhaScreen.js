import { StyleSheet, Text, View, Image, ImageBackground, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';

import { Dialog, Portal, Button } from 'react-native-paper';
import { Botao } from '../Components/Botao';
import { Input } from '../Components/Input';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function SenhaScreen() {
    const url_back = process.env.EXPO_PUBLIC_API_URL;
    const navigation = useNavigation();
    const logo = require('../../assets/logo.png');

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [palavra_chave, setPalavra_chave] = useState('');
    const [senhaconfirm, setSenhaconfirm] = useState('');

    const [dialog, setDialog] = useState({
        visible: false,
        titulo: '',
        mensagem: '',
        voltarDepois: false
    });

    function mostrarDialog(titulo, mensagem, voltarDepois = false) {
        setDialog({
            visible: true,
            titulo,
            mensagem,
            voltarDepois
        });
    }

    function fecharDialog() {
        const voltarDepois = dialog.voltarDepois;

        setDialog({
            visible: false,
            titulo: '',
            mensagem: '',
            voltarDepois: false
        });

        if (voltarDepois) {
            navigation.goBack();
        }
    }

    function voltarLog() {
        navigation.goBack();
    }

    async function salvarSenha() {
        try {
            if (!email || !senha || !palavra_chave || !senhaconfirm) {
                mostrarDialog(
                    'Atenção',
                    'Preencha todos os campos.'
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

            if (senha !== senhaconfirm) {
                mostrarDialog(
                    'Atenção',
                    'As senhas não coincidem.'
                );
                return;
            }

            const resposta = await fetch(
                `${url_back}/atualizarSenha`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        email: email,
                        senha_nova: senha,
                        palavra_chave: palavra_chave
                    })
                }
            );

            const resultado = await resposta.json();

            if (resultado.status === 'true') {
                mostrarDialog(
                    'Sucesso',
                    'Senha alterada com sucesso.',
                    true
                );
            } else if (resultado.status === 'false') {
                mostrarDialog(
                    'Erro',
                    resultado.mensagem
                );
            }
        } catch (error) {
            mostrarDialog(
                'Erro',
                'Não foi possível conectar ao servidor.'
            );
        }
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
                        <View style={styles.topContainer}>
                            <Image
                                source={logo}
                                style={styles.imagem}
                            />
                        </View>

                        <View style={styles.bottomContainer}>
                            <Input
                                texto="EMAIL"
                                seguro={false}
                                set={setEmail}
                                value={email}
                            />

                            <Input
                                texto="NOVA SENHA"
                                seguro={true}
                                set={setSenha}
                                value={senha}
                            />

                            <Input
                                texto="CONFIRMAR SENHA"
                                seguro={true}
                                set={setSenhaconfirm}
                                value={senhaconfirm}
                            />

                            <Input
                                texto="PALAVRA CHAVE"
                                seguro={false}
                                set={setPalavra_chave}
                                value={palavra_chave}
                                placeholder="cidade onde nasceu?"
                            />

                            <Botao
                                texto="SALVAR SENHA"
                                acao={salvarSenha}
                            />

                            <Botao
                                texto="VOLTAR"
                                acao={voltarLog}
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