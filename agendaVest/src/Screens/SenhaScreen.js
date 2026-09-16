import { StyleSheet, Text, View, TouchableOpacity, Image, ImageBackground, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
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

    function mostrarDialog(
        titulo,
        mensagem,
        voltarDepois = false
    ) {
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
            if (
                !email ||
                !senha ||
                !palavra_chave ||
                !senhaconfirm
            ) {
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
                        email: email.trim(),
                        senha_nova: senha,
                        palavra_chave:
                            palavra_chave.trim()
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

                return;
            }

            if (resultado.status === 'false') {
                mostrarDialog(
                    'Erro',
                    resultado.mensagem ||
                    'Não foi possível alterar a senha.'
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
                        contentContainerStyle={
                            styles.scrollContainer
                        }
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            style={styles.voltarContainer}
                            onPress={voltarLog}
                        >
                            <Text style={styles.voltar}>
                                ← Voltar
                            </Text>
                        </TouchableOpacity>

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
                            />

                            <Botao
                                texto="SALVAR SENHA"
                                acao={salvarSenha}
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
        height: 150
    },

    bottomContainer: {
        width: '80%'
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