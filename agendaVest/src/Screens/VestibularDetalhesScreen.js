import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Linking } from 'react-native';

import { Dialog, Portal, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';

export default function VestibularDetalhesScreen() {
    const navigation = useNavigation();
    const route = useRoute();

    const { id_vestibular } = route.params;
    const { usuario } = useContext(AuthContext);
    const url_back = process.env.EXPO_PUBLIC_API_URL;

    const [vestibular, setVestibular] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);
    const [adicionando, setAdicionando] = useState(false);

    const [dialog, setDialog] = useState({
        visible: false,
        titulo: '',
        mensagem: ''
    });

    const [dialogLogin, setDialogLogin] = useState(false);

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

    function fecharDialogLogin() {
        setDialogLogin(false);
    }

    function irParaLogin() {
        setDialogLogin(false);
        navigation.navigate('LoginScreen');
    }

    async function buscarDetalhes() {
        try {
            setCarregando(true);
            setErro(false);

            const resposta = await fetch(
                `${url_back}/verVest/${id_vestibular}`
            );

            if (!resposta.ok) {
                throw new Error('Erro ao buscar detalhes');
            }

            const dados = await resposta.json();

            setVestibular(dados);

        } catch (error) {
            setErro(true);
            console.error('Erro ao buscar detalhes do vestibular:', error);
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarDetalhes();
    }, []);

    async function abrirEdital() {
        if (!vestibular.link_edital) {
            return;
        }

        await Linking.openURL(vestibular.link_edital);
    }

    function abrirProvas() {
        navigation.navigate('ProvasScreen', {
            id_vestibular: id_vestibular,
            nomeVestibular: vestibular.vestibular
        });
    }

    async function adicionarInscricao() {

        // 1. Verifica se existe usuário logado
        if (!usuario) {
            setDialogLogin(true);
            return;
        }

        try {
            setAdicionando(true);

            // 2. Monta os dados que serão enviados para o backend
            const dados = {
                id_usuario: usuario.id_usuario,
                id_vestibular: id_vestibular,
                notificar_inscricao: true
            };

            // 3. Envia para o backend
            const resposta = await fetch(
                `${url_back}/addInscricao`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dados)
                }
            );

            // 4. Converte a resposta para JSON
            const resultado = await resposta.json();

            // 5. Vestibular adicionado
            if (resposta.status === 201) {
                mostrarDialog(
                    'Sucesso!',
                    'Vestibular adicionado à sua agenda.'
                );
                return;
            }

            // 6. Vestibular já estava na agenda
            if (resposta.status === 409) {
                mostrarDialog(
                    'Atenção',
                    resultado.mensagem
                );
                return;
            }

            // 7. Algum outro erro aconteceu
            mostrarDialog(
                'Erro',
                resultado.mensagem ||
                resultado.erro ||
                'Não foi possível adicionar o vestibular.'
            );

        } catch (error) {
            mostrarDialog(
                'Erro',
                'Não foi possível conectar ao servidor.'
            );

        } finally {
            setAdicionando(false);
        }
    }

    if (carregando) {
        return (
            <View style={styles.containerCentral}>

                <ActivityIndicator
                    size="large"
                    color="#285E73"
                />

                <Text style={styles.textoCarregando}>
                    Carregando detalhes...
                </Text>

            </View>
        );
    }

    if (erro || !vestibular) {
        return (
            <View style={styles.containerCentral}>

                <Text style={styles.textoErro}>
                    Não foi possível carregar os detalhes.
                </Text>

                <TouchableOpacity
                    style={styles.botao}
                    onPress={buscarDetalhes}
                >
                    <Text style={styles.textoBotao}>
                        TENTAR NOVAMENTE
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.botaoVoltar}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.textoBotao}>
                        VOLTAR
                    </Text>
                </TouchableOpacity>

            </View>
        );
    }

    return (
        <>
            <View style={styles.container}>

                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.voltar}>
                        ← Voltar
                    </Text>
                </TouchableOpacity>

                <Text style={styles.title}>
                    {vestibular.vestibular}
                </Text>

                <View style={styles.card}>

                    <Text style={styles.tituloInformacao}>
                        Inscrições
                    </Text>

                    <Text style={styles.informacao}>
                        Início: {vestibular.data_inicio_inscricao}
                    </Text>

                    <Text style={styles.informacao}>
                        Fim: {vestibular.data_fim_inscricao}
                    </Text>

                </View>

                <View style={styles.card}>

                    <Text style={styles.tituloInformacao}>
                        Data da prova
                    </Text>

                    <Text style={styles.informacao}>
                        {vestibular.data_prova}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.tituloInformacao}>
                        Taxa de inscrição
                    </Text>

                    <Text style={styles.informacao}>
                        R$ {
                            Number(
                                vestibular.taxa_prova
                            )
                                .toFixed(2)
                                .replace('.', ',')
                        }
                    </Text>
                </View>

                {/* BOTÃO DA AGENDA */}
                <TouchableOpacity
                    style={[
                        styles.botaoAgenda,
                        adicionando && styles.botaoDesativado
                    ]}
                    onPress={adicionarInscricao}
                    disabled={adicionando}
                >
                    {adicionando ? (
                        <ActivityIndicator
                            size="small"
                            color="#FFFFFF"
                        />
                    ) : (
                        <Text style={styles.textoBotaoAgenda}>
                            ADICIONAR À MINHA AGENDA
                        </Text>
                    )}

                </TouchableOpacity>

                {vestibular.link_edital ? (
                    <TouchableOpacity
                        style={styles.botaoEdital}
                        onPress={abrirEdital}
                    >
                        <Text style={styles.textoBotaoEdital}>
                            VER EDITAL
                        </Text>
                    </TouchableOpacity>
                ) : null}

                <TouchableOpacity
                    style={styles.botaoEdital}
                    onPress={abrirProvas}
                >
                    <Text style={styles.textoBotaoEdital}>
                        PROVAS ANTERIORES
                    </Text>
                </TouchableOpacity>
            </View>

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

            <Portal>
                <Dialog
                    visible={dialogLogin}
                    onDismiss={fecharDialogLogin}
                    style={styles.dialog}
                >
                    <Dialog.Title style={styles.dialogTitulo}>
                        Login necessário
                    </Dialog.Title>

                    <Dialog.Content>
                        <Text style={styles.dialogTexto}>
                            Você precisa fazer login para adicionar um vestibular à sua agenda.
                        </Text>
                    </Dialog.Content>

                    <Dialog.Actions>
                        <Button
                            onPress={fecharDialogLogin}
                            textColor="#5C6B73"
                        >
                            CANCELAR
                        </Button>

                        <Button
                            onPress={irParaLogin}
                            textColor="#285E73"
                        >
                            FAZER LOGIN
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        paddingTop: 50,
        paddingHorizontal: 20
    },

    containerCentral: {
        flex: 1,
        backgroundColor: '#E8EFF8',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },

    voltar: {
        color: '#285E73',
        fontSize: 16,
        marginBottom: 25,
        fontWeight: '500'
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#285E73',
        marginBottom: 25
    },

    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 18,
        marginBottom: 15,
        elevation: 2
    },

    tituloInformacao: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#285E73',
        marginBottom: 8
    },

    informacao: {
        fontSize: 15,
        color: '#5C6B73',
        marginTop: 4
    },

    botaoAgenda: {
        backgroundColor: '#20A67A',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 5
    },

    botaoDesativado: {
        opacity: 0.6
    },

    textoBotaoAgenda: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold'
    },

    botaoEdital: {
        backgroundColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 14,
        alignItems: 'center',
        marginTop: 10
    },

    textoBotaoEdital: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold'
    },

    textoCarregando: {
        marginTop: 15,
        color: '#285E73',
        fontSize: 15
    },

    textoErro: {
        color: '#B74A4A',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20
    },

    botao: {
        borderWidth: 1,
        borderColor: '#285E73',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 18,
        marginBottom: 10
    },

    botaoVoltar: {
        borderWidth: 1,
        borderColor: '#5C6B73',
        borderRadius: 8,
        paddingVertical: 12,
        paddingHorizontal: 18
    },

    textoBotao: {
        color: '#285E73',
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