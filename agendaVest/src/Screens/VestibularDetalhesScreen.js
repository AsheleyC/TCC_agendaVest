import React, { useContext, useEffect, useState } from 'react';

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

    function mostrarDialog(titulo, mensagem) {
        setDialog({
            visible: true,
            titulo,
            mensagem
        });
    }

    function fecharDialog() {
        setDialog((prev) => ({
            ...prev,
            visible: false
        }));
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
        } finally {
            setCarregando(false);
        }
    }

    useEffect(() => {
        buscarDetalhes();
    }, []);

    function formatarData(data) {
        if (!data) {
            return '';
        }

        const texto = String(data).substring(0, 10);

        if (texto.includes('-')) {
            const [ano, mes, dia] = texto.split('-');
            return `${dia}/${mes}/${ano.slice(2)}`;
        }

        return texto;
    }

    function converterData(data) {
        if (!data) {
            return null;
        }

        const texto = String(data).trim();

        if (/^\d{2}\/\d{2}\/\d{4}/.test(texto)) {
            const partes = texto.substring(0, 10).split('/');

            const dia = Number(partes[0]);
            const mes = Number(partes[1]);
            const ano = Number(partes[2]);

            return new Date(ano, mes - 1, dia);
        }

        if (/^\d{4}-\d{2}-\d{2}/.test(texto)) {
            const partes = texto.substring(0, 10).split('-');

            const ano = Number(partes[0]);
            const mes = Number(partes[1]);
            const dia = Number(partes[2]);

            return new Date(ano, mes - 1, dia);
        }

        return null;
    }

    function verificarSituacao() {
        const hoje = new Date();

        hoje.setHours(0, 0, 0, 0);

        const inicioInscricao = converterData(
            vestibular?.data_inicio_inscricao
        );

        const fimInscricao = converterData(
            vestibular?.data_fim_inscricao
        );

        const dataProva = converterData(
            vestibular?.data_prova
        );

        if (dataProva && dataProva < hoje) {
            return {
                texto: 'Processo encerrado',
                tipo: 'encerrado',
                processoEncerrado: true
            };
        }

        if (fimInscricao && fimInscricao < hoje) {
            return {
                texto: 'Inscrições encerradas',
                tipo: 'inscricoesEncerradas',
                processoEncerrado: false
            };
        }

        if (inicioInscricao && inicioInscricao > hoje) {
            return {
                texto: 'Inscrições em breve',
                tipo: 'emBreve',
                processoEncerrado: false
            };
        }

        return {
            texto: 'Inscrições abertas',
            tipo: 'abertas',
            processoEncerrado: false
        };
    }

    async function abrirEdital() {
        if (!vestibular.link_edital) {
            return;
        }

        await Linking.openURL(
            vestibular.link_edital
        );
    }

    function abrirProvas() {
        navigation.navigate('ProvasScreen', {
            id_vestibular: id_vestibular,
            nomeVestibular: vestibular.vestibular
        });
    }

    async function adicionarInscricao() {
        const situacao = verificarSituacao();

        if (situacao.processoEncerrado) {
            mostrarDialog(
                'Processo encerrado',
                'Este vestibular já foi realizado e não pode mais ser adicionado à agenda.'
            );

            return;
        }

        try {
            setAdicionando(true);

            const dados = {
                id_usuario: usuario.id_usuario,
                id_vestibular: id_vestibular,
                notificar_inscricao: true
            };

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

            const resultado = await resposta.json();

            if (resposta.status === 201) {
                mostrarDialog(
                    'Sucesso!',
                    'Vestibular adicionado à sua agenda.'
                );

                return;
            }

            if (resposta.status === 409) {
                mostrarDialog(
                    'Atenção',
                    resultado.mensagem
                );

                return;
            }

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

    const situacao = verificarSituacao();

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

                <View
                    style={[
                        styles.status,
                        situacao.tipo === 'abertas' && styles.statusAberto,
                        situacao.tipo === 'emBreve' && styles.statusEmBreve,
                        situacao.tipo === 'inscricoesEncerradas' && styles.statusInscricoesEncerradas,
                        situacao.tipo === 'encerrado' && styles.statusEncerrado
                    ]}
                >
                    <Text
                        style={[
                            styles.textoStatus,
                            situacao.tipo === 'abertas' && styles.textoStatusAberto,
                            situacao.tipo === 'emBreve' && styles.textoStatusEmBreve,
                            situacao.tipo === 'inscricoesEncerradas' && styles.textoStatusInscricoesEncerradas,
                            situacao.tipo === 'encerrado' && styles.textoStatusEncerrado
                        ]}
                    >
                        {situacao.texto}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.tituloInformacao}>
                        Inscrições
                    </Text>

                    <Text style={styles.informacao}>
                        Início: {formatarData(vestibular.data_inicio_inscricao)}
                    </Text>

                    <Text style={styles.informacao}>
                        Fim: {formatarData(vestibular.data_fim_inscricao)}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.tituloInformacao}>
                        Data da prova
                    </Text>

                    <Text style={styles.informacao}>
                        {formatarData(vestibular.data_prova)}
                    </Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.tituloInformacao}>
                        Taxa de inscrição
                    </Text>

                    <Text style={styles.informacao}>
                        R$ {Number(vestibular.taxa_prova)
                            .toFixed(2)
                            .replace('.', ',')}
                    </Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.botaoAgenda,
                        situacao.processoEncerrado && styles.botaoAgendaEncerrado,
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
                            {situacao.processoEncerrado
                                ? 'PROCESSO ENCERRADO'
                                : 'ADICIONAR À MINHA AGENDA'}
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
            </View>
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
        marginBottom: 10
    },

    status: {
        alignSelf: 'flex-start',
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 18
    },

    statusAberto: {
        backgroundColor: '#E4F4ED'
    },

    statusEmBreve: {
        backgroundColor: '#E7EFF8'
    },

    statusInscricoesEncerradas: {
        backgroundColor: '#FFF2D9'
    },

    statusEncerrado: {
        backgroundColor: '#F5E3E3'
    },

    textoStatus: {
        fontSize: 11,
        fontWeight: 'bold'
    },

    textoStatusAberto: {
        color: '#287A5B'
    },

    textoStatusEmBreve: {
        color: '#416B8A'
    },

    textoStatusInscricoesEncerradas: {
        color: '#9A6B16'
    },

    textoStatusEncerrado: {
        color: '#A84A4A'
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

    botaoAgendaEncerrado: {
        backgroundColor: '#9AA6AD'
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